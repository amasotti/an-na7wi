import type {
  PaginatedResponse,
  Root,
  RootNormalization,
  RootStatistics,
  RootWithWords,
} from '~/types'

export const rootService = {
  /**
   * Get all roots with pagination
   */
  async getRoots(
    params: {
      page?: number
      size?: number
      sort?: string
    } = {}
  ): Promise<PaginatedResponse<Root>> {
    const response = await useApiClient().get('/roots', { params })
    return response.data
  },

  /**
   * Get a single root by ID
   */
  async getRoot(id: string): Promise<Root> {
    const response = await useApiClient().get(`/roots/${id}`)
    return response.data
  },

  /**
   * Get root with associated words
   */
  async getRootWithWords(id: string): Promise<RootWithWords> {
    const response = await useApiClient().get(`/roots/${id}/words`)
    return response.data
  },

  /**
   * Search roots by query
   */
  async searchRoots(
    query: string,
    params: {
      page?: number
      size?: number
      sort?: string
    } = {}
  ): Promise<PaginatedResponse<Root>> {
    const response = await useApiClient().get('/roots/search', {
      params: { q: query, ...params },
    })
    return response.data
  },

  /**
   * Get roots by letter count
   */
  async getRootsByLetterCount(
    letterCount: number,
    params: {
      page?: number
      size?: number
      sort?: string
    } = {}
  ): Promise<PaginatedResponse<Root>> {
    const response = await useApiClient().get(`/roots/letters/${letterCount}`, {
      params,
    })
    return response.data
  },

  /**
   * Normalize Arabic root input
   */
  async normalizeRoot(input: string): Promise<RootNormalization> {
    const response = await useApiClient().post('/roots/normalize', { input })
    return response.data
  },

  /**
   * Get root statistics
   */
  async getStatistics(): Promise<RootStatistics> {
    const response = await useApiClient().get('/roots/statistics')
    return response.data
  },

  /**
   * Create a new root
   */
  async createRoot(input: string, meaning?: string): Promise<Root> {
    const response = await useApiClient().post('/roots', {
      input,
      meaning,
    })
    return response.data
  },

  /**
   * Delete a root by ID
   */
  async deleteRoot(id: string): Promise<void> {
    await useApiClient().delete(`/roots/${id}`)
  },
}
