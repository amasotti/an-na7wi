import { isAxiosError } from 'axios'
import type { PaginatedResponse, Word, WordSearchResult } from '~/types'

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
    const response = await useApiClient().get('/words', { params })
    return response.data
  },

  /**
   * Get a single word by ID
   */
  async getWord(id: string): Promise<Word> {
    try {
      const response = await useApiClient().get(`/words/${id}`)
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        console.log('Word not found:', id)
        throw new Error(`Word not found: ${id}`)
      }
      throw error
    }
  },

  /**
   * Create a new word
   */
  async createWord(wordData: Partial<Word>): Promise<Word> {
    try {
      const response = await useApiClient().post('/words', wordData)
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        console.error('Validation error:', error.response.data)
        throw new Error(`Validation error: ${JSON.stringify(error.response.data)}`)
      }
      throw error
    }
  },

  /**
   * Update an existing word
   */
  async updateWord(id: string, word: Partial<Word>): Promise<Word> {
    try {
      const response = await useApiClient().put(`/words/${id}`, word)
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        console.error('Validation error:', error.response.data)
        throw new Error(`Validation error: ${JSON.stringify(error.response.data)}`)
      }
      throw error
    }
  },

  /**
   * Delete a word
   */
  async deleteWord(id: string): Promise<void> {
    await useApiClient().delete(`/words/${id}`)
  },

  /**
   * Search words by Arabic text
   */
  async searchByArabic(arabic: string, page = 1, size = 10): Promise<PaginatedResponse<Word>> {
    const response = await useApiClient().get(`/words/search/arabic/${arabic}`, {
      params: { page, size },
    })
    return response.data
  },

  /**
   * Find word by exact Arabic text
   */
  async findByArabic(arabic: string): Promise<PaginatedResponse<Word> | null> {
    try {
      const response = await useApiClient().get(`/words/arabic/${arabic}`)
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
    const response = await useApiClient().get(`/words/root/${root}`, {
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
    const response = await useApiClient().get(`/words/part-of-speech/${partOfSpeech}`, {
      params: { page, size },
    })
    return response.data
  },

  /**
   * Find words by dialect
   */
  async findByDialect(dialect: string, page = 1, size = 10): Promise<PaginatedResponse<Word>> {
    const response = await useApiClient().get(`/words/dialect/${dialect}`, {
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
    const response = await useApiClient().get(`/words/difficulty/${difficulty}`, {
      params: { page, size },
    })
    return response.data
  },

  /**
   * Find verified words
   */
  async findVerified(page = 1, size = 10): Promise<PaginatedResponse<Word>> {
    const response = await useApiClient().get('/words/verified', {
      params: { page, size },
    })
    return response.data
  },

  /**
   * Search words by translation
   */
  async searchByTranslation(query: string, page = 1, size = 10): Promise<PaginatedResponse<Word>> {
    const response = await useApiClient().get(`/words/search/translation/${query}`, {
      params: { page, size },
    })
    return response.data
  },

  /**
   * Find most frequent words
   */
  async findMostFrequent(limit = 10): Promise<Word[]> {
    const response = await useApiClient().get(`/words/most-frequent/${limit}`)
    return response.data
  },

  /**
   * Search words for autocomplete functionality
   */
  async searchWords(query: string, limit = 10): Promise<WordSearchResult[]> {
    try {
      const response = await useApiClient().get('/words/search', {
        params: { q: query, limit },
      })
      return response.data
    } catch (error) {
      console.error('Word search failed:', error)
      return []
    }
  },
}
