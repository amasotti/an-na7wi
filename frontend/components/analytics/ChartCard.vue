<template>
  <BaseCard class="chart-card">
    <header class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
    </header>
    <section class="chart-content">
      <LoadingEffect v-if="loading" />
      <slot v-else />
    </section>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/common/BaseCard.vue'
import LoadingEffect from '~/components/common/LoadingEffect.vue'

interface ChartCardProps {
  title: string
  loading?: boolean
}

defineProps<ChartCardProps>()
</script>


<style scoped>
.chart-card {
  @apply p-6;
}

.chart-header {
  @apply mb-4;
}

.chart-title {
  @apply text-lg font-semibold text-gray-900;
}

.chart-content {
  @apply min-h-[300px] flex items-center justify-center;
}
</style>
