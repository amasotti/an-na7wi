<template>
  <article class="interlinear-sentence group">
    <!-- Edit Button -->
    <EditButton @click="$emit('edit')" />

    <!-- Interlinear Words (flowing inline like text) -->
    <div v-if="sortedAlignments.length > 0" class="interlinear-line" dir="rtl">
      <NuxtLink
        v-for="alignment in sortedAlignments"
        :key="alignment.id"
        :to="wordLink(alignment)"
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
      <div class="arabic">{{ sentence.arabicText }}</div>
      <div class="sentence-transliteration" dir="rtl">{{ sentence.transliteration }}</div>
      <div class="sentence-translation" dir="rtl">{{ sentence.translation }}</div>
    </div>

    <!-- Annotations -->
    <div v-if="sentence.annotations" class="annotations-block">
      <BaseIcon size="sm" class="note-icon">
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
import EditButton from "~/components/common/EditButton.vue";

interface InterlinearSentenceProps {
  sentence: InterlinearSentence
}

const props = defineProps<InterlinearSentenceProps>()

defineEmits<{
  edit: []
  delete: []
}>()

const sortedAlignments = computed(() => {
  if (!props.sentence.alignments) return []
  return [...props.sentence.alignments].sort((a, b) => a.tokenOrder - b.tokenOrder)
})

const wordLink = (alignment: { vocabularyWordId?: string }) => {
  return alignment.vocabularyWordId ? `/words/${alignment.vocabularyWordId}` : undefined
}
</script>

<style scoped>
.interlinear-sentence {
  @apply relative py-5 border-b border-gray-200 dark:border-gray-700 last:border-b-0;
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

.sentence-fallback .sentence-transliteration {
  @apply text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed;
}

.sentence-fallback .sentence-translation {
  @apply text-base text-gray-700 dark:text-gray-300 leading-relaxed;
}

/* Annotations - minimal styling */
.annotations-block {
  @apply flex gap-2 mt-3 pt-3
  border-t border-gray-100 dark:border-gray-700/50;
  @apply bg-neutral-100/50 dark:bg-gray-800/50 p-3 rounded-md;
}

.note-icon {
  @apply text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0;
}

.note-text {
  @apply text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic;
}
</style>
