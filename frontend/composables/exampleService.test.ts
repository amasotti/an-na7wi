import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ExampleGenerationRequest, ExampleGenerationResponse } from '~/types'
import { exampleService } from './exampleService'

// Mock the useApiClient composable
const mockPost = vi.fn()
vi.mock('~/composables/api', () => ({
  useApiClient: () => ({
    post: mockPost,
  }),
}))

describe('exampleService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateExamples', () => {
    it('should generate examples with arabic word only', async () => {
      const mockResponse: ExampleGenerationResponse = {
        examples: [
          {
            arabic: 'هذا كتاب مفيد',
            english: 'This is a useful book',
          },
          {
            arabic: 'أقرأ الكتاب كل يوم',
            english: 'I read the book every day',
          },
        ],
      }

      mockPost.mockResolvedValue({ data: mockResponse })

      const request: ExampleGenerationRequest = {
        arabic: 'كتاب',
      }

      const result = await exampleService.generateExamples(request)

      expect(mockPost).toHaveBeenCalledWith('/examples/generate', request)
      expect(result).toEqual(mockResponse)
      expect(result.examples).toHaveLength(2)
      expect(result.examples[0]!.arabic).toBe('هذا كتاب مفيد')
      expect(result.examples[0]!.english).toBe('This is a useful book')
    })

    it('should generate examples with arabic word and context', async () => {
      const mockResponse: ExampleGenerationResponse = {
        examples: [
          {
            arabic: 'يدرس الطالب في المدرسة',
            english: 'The student studies at school',
          },
        ],
      }

      mockPost.mockResolvedValue({ data: mockResponse })

      const request: ExampleGenerationRequest = {
        arabic: 'يدرس',
        context: 'education',
      }

      const result = await exampleService.generateExamples(request)

      expect(mockPost).toHaveBeenCalledWith('/examples/generate', request)
      expect(result).toEqual(mockResponse)
      expect(result.examples[0]!.arabic).toBe('يدرس الطالب في المدرسة')
    })

    it('should handle API errors', async () => {
      const errorMessage = 'Failed to generate examples'
      mockPost.mockRejectedValue(new Error(errorMessage))

      const request: ExampleGenerationRequest = {
        arabic: 'كتاب',
      }

      await expect(exampleService.generateExamples(request)).rejects.toThrow(errorMessage)
      expect(mockPost).toHaveBeenCalledWith('/examples/generate', request)
    })

    it('should handle empty examples response', async () => {
      const mockResponse: ExampleGenerationResponse = {
        examples: [],
      }

      mockPost.mockResolvedValue({ data: mockResponse })

      const request: ExampleGenerationRequest = {
        arabic: 'كتاب',
      }

      const result = await exampleService.generateExamples(request)

      expect(result.examples).toHaveLength(0)
    })
  })
})
