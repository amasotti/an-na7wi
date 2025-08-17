<template>
  <div class="flashcard-page page-container">
    <FlashcardHeader 
      :show-end-button="flashcardStore.isSessionActive && flashcardStore.progress.current > 0"
      :show-progress="flashcardStore.isSessionActive"
      @end-session="flashcardStore.endSession()"
    />

    <!-- Review Mode Selector (only show when not in active session) -->
    <article v-if="!flashcardStore.isSessionActive && !flashcardStore.showResults" class="review-mode-section">
      <div class="review-mode-container">
        <h2 class="section-title">Choose Review Mode</h2>
        <section class="centered-mode-grid">
          <BaseCard
            v-for="mode in reviewModes" 
            :key="mode.value"
            class="mode-button"
            :class="{ active: flashcardStore.selectedReviewMode === mode.value }"
            @click="updateReviewMode(mode.value)"
          >
            <div class="mode-icon">{{ mode.icon }}</div>
            <div class="mode-text">
              <h3>{{ mode.label }}</h3>
              <p>{{ mode.description }}</p>
            </div>
          </BaseCard>
        </section>
        <section class="session-length-section">
          <h3 class="session-length-title">Session Length: {{ sessionLength }} words</h3>
          <BaseSlider 
            :model-value="sessionLength"
            :min="3"
            :max="50"
            :step="1"
            class="session-length-slider"
            @update:model-value="updateSessionLength" 
          />
        </section>
        <div class="start-button-container">
          <BaseButton 
            variant="primary"
            size="lg"
            class="start-button"
            :disabled="flashcardStore.loading"
            :loading="flashcardStore.loading"
            @click="startSession"
          >
            Start Review
          </BaseButton>
        </div>
      </div>
    </article>

    <!-- Training Stats Section -->
    <section v-if="!flashcardStore.isSessionActive && !flashcardStore.showResults" class="stats-section">
      <div class="stats-container">
        <TrainingStats />
      </div>
    </section>

    <div class="page-content">
      <FlashcardContent />
    </div>
  </div>

</template>

<script setup lang="ts">
import BaseButton from '~/components/common/BaseButton.vue'
import BaseCard from '~/components/common/BaseCard.vue'
import BaseSlider from '~/components/common/BaseSlider.vue'
import FlashcardContent from '~/components/flashcards/FlashcardContent.vue'
import FlashcardHeader from '~/components/flashcards/FlashcardHeader.vue'
import TrainingStats from '~/components/flashcards/TrainingStats.vue'
import type { ReviewMode } from '~/types/training'

const flashcardStore = useFlashcardStore()
const { sessionLength } = storeToRefs(flashcardStore)

const reviewModes = [
  {
    value: 'NEW' as ReviewMode,
    label: 'New Words',
    description: 'Learn completely new vocabulary',
    icon: '✨',
  },
  {
    value: 'LEARNING' as ReviewMode,
    label: 'Learning',
    description: "Practice words you're still learning",
    icon: '📚',
  },
  {
    value: 'KNOWN' as ReviewMode,
    label: 'Known Words',
    description: 'Review words you already know',
    icon: '🎯',
  },
  {
    value: 'MIXED' as ReviewMode,
    label: 'Mixed Review',
    description: 'A balanced mix of all levels',
    icon: '🌟',
  },
]

const startSession = async () => {
  await flashcardStore.startNewSession()
}

const updateSessionLength = (value: number) => {
  flashcardStore.updateSessionLength(value)
}

const updateReviewMode = (mode: ReviewMode) => {
  flashcardStore.updateReviewMode(mode)
}
</script>

<style scoped>
.flashcard-page {
  @apply min-h-screen bg-gray-50;
}

.stats-section {
  @apply bg-gray-50 border-b border-gray-200;
}
.review-mode-section {
  @apply bg-white border-b border-gray-200;
}

.review-mode-container {
  @apply max-w-4xl mx-auto px-6 py-12;
}

.centered-mode-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8;
}

.section-title {
  @apply text-2xl font-bold text-gray-900 text-center mb-8;
}

.mode-button {
  @apply border-gray-200 bg-gray-50 hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer text-left;
}

.mode-button.active {
  @apply border-primary-500 bg-primary-100 ring-2 ring-primary-200;
}

.mode-icon {
  @apply text-2xl mb-2;
}

.mode-text h3 {
  @apply font-semibold text-gray-900 mb-1;
}

.mode-text p {
  @apply text-sm text-gray-600;
}

.start-button-container {
  @apply flex justify-center;
}

.start-button {
  @apply px-8 py-3;
}

.session-length-section {
  @apply mb-8;
}

.session-length-title {
  @apply text-lg font-semibold text-gray-700 mb-4 text-center;
}

.session-length-slider {
  @apply w-full max-w-md mx-auto;
}

.page-content {
  @apply py-8;
}
</style>
