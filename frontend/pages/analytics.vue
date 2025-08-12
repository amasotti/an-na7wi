<template>
  <div class="analytics-dashboard">
    <header class="dashboard-header">
      <h1 class="dashboard-title">Learning Analytics</h1>
      <p class="dashboard-subtitle">Learning progress with detailed insights and statistics</p>
    </header>

    <LoadingEffect v-if="loading" />

    <BaseErrorState
      v-else-if="error"
      class="error-state"
      message="Failed to load analytics"
      :error="error"
      @click="refresh"
    />

    <main v-else class="dashboard-content">
      <OverviewSection />
      
      <ChartsSection section-title="Analytics Overview"/>
      
      <RootsSection />
      
      <StudyPatternsSection />
    </main>
  </div>
</template>

<script setup lang="ts">
import ChartsSection from '~/components/analytics/ChartsSection.vue'
import OverviewSection from '~/components/analytics/OverviewSection.vue'
import RootsSection from '~/components/analytics/RootsSection.vue'
import StudyPatternsSection from '~/components/analytics/StudyPatternsSection.vue'
import BaseErrorState from '~/components/common/BaseErrorState.vue'
import LoadingEffect from '~/components/common/LoadingEffect.vue'

const analyticsStore = useAnalyticsStore()
const { refresh } = analyticsStore
const { loading, error } = storeToRefs(analyticsStore)

const getData = () => {
  analyticsStore.fetchAnalytics()
}

onMounted(() => {
  getData()
})

useSeoMeta({
  title: 'Learning Analytics | An-Nahwi',
  description: 'Track your Arabic learning progress with detailed insights and statistics',
})
</script>

<style scoped>
.analytics-dashboard {
  @apply p-6 max-w-7xl mx-auto;
}

.dashboard-header {
  @apply mb-8;
}

.dashboard-title {
  @apply text-3xl font-bold text-gray-900 mb-2;
}

.dashboard-subtitle {
  @apply text-gray-500 italic;
}

.error-state {
  @apply text-center py-12;
}

.dashboard-content {
  @apply space-y-8;
}
</style>
