import { beforeEach, describe, expect, it, vi } from 'vitest'
import { type Annotation, AnnotationType, MasteryLevel } from '~/types'
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

  const mockAnnotation: Annotation = {
    id: '1',
    textId: '1',
    type: AnnotationType.VOCABULARY,
    content: 'هذا',
    anchorText: 'هذا نص تجريبي',
    needsReview: false,
    masteryLevel: MasteryLevel.MASTERED,
    createdAt: '2024-01-01T00:00:00Z',
  }

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
})
