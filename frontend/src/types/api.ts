import type { Text, Word } from './entities'
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
