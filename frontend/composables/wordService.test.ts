import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  Dialect,
  Difficulty,
  MasteryLevel,
  type PaginatedResponse,
  PartOfSpeech,
  type Word,
} from '~/types'
import { wordService } from './wordService'
import {mockDictionaryLinks} from "~/test/mocks/server";

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

describe('wordService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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
    isVerified: true,
    dictionaryLinks: mockDictionaryLinks
  }

  const mockPaginatedResponse: PaginatedResponse<Word> = {
    items: [mockWord],
    totalCount: 1,
    page: 1,
    pageSize: 10,
  }

  describe('getWords', () => {
    it('should fetch words with default parameters', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPaginatedResponse })

      const result = await wordService.getWords()

      expect(mockApiClient.get).toHaveBeenCalledWith('/words', { params: {} })
      expect(result).toEqual(mockPaginatedResponse)
    })

    it('should fetch words with custom parameters', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPaginatedResponse })
      const params = {
        page: 2,
        size: 20,
        dialect: 'MSA',
        difficulty: 'ADVANCED',
        verified: true,
      }

      const result = await wordService.getWords(params)

      expect(mockApiClient.get).toHaveBeenCalledWith('/words', { params })
      expect(result).toEqual(mockPaginatedResponse)
    })
  })

  describe('getWord', () => {
    it('should fetch a single word by ID', async () => {
      mockApiClient.get.mockResolvedValue({ mockWord })

      const result = await wordService.getWord('1')

      expect(mockApiClient.get).toHaveBeenCalledWith('/words/1')
      expect(result).toEqual(mockWord)
    })
  })

  describe('createWord', () => {
    it('should create a new word', async () => {
      const wordData: Partial<Word> = {
        arabic: 'جديد',
        translation: 'new',
      }
      mockApiClient.post.mockResolvedValue({ data: mockWord })

      const result = await wordService.createWord(wordData)

      expect(mockApiClient.post).toHaveBeenCalledWith('/words', wordData)
      expect(result).toEqual(mockWord)
    })
  })

  describe('updateWord', () => {
    it('should update an existing word', async () => {
      const wordData: Partial<Word> = { translation: 'updated book' }
      mockApiClient.put.mockResolvedValue({ data: mockWord })

      const result = await wordService.updateWord('1', wordData)

      expect(mockApiClient.put).toHaveBeenCalledWith('/words/1', wordData)
      expect(result).toEqual(mockWord)
    })
  })

  describe('deleteWord', () => {
    it('should delete a word', async () => {
      mockApiClient.delete.mockResolvedValue({})

      await wordService.deleteWord('1')

      expect(mockApiClient.delete).toHaveBeenCalledWith('/words/1')
    })
  })

  describe('searchByArabic', () => {
    it('should search words by Arabic text with default pagination', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPaginatedResponse })

      const result = await wordService.searchByArabic('كتاب')

      expect(mockApiClient.get).toHaveBeenCalledWith('/words/search/arabic/كتاب', {
        params: { page: 1, size: 10 },
      })
      expect(result).toEqual(mockPaginatedResponse)
    })

    it('should search words by Arabic text with custom pagination', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPaginatedResponse })

      const result = await wordService.searchByArabic('كتاب', 2, 20)

      expect(mockApiClient.get).toHaveBeenCalledWith('/words/search/arabic/كتاب', {
        params: { page: 2, size: 20 },
      })
      expect(result).toEqual(mockPaginatedResponse)
    })
  })

  describe('findByArabic', () => {
    it('should find word by exact Arabic text', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPaginatedResponse })

      const result = await wordService.findByArabic('كتاب')

      expect(mockApiClient.get).toHaveBeenCalledWith('/words/arabic/كتاب')
      expect(result).toEqual(mockPaginatedResponse)
    })

    it('should return null when word is not found (404)', async () => {
      const error = {
        isAxiosError: true,
        response: { status: 404 },
      }
      mockApiClient.get.mockRejectedValue(error)
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const result = await wordService.findByArabic('غير موجود')

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('Word not found:', 'غير موجود')
      consoleSpy.mockRestore()
    })

    it('should throw error for non-404 errors', async () => {
      const error = new Error('Network error')
      mockApiClient.get.mockRejectedValue(error)

      await expect(wordService.findByArabic('كتاب')).rejects.toThrow('Network error')
    })
  })

  describe('findByRoot', () => {
    it('should find words by root with default pagination', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPaginatedResponse })

      const result = await wordService.findByRoot('ك-ت-ب')

      expect(mockApiClient.get).toHaveBeenCalledWith('/words/root/ك-ت-ب', {
        params: { page: 1, size: 10 },
      })
      expect(result).toEqual(mockPaginatedResponse)
    })

    it('should find words by root with custom pagination', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPaginatedResponse })

      const result = await wordService.findByRoot('ك-ت-ب', 3, 15)

      expect(mockApiClient.get).toHaveBeenCalledWith('/words/root/ك-ت-ب', {
        params: { page: 3, size: 15 },
      })
      expect(result).toEqual(mockPaginatedResponse)
    })
  })

  describe('findByPartOfSpeech', () => {
    it('should find words by part of speech with default pagination', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPaginatedResponse })

      const result = await wordService.findByPartOfSpeech('noun')

      expect(mockApiClient.get).toHaveBeenCalledWith('/words/part-of-speech/noun', {
        params: { page: 1, size: 10 },
      })
      expect(result).toEqual(mockPaginatedResponse)
    })
  })

  describe('findByDialect', () => {
    it('should find words by dialect with default pagination', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPaginatedResponse })

      const result = await wordService.findByDialect('MSA')

      expect(mockApiClient.get).toHaveBeenCalledWith('/words/dialect/MSA', {
        params: { page: 1, size: 10 },
      })
      expect(result).toEqual(mockPaginatedResponse)
    })
  })

  describe('findByDifficulty', () => {
    it('should find words by difficulty with default pagination', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPaginatedResponse })

      const result = await wordService.findByDifficulty('BEGINNER')

      expect(mockApiClient.get).toHaveBeenCalledWith('/words/difficulty/BEGINNER', {
        params: { page: 1, size: 10 },
      })
      expect(result).toEqual(mockPaginatedResponse)
    })
  })

  describe('findVerified', () => {
    it('should find verified words with default pagination', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPaginatedResponse })

      const result = await wordService.findVerified()

      expect(mockApiClient.get).toHaveBeenCalledWith('/words/verified', {
        params: { page: 1, size: 10 },
      })
      expect(result).toEqual(mockPaginatedResponse)
    })
  })

  describe('searchByTranslation', () => {
    it('should search words by translation with default pagination', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockPaginatedResponse })

      const result = await wordService.searchByTranslation('book')

      expect(mockApiClient.get).toHaveBeenCalledWith('/words/search/translation/book', {
        params: { page: 1, size: 10 },
      })
      expect(result).toEqual(mockPaginatedResponse)
    })
  })

  describe('findMostFrequent', () => {
    it('should find most frequent words with default limit', async () => {
      mockApiClient.get.mockResolvedValue({ data: [mockWord] })

      const result = await wordService.findMostFrequent()

      expect(mockApiClient.get).toHaveBeenCalledWith('/words/most-frequent/10')
      expect(result).toEqual([mockWord])
    })

    it('should find most frequent words with custom limit', async () => {
      mockApiClient.get.mockResolvedValue({ data: [mockWord] })

      const result = await wordService.findMostFrequent(5)

      expect(mockApiClient.get).toHaveBeenCalledWith('/words/most-frequent/5')
      expect(result).toEqual([mockWord])
    })
  })
})
