import type { Annotation, Text, TextVersion, TextVersionSummary } from '@/types'
import type { TextsRequest, TextsResponse } from '@/types'
import apiClient from './api'

export const textService = {
  /**
   * Get a list of texts with pagination and filtering
   */
  async getTexts(params: TextsRequest = {}): Promise<TextsResponse> {
    const response = await apiClient.get('/texts', { params })
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
  async createText(textData: Partial<Text>): Promise<Text> {
    const response = await apiClient.post('/texts', textData)
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
   * Get all versions of a text
   */
  async getTextVersions(textId: string): Promise<TextVersionSummary[]> {
    const response = await apiClient.get(`/texts/${textId}/versions`)
    return response.data.map((version: TextVersion) => ({
      id: version.id,
      versionNumber: version.versionNumber,
      updatedAt: version.updatedAt,
      isCurrent: version.isCurrent,
    }))
  },

  /**
   * Get a specific version of a text
   */
  async getTextVersion(textId: string, versionNumber: number): Promise<TextVersion> {
    const response = await apiClient.get(`/texts/${textId}/versions/${versionNumber}`)
    return {
      id: response.data.id,
      textId: response.data.textId,
      versionNumber: response.data.versionNumber,
      updatedAt: response.data.updatedAt,
      createdAt: response.data.createdAt,
      isCurrent: response.data.isCurrent,
      content: response.data.content,
    }
  },

  /**
   * Restore a specific version as the current version
   */
  async restoreTextVersion(textId: string, versionNumber: number): Promise<Text> {
    const response = await apiClient.post(`/texts/${textId}/restore/${versionNumber}`)
    return response.data
  },
}
