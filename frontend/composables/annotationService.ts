import type { Annotation, AnnotationType, MasteryLevel, Word } from '~/types'

export interface CreateAnnotationRequest {
  anchorText: string
  content: string
  type: AnnotationType
  masteryLevel?: MasteryLevel
  needsReview?: boolean
  color?: string
  linkedWordIds?: string[]
}

export interface UpdateAnnotationRequest {
  anchorText?: string
  content?: string
  type?: AnnotationType
  masteryLevel?: MasteryLevel
  needsReview?: boolean
  color?: string
  linkedWordIds?: string[]
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

  // --- Word Linking Methods ---
  
  /**
   * Get all words linked to an annotation
   */
  async getLinkedWords(annotationId: string): Promise<Word[]> {
    const response = await useApiClient().get(`/annotations/${annotationId}/words`)
    return response.data
  },

  /**
   * Link a word to an annotation
   */
  async linkWordToAnnotation(annotationId: string, wordId: string): Promise<Annotation> {
    const response = await useApiClient().post(`/annotations/${annotationId}/words/${wordId}`)
    return response.data
  },

  /**
   * Unlink a word from an annotation
   */
  async unlinkWordFromAnnotation(annotationId: string, wordId: string): Promise<Annotation> {
    const response = await useApiClient().delete(`/annotations/${annotationId}/words/${wordId}`)
    return response.data
  },

  /**
   * Bulk link multiple words to an annotation (for backward compatibility)
   */
  async linkMultipleWords(annotationId: string, wordIds: string[]): Promise<Annotation> {
    let updatedAnnotation: Annotation | null = null
    
    for (const wordId of wordIds) {
      updatedAnnotation = await this.linkWordToAnnotation(annotationId, wordId)
    }
    
    return updatedAnnotation!
  },

  /**
   * Replace all linked words for an annotation (clear existing and add new)
   */
  async replaceLinkedWords(annotationId: string, newWordIds: string[]): Promise<Annotation> {
    // Get current linked words
    const currentWords = await this.getLinkedWords(annotationId)
    
    // Unlink all current words
    let updatedAnnotation: Annotation | null = null
    for (const word of currentWords) {
      updatedAnnotation = await this.unlinkWordFromAnnotation(annotationId, word.id)
    }
    
    // Link all new words
    for (const wordId of newWordIds) {
      updatedAnnotation = await this.linkWordToAnnotation(annotationId, wordId)
    }
    
    return updatedAnnotation ?? await this.getAnnotation(annotationId)
  },
}
