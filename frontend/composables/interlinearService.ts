import type {
  InterlinearSentence,
  InterlinearText,
  InterlinearTextDetail,
  PaginatedResponse,
  WordAlignment,
} from '~/types'

export const interlinearService = {
  /**
   * Get a list of interlinear texts with pagination
   */
  async getTexts(
    params: { page?: number; pageSize?: number; sort?: string } = {}
  ): Promise<PaginatedResponse<InterlinearText>> {
    const response = await useApiClient().get('/interlinear-texts', { params })
    return response.data
  },

  /**
   * Get a single interlinear text by ID with all sentences and alignments
   */
  async getText(id: string): Promise<InterlinearTextDetail> {
    const response = await useApiClient().get(`/interlinear-texts/${id}`)
    return response.data
  },

  /**
   * Create a new interlinear text
   */
  async createText(textData: Partial<InterlinearText>): Promise<InterlinearText> {
    const response = await useApiClient().post('/interlinear-texts', textData)
    return response.data
  },

  /**
   * Update an existing interlinear text
   */
  async updateText(id: string, textData: Partial<InterlinearText>): Promise<InterlinearText> {
    const response = await useApiClient().put(`/interlinear-texts/${id}`, textData)
    return response.data
  },

  /**
   * Delete an interlinear text
   */
  async deleteText(id: string): Promise<void> {
    await useApiClient().delete(`/interlinear-texts/${id}`)
  },

  /**
   * Add a sentence to an interlinear text
   */
  async addSentence(
    textId: string,
    sentenceData: Partial<InterlinearSentence>
  ): Promise<InterlinearSentence> {
    const response = await useApiClient().post(
      `/interlinear-texts/${textId}/sentences`,
      sentenceData
    )
    return response.data
  },

  /**
   * Update a sentence
   */
  async updateSentence(
    textId: string,
    sentenceId: string,
    sentenceData: Partial<InterlinearSentence>
  ): Promise<InterlinearSentence> {
    const response = await useApiClient().put(
      `/interlinear-texts/${textId}/sentences/${sentenceId}`,
      sentenceData
    )
    return response.data
  },

  /**
   * Delete a sentence
   */
  async deleteSentence(textId: string, sentenceId: string): Promise<void> {
    await useApiClient().delete(`/interlinear-texts/${textId}/sentences/${sentenceId}`)
  },

  /**
   * Reorder sentences in a text
   * -- not yet implemented in the frontend
   */
  // async reorderSentences(textId: string, sentenceIds: string[]): Promise<void> {
  //   await useApiClient().put(`/interlinear-texts/${textId}/sentences/reorder`, { sentenceIds })
  // },

  /**
   * Add a word alignment to a sentence
   */
  async addAlignment(
    textId: string,
    sentenceId: string,
    alignmentData: Partial<WordAlignment>
  ): Promise<WordAlignment> {
    const response = await useApiClient().post(
      `/interlinear-texts/${textId}/sentences/${sentenceId}/alignments`,
      alignmentData
    )
    return response.data
  },

  /**
   * Update a word alignment
   */
  async updateAlignment(
    textId: string,
    sentenceId: string,
    alignmentId: string,
    alignmentData: Partial<WordAlignment>
  ): Promise<WordAlignment> {
    const response = await useApiClient().put(
      `/interlinear-texts/${textId}/sentences/${sentenceId}/alignments/${alignmentId}`,
      alignmentData
    )
    return response.data
  },

  /**
   * Delete a word alignment
   */
  async deleteAlignment(textId: string, sentenceId: string, alignmentId: string): Promise<void> {
    await useApiClient().delete(
      `/interlinear-texts/${textId}/sentences/${sentenceId}/alignments/${alignmentId}`
    )
  },

  /**
   * Reorder alignments in a sentence
   */
  async reorderAlignments(
    textId: string,
    sentenceId: string,
    alignmentIds: string[]
  ): Promise<void> {
    await useApiClient().put(
      `/interlinear-texts/${textId}/sentences/${sentenceId}/alignments/reorder`,
      { alignmentIds }
    )
  },
}
