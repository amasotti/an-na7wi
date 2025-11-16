<template>
    <div
      :key="alignment.id || `temp-${index}`"
      class="card-interactive"
      :class="{ 'alignment-selected': isSelected }"
      @click="$emit('toggle-selection', index, $event)"
    >
      <!-- Arabic -->
      <div class="arabic">{{ alignment.arabicTokens }}</div>

      <!-- Transliteration -->
      <div class="glossa-text">{{ alignment.transliterationTokens }}</div>

      <!-- Translation -->
      <div class="glossa-text italic">{{ alignment.translationTokens }}</div>

      <!-- Vocabulary Link Badge -->
      <div v-if="alignment.vocabularyWordId" class="vocab-badge">Linked</div>
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
.alignment-selected {
  @apply border-primary-500 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md;
}

.glossa-text {
  @apply text-xs text-gray-600;
}


.vocab-badge {
  @apply mt-2 pt-2 border-t border-gray-300
  text-xs text-primary-600;
}
</style>
