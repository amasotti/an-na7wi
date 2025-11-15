import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  Dialect,
  type InterlinearSentence,
  type InterlinearText,
  type InterlinearTextDetail,
  type PaginatedResponse,
  type WordAlignment,
} from '~/types'
import { interlinearService } from './interlinearService'

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

describe('interlinearService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockText: InterlinearText = {
    id: '1',
    title: 'Test Interlinear Text',
    description: 'A test interlinear text',
    dialect: Dialect.MSA,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    sentenceCount: 2,
  }

  const mockTextDetail: InterlinearTextDetail = {
    id: '1',
    title: 'Test Interlinear Text',
    description: 'A test interlinear text',
    dialect: Dialect.MSA,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    sentences: [
      {
        id: 's1',
        arabicText: 'السلام عليكم',
        transliteration: 'as-salamu alaykum',
        translation: 'Peace be upon you',
        annotations: 'A greeting',
        sentenceOrder: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        alignments: [],
      },
    ],
  }

  const mockSentence: InterlinearSentence = {
    id: 's1',
    arabicText: 'السلام عليكم',
    transliteration: 'as-salamu alaykum',
    translation: 'Peace be upon you',
    annotations: 'A greeting',
    sentenceOrder: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    alignments: [],
  }

  const mockAlignment: WordAlignment = {
    id: 'a1',
    arabicTokens: 'السلام',
    transliterationTokens: 'as-salamu',
    translationTokens: 'peace',
    tokenOrder: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  describe('getTexts', () => {
    it('should fetch texts with default parameters', async () => {
      const mockResponse: PaginatedResponse<InterlinearText> = {
        items: [mockText],
        totalCount: 1,
        page: 1,
        pageSize: 10,
      }
      mockApiClient.get.mockResolvedValue({ data: mockResponse })

      const result = await interlinearService.getTexts()

      expect(mockApiClient.get).toHaveBeenCalledWith('/interlinear-texts', { params: {} })
      expect(result).toEqual(mockResponse)
    })

    it('should fetch texts with custom parameters', async () => {
      const params = { page: 2, pageSize: 20, sort: 'title' }
      const mockResponse: PaginatedResponse<InterlinearText> = {
        items: [mockText],
        totalCount: 1,
        page: 2,
        pageSize: 20,
      }
      mockApiClient.get.mockResolvedValue({ data: mockResponse })

      const result = await interlinearService.getTexts(params)

      expect(mockApiClient.get).toHaveBeenCalledWith('/interlinear-texts', { params })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getText', () => {
    it('should fetch a single text by ID with full details', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockTextDetail })

      const result = await interlinearService.getText('1')

      expect(mockApiClient.get).toHaveBeenCalledWith('/interlinear-texts/1')
      expect(result).toEqual(mockTextDetail)
      expect(result.sentences).toHaveLength(1)
    })
  })

  describe('createText', () => {
    it('should create a new text', async () => {
      const textData: Partial<InterlinearText> = {
        title: 'New Text',
        description: 'A new test',
        dialect: Dialect.TUNISIAN,
      }
      mockApiClient.post.mockResolvedValue({ data: mockText })

      const result = await interlinearService.createText(textData)

      expect(mockApiClient.post).toHaveBeenCalledWith('/interlinear-texts', textData)
      expect(result).toEqual(mockText)
    })
  })

  describe('updateText', () => {
    it('should update an existing text', async () => {
      const textData: Partial<InterlinearText> = { title: 'Updated Title' }
      mockApiClient.put.mockResolvedValue({ data: mockText })

      const result = await interlinearService.updateText('1', textData)

      expect(mockApiClient.put).toHaveBeenCalledWith('/interlinear-texts/1', textData)
      expect(result).toEqual(mockText)
    })
  })

  describe('deleteText', () => {
    it('should delete a text', async () => {
      mockApiClient.delete.mockResolvedValue({})

      await interlinearService.deleteText('1')

      expect(mockApiClient.delete).toHaveBeenCalledWith('/interlinear-texts/1')
    })
  })

  describe('addSentence', () => {
    it('should add a sentence to a text', async () => {
      const sentenceData: Partial<InterlinearSentence> = {
        arabicText: 'كيف حالك؟',
        transliteration: 'kayfa haluk?',
        translation: 'How are you?',
        sentenceOrder: 1,
      }
      mockApiClient.post.mockResolvedValue({ data: mockSentence })

      const result = await interlinearService.addSentence('1', sentenceData)

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/interlinear-texts/1/sentences',
        sentenceData
      )
      expect(result).toEqual(mockSentence)
    })
  })

  describe('updateSentence', () => {
    it('should update a sentence', async () => {
      const sentenceData: Partial<InterlinearSentence> = {
        arabicText: 'Updated Arabic',
      }
      mockApiClient.put.mockResolvedValue({ data: mockSentence })

      const result = await interlinearService.updateSentence('1', 's1', sentenceData)

      expect(mockApiClient.put).toHaveBeenCalledWith(
        '/interlinear-texts/1/sentences/s1',
        sentenceData
      )
      expect(result).toEqual(mockSentence)
    })
  })

  describe('deleteSentence', () => {
    it('should delete a sentence', async () => {
      mockApiClient.delete.mockResolvedValue({})

      await interlinearService.deleteSentence('1', 's1')

      expect(mockApiClient.delete).toHaveBeenCalledWith('/interlinear-texts/1/sentences/s1')
    })
  })

  describe('addAlignment', () => {
    it('should add a word alignment to a sentence', async () => {
      const alignmentData: Partial<WordAlignment> = {
        arabicTokens: 'عليكم',
        transliterationTokens: 'alaykum',
        translationTokens: 'upon you',
        tokenOrder: 1,
      }
      mockApiClient.post.mockResolvedValue({ data: mockAlignment })

      const result = await interlinearService.addAlignment('1', 's1', alignmentData)

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/interlinear-texts/1/sentences/s1/alignments',
        alignmentData
      )
      expect(result).toEqual(mockAlignment)
    })
  })

  describe('updateAlignment', () => {
    it('should update a word alignment', async () => {
      const alignmentData: Partial<WordAlignment> = {
        arabicTokens: 'Updated tokens',
      }
      mockApiClient.put.mockResolvedValue({ data: mockAlignment })

      const result = await interlinearService.updateAlignment('1', 's1', 'a1', alignmentData)

      expect(mockApiClient.put).toHaveBeenCalledWith(
        '/interlinear-texts/1/sentences/s1/alignments/a1',
        alignmentData
      )
      expect(result).toEqual(mockAlignment)
    })
  })

  describe('deleteAlignment', () => {
    it('should delete a word alignment', async () => {
      mockApiClient.delete.mockResolvedValue({})

      await interlinearService.deleteAlignment('1', 's1', 'a1')

      expect(mockApiClient.delete).toHaveBeenCalledWith(
        '/interlinear-texts/1/sentences/s1/alignments/a1'
      )
    })
  })

  describe('reorderAlignments', () => {
    it('should reorder alignments', async () => {
      const alignmentIds = ['a2', 'a1', 'a3']
      mockApiClient.put.mockResolvedValue({})

      await interlinearService.reorderAlignments('1', 's1', alignmentIds)

      expect(mockApiClient.put).toHaveBeenCalledWith(
        '/interlinear-texts/1/sentences/s1/alignments/reorder',
        { alignmentIds }
      )
    })
  })
})
