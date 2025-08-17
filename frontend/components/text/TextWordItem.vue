<template>
  <div
    class="related-word-row"
    @click="goToWordDetails"
  >
    <div class="grid grid-cols-3 gap-6 items-center">
      <!-- Column 1: Arabic Word + Transliteration -->
      <div class="min-w-0">
        <p class="arabic-left">{{ word.arabic }}</p>
        <p class="transliteration">({{ word.transliteration || '' }})</p>
      </div>

      <!-- Column 2: Translation -->
      <div class="text-gray-800 truncate">
        {{ word.translation || '—' }}
      </div>

      <!-- Column 3: Part of Speech + Difficulty -->
      <div class="details-column">
        <div class="details-info">
          <span v-if="word.partOfSpeech" class="part-of-speech">{{ word.partOfSpeech }}</span>
          <span class="difficulty" :class="getDifficultyColorClass(word.difficulty)">{{ word.difficulty }}</span>
          <span v-if="word.dialect !== 'MSA'" class="dialect">{{ word.dialect }}</span>
        </div>
        
        <BaseIcon size="sm" class="nav-arrow">
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </BaseIcon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/common/BaseIcon.vue'
import type { WordSummary } from '~/types'

const props = defineProps<{ word: WordSummary }>()

const goToWordDetails = () => {
  navigateTo(`/words/${props.word.id}`)
}

const getDifficultyColorClass = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'text-green-600'
    case 'intermediate':
      return 'text-orange-400'
    case 'advanced':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}
</script>

<style scoped>
.related-word-row {
  @apply px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0;
}

.arabic-left {
  @apply font-bold text-lg text-gray-900;
}

.transliteration {
  @apply text-sm text-gray-500 italic;
}

.details-column {
  @apply flex items-center justify-between;
}

.details-info {
  @apply flex items-center gap-3;
}

.part-of-speech {
  @apply text-sm font-medium text-purple-600;
}

.difficulty {
  @apply text-sm font-medium;
}

.dialect {
  @apply text-sm text-gray-500;
}

.nav-arrow {
  @apply text-gray-400 group-hover:text-primary-500 transition-colors;
}
</style>
