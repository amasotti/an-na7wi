import type { Word } from '~/types/entities'

export type TrainingResult = 'correct' | 'incorrect' | 'skipped'

export type ReviewMode = 'NEW' | 'LEARNING' | 'KNOWN' | 'MIXED'

export interface TrainingSession {
  id: string
  sessionType: string
  reviewMode: ReviewMode
  startedAt: string
  completedAt: string | null
  totalWords: number
  correctAnswers: number
  words: Word[]
}

export interface FlashcardSession {
  trainingSession: TrainingSession
  currentIndex: number
  showAnswer: boolean
  displayMode: 'arabic' | 'translation'
  results: Array<{ word: Word; result: TrainingResult }>
  startTime: Date
  endTime: Date | null
}

export interface SessionResults {
  total: number
  correct: number
  incorrect: number
  skipped: number
  words: Array<{ word: Word; result: TrainingResult }>
  startTime: Date
  endTime: Date | null
}

export interface StartTrainingSessionRequest {
  reviewMode: ReviewMode
  sessionLength?: number
}

export interface RecordResultRequest {
  wordId: string
  result: 'CORRECT' | 'INCORRECT' | 'SKIPPED'
}

export interface TrainingStats {
  totalSessions: number
  totalWordsReviewed: number
  averageAccuracy: number
  recentSessions: RecentSession[]
  accuracyByReviewMode: Record<string, number>
}

export interface RecentSession {
  id: string
  completedAt: string
  reviewMode: string
  totalWords: number
  correctAnswers: number
  accuracy: number
}
