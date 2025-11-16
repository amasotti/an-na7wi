<template>
  <div class="full-width">
    <!-- Empty State -->
    <BaseEmptyState
      v-if="!currentText?.sentences || currentText.sentences.length === 0"
      link="#"
      linkText="Add a sentence to start"
      message="No sentences are available for this interlinear text."
    />

    <!-- Sentences -->
    <div v-else class="sentences-list">
      <InterlinearSentenceViewer
        v-for="sentence in sortedSentences"
        :key="sentence.id"
        :sentence="sentence"
        @edit="store.openSentenceEditModal(sentence)"
      />
    </div>

    <!-- Sentence Edit Modal -->
    <SentenceEditModal />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseEmptyState from '~/components/common/BaseEmptyState.vue'
import InterlinearSentenceViewer from './InterlinearSentenceViewer.vue'
import SentenceEditModal from './SentenceEditModal.vue'

const store = useInterlinearStore()
const { currentText } = storeToRefs(store)

const sortedSentences = computed(() => {
  if (!currentText.value?.sentences) return []
  return [...currentText.value.sentences].sort((a, b) => a.sentenceOrder - b.sentenceOrder)
})

// Expose methods for parent component
defineExpose({
  openAddSentenceModal: () => store.openSentenceEditModal(),
})
</script>

<style scoped>
.sentences-list {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 px-6 py-2;
}
</style>
