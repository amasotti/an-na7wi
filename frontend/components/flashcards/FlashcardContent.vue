<template>
  <div class="flashcard-content">
    <!-- Loading State -->
    <div v-if="flashcardStore.loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading practice words...</p>
    </div>

    <!-- No Words Available -->
    <div v-else-if="!flashcardStore.isSessionActive && !flashcardStore.showResults" class="empty-state">
      <div class="empty-icon">
        <BaseIcon size="lg" class="text-gray-400">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </BaseIcon>
      </div>
      <h3 class="empty-title">No Words to Practice</h3>
      <p class="empty-description">All your words are mastered! Add more words to your vocabulary to continue practicing.</p>
      <NuxtLink to="/words">
        <BaseButton>Browse Vocabulary</BaseButton>
      </NuxtLink>
    </div>

    <!-- Active Flashcard -->
    <div v-else-if="flashcardStore.hasCurrentWord && !flashcardStore.showResults" class="flashcard-container">
      <FlashCard
        :word="flashcardStore.currentWord!"
        :show-answer="flashcardStore.session!.showAnswer"
        :display-mode="flashcardStore.session!.displayMode"
        @reveal="flashcardStore.revealAnswer()"
        @know="flashcardStore.markWordAs('correct')"
        @dont-know="flashcardStore.markWordAs('incorrect')"
      />
    </div>

    <!-- Session Results -->
    <div v-else-if="flashcardStore.showResults" class="results-container">
      <SessionResults
        :session-data="flashcardStore.sessionResults"
        @restart="handleRestart"
        @return-home="$emit('return-home')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/common/BaseButton.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import FlashCard from '~/components/flashcards/FlashCard.vue'
import SessionResults from '~/components/flashcards/SessionResults.vue'

interface Emits {
  'return-home': []
}

defineEmits<Emits>()

const flashcardStore = useFlashcardStore()

const handleRestart = async () => {
  await flashcardStore.startNewSession()
}
</script>

<style scoped>
.flashcard-content {
  @apply min-h-96;
}

.loading-container {
  @apply flex items-center justify-center min-h-96 flex-col;
}

.loading-spinner {
  @apply animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4;
}

.loading-text {
  @apply text-gray-600;
}

.empty-state {
  @apply flex items-center justify-center min-h-96 flex-col text-center max-w-md mx-auto;
}

.empty-icon {
  @apply w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center;
}

.empty-title {
  @apply text-xl font-semibold text-gray-900 mb-2;
}

.empty-description {
  @apply text-gray-600 mb-6;
}

.flashcard-container {
  @apply flex items-center justify-center min-h-96 px-4 py-8;
}

.flashcard-container > * {
  @apply w-full max-w-lg;
}

.results-container {
  @apply max-w-4xl mx-auto px-4 py-8;
}
</style>
