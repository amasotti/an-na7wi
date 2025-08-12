<script setup lang="ts">
import OverviewSection from '~/components/analytics/OverviewSection.vue'
import type { AnalyticsOverview } from '~/types/analytics'

interface SummaryContainerProps {
  overview: AnalyticsOverview | undefined
  loading?: boolean
}

defineProps<SummaryContainerProps>()
</script>

<template>
  <OverviewSection :overview="overview" :loading="loading" />
</template>


