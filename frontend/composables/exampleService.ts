import type { ExampleGenerationRequest, ExampleGenerationResponse } from '~/types'

export const exampleService = {
  /**
   * Generate Arabic examples for a word or expression
   */
  async generateExamples(request: ExampleGenerationRequest): Promise<ExampleGenerationResponse> {
    const response = await useApiClient().post('/examples/generate', request)
    return response.data
  },
}
