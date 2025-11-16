<template>
  <article>
    <!-- Arabic Text -->
    <div class="margin-bottom-md">
      <BaseTextArea
        :id="`arabic-${sentenceId}`"
        v-model="localSentence.arabicText"
        label="Arabic"
        :rows="1"
        :required="true"
        placeholder="أدخل النص العربي"
        arabic
        @input="emitUpdate"
      />
    </div>

    <!-- Transliteration -->
    <div class="margin-bottom-md">
      <BaseInput
        :id="`transliteration-${sentenceId}`"
        v-model="localSentence.transliteration"
        type="text"
        label="Transliteration"
        placeholder="Enter transliteration..."
        :clearable="true"
        :required="true"
        @input="emitUpdate"
      />
    </div>

    <!-- Translation -->
    <div class="margin-bottom-md">
      <BaseInput
        :id="`translation-${sentenceId}`"
        v-model="localSentence.translation"
        type="text"
        label="Translation"
        placeholder="Enter English translation"
        :clearable="true"
        :required="true"
        @input="emitUpdate"
      />
    </div>

    <!-- Annotations (Optional) -->
    <div class="margin-bottom-md">
      <BaseTextArea
        :id="`annotations-${sentenceId}`"
        v-model="localSentence.annotations"
        label="Notes (Markdown)"
        :rows="3"
        placeholder="Optional notes"
        @input="emitUpdate"
      />
    </div>

    <!-- Actions -->
      <div class="form-actions" role="group" aria-label="Form actions">
        <BaseButton
          type="button"
          variant="danger"
          size="sm"
          @click="$emit('delete')"
        >
          <BaseIcon size="xs" class="button-icon">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </BaseIcon>
          Delete Sentence
        </BaseButton>

        <BaseButton
          type="button"
          variant="secondary"
          size="sm"
          :disabled="!canTokenize"
          @click="handleTokenize"
        >
          <BaseIcon size="xs" class="button-icon">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </BaseIcon>
          Tokenize
        </BaseButton>
      </div>
    <p class="tokenize-hint">The "tokenize" function will try to create tokens based on empty spaces and the convention that dashed words belong together</p>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import BaseTextArea from '~/components/common/BaseTextArea.vue'
import type { InterlinearSentence } from '~/types'

interface Props {
  sentence: Partial<InterlinearSentence>
  sentenceId: string
  sentenceOrder: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [sentence: Partial<InterlinearSentence>]
  delete: []
}>()

const interlinearStore = useInterlinearStore()

// Local state to track changes
const localSentence = ref<Partial<InterlinearSentence>>({
  arabicText: props.sentence.arabicText || '',
  transliteration: props.sentence.transliteration || '',
  translation: props.sentence.translation || '',
  annotations: props.sentence.annotations || '',
})

// Watch for external changes to the sentence prop
watch(
  () => props.sentence,
  newSentence => {
    localSentence.value = {
      arabicText: newSentence.arabicText || '',
      transliteration: newSentence.transliteration || '',
      translation: newSentence.translation || '',
      annotations: newSentence.annotations || '',
    }
  },
  { deep: true }
)

// Check if sentence can be tokenized (all three fields filled)
const canTokenize = computed(() => {
  return (
    localSentence.value.arabicText?.trim() &&
    localSentence.value.transliteration?.trim() &&
    localSentence.value.translation?.trim()
  )
})

// Emit updates to parent
const emitUpdate = () => {
  emit('update', { ...localSentence.value })
}

const handleTokenize = async () => {
  await interlinearStore.autoAlign()
}

</script>

<style scoped>
.tokenize-hint {
  @apply text-sm text-gray-600 text-center mt-2 italic;
}
</style>
