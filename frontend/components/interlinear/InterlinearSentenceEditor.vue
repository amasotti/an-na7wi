<template>
  <div class="sentence-editor">
    <!-- Arabic Text -->
    <div class="form-field">
      <label :for="`arabic-${sentenceId}`" class="form-label">
        Arabic Text <span class="required-marker">*</span>
      </label>
      <textarea
        :id="`arabic-${sentenceId}`"
        v-model="localSentence.arabicText"
        rows="2"
        required
        dir="rtl"
        class="form-textarea arabic-input"
        placeholder="أدخل النص العربي"
        @input="emitUpdate"
      ></textarea>
    </div>

    <!-- Transliteration -->
    <div class="form-field">
      <label :for="`transliteration-${sentenceId}`" class="form-label">
        Transliteration <span class="required-marker">*</span>
      </label>
      <input
        :id="`transliteration-${sentenceId}`"
        v-model="localSentence.transliteration"
        type="text"
        required
        class="form-input"
        placeholder="Enter transliteration"
        @input="emitUpdate"
      />
    </div>

    <!-- Translation -->
    <div class="form-field">
      <label :for="`translation-${sentenceId}`" class="form-label">
        Translation <span class="required-marker">*</span>
      </label>
      <input
        :id="`translation-${sentenceId}`"
        v-model="localSentence.translation"
        type="text"
        required
        class="form-input"
        placeholder="Enter English translation"
        @input="emitUpdate"
      />
    </div>

    <!-- Annotations (Optional) -->
    <div class="form-field">
      <label :for="`annotations-${sentenceId}`" class="form-label">
        Notes (Markdown)
      </label>
      <textarea
        :id="`annotations-${sentenceId}`"
        v-model="localSentence.annotations"
        rows="3"
        class="form-textarea"
        placeholder="Optional notes about grammar, vocabulary, or cultural context (Markdown supported)"
        @input="emitUpdate"
      ></textarea>
    </div>

    <!-- Alignments Preview (after tokenization) -->
    <div v-if="sentence.alignments && sentence.alignments.length > 0" class="alignments-preview">
      <div class="alignments-header">
        <BaseIcon size="xs" class="alignments-icon">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </BaseIcon>
        <span class="alignments-text">Tokenized: {{ sentence.alignments.length }} word alignments created</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="sentence-actions">
      <div class="action-buttons-left">
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
          :disabled="!canTokenize || tokenizing"
          :loading="tokenizing"
          @click="handleTokenize"
        >
          <BaseIcon size="xs" class="button-icon">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </BaseIcon>
          {{ tokenizing ? 'Tokenizing...' : 'Auto-tokenize' }}
        </BaseButton>
      </div>

      <div class="sentence-order-badge">
        Sentence #{{ sentenceOrder }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import type { InterlinearSentence } from '~/types'

interface Props {
  sentence: Partial<InterlinearSentence>
  sentenceId: string
  sentenceOrder: number
  tokenizing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tokenizing: false,
})

const emit = defineEmits<{
  update: [sentence: Partial<InterlinearSentence>]
  delete: []
  tokenize: []
}>()

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

// Handle tokenization
const handleTokenize = () => {
  emit('tokenize')
}
</script>

<style scoped>
.sentence-editor {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4;
}

.form-field {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.required-marker {
  @apply text-red-500;
}

.form-input {
  @apply w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
         transition-colors;
}

.form-textarea {
  @apply w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
         resize-y transition-colors;
}

.arabic-input {
  @apply font-arabic text-lg;
}

.sentence-actions {
  @apply flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700;
}

.action-buttons-left {
  @apply flex items-center gap-2;
}

.button-icon {
  @apply mr-1.5;
}

.sentence-order-badge {
  @apply text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-full;
}

.alignments-preview {
  @apply mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg;
}

.alignments-header {
  @apply flex items-center gap-2;
}

.alignments-icon {
  @apply text-green-600 dark:text-green-400;
}

.alignments-text {
  @apply text-sm font-medium text-green-800 dark:text-green-200;
}
</style>
