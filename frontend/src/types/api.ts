import type { Annotation, Text, Word } from './entities'
import type { Dialect, Difficulty, PartOfSpeech } from './enums'

// API Request/Response types
export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}

export interface TextsResponse extends PaginatedResponse<Text> {}
export interface WordsResponse extends PaginatedResponse<Word> {}
export interface AnnotationsResponse extends PaginatedResponse<Annotation> {}

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

export interface WordsRequest extends BaseRequest {
  dialect?: Dialect
  difficulty?: Difficulty
  partOfSpeech?: PartOfSpeech
  root?: string
}

export interface AnnotationsRequest extends BaseRequest {
  textId?: string
  type?: string[]
}

// Create/Update requests
export interface CreateTextRequest {
  title: string
  arabicContent: string
  transliteration?: string
  translation?: string
  tags?: string[]
  difficulty: Difficulty
  dialect: Dialect
  isPublic?: boolean
}

export interface UpdateTextRequest extends Partial<CreateTextRequest> {}

export interface CreateWordRequest {
  arabic: string
  transliteration?: string
  translation?: string
  root?: string
  partOfSpeech?: PartOfSpeech
  notes?: string
  difficulty: Difficulty
  dialect: Dialect
}

export interface UpdateWordRequest extends Partial<CreateWordRequest> {}

export interface CreateAnnotationRequest {
  textId: string
  content: string
  positionStart: number
  positionEnd: number
  type: string
  color?: string
}

export interface UpdateAnnotationRequest extends Partial<Omit<CreateAnnotationRequest, 'textId'>> {}

// API Error types
export interface ApiError {
  message: string
  code: string
  status: number
  timestamp: string
}

export interface ValidationError extends ApiError {
  field: string
  // biome-ignore lint/suspicious/noExplicitAny: general validation error type
  value: any
}
