<template>
  <div class="interlinear-text-viewer">
    <!-- Empty State -->
    <div v-if="!text.sentences || text.sentences.length === 0" class="empty-state">
      <h3 class="empty-state-title">
        No sentences yet
      </h3>
      <p class="empty-state-description">
        This interlinear text doesn't have any sentences yet.
      </p>
    </div>

    <!-- Sentences -->
    <div v-else class="sentences-list">
      <InterlinearSentenceViewer
        v-for="sentence in sortedSentences"
        :key="sentence.id"
        :sentence="sentence"
        @edit="$emit('editSentence', sentence.id)"
        @delete="$emit('deleteSentence', sentence.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { InterlinearTextDetail } from '@/types'
import InterlinearSentenceViewer from './InterlinearSentenceViewer.vue'

interface Props {
  text: InterlinearTextDetail
}

const props = defineProps<Props>()

defineEmits<{
  editSentence: [sentenceId: string]
  deleteSentence: [sentenceId: string]
}>()

const sortedSentences = computed(() => {
  if (!props.text.sentences) return []
  return [...props.text.sentences].sort((a, b) => a.sentenceOrder - b.sentenceOrder)
})
</script>

<style scoped>
.interlinear-text-viewer {
  @apply w-full;
}

.empty-state {
  @apply text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700;
}

.empty-state-title {
  @apply text-lg font-medium text-gray-900 dark:text-gray-100 mb-2;
}

.empty-state-description {
  @apply text-gray-600 dark:text-gray-400;
}

.sentences-list {
  @apply space-y-6;
}
</style>
