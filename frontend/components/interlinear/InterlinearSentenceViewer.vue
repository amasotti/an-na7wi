<template>
  <div class="interlinear-sentence">
    <!-- Sentence Header -->
    <div class="sentence-header">
      <div class="sentence-content">
        <h3 class="sentence-arabic" dir="rtl">
          {{ sentence.arabicText }}
        </h3>
        <p class="sentence-transliteration">
          {{ sentence.transliteration }}
        </p>
        <p class="sentence-translation">
          {{ sentence.translation }}
        </p>
      </div>
    </div>

    <!-- Word Alignments -->
    <div v-if="sortedAlignments.length > 0" class="word-alignments">
      <h4 class="word-alignments-title">
        Word-by-Word Breakdown
      </h4>

      <div class="word-alignments-grid" dir="rtl">
        <div
          v-for="alignment in sortedAlignments"
          :key="alignment.id"
          class="word-alignment-card"
        >
          <!-- Arabic -->
          <div class="word-alignment-row arabic">
            <div class="word-alignment-label">Arabic</div>
            <div class="word-alignment-value arabic-value" dir="rtl">
              {{ alignment.arabicTokens }}
            </div>
          </div>

          <!-- Transliteration -->
          <div class="word-alignment-row translation">
<!--            <div class="word-alignment-label">Transliteration</div>-->
            <div class="word-alignment-value transliteration-value">
              {{ alignment.transliterationTokens }}
            </div>
          </div>

          <!-- Translation -->
          <div class="word-alignment-row translation">
<!--            <div class="word-alignment-label">Translation</div>-->
            <div class="word-alignment-value translation-value">
              {{ alignment.translationTokens }}
            </div>
          </div>

          <!-- Vocabulary Link (if exists) -->
          <div v-if="alignment.vocabularyWordId" class="vocabulary-link-container">
            <NuxtLink
              :to="`/words/${alignment.vocabularyWordId}`"
              class="vocabulary-link"
            >
              <BaseIcon size="xs">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </BaseIcon>
              View in vocabulary
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- No Alignments -->
    <div v-else class="no-alignments">
      No word alignments for this sentence yet.
    </div>

    <!-- Annotations (if any) -->
    <div v-if="sentence.annotations" class="annotations-section">
      <div class="annotations-container">
        <BaseIcon size="sm" class="annotations-icon">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </BaseIcon>
        <div>
          <h5 class="annotations-title">Notes</h5>
          <p class="annotations-text">{{ sentence.annotations }}</p>
        </div>
      </div>
    </div>
  </div>
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
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-all duration-200;
}

.interlinear-sentence:hover {
  @apply shadow-lg border-gray-300 dark:border-gray-600;
}

.sentence-header {
  @apply flex items-start justify-between mb-6 pb-6 border-b border-gray-200 dark:border-gray-700;
}

.sentence-content {
  @apply flex-1;
}

.sentence-arabic {
  @apply text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 font-arabic text-right;
}

.sentence-transliteration {
  @apply text-gray-600 dark:text-gray-400 italic mb-1;
}

.sentence-translation {
  @apply text-gray-700 dark:text-gray-300 font-medium;
}

.word-alignments {
  @apply mt-6;
}

.word-alignments-title {
  @apply text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide;
}

.word-alignments-grid {
  @apply grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4;
}

.word-alignment-card {
  @apply bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50
         rounded-lg p-4 border border-gray-200 dark:border-gray-700
         transition-all duration-200 hover:scale-[1.02];
}

.word-alignment-card:hover {
  @apply border-primary-400 dark:border-primary-600 shadow-md;
}

.word-alignment-row {
  @apply mb-2.5 last:mb-0;
}

.word-alignment-label {
  @apply text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-1 font-semibold;
}

.word-alignment-value {
  @apply break-words;
}

.arabic-value {
  @apply text-lg text-gray-900 dark:text-gray-100 font-arabic;
}

.transliteration-value {
  @apply text-sm text-gray-600 dark:text-gray-400 italic;
}

.translation-value {
  @apply text-sm text-gray-700 dark:text-gray-300 font-medium;
}

.vocabulary-link-container {
  @apply mt-3 pt-3 border-t border-gray-200 dark:border-gray-700;
}

.vocabulary-link {
  @apply text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1;
}

.no-alignments {
  @apply text-center py-6 text-gray-500 dark:text-gray-400 text-sm;
}

.annotations-section {
  @apply mt-6 pt-6 border-t border-gray-200 dark:border-gray-700;
}

.annotations-container {
  @apply flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800;
}

.annotations-icon {
  @apply text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0;
}

.annotations-title {
  @apply text-sm font-semibold text-amber-900 dark:text-amber-300 mb-1.5;
}

.annotations-text {
  @apply text-sm text-amber-800 dark:text-amber-200 leading-relaxed;
}
</style>
