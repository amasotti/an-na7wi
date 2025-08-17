import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { type DictionaryLink, DictionaryType, type PaginatedResponse, type Word, type TextReference } from '~/types'
import { Dialect, Difficulty, MasteryLevel, PartOfSpeech } from '~/types/enums'
import { mockTextReferences } from './texts.mock'
import { mockedRoot } from './roots.mock'

export const mockDictionaryLinks: DictionaryLink[] = [
  {
    url: 'https://example.com/dictionary/kitab',
    type: DictionaryType.ALMANY,
    displayName: 'Example Dictionary',
    id: '',
  },
  {
    url: 'https://anotherexample.com/kitab',
    type: DictionaryType.ARABIC_STUDENT_DICTIONARY,
    displayName: 'Another Example Dictionary',
    id: '',
  },
]

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
  createdAt: new Date().toISOString(),
  frequency: 1,
  dictionaryLinks: mockDictionaryLinks,
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

  // Word linked texts
  http.get('/api/v1/words/:wordId/texts', () => {
    return HttpResponse.json(mockTextReferences)
  }),

  // Root normalization
  http.post('/api/v1/roots/normalize', async ({ request }) => {
    const body = await request.json() as { input: string }
    return HttpResponse.json({
      isValid: true,
      displayForm: body.input || 'ك-ت-ب',
    })
  }),
]

export const server = setupServer(...handlers)
