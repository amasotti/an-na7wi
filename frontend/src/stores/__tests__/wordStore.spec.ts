import { wordService } from '@/services/wordService'
import * as stringUtils from '@/utils/stringUtils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useWordStore } from '../wordStore'

// Mock the services and utilities
vi.mock('../../services/wordService', () => ({
  wordService: {
    getWords: vi.fn(),
    getWord: vi.fn(),
    createWord: vi.fn(),
    updateWord: vi.fn(),
    deleteWord: vi.fn(),
    searchByArabic: vi.fn(),
    searchByTranslation: vi.fn(),
  },
}))

vi.mock('../../utils/stringUtils', () => ({
  isArabicText: vi.fn(),
}))

describe('wordStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const store = useWordStore()

      expect(store.words).toEqual([])
      expect(store.currentWord).toBeNull()
      expect(store.searchResults).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.searchLoading).toBe(false)
      expect(store.pagination).toEqual({
        page: 1,
        pageSize: 10,
        totalCount: 0,
      })
      expect(store.filters).toEqual({
        search: '',
        difficulty: '',
        dialect: '',
        masteryLevel: '',
        partOfSpeech: '',
      })
    })

    it('should have correct computed values', () => {
      const store = useWordStore()

      expect(store.hasWords).toBe(false)
      expect(store.hasSearchResults).toBe(false)
      expect(store.isSearching).toBe(false)
      expect(store.displayWords).toEqual([])
    })
  })

  describe('fetchWords', () => {
    it('should fetch words successfully', async () => {
      const store = useWordStore()
      const mockResponse = {
        items: [
          { id: '1', arabic: 'كتاب', translation: 'book' },
          { id: '2', arabic: 'قلم', translation: 'pen' },
        ],
        totalCount: 2,
        page: 1,
        pageSize: 10,
      }

      vi.mocked(wordService.getWords).mockResolvedValue(mockResponse)

      await store.fetchWords()

      expect(wordService.getWords).toHaveBeenCalledWith({
        page: 1,
        size: 10,
        sort: 'arabic',
      })
      expect(store.words).toEqual(mockResponse.items)
      expect(store.pagination.totalCount).toBe(2)
      expect(store.pagination.page).toBe(1)
      expect(store.loading).toBe(false)
    })

    it('should fetch words with filters', async () => {
      const store = useWordStore()
      store.filters.difficulty = 'INTERMEDIATE'
      store.filters.dialect = 'MSA'

      const mockResponse = {
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
      }

      vi.mocked(wordService.getWords).mockResolvedValue(mockResponse)

      await store.fetchWords()

      expect(wordService.getWords).toHaveBeenCalledWith({
        page: 1,
        size: 10,
        sort: 'arabic',
        difficulty: 'INTERMEDIATE',
        dialect: 'MSA',
      })
    })

    it('should handle fetch errors', async () => {
      const store = useWordStore()
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      vi.mocked(wordService.getWords).mockRejectedValue(new Error('Network error'))

      await store.fetchWords()

      expect(store.words).toEqual([])
      expect(store.pagination.totalCount).toBe(0)
      expect(store.loading).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching words:', expect.any(Error))

      consoleErrorSpy.mockRestore()
    })

    it('should reset page when resetPage is true', async () => {
      const store = useWordStore()
      store.pagination.page = 3

      const mockResponse = {
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
      }

      vi.mocked(wordService.getWords).mockResolvedValue(mockResponse)

      await store.fetchWords(true)

      expect(store.pagination.page).toBe(1)
    })
  })

  describe('searchWords', () => {
    it('should search Arabic text using Arabic endpoint', async () => {
      const store = useWordStore()
      const mockResults = [{ id: '1', arabic: 'كتاب', translation: 'book' }]

      vi.mocked(stringUtils.isArabicText).mockReturnValue(true)
      vi.mocked(wordService.searchByArabic).mockResolvedValue(mockResults)

      await store.searchWords('كتاب')

      expect(stringUtils.isArabicText).toHaveBeenCalledWith('كتاب')
      expect(wordService.searchByArabic).toHaveBeenCalledWith('كتاب', 1, 50)
      expect(store.searchResults).toEqual(mockResults)
      expect(store.searchLoading).toBe(false)
    })

    it('should search English text using translation endpoint', async () => {
      const store = useWordStore()
      const mockResults = [{ id: '1', arabic: 'كتاب', translation: 'book' }]

      vi.mocked(stringUtils.isArabicText).mockReturnValue(false)
      vi.mocked(wordService.searchByTranslation).mockResolvedValue(mockResults)

      await store.searchWords('book')

      expect(stringUtils.isArabicText).toHaveBeenCalledWith('book')
      expect(wordService.searchByTranslation).toHaveBeenCalledWith('book', 1, 50)
      expect(store.searchResults).toEqual(mockResults)
      expect(store.searchLoading).toBe(false)
    })

    it('should clear search results for empty query', async () => {
      const store = useWordStore()
      store.searchResults = [{ id: '1', arabic: 'كتاب', translation: 'book' }] as any

      await store.searchWords('')

      expect(store.searchResults).toEqual([])
      expect(wordService.searchByArabic).not.toHaveBeenCalled()
      expect(wordService.searchByTranslation).not.toHaveBeenCalled()
    })

    it('should handle search errors', async () => {
      const store = useWordStore()
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      vi.mocked(stringUtils.isArabicText).mockReturnValue(true)
      vi.mocked(wordService.searchByArabic).mockRejectedValue(new Error('Search error'))

      await store.searchWords('كتاب')

      expect(store.searchResults).toEqual([])
      expect(store.searchLoading).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error searching words:', expect.any(Error))

      consoleErrorSpy.mockRestore()
    })
  })

  describe('createWord', () => {
    it('should create a word successfully', async () => {
      const store = useWordStore()
      const wordData = { arabic: 'مدرسة', translation: 'school' }
      const newWord = { id: '3', ...wordData }

      vi.mocked(wordService.createWord).mockResolvedValue(newWord as any)

      const result = await store.createWord(wordData)

      expect(wordService.createWord).toHaveBeenCalledWith(wordData)
      expect(result).toEqual(newWord)
      expect(store.words[0]).toEqual(newWord)
      expect(store.pagination.totalCount).toBe(1)
    })

    it('should not add to words list when searching', async () => {
      const store = useWordStore()
      store.filters.search = 'test'
      const wordData = { arabic: 'مدرسة', translation: 'school' }
      const newWord = { id: '3', ...wordData }

      vi.mocked(wordService.createWord).mockResolvedValue(newWord as any)

      await store.createWord(wordData)

      expect(store.words).toEqual([])
      expect(store.pagination.totalCount).toBe(0)
    })
  })

  describe('updateWord', () => {
    it('should update a word successfully', async () => {
      const store = useWordStore()
      const originalWord = { id: '1', arabic: 'كتاب', translation: 'book' }
      const updatedWord = { id: '1', arabic: 'كتاب', translation: 'updated book' }

      store.words = [originalWord as any]
      store.currentWord = originalWord as any

      vi.mocked(wordService.updateWord).mockResolvedValue(updatedWord as any)

      const result = await store.updateWord('1', { translation: 'updated book' })

      expect(wordService.updateWord).toHaveBeenCalledWith('1', { translation: 'updated book' })
      expect(result).toEqual(updatedWord)
      expect(store.words[0]).toEqual(updatedWord)
      expect(store.currentWord).toEqual(updatedWord)
    })

    it('should update word in search results', async () => {
      const store = useWordStore()
      const originalWord = { id: '1', arabic: 'كتاب', translation: 'book' }
      const updatedWord = { id: '1', arabic: 'كتاب', translation: 'updated book' }

      store.searchResults = [originalWord as any]

      vi.mocked(wordService.updateWord).mockResolvedValue(updatedWord as any)

      await store.updateWord('1', { translation: 'updated book' })

      expect(store.searchResults[0]).toEqual(updatedWord)
    })
  })

  describe('deleteWord', () => {
    it('should delete a word successfully', async () => {
      const store = useWordStore()
      const word = { id: '1', arabic: 'كتاب', translation: 'book' }

      store.words = [word as any]
      store.searchResults = [word as any]
      store.currentWord = word as any
      store.pagination.totalCount = 1

      vi.mocked(wordService.deleteWord).mockResolvedValue()

      await store.deleteWord('1')

      expect(wordService.deleteWord).toHaveBeenCalledWith('1')
      expect(store.words).toEqual([])
      expect(store.searchResults).toEqual([])
      expect(store.currentWord).toBeNull()
      expect(store.pagination.totalCount).toBe(0)
    })
  })

  describe('updateFilters', () => {
    it('should trigger search when search filter is updated', async () => {
      const store = useWordStore()
      vi.mocked(stringUtils.isArabicText).mockReturnValue(true)
      vi.mocked(wordService.searchByArabic).mockResolvedValue([])

      store.updateFilters({ search: 'كتاب' })

      expect(store.filters.search).toBe('كتاب')
      expect(stringUtils.isArabicText).toHaveBeenCalledWith('كتاب')
    })

    it('should clear search results when search is empty', async () => {
      const store = useWordStore()
      store.searchResults = [{ id: '1', arabic: 'كتاب' }] as any

      store.updateFilters({ search: '' })

      expect(store.filters.search).toBe('')
      expect(store.searchResults).toEqual([])
    })

    it('should refetch words when non-search filter is updated', async () => {
      const store = useWordStore()
      const mockResponse = {
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
      }

      vi.mocked(wordService.getWords).mockResolvedValue(mockResponse)

      store.updateFilters({ difficulty: 'INTERMEDIATE' })

      expect(store.filters.difficulty).toBe('INTERMEDIATE')
      expect(wordService.getWords).toHaveBeenCalled()
    })
  })

  describe('computed properties', () => {
    it('should return correct displayWords when searching', () => {
      const store = useWordStore()
      const words = [{ id: '1', arabic: 'كتاب' }]
      const searchResults = [{ id: '2', arabic: 'مدرسة' }]

      store.words = words as any
      store.searchResults = searchResults as any
      store.filters.search = 'test'

      expect(store.displayWords).toEqual(searchResults)
    })

    it('should return words when not searching', () => {
      const store = useWordStore()
      const words = [{ id: '1', arabic: 'كتاب' }]

      store.words = words as any
      store.filters.search = ''

      expect(store.displayWords).toEqual(words)
    })

    it('should have correct option arrays', () => {
      const store = useWordStore()

      expect(store.difficultyOptions).toEqual([
        { value: 'BEGINNER', label: 'BEGINNER' },
        { value: 'INTERMEDIATE', label: 'INTERMEDIATE' },
        { value: 'ADVANCED', label: 'ADVANCED' },
      ])

      expect(store.dialectOptions.length).toBeGreaterThan(0)
      expect(store.masteryLevelOptions.length).toBeGreaterThan(0)
      expect(store.partsOfSpeechOptions.length).toBeGreaterThan(0)
    })
  })

  describe('utility methods', () => {
    it('should clear search correctly', () => {
      const store = useWordStore()
      store.filters.search = 'test'
      store.searchResults = [{ id: '1', arabic: 'كتاب' }] as any

      store.clearSearch()

      expect(store.filters.search).toBe('')
      expect(store.searchResults).toEqual([])
    })

    it('should clear all filters correctly', async () => {
      const store = useWordStore()
      store.filters = {
        search: 'test',
        difficulty: 'INTERMEDIATE',
        dialect: 'MSA',
        masteryLevel: 'FAMILIAR',
        partOfSpeech: 'NOUN',
      }
      store.searchResults = [{ id: '1', arabic: 'كتاب' }] as any

      const mockResponse = {
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
      }

      vi.mocked(wordService.getWords).mockResolvedValue(mockResponse)

      store.clearFilters()

      expect(store.filters).toEqual({
        search: '',
        difficulty: '',
        dialect: '',
        masteryLevel: '',
        partOfSpeech: '',
      })
      expect(store.searchResults).toEqual([])
      expect(wordService.getWords).toHaveBeenCalled()
    })

    it('should reset store state correctly', () => {
      const store = useWordStore()

      // Set some state
      store.words = [{ id: '1', arabic: 'كتاب' }] as any
      store.currentWord = { id: '1', arabic: 'كتاب' } as any
      store.searchResults = [{ id: '1', arabic: 'كتاب' }] as any
      store.loading = true
      store.pagination.totalCount = 5
      store.filters.search = 'test'

      store.reset()

      expect(store.words).toEqual([])
      expect(store.currentWord).toBeNull()
      expect(store.searchResults).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.searchLoading).toBe(false)
      expect(store.pagination).toEqual({
        page: 1,
        pageSize: 10,
        totalCount: 0,
      })
      expect(store.filters).toEqual({
        search: '',
        difficulty: '',
        dialect: '',
        masteryLevel: '',
        partOfSpeech: '',
      })
    })
  })
})
