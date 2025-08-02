import { beforeEach, describe, expect, it, vi } from 'vitest'
import apiClient from '../api'
import { annotationService } from '../annotationService'
import type { AnnotationType, MasteryLevel } from '@/types'

vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('annotationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAnnotation', () => {
    it('should fetch a single annotation by ID', async () => {
      const mockAnnotation = {
        id: 'anno-123',
        textId: 'text-456',
        anchorText: 'كتاب',
        content: 'This means book',
        type: 'VOCABULARY' as AnnotationType,
        masteryLevel: 'LEARNING' as MasteryLevel,
      }

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockAnnotation })

      const result = await annotationService.getAnnotation('anno-123')

      expect(apiClient.get).toHaveBeenCalledWith('/annotations/anno-123')
      expect(result).toEqual(mockAnnotation)
    })
  })

  describe('getAnnotationsForText', () => {
    it('should fetch annotations for a specific text', async () => {
      const mockAnnotations = [
        {
          id: 'anno-1',
          textId: 'text-123',
          anchorText: 'كتاب',
          content: 'book',
          type: 'VOCABULARY' as AnnotationType,
        },
        {
          id: 'anno-2',
          textId: 'text-123',
          anchorText: 'في',
          content: 'preposition: in, at',
          type: 'GRAMMAR' as AnnotationType,
        },
      ]

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockAnnotations })

      const result = await annotationService.getAnnotationsForText('text-123')

      expect(apiClient.get).toHaveBeenCalledWith('/annotations/text/text-123')
      expect(result).toEqual(mockAnnotations)
    })
  })

  describe('createAnnotation', () => {
    it('should create a new annotation for a text', async () => {
      const textId = 'text-123'
      const annotationData = {
        anchorText: 'مدرسة',
        content: 'school - feminine noun',
        type: 'VOCABULARY' as AnnotationType,
        masteryLevel: 'NEW' as MasteryLevel,
        needsReview: true,
        color: '#ff0000',
      }

      const mockCreatedAnnotation = {
        id: 'anno-456',
        textId,
        ...annotationData,
        createdAt: '2023-01-01T00:00:00Z',
      }

      vi.mocked(apiClient.post).mockResolvedValue({ data: mockCreatedAnnotation })

      const result = await annotationService.createAnnotation(textId, annotationData)

      expect(apiClient.post).toHaveBeenCalledWith('/annotations/text/text-123', annotationData)
      expect(result).toEqual(mockCreatedAnnotation)
    })
  })

  describe('updateAnnotation', () => {
    it('should update an existing annotation', async () => {
      const annotationId = 'anno-123'
      const updateData = {
        content: 'Updated explanation',
        masteryLevel: 'FAMILIAR' as MasteryLevel,
        needsReview: false,
      }

      const mockUpdatedAnnotation = {
        id: annotationId,
        textId: 'text-456',
        anchorText: 'كتاب',
        ...updateData,
        updatedAt: '2023-01-02T00:00:00Z',
      }

      vi.mocked(apiClient.put).mockResolvedValue({ data: mockUpdatedAnnotation })

      const result = await annotationService.updateAnnotation(annotationId, updateData)

      expect(apiClient.put).toHaveBeenCalledWith('/annotations/anno-123', updateData)
      expect(result).toEqual(mockUpdatedAnnotation)
    })
  })

  describe('deleteAnnotation', () => {
    it('should delete an annotation', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({})

      await annotationService.deleteAnnotation('anno-123')

      expect(apiClient.delete).toHaveBeenCalledWith('/annotations/anno-123')
    })
  })

  describe('updateMasteryLevel', () => {
    it('should update the mastery level of an annotation', async () => {
      const annotationId = 'anno-123'
      const masteryLevel: MasteryLevel = 'MASTERED'

      const mockUpdatedAnnotation = {
        id: annotationId,
        textId: 'text-456',
        anchorText: 'كتاب',
        content: 'book',
        type: 'VOCABULARY' as AnnotationType,
        masteryLevel,
        updatedAt: '2023-01-02T00:00:00Z',
      }

      vi.mocked(apiClient.put).mockResolvedValue({ data: mockUpdatedAnnotation })

      const result = await annotationService.updateMasteryLevel(annotationId, masteryLevel)

      expect(apiClient.put).toHaveBeenCalledWith('/annotations/anno-123/mastery', {
        masteryLevel,
      })
      expect(result).toEqual(mockUpdatedAnnotation)
    })
  })

  describe('updateReviewSettings', () => {
    it('should update review settings without next review date', async () => {
      const annotationId = 'anno-123'
      const needsReview = false

      const mockUpdatedAnnotation = {
        id: annotationId,
        textId: 'text-456',
        anchorText: 'كتاب',
        content: 'book',
        type: 'VOCABULARY' as AnnotationType,
        needsReview,
        updatedAt: '2023-01-02T00:00:00Z',
      }

      vi.mocked(apiClient.put).mockResolvedValue({ data: mockUpdatedAnnotation })

      const result = await annotationService.updateReviewSettings(annotationId, needsReview)

      expect(apiClient.put).toHaveBeenCalledWith('/annotations/anno-123/review', {
        needsReview,
        nextReviewDate: undefined,
      })
      expect(result).toEqual(mockUpdatedAnnotation)
    })

    it('should update review settings with next review date', async () => {
      const annotationId = 'anno-123'
      const needsReview = true
      const nextReviewDate = '2023-01-10T00:00:00Z'

      const mockUpdatedAnnotation = {
        id: annotationId,
        textId: 'text-456',
        anchorText: 'كتاب',
        content: 'book',
        type: 'VOCABULARY' as AnnotationType,
        needsReview,
        nextReviewDate,
        updatedAt: '2023-01-02T00:00:00Z',
      }

      vi.mocked(apiClient.put).mockResolvedValue({ data: mockUpdatedAnnotation })

      const result = await annotationService.updateReviewSettings(
        annotationId,
        needsReview,
        nextReviewDate
      )

      expect(apiClient.put).toHaveBeenCalledWith('/annotations/anno-123/review', {
        needsReview,
        nextReviewDate,
      })
      expect(result).toEqual(mockUpdatedAnnotation)
    })
  })

  describe('getAnnotationsForReview', () => {
    it('should fetch annotations that need review', async () => {
      const mockAnnotations = [
        {
          id: 'anno-1',
          textId: 'text-123',
          anchorText: 'كتاب',
          content: 'book',
          type: 'VOCABULARY' as AnnotationType,
          needsReview: true,
          nextReviewDate: '2023-01-01T00:00:00Z',
        },
        {
          id: 'anno-2',
          textId: 'text-456',
          anchorText: 'مدرسة',
          content: 'school',
          type: 'VOCABULARY' as AnnotationType,
          needsReview: true,
          nextReviewDate: '2023-01-02T00:00:00Z',
        },
      ]

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockAnnotations })

      const result = await annotationService.getAnnotationsForReview()

      expect(apiClient.get).toHaveBeenCalledWith('/annotations/review')
      expect(result).toEqual(mockAnnotations)
    })
  })
})