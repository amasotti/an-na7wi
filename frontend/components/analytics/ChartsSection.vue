<template>
  <div class="charts-section">
    <h2> {{ sectionTitle }}</h2>
    <div class="charts-grid">
      <ChartCard title="Content by Difficulty" :loading="loading">
        <apexchart
          v-if="!loading && contentDistribution"
          type="donut"
          height="300"
          :options="difficultyChartOptions"
          :series="difficultyChartSeries"
        />
      </ChartCard>

      <ChartCard title="Content by Dialect" :loading="loading">
        <apexchart
          v-if="!loading && contentDistribution"
          type="bar"
          height="300"
          :options="dialectChartOptions"
          :series="dialectChartSeries"
        />
      </ChartCard>

      <ChartCard title="Mastery Level Distribution" :loading="loading">
        <apexchart
          v-if="!loading && learningProgress"
          type="pie"
          height="300"
          :options="masteryChartOptions"
          :series="masteryChartSeries"
        />
      </ChartCard>

      <ChartCard title="Learning Activity (Last 30 Days)" :loading="loading">
        <apexchart
          v-if="!loading && activityMetrics"
          type="line"
          height="300"
          :options="activityChartOptions"
          :series="activityChartSeries"
        />
      </ChartCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChartCard from '~/components/analytics/ChartCard.vue'

const analyticsStore = useAnalyticsStore()
const { loading, contentDistribution, learningProgress, activityMetrics } = storeToRefs(analyticsStore)

interface ChartsSectionProps {
  sectionTitle: string
}
defineProps<ChartsSectionProps>()

const difficultyChartOptions = computed(() => ({
  chart: { type: 'donut' },
  labels: Object.keys(contentDistribution.value?.byDifficulty || {}),
  colors: ['#3B82F6', '#10B981', '#F59E0B'],
  legend: { position: 'bottom' },
}))

const difficultyChartSeries = computed(() =>
  Object.values(contentDistribution.value?.byDifficulty || {})
)

const dialectChartOptions = computed(() => ({
  chart: { type: 'bar' },
  xaxis: {
    categories: Object.keys(contentDistribution.value?.byDialect || {}),
  },
  colors: ['#8B5CF6'],
}))

const dialectChartSeries = computed(() => [
  {
    name: 'Texts',
    data: Object.values(contentDistribution.value?.byDialect || {}),
  },
])

const masteryChartOptions = computed(() => ({
  chart: { type: 'pie' },
  labels: Object.keys(learningProgress.value?.masteryDistribution || {}),
  colors: ['#EF4444', '#F59E0B', '#10B981', '#8B5CF6'],
}))

const masteryChartSeries = computed(() =>
  Object.values(learningProgress.value?.masteryDistribution || {})
)

const activityChartOptions = computed(() => ({
  chart: { type: 'line' },
  xaxis: {
    categories: activityMetrics.value?.textsCreatedOverTime.map(d => d.date) || [],
  },
  stroke: { curve: 'smooth' },
  colors: ['#3B82F6', '#10B981', '#F59E0B'],
}))

const activityChartSeries = computed(() => [
  {
    name: 'Texts',
    data: activityMetrics.value?.textsCreatedOverTime.map(d => d.value) || [],
  },
  {
    name: 'Words',
    data: activityMetrics.value?.wordsAddedOverTime.map(d => d.value) || [],
  },
  {
    name: 'Annotations',
    data: activityMetrics.value?.annotationsCreatedOverTime.map(d => d.value) || [],
  },
])
</script>

<style scoped>
.charts-section {
  @apply space-y-8;
}

.charts-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}
</style>
