<template>
  <div
    :key="alignment.id || `temp-${index}`"
    class="gloss-word"
    :class="{
      'gloss-word-selected': isSelected,
      'gloss-word-linked': alignment.vocabularyWordId
    }"
    @click="$emit('toggle-selection', index, $event)"
  >
    <!-- Vocabulary Link Indicator - Subtle accent line -->
    <div v-if="alignment.vocabularyWordId" class="vocab-accent" title="Linked to vocabulary" />

    <!-- Three-line interlinear stack -->
    <div class="gloss-line gloss-arabic">{{ alignment.arabicTokens }}</div>
    <div class="gloss-line gloss-transliteration">{{ alignment.transliterationTokens }}</div>
    <div class="gloss-line gloss-translation">{{ alignment.translationTokens }}</div>
  </div>
</template>

<script setup lang="ts">
import type { WordAlignment } from '~/types'

type InteractiveGlossaProps = {
  alignment: WordAlignment
  index: number
  isSelected: boolean
}

defineProps<InteractiveGlossaProps>()

defineEmits<(e: 'toggle-selection', index: number, event: MouseEvent) => void>()
</script>

<style scoped>
/* Inline word unit - flows like text */
.gloss-word {
  @apply relative inline-flex flex-col items-center text-center
  px-3 py-2 mx-1
  rounded-lg cursor-pointer
  transition-all duration-150
  hover:bg-gray-100 dark:hover:bg-gray-800;
}

/* Selected state - subtle background highlight */
.gloss-word-selected {
  @apply bg-primary-100 dark:bg-primary-900/40
  ring-2 ring-primary-300 dark:ring-primary-700
  shadow-sm;
}

/* Linked to vocabulary - green accent on top */
.vocab-accent {
  @apply absolute top-0 left-1/2 -translate-x-1/2
  w-8 h-1 rounded-full
  bg-green-500 dark:bg-green-400;
}

/* Individual gloss lines */
.gloss-line {
  @apply leading-tight;
}

/* Arabic - main text */
.gloss-arabic {
  @apply text-xl font-arabic font-bold
  text-gray-900 dark:text-gray-50
  mb-1;
}

/* Transliteration - supporting */
.gloss-transliteration {
  @apply text-xs text-gray-600 dark:text-gray-400
  italic font-medium
  mb-0.5;
}

/* Translation - tertiary */
.gloss-translation {
  @apply text-xs text-gray-500 dark:text-gray-500;
}
</style>
