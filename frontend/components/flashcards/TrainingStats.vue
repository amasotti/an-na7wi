<template>
  <div class="training-stats">
    <h2 class="stats-title">Training Statistics</h2>
    
    <div v-if="loading" class="stats-loading">
      Loading statistics...
    </div>
    
    <div v-else-if="error" class="stats-error">
      Failed to load training statistics
    </div>
    
    <div v-else-if="stats" class="stats-content">
      <!-- Overview Stats -->
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalSessions }}</div>
          <div class="stat-label">Total Sessions</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalWordsReviewed }}</div>
          <div class="stat-label">Words Reviewed</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ Math.round(stats.averageAccuracy) }}%</div>
          <div class="stat-label">Average Accuracy</div>
        </div>
      </div>

      <!-- Accuracy by Mode -->
      <div v-if="Object.keys(stats.accuracyByReviewMode).length > 0" class="accuracy-by-mode">
        <h3 class="section-subtitle">Accuracy by Review Mode</h3>
        <div class="mode-stats">
          <div v-for="(accuracy, mode) in stats.accuracyByReviewMode" :key="mode" class="mode-stat">
            <div class="mode-name">{{ formatReviewMode(mode) }}</div>
            <div class="mode-accuracy">{{ Math.round(accuracy) }}%</div>
          </div>
        </div>
      </div>

      <!-- Recent Sessions -->
      <div v-if="stats.recentSessions.length > 0" class="recent-sessions">
        <h3 class="section-subtitle">Recent Sessions</h3>
        <div class="sessions-list">
          <div 
            v-for="session in stats.recentSessions.slice(0, 5)" 
            :key="session.id" 
            class="session-item clickable-session"
            @click="openSessionDetails(session)"
          >
            <div class="session-info">
              <span class="session-mode">{{ formatReviewMode(session.reviewMode) }}</span>
              <span class="session-date">{{ formatDate(session.completedAt) }}</span>
            </div>
            <div class="session-results">
              <span class="session-accuracy">{{ Math.round(session.accuracy) }}%</span>
              <span class="session-details">{{ session.correctAnswers }}/{{ session.totalWords }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Session Details Modal -->
    <SessionDetailsModal
      :is-open="showSessionModal"
      :session-id="selectedSessionId"
      :session-preview="selectedSession"
      @close="closeSessionDetails"
    />
  </div>
</template>

<script setup lang="ts">
import { trainingService } from '~/composables/trainingService'
import type { RecentSession, TrainingStats } from '~/types/training'
import SessionDetailsModal from './SessionDetailsModal.vue'

const stats = ref<TrainingStats | null>(null)
const loading = ref(true)
const error = ref(false)

// Modal state
const showSessionModal = ref(false)
const selectedSessionId = ref<string | null>(null)
const selectedSession = ref<RecentSession | null>(null)

const formatReviewMode = (mode: string): string => {
  const modes: Record<string, string> = {
    NEW: 'New Words',
    LEARNING: 'Learning',
    KNOWN: 'Known Words',
    MIXED: 'Mixed Review',
  }
  return modes[mode] || mode
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const loadStats = async () => {
  try {
    loading.value = true
    error.value = false
    stats.value = await trainingService.getStats()
  } catch (err) {
    console.error('Failed to load training stats:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

const openSessionDetails = (session: RecentSession) => {
  selectedSessionId.value = session.id
  selectedSession.value = session
  showSessionModal.value = true
}

const closeSessionDetails = () => {
  showSessionModal.value = false
  selectedSessionId.value = null
  selectedSession.value = null
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.training-stats {
  @apply bg-white border border-gray-200 rounded-lg p-6;
}

.stats-title {
  @apply text-xl font-bold text-gray-900 mb-4;
}

.stats-loading {
  @apply text-center text-gray-500 py-8;
}

.stats-error {
  @apply text-center text-red-500 py-8;
}

.stats-content {
  @apply space-y-6;
}

.stats-overview {
  @apply grid grid-cols-3 gap-4;
}

.stat-card {
  @apply text-center p-4 bg-gray-50 rounded-lg;
}

.stat-value {
  @apply text-2xl font-bold text-primary-600 mb-1;
}

.stat-label {
  @apply text-sm text-gray-600;
}

.section-subtitle {
  @apply text-lg font-semibold text-gray-800 mb-3;
}

.accuracy-by-mode {
  @apply border-t border-gray-200 pt-4;
}

.mode-stats {
  @apply grid grid-cols-2 md:grid-cols-4 gap-3;
}

.mode-stat {
  @apply flex flex-col items-center p-3 bg-gray-50 rounded-lg;
}

.mode-name {
  @apply text-sm font-medium text-gray-700 mb-1;
}

.mode-accuracy {
  @apply text-lg font-bold text-primary-600;
}

.recent-sessions {
  @apply border-t border-gray-200 pt-4;
}

.sessions-list {
  @apply space-y-2;
}

.session-item {
  @apply flex justify-between items-center p-3 bg-gray-50 rounded-lg;
}

.clickable-session {
  @apply hover:bg-gray-100 cursor-pointer transition-colors;
}

.session-info {
  @apply space-x-2;
}

.session-mode {
  @apply text-sm font-medium text-gray-800;
}

.session-date {
  @apply text-xs text-gray-500;
}

.session-results {
  @apply text-right space-x-2;
}

.session-accuracy {
  @apply text-sm font-semibold text-primary-600;
}

.session-details {
  @apply text-xs text-gray-500;
}
</style>