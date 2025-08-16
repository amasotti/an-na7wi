import type { Annotation, AnnotationType, MasteryLevel } from '~/types'

export interface CreateAnnotationRequest {
  anchorText: string
  content: string
  type: AnnotationType
  masteryLevel?: MasteryLevel
  needsReview?: boolean
  color?: string
}

export interface UpdateAnnotationRequest {
  anchorText?: string
  content?: string
  type?: AnnotationType
  masteryLevel?: MasteryLevel
  needsReview?: boolean
  color?: string
}

export interface MasteryUpdateRequest {
  masteryLevel: MasteryLevel
}

export interface ReviewUpdateRequest {
  needsReview: boolean
}

export const annotationService = {
  /**
   * Get a single annotation by ID
   */
  async getAnnotation(id: string): Promise<Annotation> {
    const response = await useApiClient().get(`/annotations/${id}`)
    return response.data
  },

  /**
   * Get annotations for a text
   */
  async getAnnotationsForText(textId: string): Promise<Annotation[]> {
    const response = await useApiClient().get(`/annotations/text/${textId}`)
    return response.data
  },

  /**
   * Create a new annotation for a text
   */
  async createAnnotation(textId: string, annotation: CreateAnnotationRequest): Promise<Annotation> {
    const response = await useApiClient().post(`/annotations/text/${textId}`, annotation)
    return response.data
  },

  /**
   * Update an existing annotation
   */
  async updateAnnotation(id: string, annotation: UpdateAnnotationRequest): Promise<Annotation> {
    const response = await useApiClient().put(`/annotations/${id}`, annotation)
    return response.data
  },

  /**
   * Delete an annotation
   */
  async deleteAnnotation(id: string): Promise<void> {
    await useApiClient().delete(`/annotations/${id}`)
  },

  /**
   * Update the mastery level of an annotation
   */
  async updateMasteryLevel(id: string, masteryLevel: MasteryLevel): Promise<Annotation> {
    const request: MasteryUpdateRequest = { masteryLevel }
    const response = await useApiClient().put(`/annotations/${id}/mastery`, request)
    return response.data
  },

  /**
   * Update the review settings of an annotation
   */
  async updateReviewSettings(id: string, needsReview: boolean): Promise<Annotation> {
    const request: ReviewUpdateRequest = {
      needsReview,
    }
    const response = await useApiClient().put(`/annotations/${id}/review`, request)
    return response.data
  },

  /**
   * Get annotations for review
   */
  async getAnnotationsForReview(): Promise<Annotation[]> {
    const response = await useApiClient().get('/annotations/review')
    return response.data
  },
}
