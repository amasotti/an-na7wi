import type {
  Annotation,
  PaginatedResponse,
  SearchRequest,
  Text,
  TextsRequest,
  TextsResponse,
  TextVersion,
  TextVersionSummary,
  TransliterationRequest,
  TransliterationResponse,
  Word,
} from '~/types'

export const textService = {
  /**
   * Get a list of texts with pagination and filtering
   */
  async getTexts(params: TextsRequest = {}): Promise<TextsResponse> {
    const response = await useApiClient().get('/texts', { params })
    return response.data
  },

  /**
   * Search for texts with pagination and filtering
   */
  async searchTexts(params: SearchRequest): Promise<TextsResponse> {
    const response = await useApiClient().get('/search/texts', {
      params: params,
    })
    return response.data
  },

  /**
   * Get a single text by ID
   */
  async getText(id: string): Promise<Text> {
    const response = await useApiClient().get(`/texts/${id}`)
    return response.data
  },

  /**
   * Create a new text
   */
  async createText(textData: Partial<Text>): Promise<Text> {
    const response = await useApiClient().post('/texts', textData)
    return response.data
  },

  /**
   * Update an existing text
   */
  async updateText(id: string, text: Partial<Text>): Promise<Text> {
    const response = await useApiClient().put(`/texts/${id}`, text)
    return response.data
  },

  /**
   * Delete a text
   */
  async deleteText(id: string): Promise<void> {
    await useApiClient().delete(`/texts/${id}`)
  },

  /**
   * Get annotations for a text
   */
  async getAnnotations(textId: string): Promise<Annotation[]> {
    const response = await useApiClient().get(`/annotations/text/${textId}`)
    return response.data
  },

  /**
   * Get all versions of a text
   */
  async getTextVersions(textId: string): Promise<TextVersionSummary[]> {
    const response = await useApiClient().get(`/texts/${textId}/versions`)
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
    const response = await useApiClient().get(`/texts/${textId}/versions/${versionNumber}`)
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
    const response = await useApiClient().post(`/texts/${textId}/restore/${versionNumber}`)
    return response.data
  },

  /**
   * Transliterate Arabic text to Latin alphabet
   */
  async transliterateText(arabicText: string): Promise<TransliterationResponse> {
    const request: TransliterationRequest = { arabicText }
    const response = await useApiClient().post('/texts/transliterate', request)
    return response.data
  },

  /**
   * Tokenize text and get matching words from database
   */
  async tokenizeText(textId: string, page = 1, size = 10): Promise<PaginatedResponse<Word>> {
    const response = await useApiClient().post(`/texts/${textId}/tokenize`, null, {
      params: { page, size },
    })
    return response.data
  },
}
