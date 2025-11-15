import type {
  InterlinearSentence,
  InterlinearText,
  InterlinearTextDetail,
  PaginatedResponse,
  WordAlignment,
} from '~/types'
import { Dialect } from '~/types/enums'

export const mockAlignment: WordAlignment = {
  id: 'alignment-1',
  arabicTokens: 'السلام',
  transliterationTokens: 'as-salamu',
  translationTokens: 'peace',
  tokenOrder: 0,
  vocabularyWordId: undefined,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
}

export const mockSentence: InterlinearSentence = {
  id: 'sentence-1',
  arabicText: 'السلام عليكم',
  transliteration: 'as-salamu alaykum',
  translation: 'Peace be upon you',
  annotations: 'A common Arabic greeting',
  sentenceOrder: 0,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  alignments: [mockAlignment],
}

export const mockInterlinearText: InterlinearText = {
  id: 'interlinear-1',
  title: 'Basic Arabic Greetings',
  description: 'Common greetings in Arabic',
  dialect: Dialect.MSA,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  sentenceCount: 1,
}

export const mockInterlinearTextDetail: InterlinearTextDetail = {
  id: 'interlinear-1',
  title: 'Basic Arabic Greetings',
  description: 'Common greetings in Arabic',
  dialect: Dialect.MSA,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  sentences: [mockSentence],
}

export const mockInterlinearTexts: InterlinearText[] = [
  mockInterlinearText,
  {
    id: 'interlinear-2',
    title: 'Tunisian Phrases',
    description: 'Common Tunisian Arabic phrases',
    dialect: Dialect.TUNISIAN,
    createdAt: '2024-01-20T14:15:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
    sentenceCount: 3,
  },
  {
    id: 'interlinear-3',
    title: 'Egyptian Conversations',
    description: 'Egyptian dialect conversation examples',
    dialect: Dialect.EGYPTIAN,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z',
    sentenceCount: 2,
  },
]

export const mockInterlinearTextResponse: PaginatedResponse<InterlinearText> = {
  items: mockInterlinearTexts,
  page: 1,
  pageSize: 10,
  totalCount: mockInterlinearTexts.length,
}
