import type { AnnotationType, Dialect, Difficulty, MasteryLevel, PartOfSpeech } from './enums'

// Core entities
export interface Text {
  id: string
  title: string
  arabicContent: string
  transliteration?: string
  translation?: string
  comments?: string
  tags: string[]
  difficulty: Difficulty
  dialect: Dialect
  wordCount: number
  createdAt: string
  updatedAt: string
  currentVersionId?: string
}

export interface Word {
  id: string
  arabic: string
  transliteration?: string
  translation?: string
  example?: string
  root?: string
  partOfSpeech?: PartOfSpeech
  notes?: string
  frequency: number
  difficulty: Difficulty
  dialect: Dialect
  masteryLevel?: MasteryLevel
  dictionaryLinks?: string
  pronunciationLink?: string
  relatedWords?: string
  isVerified: boolean
  createdAt: string
}

export interface Annotation {
  id: string
  textId: string
  anchorText: string
  content: string
  type: AnnotationType
  masteryLevel: MasteryLevel
  needsReview: boolean
  nextReviewDate?: string
  color?: string
  createdAt: string
}
