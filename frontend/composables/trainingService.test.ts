import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { TrainingSession } from '~/types/training'
import { trainingService } from './trainingService'

// Mock the useApiClient composable
const mockApiClient = {
  post: vi.fn(),
  put: vi.fn(),
  get: vi.fn(),
}

vi.mock('./api', () => ({
  useApiClient: () => mockApiClient,
}))

describe('trainingService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('startSession', () => {
    it('should start a training session successfully', async () => {
      const mockSession: TrainingSession = {
        id: '123',
        sessionType: 'FLASHCARD',
        reviewMode: 'MIXED',
        startedAt: '2023-01-01T00:00:00Z',
        completedAt: null,
        totalWords: 15,
        correctAnswers: 0,
        words: [],
      }

      mockApiClient.post.mockResolvedValue({ data: mockSession })

      const result = await trainingService.startSession('MIXED', 15)

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/v1/training/sessions/start', {
        reviewMode: 'MIXED',
        sessionLength: 15,
      })
      expect(result).toEqual(mockSession)
    })

    it('should handle validation errors', async () => {
      const mockError = {
        response: { status: 400, data: 'Invalid parameters' },
        isAxiosError: true,
      }

      mockApiClient.post.mockRejectedValue(mockError)

      await expect(trainingService.startSession('NEW', 15)).rejects.toThrow(
        'Invalid training session parameters'
      )
    })
  })

  describe('recordResult', () => {
    it('should record a result successfully', async () => {
      mockApiClient.post.mockResolvedValue({})

      await trainingService.recordResult('123', '456', 'correct')

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/v1/training/sessions/123/results', {
        wordId: '456',
        result: 'CORRECT',
      })
    })

    it('should handle API errors', async () => {
      const mockError = new Error('Network error')
      mockApiClient.post.mockRejectedValue(mockError)

      await expect(trainingService.recordResult('123', '456', 'incorrect')).rejects.toThrow(
        'Network error'
      )
    })
  })

  describe('completeSession', () => {
    it('should complete a session successfully', async () => {
      const mockSession: TrainingSession = {
        id: '123',
        sessionType: 'FLASHCARD',
        reviewMode: 'MIXED',
        startedAt: '2023-01-01T00:00:00Z',
        completedAt: '2023-01-01T00:10:00Z',
        totalWords: 15,
        correctAnswers: 12,
        words: [],
      }

      mockApiClient.put.mockResolvedValue({ data: mockSession })

      const result = await trainingService.completeSession('123')

      expect(mockApiClient.put).toHaveBeenCalledWith('/api/v1/training/sessions/123/complete')
      expect(result).toEqual(mockSession)
    })
  })

  describe('getSession', () => {
    it('should get a session successfully', async () => {
      const mockSession: TrainingSession = {
        id: '123',
        sessionType: 'FLASHCARD',
        reviewMode: 'NEW',
        startedAt: '2023-01-01T00:00:00Z',
        completedAt: null,
        totalWords: 10,
        correctAnswers: 5,
        words: [],
      }

      mockApiClient.get.mockResolvedValue({ data: mockSession })

      const result = await trainingService.getSession('123')

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/v1/training/sessions/123')
      expect(result).toEqual(mockSession)
    })

    it('should handle not found errors', async () => {
      const mockError = {
        response: { status: 404 },
        isAxiosError: true,
      }

      mockApiClient.get.mockRejectedValue(mockError)

      await expect(trainingService.getSession('999')).rejects.toThrow(
        'Training session not found: 999'
      )
    })
  })
})
