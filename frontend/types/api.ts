import type { Annotation, Text, Word } from './entities'
import type { AnnotationType, Dialect, Difficulty, MasteryLevel } from './enums'

// API Request/Response types
export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}

export interface TextsResponse extends PaginatedResponse<Text> {}

// Request filters
export interface BaseRequest {
  page?: number
  pageSize?: number
  search?: string
}

export interface TextsRequest extends BaseRequest {
  dialect?: Dialect
  difficulty?: Difficulty
  tags?: string[]
}

export interface SearchRequest extends BaseRequest {
  query: string
  dialect?: Dialect
  difficulty?: Difficulty
  tags?: string[]
  title?: string
}

export interface TransliterationRequest {
  arabicText: string
}

export interface TransliterationResponse {
  originalText: string
  transliteratedText: string
}

export interface ExampleGenerationRequest {
  arabic: string
  context?: string
}

export interface ExampleDTO {
  arabic: string
  transliteration: string
  english: string
}

export interface ExampleGenerationResponse {
  examples: ExampleDTO[]
}

// Annotation API types
export interface AnnotationRequest {
  anchorText: string
  content: string
  type: AnnotationType
  masteryLevel?: MasteryLevel
  needsReview?: boolean
  color?: string
  linkedWordIds?: string[]
}

export interface AnnotationUpdateRequest {
  anchorText?: string
  content?: string
  type?: AnnotationType
  masteryLevel?: MasteryLevel
  needsReview?: boolean
  color?: string
  linkedWordIds?: string[]
}

export interface AnnotationsResponse extends PaginatedResponse<Annotation> {}

// Word linking API responses
export interface WordLinkingResponse {
  annotation: Annotation
  message: string
}

export interface LinkedWordsResponse {
  words: Word[]
  annotationId: string
}
