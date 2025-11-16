<template>
  <div
    :key="alignment.id || `temp-${index}`"
    class="gloss-word-interactive"
    :class="{ 'gloss-word-selected': isSelected }"
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
