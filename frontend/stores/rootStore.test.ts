import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PaginatedResponse, Root, RootStatistics, RootWithWords } from '~/types'
import { useRootStore } from './rootStore'

// Mock the root service
const mockRoot: Root = {
  id: '1',
  letters: ['ك', 'ت', 'ب'],
  displayForm: 'ك ت ب',
  normalizedForm: 'كتب',
  letterCount: 3,
  meaning: 'writing, book',
  wordCount: 5,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const mockRootWithWords: RootWithWords = {
  root: mockRoot,
  words: [
    {
      id: '1',
      arabic: 'كتاب',
      translation: 'book',
      partOfSpeech: 'NOUN',
      difficulty: 'BEGINNER',
      dialect: 'MSA',
    },
  ],
}

const mockStatistics: RootStatistics = {
  totalRoots: 100,
  triLiteral: 45,
  quadriLiteral: 35,
  quinqueLiteral: 20,
  otherCounts: { 6: 5, 7: 2 },
}

const mockRootResponse: PaginatedResponse<Root> = {
  items: [mockRoot],
  page: 1,
  pageSize: 20,
  totalCount: 1,
}

vi.mock('~/composables/rootService', () => ({
  rootService: {
    getRoots: vi.fn(() => Promise.resolve(mockRootResponse)),
    getRoot: vi.fn((id: string) => Promise.resolve({ ...mockRoot, id })),
    getRootWithWords: vi.fn((id: string) => Promise.resolve({ ...mockRootWithWords, id })),
    createRoot: vi.fn((_input: string, _meaning?: string) =>
      Promise.resolve({ ...mockRoot, id: 'new-id' })
    ),
    updateRoot: vi.fn((id: string, data: Partial<Root>) =>
      Promise.resolve({ ...mockRoot, ...data, id })
    ),
    deleteRoot: vi.fn(() => Promise.resolve()),
    getStatistics: vi.fn(() => Promise.resolve(mockStatistics)),
    normalizeRoot: vi.fn((root: string) =>
      Promise.resolve({
        valid: true,
        displayForm: root,
        searchForm: root.replace(/\s/g, ''),
      })
    ),
  },
}))

describe('rootStore', () => {
  let store: ReturnType<typeof useRootStore>

  beforeEach(() => {
    store = useRootStore()
    // Reset store state manually
    store.roots = []
    store.currentRoot = null
    store.currentRootWithWords = null
    store.statistics = null
    store.error = null
    store.pagination.page = 1
    store.pagination.totalCount = 0
    store.resetFilters()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('has correct initial state', () => {
      expect(store.roots).toEqual([])
      expect(store.currentRoot).toBeNull()
      expect(store.currentRootWithWords).toBeNull()
      expect(store.statistics).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.pagination.page).toBe(1)
      expect(store.pagination.size).toBe(20)
      expect(store.pagination.totalCount).toBe(0)
    })
  })

  describe('computed properties', () => {
    it('filters roots by search query', () => {
      store.roots = [mockRoot, { ...mockRoot, id: '2', displayForm: 'ق ر ء', meaning: 'reading' }]

      // No filter
      expect(store.filteredRoots).toHaveLength(2)

      // Filter by display form
      store.filters.search = 'ك ت ب'
      expect(store.filteredRoots).toHaveLength(1)
      expect(store.filteredRoots[0]!.displayForm).toBe('ك ت ب')

      // Filter by meaning
      store.filters.search = 'reading'
      expect(store.filteredRoots).toHaveLength(1)
      expect(store.filteredRoots[0]!.meaning).toBe('reading')
    })

    it('filters roots by letter count', () => {
      store.roots = [mockRoot, { ...mockRoot, id: '2', letterCount: 4, displayForm: 'ق ر ء ء' }]

      // No filter
      expect(store.filteredRoots).toHaveLength(2)

      // Filter by letter count
      store.filters.letterCount = 3
      expect(store.filteredRoots).toHaveLength(1)
      expect(store.filteredRoots[0]!.letterCount).toBe(3)
    })

    it('combines search and letter count filters', () => {
      store.roots = [
        mockRoot,
        { ...mockRoot, id: '2', letterCount: 3, displayForm: 'ق ر ء', meaning: 'reading' },
        {
          ...mockRoot,
          id: '3',
          letterCount: 4,
          displayForm: 'ك ت ب ت',
          meaning: 'writing advanced',
        },
      ]

      store.filters.search = 'reading'
      store.filters.letterCount = 3

      expect(store.filteredRoots).toHaveLength(1)
      expect(store.filteredRoots[0]!.meaning).toBe('reading')
    })
  })

  describe('actions', () => {
    it('fetches roots successfully', async () => {
      await store.fetchRoots()

      expect(store.loading).toBe(false)
      expect(store.roots).toEqual([mockRoot])
      expect(store.pagination.totalCount).toBe(1)
      expect(store.error).toBeNull()
    })

    it('handles fetch roots error', async () => {
      const rootService = await import('~/composables/rootService')
      vi.mocked(rootService.rootService.getRoots).mockRejectedValueOnce(new Error('Network error'))

      await store.fetchRoots()

      expect(store.loading).toBe(false)
      expect(store.error).toBe('Network error')
      expect(store.roots).toEqual([])
    })

    it('fetches root by id successfully', async () => {
      await store.fetchRoot('test-id')

      expect(store.currentRoot).toEqual({ ...mockRoot, id: 'test-id' })
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('fetches root with words successfully', async () => {
      await store.fetchRootWithWords('test-id')

      expect(store.currentRootWithWords).toEqual({ ...mockRootWithWords, id: 'test-id' })
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('creates root successfully', async () => {
      const result = await store.createRoot('ق ل م', 'pen, writing')

      expect(result).toEqual({ ...mockRoot, id: 'new-id' })
      expect(store.roots[0]).toEqual(result)
    })

    it('updates root successfully', async () => {
      const originalRoot = { ...mockRoot, id: '1' }
      const updatedRoot = { ...mockRoot, id: '1', meaning: 'updated meaning' }
      
      store.roots = [originalRoot]
      store.currentRoot = originalRoot
      store.currentRootWithWords = { root: originalRoot, words: [] }

      const rootService = await import('~/composables/rootService')
      vi.mocked(rootService.rootService.updateRoot).mockResolvedValueOnce(updatedRoot)

      const result = await store.updateRoot('1', 'ك-ت-ب', 'updated meaning')

      expect(result).toEqual(updatedRoot)
      expect(store.roots[0]).toEqual(updatedRoot)
      expect(store.currentRoot).toEqual(updatedRoot)
      expect(store.currentRootWithWords?.root).toEqual(updatedRoot)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('handles update root error', async () => {
      const rootService = await import('~/composables/rootService')
      vi.mocked(rootService.rootService.updateRoot).mockRejectedValueOnce(new Error('Update failed'))

      await expect(store.updateRoot('1', 'ك-ت-ب', 'meaning')).rejects.toThrow('Update failed')

      expect(store.loading).toBe(false)
      expect(store.error).toBe('Update failed')
    })

    it('updates only roots array when root not in current state', async () => {
      const originalRoot = { ...mockRoot, id: '1' }
      const updatedRoot = { ...mockRoot, id: '1', meaning: 'updated meaning' }
      
      store.roots = [originalRoot]
      // currentRoot and currentRootWithWords are null

      const rootService = await import('~/composables/rootService')
      vi.mocked(rootService.rootService.updateRoot).mockResolvedValueOnce(updatedRoot)

      const result = await store.updateRoot('1', 'ك-ت-ب', 'updated meaning')

      expect(result).toEqual(updatedRoot)
      expect(store.roots[0]).toEqual(updatedRoot)
      expect(store.currentRoot).toBeNull()
      expect(store.currentRootWithWords).toBeNull()
    })

    it('deletes root successfully', async () => {
      store.roots = [mockRoot]

      const result = await store.deleteRoot('1')

      expect(result).toBe(true)
      expect(store.roots).toEqual([])
    })

    it('fetches statistics successfully', async () => {
      await store.fetchStatistics()

      expect(store.statistics).toEqual(mockStatistics)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('changes page correctly', () => {
      store.setPage(2)

      expect(store.pagination.page).toBe(2)
    })

    it('updates filters correctly', () => {
      store.updateFilters({
        search: 'test',
        letterCount: 4,
        sort: 'meaning',
      })

      expect(store.filters.search).toBe('test')
      expect(store.filters.letterCount).toBe(4)
      expect(store.filters.sort).toBe('meaning')
    })

    it('clears filters correctly', () => {
      store.updateFilters({
        search: 'test',
        letterCount: 3,
        sort: 'meaning',
      })

      store.resetFilters()

      expect(store.filters.search).toBe('')
      expect(store.filters.letterCount).toBeNull()
      expect(store.filters.sort).toBe('displayForm')
    })
  })

  describe('utility methods', () => {
    it('clears error', () => {
      store.error = 'Test error'

      store.clearError()

      expect(store.error).toBeNull()
    })

    it('clears loading state through clearError and setLoading', () => {
      // These are internal methods, just test that clearError works
      store.error = 'Test error'
      store.clearError()
      expect(store.error).toBeNull()
    })
  })
})
