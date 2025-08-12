import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockedAnalyticsData } from '~/test/mocks/analytics.mock'
import { useAnalyticsStore } from './analyticsStore'

const mockAnalyticsService = {
  getAnalytics: vi.fn(),
}

vi.mock('~/composables/analyticsService', () => ({
  useAnalyticsService: () => mockAnalyticsService,
}))

describe('analyticsStore', () => {
  const pinia = usePinia()
  let analyticsStore: ReturnType<typeof useAnalyticsStore>

  beforeEach(() => {
    analyticsStore = useAnalyticsStore()
    analyticsStore.reset()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(analyticsStore.data).toBeNull()
      expect(analyticsStore.loading).toBe(false)
      expect(analyticsStore.error).toBeNull()
      expect(analyticsStore.lastFetched).toBeNull()
    })

    it('should indicate data is stale when never fetched', () => {
      expect(analyticsStore.isStale).toBe(true)
    })
  })

  describe('fetchAnalytics', () => {
    it('should fetch analytics data successfully', async () => {
      mockAnalyticsService.getAnalytics.mockResolvedValue(mockedAnalyticsData)

      await analyticsStore.fetchAnalytics()

      expect(analyticsStore.loading).toBe(false)
      expect(analyticsStore.error).toBeNull()
      expect(analyticsStore.data).toEqual(mockedAnalyticsData)
      expect(analyticsStore.lastFetched).toBeInstanceOf(Date)
    })

    it('should handle fetch errors', async () => {
      const errorMessage = 'Network error'
      mockAnalyticsService.getAnalytics.mockRejectedValue(new Error(errorMessage))

      await analyticsStore.fetchAnalytics()

      expect(analyticsStore.loading).toBe(false)
      expect(analyticsStore.error).toBe(errorMessage)
      expect(analyticsStore.data).toBeNull()
    })

    it('should not fetch if data exists and is not stale', async () => {
      mockAnalyticsService.getAnalytics.mockResolvedValue(mockedAnalyticsData)

      await analyticsStore.fetchAnalytics()
      mockAnalyticsService.getAnalytics.mockClear()

      await analyticsStore.fetchAnalytics()

      expect(mockAnalyticsService.getAnalytics).not.toHaveBeenCalled()
    })

    it('should fetch if force refresh is true', async () => {
      mockAnalyticsService.getAnalytics.mockResolvedValue(mockedAnalyticsData)

      await analyticsStore.fetchAnalytics()
      mockAnalyticsService.getAnalytics.mockClear()

      await analyticsStore.fetchAnalytics(true)

      expect(mockAnalyticsService.getAnalytics).toHaveBeenCalledTimes(1)
    })
  })

  describe('computed values', () => {
    beforeEach(async () => {
      mockAnalyticsService.getAnalytics.mockResolvedValue(mockedAnalyticsData)
      await analyticsStore.fetchAnalytics()
    })

    it('should return overview data', () => {
      expect(analyticsStore.overview).toEqual(mockedAnalyticsData.overview)
    })

    it('should return content distribution data', () => {
      expect(analyticsStore.contentDistribution).toEqual(mockedAnalyticsData.contentDistribution)
    })

    it('should return learning progress data', () => {
      expect(analyticsStore.learningProgress).toEqual(mockedAnalyticsData.learningProgress)
    })

    it('should return activity metrics data', () => {
      expect(analyticsStore.activityMetrics).toEqual(mockedAnalyticsData.activityMetrics)
    })

    it('should return root analytics data', () => {
      expect(analyticsStore.rootAnalytics).toEqual(mockedAnalyticsData.rootAnalytics)
    })

    it('should return study patterns data', () => {
      expect(analyticsStore.studyPatterns).toEqual(mockedAnalyticsData.studyPatterns)
    })
  })

  describe('refresh', () => {
    it('should force fetch analytics', async () => {
      mockAnalyticsService.getAnalytics.mockResolvedValue(mockedAnalyticsData)
      await analyticsStore.fetchAnalytics()
      mockAnalyticsService.getAnalytics.mockClear()

      await analyticsStore.refresh()

      expect(mockAnalyticsService.getAnalytics).toHaveBeenCalled()
    })
  })

  describe('reset', () => {
    it('should reset store state', async () => {
      mockAnalyticsService.getAnalytics.mockResolvedValue(mockedAnalyticsData)
      await analyticsStore.fetchAnalytics()

      expect(analyticsStore.data).not.toBeNull()

      analyticsStore.reset()

      expect(analyticsStore.data).toBeNull()
      expect(analyticsStore.loading).toBe(false)
      expect(analyticsStore.error).toBeNull()
      expect(analyticsStore.lastFetched).toBeNull()
    })
  })
})
