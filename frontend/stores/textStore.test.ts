import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  type Annotation,
  type PaginatedResponse,
  PartOfSpeech,
  type Text,
  type Word,
} from '~/types'
import { AnnotationType, Dialect, Difficulty, MasteryLevel } from '~/types/enums'
import { useTextStore } from './textStore'

// Mock data
const mockText: Text = {
  id: '1',
  title: 'Test Text',
  arabicContent: 'هذا نص تجريبي',
  translation: 'This is a test text',
  transliteration: 'hatha nas tajribi',
  dialect: Dialect.MSA,
  difficulty: Difficulty.BEGINNER,
  tags: ['test', 'example'],
  wordCount: 3,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const mockAnnotation: Annotation = {
  id: '1',
  textId: '1',
  type: AnnotationType.VOCABULARY,
  anchorText: 'هذا',
  content: 'This (demonstrative pronoun)',
  masteryLevel: MasteryLevel.NEW,
  needsReview: false,
  createdAt: new Date().toISOString(),
}

const mockTextVersion = {
  id: '1',
  textId: '1',
  version: 1,
  title: 'Test Text',
  content: 'هذا نص تجريبي',
  translation: 'This is a test text',
  transliteration: 'hatha nas tajribi',
  changeDescription: 'Initial version',
  createdAt: new Date().toISOString(),
}

const mockWord: Word = {
  id: '1',
  arabic: 'نص',
  translation: 'text',
  root: 'ن ص ص',
  partOfSpeech: PartOfSpeech.NOUN,
  difficulty: Difficulty.BEGINNER,
  dialect: Dialect.MSA,
  masteryLevel: MasteryLevel.NEW,
  frequency: 1,
  isVerified: true,
  createdAt: new Date().toISOString(),
}

const mockTextResponse: PaginatedResponse<Text> = {
  items: [mockText],
  page: 1,
  pageSize: 10,
  totalCount: 1,
}

// Mock services
vi.mock('~/composables/textService', () => ({
  textService: {
    getTexts: vi.fn(() => Promise.resolve(mockTextResponse)),
    getText: vi.fn((id: string) => Promise.resolve({ ...mockText, id })),
    createText: vi.fn(data => Promise.resolve({ ...mockText, ...data, id: 'new-id' })),
    updateText: vi.fn((id: string, data) => Promise.resolve({ ...mockText, ...data, id })),
    deleteText: vi.fn(() => Promise.resolve()),
    getTextVersions: vi.fn(() => Promise.resolve([mockTextVersion])),
    getTextVersion: vi.fn(() => Promise.resolve(mockTextVersion)),
    tokenizeText: vi.fn(() =>
      Promise.resolve({
        items: [mockWord],
        page: 1,
        pageSize: 10,
        totalCount: 1,
      })
    ),
    getAnnotations: vi.fn(() => Promise.resolve([mockAnnotation])),
  },
}))

vi.mock('~/composables/annotationService', () => ({
  annotationService: {
    getAnnotations: vi.fn(() => Promise.resolve([mockAnnotation])),
    createAnnotation: vi.fn((textId: string, data) =>
      Promise.resolve({ ...mockAnnotation, ...data, id: 'new-id' })
    ),
    updateAnnotation: vi.fn((id: string, data) =>
      Promise.resolve({ ...mockAnnotation, ...data, id })
    ),
    deleteAnnotation: vi.fn(() => Promise.resolve()),
    updateMasteryLevel: vi.fn((id: string, masteryLevel) =>
      Promise.resolve({ ...mockAnnotation, id, masteryLevel })
    ),
    updateReviewSettings: vi.fn((id: string, needsReview, nextReviewDate) =>
      Promise.resolve({ ...mockAnnotation, id, needsReview, nextReviewDate })
    ),
  },
}))

describe('textStore', () => {
  let store: ReturnType<typeof useTextStore>

  beforeEach(() => {
    store = useTextStore()
    // Reset state manually
    store.texts = []
    store.currentText = null
    store.annotations = []
    store.error = null
    store.totalCount = 0
    store.currentPage = 1
    store.searchQuery = ''
    store.selectedDialect = null
    store.selectedDifficulty = null
    store.selectedTags = []
    store.textVersions = []
    store.selectedVersion = null
    store.isViewingCurrentVersion = true
    store.tokenizedWords = []
    store.tokenizedWordsCurrentPage = 1
    store.tokenizedWordsTotalCount = 0
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('has correct initial state', () => {
      expect(store.texts).toEqual([])
      expect(store.currentText).toBeNull()
      expect(store.annotations).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.totalCount).toBe(0)
      expect(store.currentPage).toBe(1)
      expect(store.pageSize).toBe(10)
      expect(store.searchQuery).toBe('')
      expect(store.selectedDialect).toBeNull()
      expect(store.selectedDifficulty).toBeNull()
      expect(store.selectedTags).toEqual([])
    })
  })

  describe('computed properties', () => {
    it('filteredTexts returns all texts initially', () => {
      store.texts = [mockText]
      expect(store.filteredTexts).toEqual([mockText])
    })

    it('hasMorePages returns correct value', () => {
      store.totalCount = 25
      store.pageSize = 10
      store.currentPage = 2
      expect(store.hasMorePages).toBe(true)

      store.currentPage = 3
      expect(store.hasMorePages).toBe(false)
    })
  })

  describe('text actions', () => {
    it('fetches texts successfully', async () => {
      await store.fetchTexts()

      expect(store.loading).toBe(false)
      expect(store.texts).toEqual([mockText])
      expect(store.totalCount).toBe(1)
      expect(store.error).toBeNull()
    })

    it('handles fetch texts error', async () => {
      const textService = await import('~/composables/textService')
      vi.mocked(textService.textService.getTexts).mockRejectedValueOnce(new Error('Network error'))

      await store.fetchTexts()

      expect(store.loading).toBe(false)
      expect(store.error).toBe('Failed to fetch texts')
      expect(store.texts).toEqual([])
    })

    it('fetches text by id successfully', async () => {
      await store.fetchTextById('test-id')

      expect(store.currentText).toEqual({ ...mockText, id: 'test-id' })
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('creates text successfully', async () => {
      const textData = { title: 'New Text', content: 'محتوى جديد' }

      const result = await store.createText(textData)

      expect(result).toEqual({ ...mockText, ...textData, id: 'new-id' })
      expect(store.texts[0]).toEqual(result)
    })

    it('updates text successfully', async () => {
      store.texts = [mockText]
      store.currentText = mockText

      const updateData = { title: 'Updated Title' }
      const result = await store.updateText('1', updateData)

      expect(result.title).toBe('Updated Title')
      expect(store.texts[0]!.title).toBe('Updated Title')
      expect(store.currentText?.title).toBe('Updated Title')
    })

    it('deletes text successfully', async () => {
      store.texts = [mockText]
      store.currentText = mockText

      await store.deleteText('1')

      expect(store.texts).toEqual([])
      expect(store.currentText).toBeNull()
    })
  })

  describe('annotation actions', () => {
    it('fetches annotations successfully', async () => {
      await store.fetchAnnotations('1')

      expect(store.annotations).toEqual([mockAnnotation])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('creates annotation successfully', async () => {
      const annotationData = {
        anchorText: 'نص',
        content: 'This means text',
        type: AnnotationType.GRAMMAR,
        masteryLevel: MasteryLevel.NEW,
        needsReview: false,
      }

      const result = await store.createAnnotation('1', annotationData)

      expect(result).toEqual({ ...mockAnnotation, ...annotationData, id: 'new-id' })
      expect(store.annotations[0]).toEqual(result)
    })

    it('updates annotation successfully', async () => {
      store.annotations = [mockAnnotation]

      const updateData = { content: 'Updated explanation' }
      const result = await store.updateAnnotation('1', updateData)

      expect(result.content).toBe('Updated explanation')
      expect(store.annotations[0]!.content).toBe('Updated explanation')
    })

    it('deletes annotation successfully', async () => {
      store.annotations = [mockAnnotation]

      await store.deleteAnnotation('1')

      expect(store.annotations).toEqual([])
    })
  })

  describe('version actions', () => {
    it('fetches text versions successfully', async () => {
      await store.fetchTextVersions('1')

      expect(store.textVersions).toEqual([mockTextVersion])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('selects text version successfully', async () => {
      await store.selectTextVersion('1', 1)

      expect(store.selectedVersion).toEqual(mockTextVersion)
      expect(store.isViewingCurrentVersion).toBe(false)
    })
  })

  describe('tokenized words actions', () => {
    it('fetches tokenized words successfully', async () => {
      await store.fetchTokenizedWords('1')

      expect(store.tokenizedWords).toEqual([mockWord])
      expect(store.tokenizedWordsTotalCount).toBe(1)
      expect(store.tokenizedWordsLoading).toBe(false)
    })
  })

  describe('filter actions', () => {
    it('sets filters correctly', async () => {
      store.setFilters({
        search: 'test query',
        dialect: Dialect.EGYPTIAN,
        difficulty: Difficulty.INTERMEDIATE,
        tags: ['tag1', 'tag2'],
      })

      expect(store.searchQuery).toBe('test query')
      expect(store.selectedDialect).toBe(Dialect.EGYPTIAN)
      expect(store.selectedDifficulty).toBe(Difficulty.INTERMEDIATE)
      expect(store.selectedTags).toEqual(['tag1', 'tag2'])
    })

    it('resets filters correctly', async () => {
      store.searchQuery = 'test'
      store.selectedDialect = Dialect.EGYPTIAN
      store.selectedDifficulty = Difficulty.ADVANCED
      store.selectedTags = ['tag1']

      store.resetFilters()

      expect(store.searchQuery).toBe('')
      expect(store.selectedDialect).toBeNull()
      expect(store.selectedDifficulty).toBeNull()
      expect(store.selectedTags).toEqual([])
    })
  })
})
