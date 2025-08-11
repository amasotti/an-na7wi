import type { AnalyticsData } from '~/types/analytics'

export const useAnalyticsService = () => {
  const apiClient = useApiClient()

  const getAnalytics = async (): Promise<AnalyticsData> => {
    const response = await apiClient.get('/analytics')
    return response.data
  }

  return {
    getAnalytics,
  }
}
