import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  type Annotation,
  AnnotationType,
  Dialect,
  Difficulty,
  MasteryLevel,
  type PaginatedResponse,
  type Text,
  type TextsRequest,
  type TextsResponse,
  type TextVersion,
  type TextVersionSummary,
  type TransliterationResponse,
  type Word,
} from '~/types'
import { textService } from './textService'

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

describe('textService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockText: Text = {
    id: '1',
    title: 'Test Text',
    arabicContent: 'هذا نص تجريبي',
    transliteration: 'haza nass tajribi',
    translation: 'This is a test text',
    dialect: Dialect.MSA,
    difficulty: Difficulty.INTERMEDIATE,
    tags: ['test'],
    wordCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  const mockAnnotation: Annotation = {
    id: '1',
    textId: '1',
    type: AnnotationType.VOCABULARY,
    content: 'هذا',
    anchorText: 'هذا نص تجريبي',
    needsReview: false,
    masteryLevel: MasteryLevel.MASTERED,
    createdAt: '2024-01-01T00:00:00Z',
    linkedWords: [],
  }

  const mockTextVersion: TextVersion = {
    id: '1',
    textId: '1',
    versionNumber: 1,
    content: {
      title: 'Test Text',
      arabicContent: 'هذا نص تجريبي',
      transliteration: 'haza nass tajribi',
      translation: 'This is a test text',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isCurrent: true,
  }

  const mockTextVersionSummary: TextVersionSummary = {
    id: '1',
    versionNumber: 1,
    updatedAt: '2024-01-01T00:00:00Z',
    isCurrent: true,
  }

  describe('getTexts', () => {
    it('should fetch texts with default parameters', async () => {
      const mockResponse: TextsResponse = {
        items: [mockText],
        totalCount: 1,
        page: 1,
        pageSize: 10,
      }
      mockApiClient.get.mockResolvedValue({ data: mockResponse })

      const result = await textService.getTexts()

      expect(mockApiClient.get).toHaveBeenCalledWith('/texts', { params: {} })
      expect(result).toEqual(mockResponse)
    })

    it('should fetch texts with custom parameters', async () => {
      const params: TextsRequest = {
        dialect: Dialect.MSA,
        difficulty: Difficulty.ADVANCED,
        tags: ['literature'],
      }
      const mockResponse: TextsResponse = {
        items: [mockText],
        totalCount: 1,
        page: 2,
        pageSize: 20,
      }
      mockApiClient.get.mockResolvedValue({ data: mockResponse })

      const result = await textService.getTexts(params)

      expect(mockApiClient.get).toHaveBeenCalledWith('/texts', { params })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getText', () => {
    it('should fetch a single text by ID', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockText })

      const result = await textService.getText('1')

      expect(mockApiClient.get).toHaveBeenCalledWith('/texts/1')
      expect(result).toEqual(mockText)
    })
  })

  describe('createText', () => {
    it('should create a new text', async () => {
      const textData: Partial<Text> = {
        title: 'New Text',
        arabicContent: 'هذا نص جديد',
        transliteration: 'haza nass jadid',
        translation: 'This is a new text',
      }
      mockApiClient.post.mockResolvedValue({ data: mockText })

      const result = await textService.createText(textData)

      expect(mockApiClient.post).toHaveBeenCalledWith('/texts', textData)
      expect(result).toEqual(mockText)
    })
  })

  describe('updateText', () => {
    it('should update an existing text', async () => {
      const textData: Partial<Text> = { title: 'Updated Text' }
      mockApiClient.put.mockResolvedValue({ data: mockText })

      const result = await textService.updateText('1', textData)

      expect(mockApiClient.put).toHaveBeenCalledWith('/texts/1', textData)
      expect(result).toEqual(mockText)
    })
  })

  describe('deleteText', () => {
    it('should delete a text', async () => {
      mockApiClient.delete.mockResolvedValue({})

      await textService.deleteText('1')

      expect(mockApiClient.delete).toHaveBeenCalledWith('/texts/1')
    })
  })

  describe('getAnnotations', () => {
    it('should fetch annotations for a text', async () => {
      mockApiClient.get.mockResolvedValue({ data: [mockAnnotation] })

      const result = await textService.getAnnotations('1')

      expect(mockApiClient.get).toHaveBeenCalledWith('/annotations/text/1')
      expect(result).toEqual([mockAnnotation])
    })
  })

  describe('getTextVersions', () => {
    it('should fetch text versions and map to summary format', async () => {
      mockApiClient.get.mockResolvedValue({ data: [mockTextVersion] })

      const result = await textService.getTextVersions('1')

      expect(mockApiClient.get).toHaveBeenCalledWith('/texts/1/versions')
      expect(result).toEqual([mockTextVersionSummary])
    })
  })

  describe('getTextVersion', () => {
    it('should fetch a specific text version', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockTextVersion })

      const result = await textService.getTextVersion('1', 1)

      expect(mockApiClient.get).toHaveBeenCalledWith('/texts/1/versions/1')
      expect(result).toEqual(mockTextVersion)
    })
  })

  describe('restoreTextVersion', () => {
    it('should restore a specific version as current', async () => {
      mockApiClient.post.mockResolvedValue({ data: mockText })

      const result = await textService.restoreTextVersion('1', 1)

      expect(mockApiClient.post).toHaveBeenCalledWith('/texts/1/restore/1')
      expect(result).toEqual(mockText)
    })
  })

  describe('transliterateText', () => {
    it('should transliterate Arabic text', async () => {
      const arabicText = 'هذا نص'
      const mockResponse: TransliterationResponse = {
        originalText: arabicText,
        transliteratedText: 'haza nass',
      }
      mockApiClient.post.mockResolvedValue({ data: mockResponse })

      const result = await textService.transliterateText(arabicText)

      expect(mockApiClient.post).toHaveBeenCalledWith('/texts/transliterate', {
        arabicText,
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('tokenizeText', () => {
    it('should tokenize text with default pagination', async () => {
      const mockResponse: PaginatedResponse<Word> = {
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
      }
      mockApiClient.post.mockResolvedValue({ data: mockResponse })

      const result = await textService.tokenizeText('1')

      expect(mockApiClient.post).toHaveBeenCalledWith('/texts/1/tokenize', null, {
        params: { page: 1, size: 10 },
      })
      expect(result).toEqual(mockResponse)
    })

    it('should tokenize text with custom pagination', async () => {
      const mockResponse: PaginatedResponse<Word> = {
        items: [],
        totalCount: 0,
        page: 2,
        pageSize: 20,
      }
      mockApiClient.post.mockResolvedValue({ data: mockResponse })

      const result = await textService.tokenizeText('1', 2, 20)

      expect(mockApiClient.post).toHaveBeenCalledWith('/texts/1/tokenize', null, {
        params: { page: 2, size: 20 },
      })
      expect(result).toEqual(mockResponse)
    })
  })
})
