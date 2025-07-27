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

/**
 * Represents a version of a text, which can include changes to the content,
 *
 */
export interface TextVersion {
  id: string
  textId: string
  versionNumber: number
  isCurrent: boolean
  content: string // Serialized content, could be JSON or similar format
  createdAt: string
  updatedAt: string
}

/**
 * Lightweight version summary for dropdowns and lists
 */
export interface TextVersionSummary {
  id: string
  versionNumber: number
  createdAt: string
  updatedAt: string
  isCurrent: boolean
}
