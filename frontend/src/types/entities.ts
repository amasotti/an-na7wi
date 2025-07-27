import type { AnnotationType, Dialect, Difficulty, MasteryLevel } from './enums'

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
