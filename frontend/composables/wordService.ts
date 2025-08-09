import { isAxiosError } from 'axios'
import type { PaginatedResponse, Word } from '~/types'
import { ensureModernDictionaryLinks } from '~/utils/dictionaryMigration'

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
    const data = response.data
    // Ensure all words have modern dictionary links format
    data.items = data.items.map(ensureModernDictionaryLinks)
    return data
  },

  /**
   * Get a single word by ID
   */
  async getWord(id: string): Promise<Word> {
    const response = await useApiClient().get(`/words/${id}`)
    return ensureModernDictionaryLinks(response.data)
  },

  /**
   * Create a new word
   */
  async createWord(wordData: Partial<Word>): Promise<Word> {
    const response = await useApiClient().post('/words', wordData)
    return ensureModernDictionaryLinks(response.data)
  },

  /**
   * Update an existing word
   */
  async updateWord(id: string, word: Partial<Word>): Promise<Word> {
    const response = await useApiClient().put(`/words/${id}`, word)
    return ensureModernDictionaryLinks(response.data)
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
    const data = response.data
    data.items = data.items.map(ensureModernDictionaryLinks)
    return data
  },

  /**
   * Find word by exact Arabic text
   */
  async findByArabic(arabic: string): Promise<PaginatedResponse<Word> | null> {
    try {
      const response = await useApiClient().get(`/words/arabic/${arabic}`)
      const data = response.data
      if (data) {
        data.items = data.items.map(ensureModernDictionaryLinks)
      }
      return data
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
    const data = response.data
    data.items = data.items.map(ensureModernDictionaryLinks)
    return data
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
    const data = response.data
    data.items = data.items.map(ensureModernDictionaryLinks)
    return data
  },

  /**
   * Find words by dialect
   */
  async findByDialect(dialect: string, page = 1, size = 10): Promise<PaginatedResponse<Word>> {
    const response = await useApiClient().get(`/words/dialect/${dialect}`, {
      params: { page, size },
    })
    const data = response.data
    data.items = data.items.map(ensureModernDictionaryLinks)
    return data
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
    const data = response.data
    data.items = data.items.map(ensureModernDictionaryLinks)
    return data
  },

  /**
   * Find verified words
   */
  async findVerified(page = 1, size = 10): Promise<PaginatedResponse<Word>> {
    const response = await useApiClient().get('/words/verified', {
      params: { page, size },
    })
    const data = response.data
    data.items = data.items.map(ensureModernDictionaryLinks)
    return data
  },

  /**
   * Search words by translation
   */
  async searchByTranslation(query: string, page = 1, size = 10): Promise<PaginatedResponse<Word>> {
    const response = await useApiClient().get(`/words/search/translation/${query}`, {
      params: { page, size },
    })
    const data = response.data
    data.items = data.items.map(ensureModernDictionaryLinks)
    return data
  },

  /**
   * Find most frequent words
   */
  async findMostFrequent(limit = 10): Promise<Word[]> {
    const response = await useApiClient().get(`/words/most-frequent/${limit}`)
    return response.data.map(ensureModernDictionaryLinks)
  },
}
