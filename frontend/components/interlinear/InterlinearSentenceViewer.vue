<template>
  <article class="interlinear-sentence group">
    <!-- Edit Button -->
    <button
      type="button"
      class="edit-sentence-btn"
      @click="$emit('edit')"
      title="Edit this sentence"
    >
      <BaseIcon size="xs">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </BaseIcon>
    </button>

    <!-- Interlinear Words (flowing inline like text) -->
    <div v-if="sortedAlignments.length > 0" class="interlinear-line" dir="rtl">
      <NuxtLink
        v-for="alignment in sortedAlignments"
        :key="alignment.id"
        :to="alignment.vocabularyWordId ? `/words/${alignment.vocabularyWordId}` : undefined"
        :class="['interlinear-word', { 'is-linked': alignment.vocabularyWordId }]"
        :title="alignment.vocabularyWordId ? 'Click to view in vocabulary' : undefined"
      >
        <div class="word-arabic" dir="rtl">{{ alignment.arabicTokens }}</div>
        <div class="word-gloss">
          <span class="word-transliteration">{{ alignment.transliterationTokens }}</span>
          <span class="word-translation">{{ alignment.translationTokens }}</span>
        </div>
      </NuxtLink>
    </div>

    <!-- Fallback: show full sentence if no alignments -->
    <div v-else class="sentence-fallback">
      <div class="sentence-arabic" dir="rtl">{{ sentence.arabicText }}</div>
      <div class="sentence-transliteration">{{ sentence.transliteration }}</div>
      <div class="sentence-translation">{{ sentence.translation }}</div>
    </div>

    <!-- Annotations -->
    <div v-if="sentence.annotations" class="annotations-block">
      <BaseIcon size="xs" class="note-icon">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </BaseIcon>
      <span class="note-text">{{ sentence.annotations }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import type { InterlinearSentence } from '@/types'

interface Props {
  sentence: InterlinearSentence
}

const props = defineProps<Props>()

defineEmits<{
  edit: []
  delete: []
}>()

const sortedAlignments = computed(() => {
  if (!props.sentence.alignments) return []
  return [...props.sentence.alignments].sort((a, b) => a.tokenOrder - b.tokenOrder)
})
</script>

<style scoped>
.interlinear-sentence {
  @apply relative py-5 border-b border-gray-200 dark:border-gray-700 last:border-b-0;
}

.edit-sentence-btn {
  @apply absolute top-3 left-0 p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20;
}

/* Interlinear line - words flow inline like reading text */
.interlinear-line {
  @apply flex flex-wrap gap-x-4 gap-y-3 items-start pl-8;
}

.interlinear-word {
  @apply relative inline-flex flex-col items-center text-center;
}

/* Linked words - different color, clickable */
.interlinear-word.is-linked {
  @apply cursor-pointer;
}

.interlinear-word.is-linked .word-arabic {
  @apply text-primary-600 dark:text-primary-400;
}

.interlinear-word.is-linked:hover .word-arabic {
  @apply text-primary-700 dark:text-primary-300 underline;
}

.word-arabic {
  @apply text-lg font-arabic text-gray-900 dark:text-gray-100 mb-0.5 leading-tight transition-colors;
}

.word-gloss {
  @apply flex flex-col items-center gap-0 text-xs leading-tight;
}

.word-transliteration {
  @apply text-gray-500 dark:text-gray-400 italic;
}

.word-translation {
  @apply text-gray-600 dark:text-gray-300;
}

/* Fallback for sentences without alignments */
.sentence-fallback {
  @apply space-y-1 pl-8;
}

.sentence-fallback .sentence-arabic {
  @apply text-xl font-arabic text-gray-900 dark:text-gray-100 leading-relaxed;
}

.sentence-fallback .sentence-transliteration {
  @apply text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed;
}

.sentence-fallback .sentence-translation {
  @apply text-base text-gray-700 dark:text-gray-300 leading-relaxed;
}

/* Annotations - minimal styling */
.annotations-block {
  @apply flex items-start gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 pl-8;
}

.note-icon {
  @apply text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0;
}

.note-text {
  @apply text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic;
}
</style>
