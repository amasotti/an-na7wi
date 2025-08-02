import type {
  PaginatedResponse,
  Root,
  RootNormalization,
  RootStatistics,
  RootWithWords,
} from '@/types'
import apiClient from './api'

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
    const response = await apiClient.get('/roots', { params })
    return response.data
  },

  /**
   * Get a single root by ID
   */
  async getRoot(id: string): Promise<Root> {
    const response = await apiClient.get(`/roots/${id}`)
    return response.data
  },

  /**
   * Get root with associated words
   */
  async getRootWithWords(id: string): Promise<RootWithWords> {
    const response = await apiClient.get(`/roots/${id}/words`)
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
    const response = await apiClient.get('/roots/search', {
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
    const response = await apiClient.get(`/roots/letter-count/${letterCount}`, { params })
    return response.data
  },

  /**
   * Get roots starting with specific letter
   */
  async getRootsStartingWith(
    letter: string,
    params: {
      page?: number
      size?: number
      sort?: string
    } = {}
  ): Promise<PaginatedResponse<Root>> {
    const response = await apiClient.get(`/roots/starting-with/${letter}`, { params })
    return response.data
  },

  /**
   * Normalize root input
   */
  async normalizeRoot(input: string): Promise<RootNormalization> {
    const response = await apiClient.post('/roots/normalize', { input })
    return response.data
  },

  /**
   * Get root statistics
   */
  async getStatistics(): Promise<RootStatistics> {
    const response = await apiClient.get('/roots/statistics')
    return response.data
  },
}
