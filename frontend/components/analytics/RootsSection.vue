<template>
  <BaseCard class="roots-section">
    <header class="section-header">
      <h3 class="section-title">Most Frequent Arabic Roots</h3>
    </header>

    <article v-if="rootAnalytics?.mostFrequentRoots" class="roots-grid">
      <section
        v-for="root in rootAnalytics.mostFrequentRoots.slice(0, 6)" 
        :key="root.root" 
        class="root-card"
      >
        <div class="root-header">
          <span class="root-display" @click="goToRoot(root)">{{ root.displayForm }}</span>
          <BaseBadge variant="secondary">{{ root.wordCount }} words</BaseBadge>
        </div>
        <p class="root-meaning">{{ root.meaning || 'No meaning available' }}</p>
      </section>
    </article>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/common/BaseBadge.vue'
import BaseCard from '~/components/common/BaseCard.vue'
import type {RootFrequency} from "~/types/analytics";

const analyticsStore = useAnalyticsStore()
const { rootAnalytics } = storeToRefs(analyticsStore)

const goToRoot = (root: RootFrequency) => {
  navigateTo(`/roots?search=${root.displayForm}`)
}

</script>

<style scoped>
.roots-section {
  @apply p-6;
}

.section-header {
  @apply mb-6;
}

.section-title {
  @apply text-lg font-semibold text-gray-900;
}

.roots-skeleton {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse;
}

.root-skeleton {
  @apply h-20 bg-gray-200 rounded-lg;
}

.roots-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

.root-card {
  @apply bg-gray-50 rounded-lg p-4 transition-colors hover:bg-gray-100;
}

.root-header {
  @apply flex justify-between items-start mb-2;
}

.root-display {
  @apply text-xl font-bold text-gray-900 font-arabic;
}

.root-display:hover {
  @apply text-blue-600 cursor-pointer;
}

.root-meaning {
  @apply text-sm text-gray-600;
}
</style>
