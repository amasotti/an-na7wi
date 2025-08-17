import { render, screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { VocabularyRelatedWords as RelatedWords } from '#components'
import { mockWord } from '~/test/mocks/server'
import type { Word } from '~/types'

// Mock ALL services BEFORE importing the component
vi.mock('~/composables/rootService', () => ({
  rootService: {
    normalizeRoot: vi.fn().mockResolvedValue({
      isValid: true,
      displayForm: 'ك-ت-ب',
    }),
  },
}))

vi.mock('~/composables/wordService', () => ({
  wordService: {
    findByRoot: vi.fn().mockResolvedValue({
      items: [],
      totalCount: 0,
      page: 1,
      pageSize: 5,
    }),
  },
}))

// Mock request deduplicator to pass through
vi.mock('~/utils/requestDeduplicator', () => ({
  requestDeduplicator: {
    dedupe: vi.fn((_key, fn) => fn()),
  },
}))

// Mock navigateTo
const mockNavigateTo = vi.fn()
vi.mock('#app', () => ({
  navigateTo: mockNavigateTo,
}))

// Mock the word store
let mockCurrentWord: Word | null = null

const mockWordStore = {
  get currentWord() {
    return mockCurrentWord
  },
  fetchWordById: vi.fn().mockResolvedValue(undefined),
}

vi.mock('~/stores/wordStore', () => ({
  useWordStore: () => mockWordStore,
}))

describe('RelatedWords', () => {
  const createComponent = async (word: Word | null = null) => {
    mockCurrentWord = word

    const wrapper = render(RelatedWords, {
      global: {
        stubs: {
          LoadingEffect: {
            template: '<div data-testid="loading">Loading...</div>',
          },
          BaseIcon: {
            template: '<span data-testid="icon"><slot /></span>',
          },
        },
      },
    })

    await nextTick()
    return wrapper
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockCurrentWord = null
  })

  describe('Basic rendering', () => {
    it('shows loading initially', async () => {
      await createComponent()
      expect(screen.getByTestId('loading')).toBeInTheDocument()
    })

    it('renders section title when word has root', async () => {
      const word = { ...mockWord, root: 'ك-ت-ب' }
      await createComponent(word)

      await vi.waitFor(() => {
        expect(screen.getByText('Related Words (Same Root)')).toBeInTheDocument()
      })
    })

    it('renders section icon', async () => {
      const word = { ...mockWord, root: 'ك-ت-ب' }
      await createComponent(word)

      await vi.waitFor(() => {
        expect(screen.getByTestId('icon')).toBeInTheDocument()
      })
    })
  })

  describe('Word filtering', () => {
    it('does not load related words when current word has no root', async () => {
      const word = { ...mockWord, root: undefined }
      await createComponent(word)

      // Should still show loading since no API calls are made
      expect(screen.getByTestId('loading')).toBeInTheDocument()
    })

    it('does not load related words when current word root is empty', async () => {
      const word = { ...mockWord, root: '   ' }
      await createComponent(word)

      // Should still show loading since no API calls are made
      expect(screen.getByTestId('loading')).toBeInTheDocument()
    })
  })

  describe('Component structure', () => {
    it('renders with proper accessibility attributes', async () => {
      const word = { ...mockWord, root: 'ك-ت-ب' }
      await createComponent(word)

      await vi.waitFor(() => {
        const section = screen.getByRole('region', { name: /related words/i })
        expect(section).toBeInTheDocument()
        expect(section).toHaveAttribute('aria-labelledby', 'related-words-title')
      })
    })
  })
})
