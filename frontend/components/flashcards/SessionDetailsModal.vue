<template>
  <BaseModal
    :open="isOpen"
    title="Training Session Details"
    size="lg"
    @close="close"
  >
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading session details...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p class="error-message">Failed to load session details</p>
      <BaseButton @click="loadSessionDetails" variant="secondary" size="sm">
        Retry
      </BaseButton>
    </div>

    <div v-else-if="sessionData" class="session-details">
      <!-- Session Overview -->
      <div class="session-overview">
        <div class="overview-grid">
          <div class="overview-item">
            <div class="overview-label">Review Mode</div>
            <div class="overview-value">{{ formatReviewMode(sessionData.reviewMode) }}</div>
          </div>
          <div class="overview-item">
            <div class="overview-label">Completed</div>
            <div class="overview-value">{{ formatDateTime(sessionData.completedAt!) }}</div>
          </div>
          <div class="overview-item">
            <div class="overview-label">Total Words</div>
            <div class="overview-value">{{ sessionData.totalWords }}</div>
          </div>
          <div class="overview-item">
            <div class="overview-label">Accuracy</div>
            <div class="overview-value accuracy-value">
              {{ Math.round((sessionData.correctAnswers / sessionData.totalWords) * 100) }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Words List -->
      <div class="words-section">
        <h3 class="section-title">Words Reviewed</h3>
        <div class="words-list">
          <div 
            v-for="(word, index) in sessionData.words" 
            :key="word.id"
            class="word-item"
            :class="getWordResultClass(word.id, sessionResults)"
          >
            <div class="word-content">
              <div class="word-arabic arabic">{{ word.arabic }}</div>
              <div class="word-details">
                <div class="word-transliteration">{{ word.transliteration }}</div>
                <div class="word-translation">{{ word.translation }}</div>
              </div>
            </div>
            <div class="word-result">
              {{ getWordResult(word.id, sessionResults) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseModal from '~/components/common/BaseModal.vue'
import { trainingService } from '~/composables/trainingService'
import type { RecentSession, TrainingSession } from '~/types/training'

interface Props {
  isOpen: boolean
  sessionId: string | null
  sessionPreview?: RecentSession
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const sessionData = ref<TrainingSession | null>(null)
const sessionResults = ref<Record<string, string>>({})
const loading = ref(false)
const error = ref(false)

const formatReviewMode = (mode: string): string => {
  const modes: Record<string, string> = {
    NEW: 'New Words',
    LEARNING: 'Learning',
    KNOWN: 'Known Words',
    MIXED: 'Mixed Review',
  }
  return modes[mode] || mode
}

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getWordResult = (wordId: string, results: Record<string, string>): string => {
  const result = results[wordId]
  if (!result) return 'No Result'

  const resultMap: Record<string, string> = {
    CORRECT: 'Correct',
    INCORRECT: 'Incorrect',
    SKIPPED: 'Skipped',
  }
  return resultMap[result] || result
}

const getWordResultClass = (wordId: string, results: Record<string, string>): string => {
  const result = results[wordId]
  if (!result) return 'word-no-result'

  const classMap: Record<string, string> = {
    CORRECT: 'word-correct',
    INCORRECT: 'word-incorrect',
    SKIPPED: 'word-skipped',
  }
  return classMap[result] || 'word-no-result'
}

const loadSessionDetails = async () => {
  if (!props.sessionId) return

  try {
    loading.value = true
    error.value = false

    sessionData.value = await trainingService.getSession(props.sessionId)

    // For now, we'll simulate results based on the session accuracy
    // In a future enhancement, you could store individual word results
    const accuracy = sessionData.value.correctAnswers / sessionData.value.totalWords
    const results: Record<string, string> = {}

    sessionData.value.words.forEach((word, index) => {
      if (index < sessionData.value!.correctAnswers) {
        results[word.id] = 'CORRECT'
      } else if (index < sessionData.value!.totalWords) {
        results[word.id] = 'INCORRECT'
      }
    })

    sessionResults.value = results
  } catch (err) {
    console.error('Failed to load session details:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

const close = () => {
  emit('close')
}

// Watch for sessionId changes and load data
watch(
  () => [props.isOpen, props.sessionId],
  ([isOpen, sessionId]) => {
    if (isOpen && sessionId) {
      loadSessionDetails()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.loading-state {
  @apply flex flex-col items-center justify-center py-12 space-y-4;
}

.loading-spinner {
  @apply w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin;
}

.error-state {
  @apply text-center py-12 space-y-4;
}

.error-message {
  @apply text-red-600 font-medium;
}

.session-details {
  @apply space-y-6;
}

.session-overview {
  @apply bg-gray-50 rounded-lg p-4;
}

.overview-grid {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4;
}

.overview-item {
  @apply text-center;
}

.overview-label {
  @apply text-sm text-gray-600 mb-1;
}

.overview-value {
  @apply text-lg font-semibold text-gray-900;
}

.accuracy-value {
  @apply text-primary-600;
}

.words-section {
  @apply space-y-4;
}

.section-title {
  @apply text-lg font-semibold text-gray-900;
}

.words-list {
  @apply space-y-2 max-h-96 overflow-y-auto;
}

.word-item {
  @apply flex items-center justify-between p-3 rounded-lg border;
}

.word-correct {
  @apply bg-green-50 border-green-200;
}

.word-incorrect {
  @apply bg-red-50 border-red-200;
}

.word-skipped {
  @apply bg-yellow-50 border-yellow-200;
}

.word-no-result {
  @apply bg-gray-50 border-gray-200;
}

.word-content {
  @apply flex-1;
}

.word-arabic {
  @apply text-lg font-semibold text-gray-900 mb-1;
}

.word-details {
  @apply space-y-1;
}

.word-transliteration {
  @apply text-sm text-gray-600 italic;
}

.word-translation {
  @apply text-sm text-gray-700;
}

.word-result {
  @apply text-sm font-medium px-2 py-1 rounded;
}

.word-correct .word-result {
  @apply text-green-700 bg-green-100;
}

.word-incorrect .word-result {
  @apply text-red-700 bg-red-100;
}

.word-skipped .word-result {
  @apply text-yellow-700 bg-yellow-100;
}

.word-no-result .word-result {
  @apply text-gray-600 bg-gray-100;
}
</style>
