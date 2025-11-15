<template>
  <BaseModal
    :open="open"
    :title="sentence?.id ? `Edit Sentence ${sentenceOrder}` : `Add Sentence ${sentenceOrder}`"
    size="xl"
    @close="$emit('close')"
  >
    <div class="sentence-edit-modal">
      <!-- Sentence Editor -->
      <InterlinearSentenceEditor
        :sentence="localSentence"
        :sentence-id="sentence?.id || 'editing'"
        :sentence-order="sentenceOrder"
        @update="handleUpdate"
        @delete="handleDeleteSentence"
      />

      <!-- Word Alignment Editor (if alignments exist and sentence is saved) -->
      <WordAlignmentEditor
        v-if="sentence?.id && localSentence.alignments && localSentence.alignments.length > 0"
        :alignments="localSentence.alignments"
        :sentence-id="sentence.id"
        @update="handleAlignmentsUpdate"
      />

      <!-- Actions -->
      <div class="modal-actions">
        <BaseButton
          type="button"
          variant="outline"
          @click="$emit('close')"
        >
          Close
        </BaseButton>
        <BaseButton
          type="button"
          variant="primary"
          :loading="saving"
          @click="handleSave"
        >
          {{ sentence?.id ? 'Save Changes' : 'Add Sentence' }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseModal from '~/components/common/BaseModal.vue'
import InterlinearSentenceEditor from '~/components/interlinear/InterlinearSentenceEditor.vue'
import WordAlignmentEditor from '~/components/interlinear/WordAlignmentEditor.vue'
import type { InterlinearSentence, WordAlignment } from '~/types'

interface Props {
  open: boolean
  sentence: InterlinearSentence | null
  sentenceOrder: number
  textId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [sentence: Partial<InterlinearSentence>]
  updateAlignments: [alignments: WordAlignment[]]
  split: [alignmentIndex: number]
  merge: [alignmentIndices: number[]]
  deleteSentence: []
}>()

const localSentence = ref<Partial<InterlinearSentence>>({})
const saving = ref(false)

// Watch for sentence changes
watch(
  () => props.sentence,
  newSentence => {
    if (newSentence) {
      localSentence.value = { ...newSentence }
    }
  },
  { immediate: true, deep: true }
)

const handleUpdate = (updatedSentence: Partial<InterlinearSentence>) => {
  localSentence.value = {
    ...localSentence.value,
    ...updatedSentence,
  }
}

const handleAlignmentsUpdate = (alignments: WordAlignment[]) => {
  localSentence.value = {
    ...localSentence.value,
    alignments,
  }
  emit('updateAlignments', alignments)
}

const handleDeleteSentence = () => {
  emit('deleteSentence')
}

const handleSave = () => {
  emit('save', localSentence.value)
}
</script>

<style scoped>
.sentence-edit-modal {
  @apply space-y-4;
}

.modal-actions {
  @apply flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700;
}
</style>
