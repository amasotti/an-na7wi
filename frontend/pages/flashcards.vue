<template>
  <div class="flashcard-page">
    <FlashcardHeader 
      :show-end-button="flashcardStore.isSessionActive && flashcardStore.progress.current > 0"
      :show-progress="flashcardStore.isSessionActive"
      @end-session="flashcardStore.endSession()"
    />
    
    <div class="page-content">
      <FlashcardContent />
    </div>
  </div>
</template>

<script setup lang="ts">
import FlashcardContent from '~/components/flashcards/FlashcardContent.vue'
import FlashcardHeader from '~/components/flashcards/FlashcardHeader.vue'

const flashcardStore = useFlashcardStore()

// Initialize session on mount
onMounted(async () => {
  if (!flashcardStore.isSessionActive && !flashcardStore.showResults) {
    await flashcardStore.startNewSession()
  }
})
</script>

<style scoped>
.flashcard-page {
  @apply min-h-screen bg-gray-50;
}

.page-content {
  @apply py-8;
}
</style>
