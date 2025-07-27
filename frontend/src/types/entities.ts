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
  versionId?: string
  isCurrentVersion: boolean
  parentTextId?: string
  wordCount: number
  createdAt: string
  updatedAt: string
}

export interface Word {
  id: string
  arabic: string
  transliteration?: string
  translation?: string
  root?: string
  partOfSpeech?: PartOfSpeech
  notes?: string
  frequency: number
  difficulty: Difficulty
  dialect: Dialect
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

export interface TextWord {
  textId: string
  wordId: string
  position: number
  context?: string
}
