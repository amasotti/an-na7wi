import type { AnalyticsData } from '~/types/analytics'

export const useAnalyticsStore = defineStore('analytics', () => {
  const data = ref<AnalyticsData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetched = ref<Date | null>(null)

  const { getAnalytics } = useAnalyticsService()

  const isStale = computed(() => {
    if (!lastFetched.value) return true
    const staleTime = 5 * 60 * 1000 // 5 minutes
    return Date.now() - lastFetched.value.getTime() > staleTime
  })

  const fetchAnalytics = async (forceRefresh = false) => {
    if (loading.value) return
    if (data.value && !isStale.value && !forceRefresh) return

    try {
      loading.value = true
      error.value = null
      data.value = await getAnalytics()
      lastFetched.value = new Date()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch analytics'
      console.error('Analytics fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const refresh = () => fetchAnalytics(true)

  const reset = () => {
    data.value = null
    loading.value = false
    error.value = null
    lastFetched.value = null
  }

  // Computed values for easy access to nested data
  const overview = computed(() => data.value?.overview)
  const contentDistribution = computed(() => data.value?.contentDistribution)
  const learningProgress = computed(() => data.value?.learningProgress)
  const activityMetrics = computed(() => data.value?.activityMetrics)
  const rootAnalytics = computed(() => data.value?.rootAnalytics)
  const studyPatterns = computed(() => data.value?.studyPatterns)

  return {
    // State
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    lastFetched: readonly(lastFetched),

    // Computed
    isStale,
    overview,
    contentDistribution,
    learningProgress,
    activityMetrics,
    rootAnalytics,
    studyPatterns,

    // Actions
    fetchAnalytics,
    refresh,
    reset,
  }
})
