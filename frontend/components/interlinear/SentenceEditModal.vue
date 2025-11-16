<template>
  <BaseModal
    :open="showSentenceEditModal"
    :title="editingSentence?.id ? `Edit Sentence ${editingSentenceOrder}` : `Add Sentence ${editingSentenceOrder}`"
    size="xl"
    @close="store.closeSentenceEditModal()"
  >
    <div class="sentence-edit-modal">
      <!-- Sentence Editor -->
      <InterlinearSentenceEditor
        :sentence-id="editingSentence?.id || 'editing'"
        :sentence-order="editingSentenceOrder"
      />

      <!-- Word Alignment Editor (if alignments exist and sentence is saved) -->
      <WordAlignmentEditor
        v-if="editingSentence?.id && editingSentence.alignments && editingSentence.alignments.length > 0"
      />

      <!-- Actions -->
      <div class="modal-actions">
        <CancelButton
          type="button"
          @click="store.closeSentenceEditModal()"
          text="Close"
        />
        <DeleteButton v-if="editingSentence?.id" @click="store.clearSentenceAlignments()" text="Clean Alignements" />
        <SaveButton
          v-if="editingSentence?.id"
          :loading="sentenceSaving"
          @click="store.saveSentence()"
          :text="editingSentence?.id ? 'Save Changes' : 'Add Sentence'"
        />
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '~/components/common/BaseModal.vue'
import CancelButton from '~/components/common/CancelButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import SaveButton from '~/components/common/SaveButton.vue'
import WordAlignmentEditor from '~/components/interlinear/alignment/WordAlignmentEditor.vue'
import InterlinearSentenceEditor from '~/components/interlinear/InterlinearSentenceEditor.vue'

const store = useInterlinearStore()
const { showSentenceEditModal, editingSentence, editingSentenceOrder, sentenceSaving } =
  storeToRefs(store)
</script>

<style scoped>
.sentence-edit-modal {
  @apply space-y-4;
}
.modal-actions {
  @apply flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700;
}
</style>
