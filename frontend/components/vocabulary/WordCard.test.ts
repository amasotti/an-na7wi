import { fireEvent, render, screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VocabularyWordCard as WordCard } from '#components'
import type { DictionaryLink, Word } from '@/types'
import { Dialect, DictionaryType, Difficulty, MasteryLevel, PartOfSpeech } from '@/types/enums'

// Mock NuxtLink for testing
const MockNuxtLink = {
  template: '<a :href="to" v-bind="$attrs"><slot /></a>',
  props: ['to'],
}

// Mock window.open
const mockWindowOpen = vi.fn()
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
})

describe('WordCard', () => {
  const createMockWord = (overrides: Partial<Word> = {}): Word => ({
    id: 'test-id',
    arabic: 'كتاب',
    transliteration: 'kitab',
    translation: 'book',
    example: 'هذا كتاب جميل (This is a beautiful book)',
    root: 'ك-ت-ب',
    partOfSpeech: PartOfSpeech.NOUN,
    notes: 'Common word',
    frequency: 100,
    difficulty: Difficulty.BEGINNER,
    dialect: Dialect.MSA,
    masteryLevel: MasteryLevel.LEARNING,
    dictionaryLinks: [],
    pronunciationLink: 'https://example.com/audio',
    relatedWords: 'كاتب، مكتبة',
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    ...overrides,
  })

  const createMockDictionaryLink = (overrides: Partial<DictionaryLink> = {}): DictionaryLink => ({
    id: 'dict-id',
    type: DictionaryType.ALMANY,
    url: 'https://www.almaany.com/test',
    displayName: 'AlMaany',
    ...overrides,
  })

  const createComponent = (word: Word, props = {}) => {
    return render(WordCard, {
      props: { word, ...props },
      global: {
        components: {
          NuxtLink: MockNuxtLink,
        },
        stubs: {
          BaseButton: {
            template: '<button v-bind="$attrs" :title="title"><slot /></button>',
            props: ['title'],
          },
          BaseIcon: {
            template: '<span><slot /></span>',
            props: ['size', 'name'],
          },
          RouterLink: {
            template: '<a v-bind="$attrs" :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockWindowOpen.mockClear()
  })

  describe('Basic rendering', () => {
    it('renders word information correctly', () => {
      const word = createMockWord()
      createComponent(word)

      expect(screen.getByText('كتاب')).toBeInTheDocument()
      expect(screen.getByText('kitab')).toBeInTheDocument()
      expect(screen.getByText('book')).toBeInTheDocument()
      // The component doesn't render notes, so let's check for other rendered content
      expect(screen.getByText('BEGINNER')).toBeInTheDocument()
      expect(screen.getByText('LEARNING')).toBeInTheDocument()
      expect(screen.getByText('MSA')).toBeInTheDocument()
    })

    it('renders example when provided', () => {
      const word = createMockWord()
      createComponent(word)

      expect(screen.getByText('Example:')).toBeInTheDocument()
      expect(screen.getByText('هذا كتاب جميل (This is a beautiful book)')).toBeInTheDocument()
    })

    it('does not render example section when not provided', () => {
      const word = createMockWord({ example: undefined })
      createComponent(word)

      expect(screen.queryByText('Example:')).not.toBeInTheDocument()
    })

    it('renders metadata badges', () => {
      const word = createMockWord()
      createComponent(word)

      expect(screen.getByText('BEGINNER')).toBeInTheDocument()
      expect(screen.getByText('LEARNING')).toBeInTheDocument()
      expect(screen.getByText('MSA')).toBeInTheDocument()
    })

    it('renders default mastery level when not provided', () => {
      const word = createMockWord({ masteryLevel: undefined })
      createComponent(word)

      expect(screen.getByText('NEW')).toBeInTheDocument()
    })
  })

  describe('Action buttons', () => {
    it('renders edit and delete buttons', () => {
      const word = createMockWord()
      createComponent(word)

      expect(screen.getByTitle('Edit word')).toBeInTheDocument()
      expect(screen.getByTitle('Delete word')).toBeInTheDocument()
    })

    it('emits edit event when edit button is clicked', async () => {
      const word = createMockWord()
      const { emitted } = createComponent(word)

      const editButton = screen.getByTitle('Edit word')
      await fireEvent.click(editButton)

      expect(emitted().edit).toHaveLength(1)
      expect(emitted().edit![0]).toEqual([word])
    })

    it('emits delete event when delete button is clicked', async () => {
      const word = createMockWord()
      const { emitted } = createComponent(word)

      const deleteButton = screen.getByTitle('Delete word')
      await fireEvent.click(deleteButton)

      expect(emitted().delete).toHaveLength(1)
      expect(emitted().delete![0]).toEqual([word])
    })

    it('emits click event when card is clicked', async () => {
      const word = createMockWord()
      const { emitted } = createComponent(word)

      const card = screen.getByText('كتاب').closest('.word-card')
      await fireEvent.click(card!)

      expect(emitted().click).toHaveLength(1)
      expect(emitted().click![0]).toEqual([word])
    })
  })

  describe('Dictionary links', () => {
    it('shows references section when dictionary links exist', () => {
      const dictionaryLinks = [createMockDictionaryLink()]
      const word = createMockWord({ dictionaryLinks })
      createComponent(word)

      expect(screen.getByText('References')).toBeInTheDocument()
    })

    it('shows pronunciation link when provided', () => {
      const word = createMockWord()
      createComponent(word)

      expect(screen.getByText('Audio')).toBeInTheDocument()
    })

    it('opens pronunciation link when audio button is clicked', async () => {
      const word = createMockWord()
      createComponent(word)

      const audioButton = screen.getByText('Audio')
      await fireEvent.click(audioButton)

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example.com/audio',
        '_blank',
        'noopener,noreferrer'
      )
    })

    it('renders dictionary links with correct names', () => {
      const dictionaryLinks = [
        createMockDictionaryLink({ type: DictionaryType.ALMANY, displayName: 'AlMaany' }),
        createMockDictionaryLink({
          type: DictionaryType.CUSTOM,
          displayName: 'Custom Dict',
          url: 'https://custom.com',
        }),
      ]
      const word = createMockWord({ dictionaryLinks })
      createComponent(word)

      expect(screen.getByText('AlMaany')).toBeInTheDocument()
      expect(screen.getByText('Custom Dict')).toBeInTheDocument()
    })

    it('opens dictionary link when clicked', async () => {
      const dictionaryLinks = [createMockDictionaryLink()]
      const word = createMockWord({ dictionaryLinks })
      createComponent(word)

      const dictButton = screen.getByText('AlMaany')
      await fireEvent.click(dictButton)

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://www.almaany.com/test',
        '_blank',
        'noopener,noreferrer'
      )
    })

    it('does not show references section when no links exist', () => {
      const word = createMockWord({ dictionaryLinks: [], pronunciationLink: undefined })
      createComponent(word)

      expect(screen.queryByText('References')).not.toBeInTheDocument()
    })
  })

  describe('Root link', () => {
    it('renders root link when root is provided', () => {
      const word = createMockWord()
      createComponent(word)

      // Check for the root link by class and content
      const rootLink = document.querySelector('.root-link')
      expect(rootLink).toBeInTheDocument()
      expect(rootLink?.textContent?.trim()).toContain('Root: ك-ت-ب')
    })

    it('does not render root link when root is not provided', () => {
      const word = createMockWord({ root: undefined })
      createComponent(word)

      expect(screen.queryByText(/Root:/)).not.toBeInTheDocument()
    })

    it('root link has correct href', () => {
      const word = createMockWord()
      createComponent(word)

      // Find the link element by searching for the link with the right class
      const rootLink = document.querySelector('.root-link')
      expect(rootLink).toHaveAttribute('href', '/roots?search=%D9%83-%D8%AA-%D8%A8')
    })
  })

  describe('Computed properties', () => {
    it('correctly computes hasLinks when only pronunciation link exists', () => {
      const word = createMockWord({ dictionaryLinks: [] })
      createComponent(word)

      expect(screen.getByText('References')).toBeInTheDocument()
    })

    it('correctly computes hasLinks when only dictionary links exist', () => {
      const dictionaryLinks = [createMockDictionaryLink()]
      const word = createMockWord({ dictionaryLinks, pronunciationLink: undefined })
      createComponent(word)

      expect(screen.getByText('References')).toBeInTheDocument()
    })

    it('correctly computes hasLinks when both exist', () => {
      const dictionaryLinks = [createMockDictionaryLink()]
      const word = createMockWord({ dictionaryLinks })
      createComponent(word)

      expect(screen.getByText('References')).toBeInTheDocument()
      expect(screen.getByText('Audio')).toBeInTheDocument()
      expect(screen.getByText('AlMaany')).toBeInTheDocument()
    })
  })

  describe('Fallback text', () => {
    it('shows fallback text for missing transliteration', () => {
      const word = createMockWord({ transliteration: undefined })
      createComponent(word)

      expect(screen.getByText('No transliteration')).toBeInTheDocument()
    })

    it('shows fallback text for missing translation', () => {
      const word = createMockWord({ translation: undefined })
      createComponent(word)

      expect(screen.getByText('No translation')).toBeInTheDocument()
    })
  })

  describe('Styling classes', () => {
    it('applies difficulty badge classes correctly', () => {
      const word = createMockWord({ difficulty: Difficulty.ADVANCED })
      createComponent(word)

      const badge = screen.getByText('ADVANCED')
      expect(badge).toHaveClass('bg-red-100', 'text-red-800')
    })

    it('applies mastery level badge classes correctly', () => {
      const word = createMockWord({ masteryLevel: MasteryLevel.MASTERED })
      createComponent(word)

      const badge = screen.getByText('MASTERED')
      expect(badge).toHaveClass('bg-green-100', 'text-green-800')
    })
  })
})
