<template>
  <div class="session-results">
    <!-- Header -->
    <header class="results-header">
      <aside class="completion-icon">
        <BaseIcon size="xl" class="text-primary-600">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </BaseIcon>
      </aside>
      <h2 class="results-title">Session Complete!</h2>
      <p class="results-subtitle">Here's how you performed</p>
    </header>

    <!-- Stats Overview -->
    <div class="stats-grid">
      <div class="stat-card correct">
        <div class="stat-icon">
          <BaseIcon size="md" class="text-green-600">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M5 13l4 4L19 7"/>
          </BaseIcon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ sessionData.correct }}</div>
          <div class="stat-label">Correct</div>
        </div>
      </div>

      <div class="stat-card incorrect">
        <div class="stat-icon">
          <BaseIcon size="md" class="text-red-600">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12"/>
          </BaseIcon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ sessionData.incorrect }}</div>
          <div class="stat-label">Need Practice</div>
        </div>
      </div>

      <div class="stat-card total">
        <div class="stat-icon">
          <BaseIcon size="md" class="text-blue-600">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </BaseIcon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ sessionData.total }}</div>
          <div class="stat-label">Total Words</div>
        </div>
      </div>

      <div class="stat-card duration">
        <div class="stat-icon">
          <BaseIcon size="md" class="text-purple-600">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </BaseIcon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ sessionDuration }}</div>
          <div class="stat-label">Duration</div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <BaseCard class="chart-card">
        <template #header>
          <h3 class="chart-title">Performance Overview</h3>
        </template>
        
        <div class="chart-container">
          <apexchart
            type="donut"
            height="300"
            :options="donutChartOptions"
            :series="donutChartSeries"
          />
        </div>
      </BaseCard>

      <BaseCard v-if="sessionData.words.length > 0" class="chart-card">
        <template #header>
          <h3 class="chart-title">Accuracy by Difficulty</h3>
        </template>
        
        <div class="chart-container">
          <apexchart
            type="bar"
            height="300"
            :options="barChartOptions"
            :series="barChartSeries"
          />
        </div>
      </BaseCard>
    </div>

    <!-- Word Review -->
    <BaseCard v-if="sessionData.words.length > 0" class="word-review-card">
      <template #header>
        <h3 class="review-title">Word Review</h3>
      </template>
      
      <div class="words-tabs">
        <button 
          v-for="tab in reviewTabs" 
          :key="tab.key"
          class="tab-button"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }} ({{ tab.count }})
        </button>
      </div>

      <div class="words-list">
        <div v-for="item in filteredWords" :key="item.word.id" class="word-item">
          <div class="word-content">
            <div class="word-arabic">{{ item.word.arabic }}</div>
            <div class="word-translation">{{ item.word.translation }}</div>
          </div>
          <div class="word-result">
            <BaseBadge :variant="getResultVariant(item.result)">
              {{ getResultLabel(item.result) }}
            </BaseBadge>
          </div>
        </div>
        
        <div v-if="filteredWords.length === 0" class="no-words">
          No words in this category
        </div>
      </div>
    </BaseCard>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <BaseButton size="sm" @click="handleRestart">
        <BaseIcon size="sm" class="mr-2">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </BaseIcon>
        <span class="text-sm">Practice Again</span>
      </BaseButton>
      
      <BaseButton variant="outline" size="sm" @click="goHome">
        <BaseIcon size="sm" class="mr-2">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </BaseIcon>
        <span class="text-sm">Go home</span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseBadge from '~/components/common/BaseBadge.vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseCard from '~/components/common/BaseCard.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import type { BadgeVariant } from '~/types'
import type { SessionResults } from '~/types/training'

const flashcardStore = useFlashcardStore()
const sessionData = computed<SessionResults>(() => flashcardStore.sessionResults)

// State
type ResultType = 'all' | 'correct' | 'incorrect' | 'skipped'
const activeTab = ref<ResultType>('all')

// Computed
const sessionDuration = computed(() => {
  if (!sessionData.value.endTime) return '0m'

  const start = sessionData.value.startTime
  const end = sessionData.value.endTime
  const diffMs = end.getTime() - start.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffSecs = Math.floor((diffMs % 60000) / 1000)

  if (diffMins > 0) {
    return `${diffMins}m ${diffSecs}s`
  }
  return `${diffSecs}s`
})

const handleRestart = async () => {
  await flashcardStore.startNewSession()
}

const goHome = () => {
  flashcardStore.resetSession()
  navigateTo('/')
}

type ReviewTab = {
  key: ResultType
  label: string
  count: number
}
const reviewTabs = computed((): ReviewTab[] => [
  { key: 'all', label: 'All', count: sessionData.value.words.length },
  { key: 'correct', label: 'Correct', count: sessionData.value.correct },
  { key: 'incorrect', label: 'Need Practice', count: sessionData.value.incorrect },
  { key: 'skipped', label: 'Skipped', count: sessionData.value.skipped },
])

const filteredWords = computed(() => {
  if (activeTab.value === 'all') return sessionData.value.words
  return sessionData.value.words.filter(item => item.result === activeTab.value)
})

// Chart data
const donutChartSeries = computed(() => [
  sessionData.value.correct,
  sessionData.value.incorrect,
  sessionData.value.skipped,
])

const donutChartOptions = computed(() => ({
  chart: {
    type: 'donut',
    fontFamily: 'inherit',
  },
  labels: ['Correct', 'Need Practice', 'Skipped'],
  colors: ['#10b981', '#ef4444', '#6b7280'],
  legend: {
    position: 'bottom',
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${Math.round(val)}%`,
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
}))

const barChartSeries = computed(() => {
  const difficultyStats = sessionData.value.words.reduce(
    (acc, item) => {
      const difficulty = item.word.difficulty || 'UNKNOWN'
      if (!acc[difficulty]) {
        acc[difficulty] = { correct: 0, total: 0 }
      }
      acc[difficulty].total++
      if (item.result === 'correct') {
        acc[difficulty].correct++
      }
      return acc
    },
    {} as Record<string, { correct: number; total: number }>
  )

  const categories = Object.keys(difficultyStats)
  const data = categories.map(difficulty => {
    const stats = difficultyStats[difficulty]
    if (!stats) return 0
    return Math.round((stats.correct / stats.total) * 100)
  })

  return [
    {
      name: 'Accuracy %',
      data,
    },
  ]
})

const barChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    fontFamily: 'inherit',
  },
  xaxis: {
    categories: Object.keys(
      sessionData.value.words.reduce(
        (acc, item) => {
          const difficulty = item.word.difficulty || 'UNKNOWN'
          acc[difficulty] = true
          return acc
        },
        {} as Record<string, boolean>
      )
    ),
  },
  yaxis: {
    title: {
      text: 'Accuracy (%)',
    },
    max: 100,
  },
  colors: ['#3b82f6'],
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val}%`,
  },
}))

// Methods
const getResultVariant = (result: string): BadgeVariant => {
  switch (result) {
    case 'correct':
      return 'primary'
    case 'skipped':
      return 'secondary'
    case 'incorrect':
      return 'error'
    default:
      return 'secondary'
  }
}

const getResultLabel = (result: string) => {
  switch (result) {
    case 'correct':
      return 'Correct'
    case 'incorrect':
      return 'Need Practice'
    case 'skipped':
      return 'Skipped'
    default:
      return 'Unknown'
  }
}
</script>

<style scoped>
.session-results {
  @apply space-y-8;
}

.results-header {
  @apply text-center mb-8;
}

.completion-icon {
  @apply w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center;
}

.results-title {
  @apply text-3xl font-bold text-gray-900 mb-2;
}

.results-subtitle {
  @apply text-lg text-gray-600;
}

.stats-grid {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4 mb-8;
}

.stat-card {
  @apply bg-white rounded-lg p-4 border border-gray-200 text-center;
}

.stat-card.correct {
  @apply border-green-200 bg-green-50;
}

.stat-card.incorrect {
  @apply border-red-200 bg-red-50;
}

.stat-card.total {
  @apply border-blue-200 bg-blue-50;
}

.stat-card.duration {
  @apply border-purple-200 bg-purple-50;
}

.stat-icon {
  @apply w-10 h-10 mx-auto mb-2 rounded-full bg-white flex items-center justify-center;
}

.stat-value {
  @apply text-2xl font-bold text-gray-900;
}

.stat-label {
  @apply text-sm text-gray-600;
}

.charts-section {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8;
}

.chart-card {
  @apply bg-white;
}

.chart-title {
  @apply text-lg font-semibold text-gray-900;
}

.chart-container {
  @apply p-4;
}

.word-review-card {
  @apply bg-white mb-8;
}

.review-title {
  @apply text-lg font-semibold text-gray-900;
}

.words-tabs {
  @apply flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1;
}

.tab-button {
  @apply flex-1 py-2 px-3 text-sm font-medium text-gray-600 rounded-md transition-colors;
}

.tab-button.active {
  @apply bg-white text-primary-600 shadow-sm;
}

.words-list {
  @apply max-h-64 overflow-y-auto space-y-2;
}

.word-item {
  @apply flex items-center justify-between p-3 bg-gray-50 rounded-lg;
}

.word-content {
  @apply flex-1;
}

.word-arabic {
  @apply text-lg font-semibold text-gray-900;
  font-family: 'Amiri', 'Times New Roman', serif;
  direction: rtl;
}

.word-translation {
  @apply text-sm text-gray-600;
}

.word-result {
  @apply ml-3;
}

.no-words {
  @apply text-center py-8 text-gray-500;
}

.action-buttons {
  @apply flex flex-col sm:flex-row gap-4 justify-center;
}
</style>
