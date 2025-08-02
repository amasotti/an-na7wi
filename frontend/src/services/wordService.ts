import type { PaginatedResponse, Word } from '@/types'
import { isAxiosError } from 'axios'
import apiClient from './api'

export const wordService = {
  /**
   * Get a list of words with pagination and filtering
   */
  async getWords(
    params: {
      page?: number
      size?: number
      sort?: string
      dialect?: string
      difficulty?: string
      partOfSpeech?: string
      masteryLevel?: string
      verified?: boolean
    } = {}
  ): Promise<{
    items: Word[]
    totalCount: number
    page: number
    pageSize: number
  }> {
    const response = await apiClient.get('/words', { params })
    return response.data
  },

  /**
   * Get a single word by ID
   */
  async getWord(id: string): Promise<Word> {
    const response = await apiClient.get(`/words/${id}`)
    return response.data
  },

  /**
   * Create a new word
   */
  async createWord(wordData: Partial<Word>): Promise<Word> {
    const response = await apiClient.post('/words', wordData)
    return response.data
  },

  /**
   * Update an existing word
   */
  async updateWord(id: string, word: Partial<Word>): Promise<Word> {
    const response = await apiClient.put(`/words/${id}`, word)
    return response.data
  },

  /**
   * Delete a word
   */
  async deleteWord(id: string): Promise<void> {
    await apiClient.delete(`/words/${id}`)
  },

  /**
   * Search words by Arabic text
   */
  async searchByArabic(arabic: string, page = 1, size = 10): Promise<PaginatedResponse<Word>> {
    const response = await apiClient.get(`/words/search/arabic/${arabic}`, {
      params: { page, size },
    })
    return response.data
  },

  /**
   * Find word by exact Arabic text
   */
  async findByArabic(arabic: string): Promise<PaginatedResponse<Word> | null> {
    try {
      const response = await apiClient.get(`/words/arabic/${arabic}`)
      return response.data
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        console.log('Word not found:', arabic)
        return null
      }
      throw error
    }
  },

  /**
   * Find words by root
   */
  async findByRoot(root: string, page = 1, size = 10): Promise<PaginatedResponse<Word>> {
    const response = await apiClient.get(`/words/root/${root}`, {
      params: { page, size },
    })
    return response.data
  },

  /**
   * Find words by part of speech
   */
  async findByPartOfSpeech(
    partOfSpeech: string,
    page = 1,
    size = 10
  ): Promise<PaginatedResponse<Word>> {
    const response = await apiClient.get(`/words/part-of-speech/${partOfSpeech}`, {
      params: { page, size },
    })
    return response.data
  },

  /**
   * Find words by dialect
   */
  async findByDialect(dialect: string, page = 1, size = 10): Promise<PaginatedResponse<Word>> {
    const response = await apiClient.get(`/words/dialect/${dialect}`, {
      params: { page, size },
    })
    return response.data
  },

  /**
   * Find words by difficulty
   */
  async findByDifficulty(
    difficulty: string,
    page = 1,
    size = 10
  ): Promise<PaginatedResponse<Word>> {
    const response = await apiClient.get(`/words/difficulty/${difficulty}`, {
      params: { page, size },
    })
    return response.data
  },

  /**
   * Find verified words
   */
  async findVerified(page = 1, size = 10): Promise<PaginatedResponse<Word>> {
    const response = await apiClient.get('/words/verified', {
      params: { page, size },
    })
    return response.data
  },

  /**
   * Search words by translation
   */
  async searchByTranslation(query: string, page = 1, size = 10): Promise<PaginatedResponse<Word>> {
    const response = await apiClient.get(`/words/search/translation/${query}`, {
      params: { page, size },
    })
    return response.data
  },

  /**
   * Find most frequent words
   */
  async findMostFrequent(limit = 10): Promise<Word[]> {
    const response = await apiClient.get(`/words/most-frequent/${limit}`)
    return response.data
  },
}
