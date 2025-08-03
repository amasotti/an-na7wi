import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockWord, mockWordResponse } from '~/test/mocks/server'
import type { Word } from '~/types'
import { Dialect, Difficulty, MasteryLevel, PartOfSpeech } from '~/types/enums'
import { useWordStore } from './wordStore'

// Mock the word service
vi.mock('~/composables/wordService', () => ({
  wordService: {
    getWords: vi.fn(() => Promise.resolve(mockWordResponse)),
    getWord: vi.fn((id: string) => Promise.resolve({ ...mockWord, id })),
    createWord: vi.fn((data: Partial<Word>) =>
      Promise.resolve({ ...mockWord, ...data, id: 'new-id' })
    ),
    updateWord: vi.fn((id: string, data: Partial<Word>) =>
      Promise.resolve({ ...mockWord, ...data, id })
    ),
    deleteWord: vi.fn(() => Promise.resolve()),
    searchByArabic: vi.fn(() => Promise.resolve(mockWordResponse)),
    searchByTranslation: vi.fn(() => Promise.resolve(mockWordResponse)),
    findByRoot: vi.fn(() => Promise.resolve(mockWordResponse)),
  },
}))

// Mock string utils
vi.mock('~/utils/stringUtils', () => ({
  isArabicText: vi.fn((text: string) => /[\u0600-\u06FF]/.test(text)),
}))

describe('wordStore', () => {
  let store: ReturnType<typeof useWordStore>

  beforeEach(() => {
    store = useWordStore()
    store.reset() // Reset store state
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('has correct initial state', () => {
      expect(store.words).toEqual([])
      expect(store.currentWord).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.searchLoading).toBe(false)
      expect(store.searchResults).toEqual([])
      expect(store.pagination.page).toBe(1)
      expect(store.pagination.pageSize).toBe(10)
      expect(store.pagination.totalCount).toBe(0)
      expect(store.filters.search).toBe('')
    })
  })

  describe('computed properties', () => {
    it('hasWords returns correct value', () => {
      expect(store.hasWords).toBe(false)

      store.words = [mockWord]
      expect(store.hasWords).toBe(true)
    })

    it('hasSearchResults returns correct value', () => {
      expect(store.hasSearchResults).toBe(false)

      store.searchResults = [mockWord]
      expect(store.hasSearchResults).toBe(true)
    })

    it('isSearching returns correct value', () => {
      expect(store.isSearching).toBe(false)

      store.filters.search = 'test'
      expect(store.isSearching).toBe(true)
    })

    it('displayWords returns correct words based on search state', () => {
      store.words = [mockWord]
      store.searchResults = [{ ...mockWord, id: '2' }]

      // Not searching
      expect(store.displayWords).toEqual([mockWord])

      // Searching
      store.filters.search = 'test'
      expect(store.displayWords).toEqual([{ ...mockWord, id: '2' }])
    })

    it('returns correct option arrays', () => {
      expect(store.difficultyOptions).toEqual(
        Object.values(Difficulty).map(d => ({ value: d, label: d }))
      )

      expect(store.dialectOptions).toEqual(
        Object.values(Dialect).map(d => ({ value: d, label: d }))
      )

      expect(store.masteryLevelOptions).toEqual(
        Object.values(MasteryLevel).map(m => ({ value: m, label: m }))
      )

      expect(store.partsOfSpeechOptions).toEqual(
        Object.values(PartOfSpeech).map(p => ({ value: p, label: p }))
      )
    })
  })

  describe('fetchWords', () => {
    it('fetches words successfully', async () => {
      await store.fetchWords()

      expect(store.loading).toBe(false)
      expect(store.words).toEqual(mockWordResponse.items)
      expect(store.pagination.totalCount).toBe(mockWordResponse.totalCount)
    })

    it('resets page when resetPage is true', async () => {
      store.pagination.page = 3

      await store.fetchWords(true)

      expect(store.pagination.page).toBe(1)
    })

    it('handles fetch error', async () => {
      const wordService = await import('~/composables/wordService')
      vi.mocked(wordService.wordService.getWords).mockRejectedValueOnce(new Error('API Error'))

      await store.fetchWords()

      expect(store.words).toEqual([])
      expect(store.pagination.totalCount).toBe(0)
      expect(store.loading).toBe(false)
    })
  })

  describe('searchWords', () => {
    it('searches by Arabic text', async () => {
      await store.searchWords('كتاب')

      const wordService = await import('~/composables/wordService')
      expect(wordService.wordService.searchByArabic).toHaveBeenCalledWith('كتاب', 1, 50)
      expect(store.searchResults).toEqual(mockWordResponse.items)
    })

    it('searches by translation', async () => {
      await store.searchWords('book')

      const wordService = await import('~/composables/wordService')
      expect(wordService.wordService.searchByTranslation).toHaveBeenCalledWith('book', 1, 50)
      expect(store.searchResults).toEqual(mockWordResponse.items)
    })

    it('clears results for empty query', async () => {
      store.searchResults = [mockWord]

      await store.searchWords('')

      expect(store.searchResults).toEqual([])
    })

    it('handles search error', async () => {
      const wordService = await import('~/composables/wordService')
      vi.mocked(wordService.wordService.searchByArabic).mockRejectedValueOnce(
        new Error('Search Error')
      )

      await store.searchWords('كتاب')

      expect(store.searchResults).toEqual([])
      expect(store.searchLoading).toBe(false)
    })
  })

  describe('fetchWordById', () => {
    it('fetches word by id successfully', async () => {
      await store.fetchWordById('test-id')

      expect(store.currentWord).toEqual({ ...mockWord, id: 'test-id' })
      expect(store.loading).toBe(false)
    })

    it('handles fetch by id error', async () => {
      const wordService = await import('~/composables/wordService')
      vi.mocked(wordService.wordService.getWord).mockRejectedValueOnce(new Error('Not found'))

      await store.fetchWordById('invalid-id')

      expect(store.currentWord).toBeNull()
      expect(store.loading).toBe(false)
    })
  })

  describe('createWord', () => {
    it('creates word successfully', async () => {
      const wordData = { arabic: 'قلم', translation: 'pen' }

      const result = await store.createWord(wordData)

      expect(result).toEqual({ ...mockWord, ...wordData, id: 'new-id' })
      expect(store.words[0]).toEqual(result)
      expect(store.pagination.totalCount).toBe(1)
    })

    it('does not add to list when searching', async () => {
      store.filters.search = 'test'
      const wordData = { arabic: 'قلم', translation: 'pen' }

      await store.createWord(wordData)

      expect(store.words).toEqual([])
    })
  })

  describe('updateWord', () => {
    beforeEach(() => {
      store.words = [mockWord]
      store.searchResults = [mockWord]
      store.currentWord = mockWord
    })

    it('updates word in all relevant arrays', async () => {
      const updateData = { translation: 'updated book' }

      const result = await store.updateWord('1', updateData)

      expect(result.translation).toBe('updated book')
      expect(store.words[0]!.translation).toBe('updated book')
      expect(store.searchResults[0]!.translation).toBe('updated book')
      expect(store.currentWord?.translation).toBe('updated book')
    })

    it('handles update error', async () => {
      const wordService = await import('~/composables/wordService')
      vi.mocked(wordService.wordService.updateWord).mockRejectedValueOnce(
        new Error('Update failed')
      )

      await expect(store.updateWord('1', { translation: 'fail' })).rejects.toThrow('Update failed')
    })
  })

  describe('deleteWord', () => {
    beforeEach(() => {
      store.words = [mockWord]
      store.searchResults = [mockWord]
      store.currentWord = mockWord
      store.pagination.totalCount = 1
    })

    it('deletes word from all arrays', async () => {
      await store.deleteWord('1')

      expect(store.words).toEqual([])
      expect(store.searchResults).toEqual([])
      expect(store.currentWord).toBeNull()
      expect(store.pagination.totalCount).toBe(0)
    })
  })

  describe('pagination and filters', () => {
    it('changes page correctly', async () => {
      store.changePage(3)

      expect(store.pagination.page).toBe(3)
    })

    it('updates filters and triggers search', async () => {
      store.updateFilters({ search: 'test' })

      expect(store.filters.search).toBe('test')
    })

    it('updates filters and triggers fetch for non-search filters', async () => {
      store.updateFilters({ difficulty: Difficulty.INTERMEDIATE })

      expect(store.filters.difficulty).toBe(Difficulty.INTERMEDIATE)
    })

    it('clears search correctly', () => {
      store.filters.search = 'test'
      store.searchResults = [mockWord]

      store.clearSearch()

      expect(store.filters.search).toBe('')
      expect(store.searchResults).toEqual([])
    })

    it('clears all filters', async () => {
      store.filters = {
        search: 'test',
        difficulty: Difficulty.INTERMEDIATE,
        dialect: Dialect.EGYPTIAN,
        masteryLevel: MasteryLevel.LEARNING,
        partOfSpeech: PartOfSpeech.VERB,
      }

      store.clearFilters()

      expect(store.filters).toEqual({
        search: '',
        difficulty: '',
        dialect: '',
        masteryLevel: '',
        partOfSpeech: '',
      })
    })
  })

  describe('reset', () => {
    it('resets all state to initial values', () => {
      // Set some state
      store.words = [mockWord]
      store.currentWord = mockWord
      store.searchResults = [mockWord]
      store.loading = true
      store.pagination.page = 3
      store.filters.search = 'test'

      store.reset()

      expect(store.words).toEqual([])
      expect(store.currentWord).toBeNull()
      expect(store.searchResults).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.pagination.page).toBe(1)
      expect(store.filters.search).toBe('')
    })
  })
})
