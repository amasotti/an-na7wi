import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDictionaryLinks } from '~/test/mocks/server'
import {
  Dialect,
  Difficulty,
  MasteryLevel,
  type PaginatedResponse,
  PartOfSpeech,
  type Root,
  type RootNormalization,
  type RootStatistics,
  type RootWithWords,
  type Word,
} from '~/types'
import { rootService } from './rootService'

// Mock the API client
const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}

vi.mock('./api', () => ({
  useApiClient: () => mockApiClient,
}))

describe('rootService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockRoot: Root = {
    id: '1',
    displayForm: 'ك-ت-ب',
    normalizedForm: 'كتب',
    letters: ['ك', 'ت', 'ب'],
    letterCount: 3,
    meaning: 'writing',
    analysis: 'Root related to writing and written materials',
    wordCount: 15,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  const mockWord: Word = {
    id: '1',
    arabic: 'كتاب',
    transliteration: 'kitab',
    translation: 'book',
    partOfSpeech: PartOfSpeech.NOUN,
    dialect: Dialect.MSA,
    difficulty: Difficulty.BEGINNER,
    masteryLevel: MasteryLevel.LEARNING,
    frequency: 100,
    root: 'ك-ت-ب',
    createdAt: '2024-01-01T00:00:00Z',
    dictionaryLinks: mockDictionaryLinks,
  }

  const mockRootWithWords: RootWithWords = {
    root: mockRoot,
    words: [mockWord],
  }

  const mockPaginatedResponse: PaginatedResponse<Root> = {
    items: [mockRoot],
    totalCount: 1,
    page: 1,
    pageSize: 10,
  }

  describe('getRoots', () => {
    it('should fetch roots with default parameters', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPaginatedResponse })

      const result = await rootService.getRoots()

      expect(mockApiClient.get).toHaveBeenCalledWith('/roots', { params: {} })
      expect(result).toEqual(mockPaginatedResponse)
    })

    it('should fetch roots with custom parameters', async () => {
      const params = {
        page: 2,
        size: 20,
        sort: 'rootArabic',
      }
      mockApiClient.get.mockResolvedValue({ data: mockPaginatedResponse })

      const result = await rootService.getRoots(params)

      expect(mockApiClient.get).toHaveBeenCalledWith('/roots', { params })
      expect(result).toEqual(mockPaginatedResponse)
    })
  })

  describe('getRoot', () => {
    it('should fetch a single root by ID', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockRoot })

      const result = await rootService.getRoot('1')

      expect(mockApiClient.get).toHaveBeenCalledWith('/roots/1')
      expect(result).toEqual(mockRoot)
    })
  })

  describe('getRootWithWords', () => {
    it('should fetch root with associated words', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockRootWithWords })

      const result = await rootService.getRootWithWords('1')

      expect(mockApiClient.get).toHaveBeenCalledWith('/roots/1/words')
      expect(result).toEqual(mockRootWithWords)
    })
  })

  describe('searchRoots', () => {
    it('should search roots with default parameters', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPaginatedResponse })

      const result = await rootService.searchRoots('كتب')

      expect(mockApiClient.get).toHaveBeenCalledWith('/roots/search', {
        params: { q: 'كتب' },
      })
      expect(result).toEqual(mockPaginatedResponse)
    })

    it('should search roots with custom parameters', async () => {
      const params = {
        page: 2,
        size: 15,
        sort: 'wordCount',
      }
      mockApiClient.get.mockResolvedValue({ data: mockPaginatedResponse })

      const result = await rootService.searchRoots('كتب', params)

      expect(mockApiClient.get).toHaveBeenCalledWith('/roots/search', {
        params: { q: 'كتب', ...params },
      })
      expect(result).toEqual(mockPaginatedResponse)
    })
  })

  describe('getRootsByLetterCount', () => {
    it('should fetch roots by letter count with default parameters', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPaginatedResponse })

      const result = await rootService.getRootsByLetterCount(3)

      expect(mockApiClient.get).toHaveBeenCalledWith('/roots/letter-count/3', {
        params: {},
      })
      expect(result).toEqual(mockPaginatedResponse)
    })

    it('should fetch roots by letter count with custom parameters', async () => {
      const params = {
        page: 3,
        size: 25,
        sort: 'meaning',
      }
      mockApiClient.get.mockResolvedValue({ data: mockPaginatedResponse })

      const result = await rootService.getRootsByLetterCount(4, params)

      expect(mockApiClient.get).toHaveBeenCalledWith('/roots/letter-count/4', {
        params,
      })
      expect(result).toEqual(mockPaginatedResponse)
    })
  })

  describe('normalizeRoot', () => {
    it('should normalize Arabic root input', async () => {
      const mockNormalization: RootNormalization = {
        input: 'ك ت ب',
        normalizedForm: 'كتب',
        letters: ['ك', 'ت', 'ب'],
        displayForm: 'ك-ت-ب',
        letterCount: 3,
        isValid: true,
      }
      mockApiClient.post.mockResolvedValue({ data: mockNormalization })

      const result = await rootService.normalizeRoot('ك ت ب')

      expect(mockApiClient.post).toHaveBeenCalledWith('/roots/normalize', {
        input: 'ك ت ب',
      })
      expect(result).toEqual(mockNormalization)
    })
  })

  describe('getStatistics', () => {
    it('should fetch root statistics', async () => {
      const mockStatistics: RootStatistics = {
        totalRoots: 1000,
        triLiteral: 500,
        quadriLiteral: 300,
        quinqueLiteral: 200,
        otherCounts: {
          6: 0,
        },
      }
      mockApiClient.get.mockResolvedValue({ data: mockStatistics })

      const result = await rootService.getStatistics()

      expect(mockApiClient.get).toHaveBeenCalledWith('/roots/statistics')
      expect(result).toEqual(mockStatistics)
    })
  })

  describe('createRoot', () => {
    it('should create a new root with input only', async () => {
      mockApiClient.post.mockResolvedValue({ data: mockRoot })

      const result = await rootService.createRoot('ك-ت-ب')

      expect(mockApiClient.post).toHaveBeenCalledWith('/roots', {
        input: 'ك-ت-ب',
        meaning: undefined,
      })
      expect(result).toEqual(mockRoot)
    })

    it('should create a new root with input and meaning', async () => {
      mockApiClient.post.mockResolvedValue({ data: mockRoot })

      const result = await rootService.createRoot('ك-ت-ب', 'writing')

      expect(mockApiClient.post).toHaveBeenCalledWith('/roots', {
        input: 'ك-ت-ب',
        meaning: 'writing',
      })
      expect(result).toEqual(mockRoot)
    })
  })

  describe('updateRoot', () => {
    it('should update a root with input only', async () => {
      const updatedRoot: Root = {
        ...mockRoot,
        meaning: 'updated meaning',
      }
      mockApiClient.put.mockResolvedValue({ data: updatedRoot })

      const result = await rootService.updateRoot('1', 'ك-ت-ب')

      expect(mockApiClient.put).toHaveBeenCalledWith('/roots/1', {
        input: 'ك-ت-ب',
        meaning: undefined,
      })
      expect(result).toEqual(updatedRoot)
    })

    it('should update a root with input and meaning', async () => {
      const updatedRoot: Root = {
        ...mockRoot,
        meaning: 'updated writing meaning',
      }
      mockApiClient.put.mockResolvedValue({ data: updatedRoot })

      const result = await rootService.updateRoot('1', 'ك-ت-ب', 'updated writing meaning')

      expect(mockApiClient.put).toHaveBeenCalledWith('/roots/1', {
        input: 'ك-ت-ب',
        meaning: 'updated writing meaning',
      })
      expect(result).toEqual(updatedRoot)
    })

    it('should handle update with different root form', async () => {
      const updatedRoot: Root = {
        ...mockRoot,
        displayForm: 'ق-ر-أ',
        normalizedForm: 'قرأ',
        letters: ['ق', 'ر', 'أ'],
        meaning: 'reading',
      }
      mockApiClient.put.mockResolvedValue({ data: updatedRoot })

      const result = await rootService.updateRoot('1', 'ق-ر-أ', 'reading')

      expect(mockApiClient.put).toHaveBeenCalledWith('/roots/1', {
        input: 'ق-ر-أ',
        meaning: 'reading',
      })
      expect(result).toEqual(updatedRoot)
    })
  })

  describe('deleteRoot', () => {
    it('should delete a root by ID', async () => {
      mockApiClient.delete.mockResolvedValue({})

      await rootService.deleteRoot('1')

      expect(mockApiClient.delete).toHaveBeenCalledWith('/roots/1')
    })
  })
})
