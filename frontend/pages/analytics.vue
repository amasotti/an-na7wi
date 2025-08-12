<template>
  <div class="analytics-dashboard p-6 max-w-7xl mx-auto">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Learning Analytics</h1>
      <p class="text-gray-500 italic">Track your Arabic learning progress with detailed insights and statistics</p>
    </header>

    <LoadingEffect v-if="pending" />

    <BaseErrorState
      v-else-if="error"
      class="text-center py-12"
      message="Failed to load analytics"
      :error="error.message"
      @click="refresh"
    />


    <main v-else-if="analytics" class="space-y-8">
      <!-- Overview Cards -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Texts"
          :count="analytics.overview.totalTexts"
          icon-class="text-blue-600"
          icon-bg-class="bg-blue-100">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </SummaryCard>


        <SummaryCard
          title="Total Words"
          :count="analytics.overview.totalWords"
          icon-class="text-green-600"
          icon-bg-class="bg-green-100">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </SummaryCard>

        <SummaryCard
          title="Total Annotations"
          :count="analytics.overview.totalAnnotations"
          icon-class="text-purple-600"
          icon-bg-class="bg-purple-100">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </SummaryCard>

        <SummaryCard
          title="Roots"
          :count="analytics.overview.totalRoots"
          icon-class="text-orange-600"
          icon-bg-class="bg-orange-100"
        >
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </SummaryCard>
      </section>

      <!-- Charts Row 1 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Difficulty Distribution -->
        <BaseCard class="p-6">
          <h3 class="text-lg font-semibold mb-4">Content by Difficulty</h3>
          <apexchart
            type="donut"
            height="300"
            :options="difficultyChartOptions"
            :series="difficultyChartSeries"
          />
        </BaseCard>

        <!-- Dialect Distribution -->
        <BaseCard class="p-6">
          <h3 class="text-lg font-semibold mb-4">Content by Dialect</h3>
          <apexchart
            type="bar"
            height="300"
            :options="dialectChartOptions"
            :series="dialectChartSeries"
          />
        </BaseCard>
      </div>

      <!-- Charts Row 2 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Learning Progress -->
        <BaseCard class="p-6">
          <h3 class="text-lg font-semibold mb-4">Mastery Level Distribution</h3>
          <apexchart
            type="pie"
            height="300"
            :options="masteryChartOptions"
            :series="masteryChartSeries"
          />
        </BaseCard>

        <!-- Activity Over Time -->
        <BaseCard class="p-6">
          <h3 class="text-lg font-semibold mb-4">Learning Activity (Last 30 Days)</h3>
          <apexchart
            type="line"
            height="300"
            :options="activityChartOptions"
            :series="activityChartSeries"
          />
        </BaseCard>
      </div>

      <!-- Root Analysis -->
      <BaseCard class="p-6">
        <h3 class="text-lg font-semibold mb-6">Most Frequent Arabic Roots</h3>
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="root in analytics.rootAnalytics.mostFrequentRoots.slice(0, 6)" :key="root.root" 
               class="bg-gray-50 rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
              <span class="text-xl font-bold text-gray-900 font-arabic">{{ root.displayForm }}</span>
              <BaseBadge variant="secondary">{{ root.wordCount }} words</BaseBadge>
            </div>
            <p class="text-sm text-gray-600">{{ root.meaning || 'No meaning available' }}</p>
          </div>
        </section>
      </BaseCard>

      <!-- Study Patterns -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BaseCard class="p-6">
          <h3 class="text-lg font-semibold mb-4">Review Schedule</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Due Today</span>
              <span class="font-semibold text-red-600">{{ analytics.studyPatterns.reviewSchedule.due }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Overdue</span>
              <span class="font-semibold text-orange-600">{{ analytics.studyPatterns.reviewSchedule.overdue }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Upcoming</span>
              <span class="font-semibold text-green-600">{{ analytics.studyPatterns.reviewSchedule.upcoming }}</span>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="p-6">
          <h3 class="text-lg font-semibold mb-4">Study Streak</h3>
          <div class="text-center">
            <div class="text-4xl font-bold text-green-600 mb-2">{{ analytics.studyPatterns.studyStreak }}</div>
            <p class="text-gray-600">{{ analytics.studyPatterns.studyStreak === 1 ? 'day' : 'days' }} in a row</p>
          </div>
        </BaseCard>

        <BaseCard class="p-6">
          <h3 class="text-lg font-semibold mb-4">Most Studied Topics</h3>
          <div class="flex flex-wrap gap-2">
            <BaseBadge 
              v-for="topic in analytics.studyPatterns.mostStudiedTopics" 
              :key="topic" 
              variant="primary"
            >
              {{ topic }}
            </BaseBadge>
          </div>
        </BaseCard>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { AnalyticsData } from '~/types/analytics'
import LoadingEffect from "~/components/common/LoadingEffect.vue";
import BaseErrorState from "~/components/common/BaseErrorState.vue";
import BaseCard from "~/components/common/BaseCard.vue";
import SummaryCard from "~/components/analytics/SummaryCard.vue";
import BaseBadge from "~/components/common/BaseBadge.vue";

const { getAnalytics } = useAnalyticsService()

const {
  data: analytics,
  pending,
  error,
  refresh,
} = await useLazyAsyncData<AnalyticsData>('analytics', getAnalytics)

// Chart configurations
const difficultyChartOptions = computed(() => ({
  chart: {
    type: 'donut',
  },
  labels: Object.keys(analytics.value?.contentDistribution.byDifficulty || {}),
  colors: ['#3B82F6', '#10B981', '#F59E0B'],
  legend: {
    position: 'bottom',
  },
}))

const difficultyChartSeries = computed(() =>
  Object.values(analytics.value?.contentDistribution.byDifficulty || {})
)

const dialectChartOptions = computed(() => ({
  chart: {
    type: 'bar',
  },
  xaxis: {
    categories: Object.keys(analytics.value?.contentDistribution.byDialect || {}),
  },
  colors: ['#8B5CF6'],
}))

const dialectChartSeries = computed(() => [
  {
    name: 'Texts',
    data: Object.values(analytics.value?.contentDistribution.byDialect || {}),
  },
])

const masteryChartOptions = computed(() => ({
  chart: {
    type: 'pie',
  },
  labels: Object.keys(analytics.value?.learningProgress.masteryDistribution || {}),
  colors: ['#EF4444', '#F59E0B', '#10B981', '#8B5CF6'],
}))

const masteryChartSeries = computed(() =>
  Object.values(analytics.value?.learningProgress.masteryDistribution || {})
)

const activityChartOptions = computed(() => ({
  chart: {
    type: 'line',
  },
  xaxis: {
    categories: analytics.value?.activityMetrics.textsCreatedOverTime.map(d => d.date) || [],
  },
  stroke: {
    curve: 'smooth',
  },
  colors: ['#3B82F6', '#10B981', '#F59E0B'],
}))

const activityChartSeries = computed(() => [
  {
    name: 'Texts',
    data: analytics.value?.activityMetrics.textsCreatedOverTime.map(d => d.value) || [],
  },
  {
    name: 'Words',
    data: analytics.value?.activityMetrics.wordsAddedOverTime.map(d => d.value) || [],
  },
  {
    name: 'Annotations',
    data: analytics.value?.activityMetrics.annotationsCreatedOverTime.map(d => d.value) || [],
  },
])

useSeoMeta({
  title: 'Learning Analytics | An-Nahwi',
  description: 'Track your Arabic learning progress with detailed insights and statistics',
})
</script>
