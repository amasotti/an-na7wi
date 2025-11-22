import type {
  AnnotationType,
  Dialect,
  DictionaryType,
  Difficulty,
  MasteryLevel,
  PartOfSpeech,
} from './enums'

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

export interface TextReference {
  id: string
  title: string
  difficulty: Difficulty
  dialect: Dialect
  createdAt: string
  tags: string[]
}

export interface DictionaryLink {
  id: string
  type: DictionaryType
  url: string
  displayName?: string
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
  dictionaryLinks: DictionaryLink[]
  pronunciationLink?: string
  createdAt: string
  derivedFromId?: string | null
}

export interface Annotation {
  id: string
  textId: string
  anchorText: string
  content: string
  type: AnnotationType
  masteryLevel: MasteryLevel
  needsReview: boolean
  color?: string
  createdAt: string
  linkedWords: Word[]
}

export interface Root {
  id: string
  letters: string[]
  normalizedForm: string
  displayForm: string
  letterCount: number
  meaning?: string
  analysis?: string
  wordCount: number
  createdAt: string
  updatedAt: string
}

export interface RootNormalization {
  input: string
  letters: string[]
  normalizedForm: string
  displayForm: string
  letterCount: number
  isValid: boolean
}

export interface RootStatistics {
  totalRoots: number
  triLiteral: number
  quadriLiteral: number
  quinqueLiteral: number
  otherCounts: Record<number, number>
}

export interface WordSummary {
  id: string
  arabic: string
  transliteration?: string
  translation?: string
  partOfSpeech?: string
  difficulty: string
  dialect: string
}

export interface RootWithWords {
  root: Root
  words: WordSummary[]
}

export interface WordSearchResult {
  id: string
  arabic: string
  transliteration?: string
  translation?: string
}

// Interlinear text entities
export interface InterlinearText {
  id: string
  title: string
  description?: string
  dialect: Dialect
  createdAt: string
  updatedAt: string
  sentenceCount: number
}

export interface WordAlignment {
  id: string
  arabicTokens: string
  transliterationTokens: string
  translationTokens: string
  tokenOrder: number
  vocabularyWordId?: string
  createdAt: string
  updatedAt: string
}

export interface InterlinearSentence {
  id: string
  arabicText: string
  transliteration: string
  translation: string
  annotations?: string
  sentenceOrder: number
  createdAt: string
  updatedAt: string
  alignments: WordAlignment[]
}

export interface InterlinearTextDetail {
  id: string
  title: string
  description?: string
  dialect: Dialect
  createdAt: string
  updatedAt: string
  sentences: InterlinearSentence[]
}
