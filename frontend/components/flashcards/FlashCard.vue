<template>
  <BaseCard class="flashcard-container">
    <div class="card-content">
      <!-- Card Content -->
      <div class="content-area">
        <!-- Primary Content (Always Visible) -->
        <div class="primary-content">
          <div v-if="displayMode === 'arabic'" class="content-block">
            <h2 class="arabic-heading">
              {{ word.arabic }}
            </h2>
            <p v-if="word.transliteration" class="transliteration">
              {{ word.transliteration }}
            </p>
          </div>
          
          <div v-else class="content-block">
            <h2 class="translation-heading">
              {{ word.translation }}
            </h2>
            <p v-if="word.partOfSpeech" class="part-of-speech">
              {{ word.partOfSpeech.replace('_', ' ') }}
            </p>
          </div>
        </div>

        <!-- Secondary Content (Blurred/Hidden) -->
        <div class="secondary-content" :class="{ blurred: !showAnswer }">
          <div v-if="displayMode === 'arabic'" class="content-block">
            <h3 class="secondary-translation">
              {{ word.translation }}
            </h3>
            <p v-if="word.partOfSpeech" class="part-of-speech">
              {{ word.partOfSpeech.replace('_', ' ') }}
            </p>
          </div>
          
          <div v-else class="content-block">
            <h3 class="secondary-arabic">
              {{ word.arabic }}
            </h3>
            <p v-if="word.transliteration" class="transliteration">
              {{ word.transliteration }}
            </p>
          </div>
        </div>

        <!-- Additional Info -->
        <div v-if="showAnswer && (word.root || word.notes)" class="additional-info">
          <p v-if="word.root" class="root-info">
            <span class="label">Root:</span>
            <span class="arabic-text">{{ word.root }}</span>
          </p>
          <p v-if="word.notes" class="notes-info">
            <span class="label">Notes:</span> {{ word.notes }}
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <!-- Reveal Button -->
        <BaseButton v-if="!showAnswer" 
                   variant="outline" 
                   size="lg" 
                   class="reveal-button"
                   @click="$emit('reveal')">
          <BaseIcon size="sm" class="mr-2">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </BaseIcon>
          Reveal Answer
        </BaseButton>

        <!-- Knowledge Assessment Buttons -->
        <div v-else class="assessment-buttons">
          <BaseButton variant="primary" size="lg" class="know-button" @click="$emit('know')">
            <BaseIcon size="sm" class="mr-2">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M5 13l4 4L19 7"/>
            </BaseIcon>
            I Know This
          </BaseButton>
          
          <BaseButton variant="danger" size="lg" class="practice-button" @click="$emit('dont-know')">
            <BaseIcon size="sm" class="mr-2">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M6 18L18 6M6 6l12 12"/>
            </BaseIcon>
            Need Practice
          </BaseButton>
        </div>
      </div>

      <!-- Word Metadata Badges -->
      <div class="metadata-badges">
        <BaseBadge v-if="word.difficulty" :variant="getDifficultyVariant(word.difficulty)">
          {{ word.difficulty }}
        </BaseBadge>
        <BaseBadge v-if="word.masteryLevel" variant="secondary">
          {{ word.masteryLevel.replace('_', ' ') }}
        </BaseBadge>
        <BaseBadge v-if="word.dialect" variant="primary">
          {{ word.dialect }}
        </BaseBadge>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { ButtonVariant, Word } from '~/types'
import { Difficulty } from '~/types/enums'

import BaseBadge from '~/components/common/BaseBadge.vue'
// Components
import BaseButton from '~/components/common/BaseButton.vue'
import BaseCard from '~/components/common/BaseCard.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'

interface Props {
  word: Word
  showAnswer: boolean
  displayMode: 'arabic' | 'translation'
}

interface Emits {
  reveal: []
  know: []
  'dont-know': []
}

defineProps<Props>()
defineEmits<Emits>()

// Utility functions
const getDifficultyVariant = (difficulty: string): ButtonVariant => {
  switch (difficulty) {
    case Difficulty.BEGINNER:
      return 'primary'
    case Difficulty.INTERMEDIATE:
      return 'secondary'
    case Difficulty.ADVANCED:
      return 'danger'
    default:
      return 'ghost'
  }
}
</script>

<style scoped>
.flashcard-container {
  @apply min-h-96 shadow-lg;
  transition: transform 0.2s ease-in-out;
}

.flashcard-container:hover {
  transform: translateY(-2px);
}

.card-content {
  @apply text-center p-6;
}

.content-area {
  @apply mb-8 min-h-48 flex flex-col justify-center;
}

.primary-content {
  @apply mb-6;
}

.content-block {
  @apply space-y-4;
}

.arabic-heading {
  @apply text-4xl font-bold text-gray-900 leading-relaxed;
  font-family: 'Amiri', 'Times New Roman', serif;
  direction: rtl;
  text-align: center;
}

.translation-heading {
  @apply text-3xl font-bold text-gray-900;
}

.transliteration {
  @apply text-lg text-gray-600 italic;
}

.part-of-speech {
  @apply text-sm text-gray-500 uppercase tracking-wide;
}

.secondary-content {
  @apply space-y-4 transition-all duration-300;
}

.secondary-content.blurred {
  filter: blur(4px);
}

.secondary-translation {
  @apply text-2xl font-semibold text-primary-700;
}

.secondary-arabic {
  @apply text-3xl font-bold text-primary-700;
  font-family: 'Amiri', 'Times New Roman', serif;
  direction: rtl;
  text-align: center;
}

.additional-info {
  @apply mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600 space-y-2;
}

.root-info {
  @apply flex items-center justify-center;
}

.root-info .label {
  @apply font-medium mr-2;
}

.arabic-text {
  font-family: 'Amiri', 'Times New Roman', serif;
  direction: rtl;
}

.notes-info .label {
  @apply font-medium;
}

.action-buttons {
  @apply flex flex-col space-y-3;
}

.reveal-button {
  @apply w-full;
}

.assessment-buttons {
  @apply flex space-x-3;
}

.know-button,
.practice-button {
  @apply flex-1;
}

.metadata-badges {
  @apply flex justify-center space-x-3 mt-6;
}
</style>
