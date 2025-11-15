import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { type DictionaryLink, DictionaryType, type PaginatedResponse, type Word } from '~/types'
import { Dialect, Difficulty, MasteryLevel, PartOfSpeech } from '~/types/enums'
import {
  mockAlignment,
  mockInterlinearText,
  mockInterlinearTextDetail,
  mockInterlinearTextResponse,
  mockSentence,
} from './interlinear.mock'
import { mockedNormalizedRoot } from './roots.mock'
import { mockTextReferences } from './texts.mock'

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
    const _body = (await request.json()) as { input: string }
    return HttpResponse.json(mockedNormalizedRoot)
  }),

  // Interlinear Texts API
  http.get('/api/v1/interlinear-texts', () => {
    return HttpResponse.json(mockInterlinearTextResponse)
  }),

  http.get('/api/v1/interlinear-texts/:id', ({ params }) => {
    return HttpResponse.json({ ...mockInterlinearTextDetail, id: params.id })
  }),

  http.post('/api/v1/interlinear-texts', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ ...mockInterlinearText, ...body, id: 'new-id' }, { status: 201 })
  }),

  http.put('/api/v1/interlinear-texts/:id', async ({ params, request }) => {
    const body = await request.json()
    return HttpResponse.json({ ...mockInterlinearText, ...body, id: params.id })
  }),

  http.delete('/api/v1/interlinear-texts/:id', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Interlinear Sentences API
  http.post('/api/v1/interlinear-texts/:textId/sentences', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ ...mockSentence, ...body, id: 'new-sentence-id' }, { status: 201 })
  }),

  http.put('/api/v1/interlinear-texts/:textId/sentences/:sentenceId', async ({ params, request }) => {
    const body = await request.json()
    return HttpResponse.json({ ...mockSentence, ...body, id: params.sentenceId })
  }),

  http.delete('/api/v1/interlinear-texts/:textId/sentences/:sentenceId', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  http.put('/api/v1/interlinear-texts/:textId/sentences/reorder', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Word Alignments API
  http.post('/api/v1/interlinear-texts/:textId/sentences/:sentenceId/alignments', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ ...mockAlignment, ...body, id: 'new-alignment-id' }, { status: 201 })
  }),

  http.put('/api/v1/interlinear-texts/:textId/sentences/:sentenceId/alignments/:alignmentId', async ({ params, request }) => {
    const body = await request.json()
    return HttpResponse.json({ ...mockAlignment, ...body, id: params.alignmentId })
  }),

  http.delete('/api/v1/interlinear-texts/:textId/sentences/:sentenceId/alignments/:alignmentId', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  http.put('/api/v1/interlinear-texts/:textId/sentences/:sentenceId/alignments/reorder', () => {
    return new HttpResponse(null, { status: 204 })
  }),
]

export const server = setupServer(...handlers)
