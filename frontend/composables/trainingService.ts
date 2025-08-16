import { isAxiosError } from 'axios'
import type {
  RecordResultRequest,
  ReviewMode,
  StartTrainingSessionRequest,
  TrainingSession,
} from '~/types/training'

export const trainingService = {
  /**
   * Start a new training session with specified review mode and session length
   */
  async startSession(reviewMode: ReviewMode, sessionLength: number = 15): Promise<TrainingSession> {
    try {
      const request: StartTrainingSessionRequest = {
        reviewMode,
        sessionLength,
      }

      const response = await useApiClient().post('/training/sessions/start', request)
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        console.error('Invalid training session request:', error.response.data)
        throw new Error('Invalid training session parameters')
      }
      console.error('Error starting training session:', error)
      throw error
    }
  },

  /**
   * Record a result for a specific word in a training session
   */
  async recordResult(
    sessionId: string,
    wordId: string,
    result: 'correct' | 'incorrect' | 'skipped'
  ): Promise<void> {
    try {
      const request: RecordResultRequest = {
        wordId,
        result: result.toUpperCase() as 'CORRECT' | 'INCORRECT' | 'SKIPPED',
      }

      await useApiClient().post(`/training/sessions/${sessionId}/results`, request)
    } catch (error) {
      console.error('Error recording training result:', error)
      throw error
    }
  },

  /**
   * Complete a training session
   */
  async completeSession(sessionId: string): Promise<TrainingSession> {
    try {
      const response = await useApiClient().put(`/training/sessions/${sessionId}/complete`)
      return response.data
    } catch (error) {
      console.error('Error completing training session:', error)
      throw error
    }
  },

  /**
   * Get a specific training session by ID
   */
  async getSession(sessionId: string): Promise<TrainingSession> {
    try {
      const response = await useApiClient().get(`/training/sessions/${sessionId}`)
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`Training session not found: ${sessionId}`)
      }
      console.error('Error fetching training session:', error)
      throw error
    }
  },
}
