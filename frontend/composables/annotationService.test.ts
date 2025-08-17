import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockAnnotation, mockAnnotationWithWords, mockWord } from '~/test/mocks/annotations.mock'
import { AnnotationType, MasteryLevel } from '~/types'
import {
  annotationService,
  type CreateAnnotationRequest,
  type UpdateAnnotationRequest,
} from './annotationService'

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

describe('annotationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Using mock from test/mocks/annotations.mock.ts

  describe('getAnnotation', () => {
    it('should fetch a single annotation by ID', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockAnnotation })

      const result = await annotationService.getAnnotation('1')

      expect(mockApiClient.get).toHaveBeenCalledWith('/annotations/1')
      expect(result).toEqual(mockAnnotation)
    })
  })

  describe('getAnnotationsForText', () => {
    it('should fetch annotations for a text', async () => {
      mockApiClient.get.mockResolvedValue({ data: [mockAnnotation] })

      const result = await annotationService.getAnnotationsForText('1')

      expect(mockApiClient.get).toHaveBeenCalledWith('/annotations/text/1')
      expect(result).toEqual([mockAnnotation])
    })
  })

  describe('createAnnotation', () => {
    it('should create a new annotation for a text', async () => {
      const annotationData: CreateAnnotationRequest = {
        anchorText: 'هذا',
        content: 'This',
        type: AnnotationType.CULTURAL,
        masteryLevel: MasteryLevel.LEARNING,
        needsReview: false,
        color: '#ffcc00',
      }
      mockApiClient.post.mockResolvedValue({ data: mockAnnotation })

      const result = await annotationService.createAnnotation('1', annotationData)

      expect(mockApiClient.post).toHaveBeenCalledWith('/annotations/text/1', annotationData)
      expect(result).toEqual(mockAnnotation)
    })
  })

  describe('updateAnnotation', () => {
    it('should update an existing annotation', async () => {
      const annotationData: UpdateAnnotationRequest = {
        content: 'Updated explanation',
        masteryLevel: MasteryLevel.MASTERED,
      }
      mockApiClient.put.mockResolvedValue({ data: mockAnnotation })

      const result = await annotationService.updateAnnotation('1', annotationData)

      expect(mockApiClient.put).toHaveBeenCalledWith('/annotations/1', annotationData)
      expect(result).toEqual(mockAnnotation)
    })
  })

  describe('deleteAnnotation', () => {
    it('should delete an annotation', async () => {
      mockApiClient.delete.mockResolvedValue({})

      await annotationService.deleteAnnotation('1')

      expect(mockApiClient.delete).toHaveBeenCalledWith('/annotations/1')
    })
  })

  describe('updateMasteryLevel', () => {
    it('should update the mastery level of an annotation', async () => {
      mockApiClient.put.mockResolvedValue({ data: mockAnnotation })

      const result = await annotationService.updateMasteryLevel('1', MasteryLevel.MASTERED)

      expect(mockApiClient.put).toHaveBeenCalledWith('/annotations/1/mastery', {
        masteryLevel: 'MASTERED',
      })
      expect(result).toEqual(mockAnnotation)
    })
  })

  describe('updateReviewSettings', () => {
    it('should update review settings without next review date', async () => {
      mockApiClient.put.mockResolvedValue({ data: mockAnnotation })

      const result = await annotationService.updateReviewSettings('1', true)

      expect(mockApiClient.put).toHaveBeenCalledWith('/annotations/1/review', {
        needsReview: true,
      })
      expect(result).toEqual(mockAnnotation)
    })

    it('should update review settings with next review date', async () => {
      mockApiClient.put.mockResolvedValue({ data: mockAnnotation })

      const result = await annotationService.updateReviewSettings('1', true)

      expect(mockApiClient.put).toHaveBeenCalledWith('/annotations/1/review', {
        needsReview: true,
      })
      expect(result).toEqual(mockAnnotation)
    })
  })

  describe('getAnnotationsForReview', () => {
    it('should fetch annotations for review', async () => {
      mockApiClient.get.mockResolvedValue({ data: [mockAnnotation] })

      const result = await annotationService.getAnnotationsForReview()

      expect(mockApiClient.get).toHaveBeenCalledWith('/annotations/review')
      expect(result).toEqual([mockAnnotation])
    })
  })

  describe('word linking methods', () => {
    describe('getLinkedWords', () => {
      it('should get linked words for an annotation', async () => {
        mockApiClient.get.mockResolvedValue({ data: [mockWord] })

        const result = await annotationService.getLinkedWords('annotation-1')

        expect(mockApiClient.get).toHaveBeenCalledWith('/annotations/annotation-1/words')
        expect(result).toEqual([mockWord])
      })
    })

    describe('linkWordToAnnotation', () => {
      it('should link a word to an annotation', async () => {
        mockApiClient.post.mockResolvedValue({ data: mockAnnotationWithWords })

        const result = await annotationService.linkWordToAnnotation('annotation-1', 'word-1')

        expect(mockApiClient.post).toHaveBeenCalledWith('/annotations/annotation-1/words/word-1')
        expect(result).toEqual(mockAnnotationWithWords)
      })
    })

    describe('unlinkWordFromAnnotation', () => {
      it('should unlink a word from an annotation', async () => {
        mockApiClient.delete.mockResolvedValue({ data: mockAnnotation })

        const result = await annotationService.unlinkWordFromAnnotation('annotation-1', 'word-1')

        expect(mockApiClient.delete).toHaveBeenCalledWith('/annotations/annotation-1/words/word-1')
        expect(result).toEqual(mockAnnotation)
      })
    })

    describe('linkMultipleWords', () => {
      it('should link multiple words to an annotation', async () => {
        const updatedAnnotation = { ...mockAnnotation, linkedWords: [mockWord] }
        mockApiClient.post.mockResolvedValue({ data: updatedAnnotation })

        const result = await annotationService.linkMultipleWords('annotation-1', [
          'word-1',
          'word-2',
        ])

        expect(mockApiClient.post).toHaveBeenCalledTimes(2)
        expect(mockApiClient.post).toHaveBeenCalledWith('/annotations/annotation-1/words/word-1')
        expect(mockApiClient.post).toHaveBeenCalledWith('/annotations/annotation-1/words/word-2')
        expect(result).toEqual(mockAnnotationWithWords)
      })
    })

    describe('replaceLinkedWords', () => {
      it('should replace all linked words for an annotation', async () => {
        const currentWords = [mockWord]
        const updatedAnnotation = { ...mockAnnotation, linkedWords: [mockWord] }

        mockApiClient.get.mockResolvedValue({ data: currentWords })
        mockApiClient.delete.mockResolvedValue({ data: mockAnnotation })
        mockApiClient.post.mockResolvedValue({ data: updatedAnnotation })

        const result = await annotationService.replaceLinkedWords('annotation-1', ['word-2'])

        expect(mockApiClient.get).toHaveBeenCalledWith('/annotations/annotation-1/words')
        expect(mockApiClient.delete).toHaveBeenCalledWith('/annotations/annotation-1/words/word-1')
        expect(mockApiClient.post).toHaveBeenCalledWith('/annotations/annotation-1/words/word-2')
        expect(result).toEqual(mockAnnotationWithWords)
      })

      it('should handle empty current words', async () => {
        const updatedAnnotation = { ...mockAnnotation, linkedWords: [mockWord] }

        mockApiClient.get.mockResolvedValue({ data: [] })
        mockApiClient.post.mockResolvedValue({ data: updatedAnnotation })

        const result = await annotationService.replaceLinkedWords('annotation-1', ['word-1'])

        expect(mockApiClient.get).toHaveBeenCalledWith('/annotations/annotation-1/words')
        expect(mockApiClient.delete).not.toHaveBeenCalled()
        expect(mockApiClient.post).toHaveBeenCalledWith('/annotations/annotation-1/words/word-1')
        expect(result).toEqual(mockAnnotationWithWords)
      })

      it('should return annotation when no new words provided', async () => {
        const currentWords = [mockWord]

        mockApiClient.get.mockResolvedValueOnce({ data: currentWords })
        mockApiClient.delete.mockResolvedValue({ data: mockAnnotation })
        mockApiClient.get.mockResolvedValueOnce({ data: mockAnnotation })

        const result = await annotationService.replaceLinkedWords('annotation-1', [])

        expect(mockApiClient.get).toHaveBeenNthCalledWith(1, '/annotations/annotation-1/words')
        expect(mockApiClient.delete).toHaveBeenCalledWith('/annotations/annotation-1/words/word-1')
        // The method calls getAnnotation internally, so only one get call to words endpoint
        expect(result).toEqual(mockAnnotation)
      })
    })
  })
})
