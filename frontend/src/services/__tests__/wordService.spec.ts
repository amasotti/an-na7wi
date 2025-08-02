import { beforeEach, describe, expect, it, vi } from 'vitest'
import { isAxiosError } from 'axios'
import apiClient from '../api'
import { wordService } from '../wordService'

vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('axios', () => ({
  isAxiosError: vi.fn(),
}))

describe('wordService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getWords', () => {
    it('should fetch words with default parameters', async () => {
      const mockResponse = {
        items: [
          { id: '1', arabic: 'كتاب', translation: 'book' },
          { id: '2', arabic: 'قلم', translation: 'pen' },
        ],
        totalCount: 2,
        page: 1,
        pageSize: 10,
      }

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse })

      const result = await wordService.getWords()

      expect(apiClient.get).toHaveBeenCalledWith('/words', { params: {} })
      expect(result).toEqual(mockResponse)
    })

    it('should fetch words with custom parameters', async () => {
      const params = {
        page: 2,
        size: 20,
        sort: 'arabic',
        dialect: 'MSA',
        difficulty: 'INTERMEDIATE',
        partOfSpeech: 'NOUN',
        masteryLevel: 'FAMILIAR',
      }

      const mockResponse = {
        items: [],
        totalCount: 0,
        page: 2,
        pageSize: 20,
      }

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse })

      const result = await wordService.getWords(params)

      expect(apiClient.get).toHaveBeenCalledWith('/words', { params })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getWord', () => {
    it('should fetch a single word by ID', async () => {
      const mockWord = {
        id: 'word-123',
        arabic: 'كتاب',
        translation: 'book',
        partOfSpeech: 'NOUN',
      }

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockWord })

      const result = await wordService.getWord('word-123')

      expect(apiClient.get).toHaveBeenCalledWith('/words/word-123')
      expect(result).toEqual(mockWord)
    })
  })

  describe('createWord', () => {
    it('should create a new word', async () => {
      const wordData = {
        arabic: 'مدرسة',
        translation: 'school',
        partOfSpeech: 'NOUN',
      }

      const mockCreatedWord = {
        id: 'word-456',
        ...wordData,
        createdAt: '2023-01-01T00:00:00Z',
      }

      vi.mocked(apiClient.post).mockResolvedValue({ data: mockCreatedWord })

      const result = await wordService.createWord(wordData)

      expect(apiClient.post).toHaveBeenCalledWith('/words', wordData)
      expect(result).toEqual(mockCreatedWord)
    })
  })

  describe('updateWord', () => {
    it('should update an existing word', async () => {
      const wordId = 'word-123'
      const updateData = {
        translation: 'updated book',
        difficulty: 'ADVANCED',
      }

      const mockUpdatedWord = {
        id: wordId,
        arabic: 'كتاب',
        ...updateData,
        updatedAt: '2023-01-02T00:00:00Z',
      }

      vi.mocked(apiClient.put).mockResolvedValue({ data: mockUpdatedWord })

      const result = await wordService.updateWord(wordId, updateData)

      expect(apiClient.put).toHaveBeenCalledWith('/words/word-123', updateData)
      expect(result).toEqual(mockUpdatedWord)
    })
  })

  describe('deleteWord', () => {
    it('should delete a word', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({})

      await wordService.deleteWord('word-123')

      expect(apiClient.delete).toHaveBeenCalledWith('/words/word-123')
    })
  })

  describe('searchByArabic', () => {
    it('should search words by Arabic text with default pagination', async () => {
      const mockWords = [
        { id: '1', arabic: 'كتاب', translation: 'book' },
        { id: '2', arabic: 'كتابة', translation: 'writing' },
      ]

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockWords })

      const result = await wordService.searchByArabic('كتب')

      expect(apiClient.get).toHaveBeenCalledWith('/words/search/arabic/كتب', {
        params: { page: 1, size: 10 },
      })
      expect(result).toEqual(mockWords)
    })

    it('should search words by Arabic text with custom pagination', async () => {
      const mockWords = []

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockWords })

      const result = await wordService.searchByArabic('test', 2, 5)

      expect(apiClient.get).toHaveBeenCalledWith('/words/search/arabic/test', {
        params: { page: 2, size: 5 },
      })
      expect(result).toEqual(mockWords)
    })
  })

  describe('findByArabic', () => {
    it('should find word by exact Arabic text', async () => {
      const mockWord = {
        id: 'word-123',
        arabic: 'كتاب',
        translation: 'book',
      }

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockWord })

      const result = await wordService.findByArabic('كتاب')

      expect(apiClient.get).toHaveBeenCalledWith('/words/arabic/كتاب')
      expect(result).toEqual(mockWord)
    })

    it('should return null when word is not found (404)', async () => {
      const error = {
        isAxiosError: true,
        response: { status: 404 },
      }

      vi.mocked(isAxiosError).mockReturnValue(true)
      vi.mocked(apiClient.get).mockRejectedValue(error)

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const result = await wordService.findByArabic('nonexistent')

      expect(apiClient.get).toHaveBeenCalledWith('/words/arabic/nonexistent')
      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('Word not found:', 'nonexistent')

      consoleSpy.mockRestore()
    })

    it('should rethrow non-404 errors', async () => {
      const error = {
        isAxiosError: true,
        response: { status: 500 },
      }

      vi.mocked(isAxiosError).mockReturnValue(true)
      vi.mocked(apiClient.get).mockRejectedValue(error)

      await expect(wordService.findByArabic('test')).rejects.toThrow()
    })

    it('should rethrow non-axios errors', async () => {
      const error = new Error('Network error')

      vi.mocked(isAxiosError).mockReturnValue(false)
      vi.mocked(apiClient.get).mockRejectedValue(error)

      await expect(wordService.findByArabic('test')).rejects.toThrow('Network error')
    })
  })

  describe('findByRoot', () => {
    it('should find words by root with default pagination', async () => {
      const mockWords = [
        { id: '1', arabic: 'كتاب', root: 'كتب' },
        { id: '2', arabic: 'كاتب', root: 'كتب' },
      ]

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockWords })

      const result = await wordService.findByRoot('كتب')

      expect(apiClient.get).toHaveBeenCalledWith('/words/root/كتب', {
        params: { page: 1, size: 10 },
      })
      expect(result).toEqual(mockWords)
    })
  })

  describe('findByPartOfSpeech', () => {
    it('should find words by part of speech', async () => {
      const mockWords = [
        { id: '1', arabic: 'كتاب', partOfSpeech: 'NOUN' },
        { id: '2', arabic: 'مدرسة', partOfSpeech: 'NOUN' },
      ]

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockWords })

      const result = await wordService.findByPartOfSpeech('NOUN', 1, 20)

      expect(apiClient.get).toHaveBeenCalledWith('/words/part-of-speech/NOUN', {
        params: { page: 1, size: 20 },
      })
      expect(result).toEqual(mockWords)
    })
  })

  describe('findByDialect', () => {
    it('should find words by dialect', async () => {
      const mockWords = [
        { id: '1', arabic: 'كتاب', dialect: 'MSA' },
      ]

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockWords })

      const result = await wordService.findByDialect('MSA')

      expect(apiClient.get).toHaveBeenCalledWith('/words/dialect/MSA', {
        params: { page: 1, size: 10 },
      })
      expect(result).toEqual(mockWords)
    })
  })

  describe('findByDifficulty', () => {
    it('should find words by difficulty', async () => {
      const mockWords = [
        { id: '1', arabic: 'كتاب', difficulty: 'BEGINNER' },
      ]

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockWords })

      const result = await wordService.findByDifficulty('BEGINNER')

      expect(apiClient.get).toHaveBeenCalledWith('/words/difficulty/BEGINNER', {
        params: { page: 1, size: 10 },
      })
      expect(result).toEqual(mockWords)
    })
  })

  describe('findVerified', () => {
    it('should find verified words', async () => {
      const mockWords = [
        { id: '1', arabic: 'كتاب', verified: true },
      ]

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockWords })

      const result = await wordService.findVerified()

      expect(apiClient.get).toHaveBeenCalledWith('/words/verified', {
        params: { page: 1, size: 10 },
      })
      expect(result).toEqual(mockWords)
    })
  })

  describe('searchByTranslation', () => {
    it('should search words by translation', async () => {
      const mockWords = [
        { id: '1', arabic: 'كتاب', translation: 'book' },
      ]

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockWords })

      const result = await wordService.searchByTranslation('book')

      expect(apiClient.get).toHaveBeenCalledWith('/words/search/translation/book', {
        params: { page: 1, size: 10 },
      })
      expect(result).toEqual(mockWords)
    })
  })

  describe('findMostFrequent', () => {
    it('should find most frequent words with default limit', async () => {
      const mockWords = [
        { id: '1', arabic: 'في', frequency: 1000 },
        { id: '2', arabic: 'من', frequency: 950 },
      ]

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockWords })

      const result = await wordService.findMostFrequent()

      expect(apiClient.get).toHaveBeenCalledWith('/words/most-frequent/10')
      expect(result).toEqual(mockWords)
    })

    it('should find most frequent words with custom limit', async () => {
      const mockWords = []

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockWords })

      const result = await wordService.findMostFrequent(5)

      expect(apiClient.get).toHaveBeenCalledWith('/words/most-frequent/5')
      expect(result).toEqual(mockWords)
    })
  })
})