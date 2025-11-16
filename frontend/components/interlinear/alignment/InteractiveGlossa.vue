<template>
  <div
    :key="alignment.id || `temp-${index}`"
    class="alignment-card"
    :class="{
      'alignment-card-selected': isSelected,
      'alignment-card-linked': alignment.vocabularyWordId
    }"
    @click="$emit('toggle-selection', index, $event)"
  >
    <!-- Selection Indicator -->
    <div v-if="isSelected" class="selection-badge">
      <BaseIcon size="xs">
        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </BaseIcon>
    </div>

    <!-- Vocabulary Link Indicator -->
    <div v-if="alignment.vocabularyWordId" class="vocab-link-badge" title="Linked to vocabulary">
      <BaseIcon size="xs">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </BaseIcon>
    </div>

    <!-- Arabic - Prominent -->
    <div class="alignment-arabic">{{ alignment.arabicTokens }}</div>

    <!-- Transliteration - Secondary -->
    <div class="alignment-transliteration">{{ alignment.transliterationTokens }}</div>

    <!-- Translation - Tertiary -->
    <div class="alignment-translation">{{ alignment.translationTokens }}</div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/common/BaseIcon.vue'
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
.alignment-card {
  @apply relative rounded-xl p-4
  bg-gradient-to-br from-white to-gray-50
  dark:from-gray-800 dark:to-gray-900
  border-2 border-gray-200 dark:border-gray-700
  cursor-pointer transition-all duration-200
  hover:shadow-lg hover:-translate-y-0.5
  hover:border-gray-300 dark:hover:border-gray-600;
}

.alignment-card-selected {
  @apply border-primary-500 dark:border-primary-400
  bg-gradient-to-br from-primary-50 to-primary-100
  dark:from-primary-900/30 dark:to-primary-800/30
  shadow-xl scale-[1.02] ring-2 ring-primary-200 dark:ring-primary-800;
}

.alignment-card-linked {
  @apply border-l-4 border-l-green-500 dark:border-l-green-400;
}

.selection-badge {
  @apply absolute -top-2 -right-2 w-6 h-6
  bg-primary-500 text-white rounded-full
  flex items-center justify-center
  shadow-lg;
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.vocab-link-badge {
  @apply absolute top-2 right-2
  w-5 h-5 rounded-full
  bg-green-100 dark:bg-green-900/40
  flex items-center justify-center
  text-green-600 dark:text-green-400
  opacity-90 hover:opacity-100 hover:scale-110
  transition-all duration-200;
}

.alignment-arabic {
  @apply text-2xl font-arabic font-bold
  text-gray-900 dark:text-gray-50
  mb-2 leading-tight;
}

.alignment-transliteration {
  @apply text-sm text-gray-600 dark:text-gray-400
  italic mb-1 font-medium;
}

.alignment-translation {
  @apply text-xs text-gray-500 dark:text-gray-500
  leading-relaxed;
}
</style>
