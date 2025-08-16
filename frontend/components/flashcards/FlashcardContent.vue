<template>
  <div class="flashcard-content">
    <!-- Loading State -->
    <LoadingEffect v-if="flashcardStore.loading" />

    <!-- Active Flashcard -->
    <FlashCard v-else-if="flashcardStore.hasCurrentWord && !flashcardStore.showResults" class="flashcard-container" />

    <!-- Session Results -->
    <article v-else-if="flashcardStore.showResults" class="results-container">
      <SessionResults />
    </article>
  </div>
</template>

<script setup lang="ts">
import LoadingEffect from '~/components/common/LoadingEffect.vue'
import FlashCard from '~/components/flashcards/FlashCard.vue'
import SessionResults from '~/components/flashcards/SessionResults.vue'

const flashcardStore = useFlashcardStore()
</script>

<style scoped>

.flashcard-content {
  @apply min-h-96;
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
