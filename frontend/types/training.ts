import type { Word } from '~/types/entities'

export type TrainingResult = 'correct' | 'incorrect' | 'skipped'

export interface FlashcardSession {
  words: Word[]
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
