import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import type { PaginatedResponse, Word } from '~/types'
import { Dialect, Difficulty, MasteryLevel, PartOfSpeech } from '~/types/enums'

// Mock data
export const mockWord: Word = {
  id: '1',
  arabic: 'كتاب',
  transliteration: 'kitab',
  translation: 'book',
  root: 'ك ت ب',
  partOfSpeech: PartOfSpeech.NOUN,
  difficulty: Difficulty.BEGINNER,
  dialect: Dialect.MSA,
  masteryLevel: MasteryLevel.NEW,
  example: 'هذا كتاب جديد',
  notes: 'Common word for book',
  isVerified: true,
  createdAt: new Date().toISOString(),
  frequency: 1,
}

export const mockWordResponse: PaginatedResponse<Word> = {
  items: [mockWord],
  page: 1,
  pageSize: 10,
  totalCount: 1,
}

// Request handlers
export const handlers = [
  // Words API
  http.get('/api/v1/words', () => {
    return HttpResponse.json(mockWordResponse)
  }),

  http.get('/api/v1/words/:id', ({ params }) => {
    return HttpResponse.json({ ...mockWord, id: params.id })
  }),

  http.post('/api/v1/words', async ({ request }) => {
    const body = (await request.json()) as Partial<Word>
    return HttpResponse.json({ ...mockWord, ...body, id: '2' }, { status: 201 })
  }),

  http.put('/api/v1/words/:id', async ({ params, request }) => {
    const body = (await request.json()) as Partial<Word>
    return HttpResponse.json({ ...mockWord, ...body, id: params.id })
  }),

  http.delete('/api/v1/words/:id', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Search endpoints
  http.get('/api/v1/words/search/arabic', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('query')
    return HttpResponse.json({
      ...mockWordResponse,
      items: query ? [mockWord] : [],
    })
  }),

  http.get('/api/v1/words/search/translation', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('query')
    return HttpResponse.json({
      ...mockWordResponse,
      items: query ? [mockWord] : [],
    })
  }),

  http.get('/api/v1/words/root/:root', () => {
    return HttpResponse.json(mockWordResponse)
  }),
]

export const server = setupServer(...handlers)
