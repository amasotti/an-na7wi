‚<template>
  <section class="overview-section">
    <div v-if="overview" class="overview-grid">
      <SummaryCard
        title="Total Texts"
        :count="overview.totalTexts"
        icon-class="text-blue-600"
        icon-bg-class="bg-blue-100">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </SummaryCard>

      <SummaryCard
        title="Total Words"
        :count="overview.totalWords"
        icon-class="text-green-600"
        icon-bg-class="bg-green-100">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </SummaryCard>

      <SummaryCard
        title="Total Annotations"
        :count="overview.totalAnnotations"
        icon-class="text-purple-600"
        icon-bg-class="bg-purple-100">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </SummaryCard>

      <SummaryCard
        title="Roots"
        :count="overview.totalRoots"
        icon-class="text-orange-600"
        icon-bg-class="bg-orange-100">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </SummaryCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import SummaryCard from '~/components/analytics/SummaryCard.vue'

const analyticsStore = useAnalyticsStore()
const { overview } = storeToRefs(analyticsStore)

</script>

<style scoped>
.overview-section {
  @apply mb-8;
}

.overview-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6;
}

.overview-skeleton {
  @apply animate-pulse;
}

.skeleton-card {
  @apply h-24 bg-gray-200 rounded-lg;
}
</style>
