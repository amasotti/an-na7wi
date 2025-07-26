import type { Annotation, Text } from '@/types'
import type { TextsRequest, TextsResponse } from '@/types'
import apiClient from './api'

export const textService = {
  /**
   * Get a list of texts with pagination and filtering
   */
  async getTexts(params: TextsRequest = {}): Promise<TextsResponse> {
    const response = await apiClient.get('/texts', { params })
    
    // Backend currently returns array directly instead of paginated response
    if (Array.isArray(response.data)) {
      return {
        items: response.data,
        totalCount: response.data.length,
        page: params.page || 1,
        pageSize: params.pageSize || 10,
      }
    }
    
    // Future: when backend returns proper paginated response
    return response.data
  },

  /**
   * Get a single text by ID
   */
  async getText(id: string): Promise<Text> {
    const response = await apiClient.get(`/texts/${id}`)
    return response.data
  },

  /**
   * Create a new text
   */
  async createText(text: Partial<Text>): Promise<Text> {
    const response = await apiClient.post('/texts', text)
    return response.data
  },

  /**
   * Update an existing text
   */
  async updateText(id: string, text: Partial<Text>): Promise<Text> {
    const response = await apiClient.put(`/texts/${id}`, text)
    return response.data
  },

  /**
   * Delete a text
   */
  async deleteText(id: string): Promise<void> {
    await apiClient.delete(`/texts/${id}`)
  },

  /**
   * Analyze a text to extract vocabulary
   */
  async analyzeText(id: string): Promise<void> {
    await apiClient.post(`/texts/${id}/analyze`)
  },

  /**
   * Get annotations for a text
   */
  async getAnnotations(textId: string): Promise<Annotation[]> {
    const response = await apiClient.get(`/annotations/text/${textId}`)
    return response.data
  },

  /**
   * Create a new annotation
   */
  async createAnnotation(annotation: Partial<Annotation>): Promise<Annotation> {
    const response = await apiClient.post('/annotations', annotation)
    return response.data
  },

  /**
   * Update an existing annotation
   */
  async updateAnnotation(id: string, annotation: Partial<Annotation>): Promise<Annotation> {
    const response = await apiClient.put(`/annotations/${id}`, annotation)
    return response.data
  },

  /**
   * Delete an annotation
   */
  async deleteAnnotation(id: string): Promise<void> {
    await apiClient.delete(`/annotations/${id}`)
  },
}
