import type { Text } from './entities'
import type { Dialect, Difficulty } from './enums'

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
  english: string
}

export interface ExampleGenerationResponse {
  examples: ExampleDTO[]
}
