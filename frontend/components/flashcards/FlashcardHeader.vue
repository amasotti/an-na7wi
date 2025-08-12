<template>
  <div class="header-section">
    <div class="header-content">
      <div class="title-section">
        <h1 class="page-title">Flashcard Practice</h1>
        <p class="page-subtitle">Master your vocabulary with interactive flashcards</p>
      </div>
      <BaseButton v-if="showEndButton" variant="outline" @click="$emit('end-session')">
        End Session
      </BaseButton>
    </div>
  </div>

  <!-- Session Progress -->
  <div v-if="showProgress" class="progress-section">
    <div class="progress-content">
      <div class="progress-text">
        <span>Progress</span>
        <span>{{ flashcardStore.progress.current }} of {{ flashcardStore.progress.total }}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${flashcardStore.progress.percentage}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/common/BaseButton.vue'

interface Props {
  showEndButton?: boolean
  showProgress?: boolean
}

interface Emits {
  'end-session': []
}

withDefaults(defineProps<Props>(), {
  showEndButton: false,
  showProgress: false,
})

defineEmits<Emits>()

const flashcardStore = useFlashcardStore()
</script>

<style scoped>
.header-section {
  @apply bg-white shadow-sm border-b;
}

.header-content {
  @apply max-w-4xl mx-auto px-4 py-6 flex items-center justify-between;
}

.title-section {
  @apply space-y-2;
}

.page-title {
  @apply text-3xl font-bold text-gray-900;
}

.page-subtitle {
  @apply text-gray-600;
}

.progress-section {
  @apply bg-white border-b;
}

.progress-content {
  @apply max-w-4xl mx-auto px-4 py-4;
}

.progress-text {
  @apply flex items-center justify-between text-sm text-gray-600 mb-2;
}

.progress-bar {
  @apply w-full bg-gray-200 rounded-full h-2;
}

.progress-fill {
  @apply bg-primary-600 h-2 rounded-full transition-all duration-300;
}
</style>
