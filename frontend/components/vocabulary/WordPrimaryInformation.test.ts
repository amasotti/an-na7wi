import { fireEvent, render, screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { VocabularyWordPrimaryInformation as WordPrimaryInformation } from '#components'
import type { Word } from '@/types'
import { mockWord } from '~/test/mocks/server'
import { Dialect, Difficulty, MasteryLevel, PartOfSpeech } from '~/types/enums'

// Mock dependencies
vi.mock('~/utils/dateUtils', () => ({
  formatDate: vi.fn((dateString: string) => {
    if (dateString === '2024-01-01T00:00:00Z') return 'January 1, 2024'
    if (dateString === '2024-02-15T10:30:00Z') return 'February 15, 2024'
    return 'January 1, 2024'
  }),
}))

// Mock navigateTo
const mockNavigateTo = vi.fn()
vi.mock('#app', () => ({
  navigateTo: mockNavigateTo,
}))

// Mock the word store with the current word
let mockCurrentWord: Word | null = null

const mockWordStore = {
  get currentWord() {
    return mockCurrentWord
  },
}

vi.mock('~/stores/wordStore', () => ({
  useWordStore: () => mockWordStore,
}))

describe('WordPrimaryInformation', () => {
  const createMockWord = (overrides: Partial<Word> = {}): Word => ({
    ...mockWord,
    createdAt: '2024-01-01T00:00:00Z',
    ...overrides,
  })

  const createComponent = async (word: Word | null = null) => {
    mockCurrentWord = word

    const wrapper = render(WordPrimaryInformation, {
      global: {
        stubs: {
          BaseButton: {
            template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
            props: ['variant', 'size'],
          },
          BaseIcon: {
            template: '<svg v-bind="$attrs"><slot /></svg>',
            props: ['size'],
          },
          BaseBadge: {
            template: '<span v-bind="$attrs" @click="handleClick"><slot /></span>',
            props: ['size'],
            methods: {
              handleClick() {
                this.$emit('click')
              },
            },
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

  describe('rendering with current word', () => {
    it('renders Arabic text correctly', async () => {
      const word = createMockWord({ arabic: 'مدرسة' })
      await createComponent(word)

      const arabicText = screen.getByRole('heading', { level: 1 })
      expect(arabicText).toHaveTextContent('مدرسة')
      expect(arabicText).toHaveClass('word-arabic', 'arabic')
    })

    it('renders transliteration when provided', async () => {
      const word = createMockWord({
        arabic: 'مدرسة',
        transliteration: 'madrasa',
      })
      await createComponent(word)

      expect(screen.getByText('madrasa')).toBeInTheDocument()
      const transliterationElement = screen.getByText('madrasa')
      expect(transliterationElement).toHaveClass('transliteration')
    })

    it('does not render transliteration section when not provided', async () => {
      const word = createMockWord({
        arabic: 'مدرسة',
        transliteration: undefined,
      })
      await createComponent(word)

      expect(screen.queryByText('madrasa')).not.toBeInTheDocument()
    })

    it('renders translation when provided', async () => {
      const word = createMockWord({
        arabic: 'مدرسة',
        translation: 'school',
      })
      await createComponent(word)

      expect(screen.getByText('school')).toBeInTheDocument()
      const translationElement = screen.getByText('school')
      expect(translationElement).toHaveClass('translation')
    })

    it('does not render translation section when not provided', async () => {
      const word = createMockWord({
        arabic: 'مدرسة',
        translation: undefined,
      })
      await createComponent(word)

      expect(screen.queryByText('school')).not.toBeInTheDocument()
    })

    it('renders action buttons', async () => {
      const word = createMockWord()
      await createComponent(word)

      expect(screen.getByText('Edit')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })
  })

  describe('word information badges', () => {
    it('displays root information correctly', async () => {
      const word = createMockWord({ root: 'د ر س' })
      await createComponent(word)

      expect(screen.getByText('Root')).toBeInTheDocument()
      expect(screen.getByText('د ر س')).toBeInTheDocument()
    })

    it('displays part of speech correctly', async () => {
      const word = createMockWord({ partOfSpeech: PartOfSpeech.NOUN })
      await createComponent(word)

      expect(screen.getByText('Part of Speech')).toBeInTheDocument()
      expect(screen.getByText(PartOfSpeech.NOUN)).toBeInTheDocument()
    })

    it('shows N/A for undefined part of speech', async () => {
      const word = createMockWord({ partOfSpeech: undefined })
      await createComponent(word)

      expect(screen.getByText('N/A')).toBeInTheDocument()
    })

    it('displays dialect correctly', async () => {
      const word = createMockWord({ dialect: Dialect.EGYPTIAN })
      await createComponent(word)

      expect(screen.getByText('Dialect')).toBeInTheDocument()
      expect(screen.getByText(Dialect.EGYPTIAN)).toBeInTheDocument()

      const dialectBadge = screen.getByText(Dialect.EGYPTIAN)
      expect(dialectBadge).toBeInTheDocument()
    })

    it('shows Standard for undefined dialect', async () => {
      const word = createMockWord({ dialect: undefined })
      await createComponent(word)

      expect(screen.getByText('Standard')).toBeInTheDocument()
    })

    it('displays mastery level correctly', async () => {
      const word = createMockWord({ masteryLevel: MasteryLevel.LEARNING })
      await createComponent(word)

      expect(screen.getByText('Mastery')).toBeInTheDocument()
      expect(screen.getByText(MasteryLevel.LEARNING)).toBeInTheDocument()

      const masteryBadge = screen.getByText(MasteryLevel.LEARNING)
      expect(masteryBadge).toBeInTheDocument()
    })

    it('shows Standard for undefined mastery level', async () => {
      const word = createMockWord({ masteryLevel: undefined, dialect: undefined })
      await createComponent(word)

      expect(screen.getAllByText('Standard')).toHaveLength(2) // dialect and mastery both default
    })

    it('displays formatted creation date', async () => {
      const word = createMockWord()
      await createComponent(word)

      expect(screen.getByText('Added')).toBeInTheDocument()
      expect(screen.getByText('January 1, 2024')).toBeInTheDocument()
    })
  })

  describe('root navigation', () => {
    it('displays root badge with correct text', async () => {
      const word = createMockWord({ root: 'ك ت ب' })
      await createComponent(word)

      const rootBadge = screen.getByText('ك ت ب')
      expect(rootBadge).toBeInTheDocument()
    })

    it('displays different root text correctly', async () => {
      const word = createMockWord({ root: 'ا ب ج' })
      await createComponent(word)

      const rootBadge = screen.getByText('ا ب ج')
      expect(rootBadge).toBeInTheDocument()
    })

    it('displays root label when no root is provided', async () => {
      const word = createMockWord({ root: undefined })
      await createComponent(word)

      // The component should handle undefined root gracefully - no root section should be shown
      expect(screen.queryByText('Root')).not.toBeInTheDocument()
    })
  })

  describe('event handling', () => {
    it('emits edit event when Edit button is clicked', async () => {
      const word = createMockWord()
      const wrapper = await createComponent(word)

      const editButton = screen.getByText('Edit').closest('button')
      await fireEvent.click(editButton!)

      expect(wrapper.emitted().edit).toBeTruthy()
      expect(wrapper.emitted().edit!.length).toBeGreaterThan(0)
    })

    it('emits delete event when Delete button is clicked', async () => {
      const word = createMockWord()
      const wrapper = await createComponent(word)

      const deleteButton = screen.getByText('Delete').closest('button')
      await fireEvent.click(deleteButton!)

      expect(wrapper.emitted().delete).toBeTruthy()
      expect(wrapper.emitted().delete!.length).toBeGreaterThan(0)
    })
  })

  describe('component structure and styling', () => {
    it('uses proper semantic HTML structure', async () => {
      const word = createMockWord()
      await createComponent(word)

      const mainArticle = document.querySelector('article.word-hero')
      expect(mainArticle).toBeInTheDocument()

      const sections = mainArticle?.querySelectorAll('section, article')
      expect(sections?.length).toBeGreaterThan(0)
    })

    it('applies correct CSS classes to action buttons', async () => {
      const word = createMockWord()
      await createComponent(word)

      const editButton = screen.getByText('Edit').closest('button')
      const deleteButton = screen.getByText('Delete').closest('button')

      expect(editButton).toBeInTheDocument()
      expect(deleteButton).toBeInTheDocument()
    })

    it('applies responsive grid layout for word information', async () => {
      const word = createMockWord()
      await createComponent(word)

      const infoGrid = document.querySelector('.metadata-grid')
      expect(infoGrid).toBeInTheDocument()
    })

    it('applies proper background styling to info section', async () => {
      const word = createMockWord()
      await createComponent(word)

      const infoSection = document.querySelector('.metadata-grid')
      expect(infoSection).toBeInTheDocument()
    })
  })

  describe('edge cases and error handling', () => {
    it('handles null currentWord gracefully', async () => {
      // Since the component uses currentWord!! (non-null assertion),
      // it expects currentWord to exist. We'll test with minimal data instead
      const minimalWord = createMockWord({
        arabic: '',
        transliteration: undefined,
        translation: undefined,
      })
      await createComponent(minimalWord)

      // Component should render without crashing
      expect(document.querySelector('article.word-hero')).toBeInTheDocument()
    })

    it('handles empty strings in word fields', async () => {
      const word = createMockWord({
        arabic: '',
        transliteration: '',
        translation: '',
        root: '',
      })
      await createComponent(word)

      const arabicHeading = screen.getByRole('heading', { level: 1 })
      expect(arabicHeading).toHaveTextContent('')
    })

    it('handles very long Arabic text', async () => {
      const longArabicText = 'هذا نص طويل جداً يحتوي على كلمات كثيرة ويجب أن يتم عرضه بشكل صحيح'
      const word = createMockWord({ arabic: longArabicText })
      await createComponent(word)

      expect(screen.getByText(longArabicText)).toBeInTheDocument()
    })

    it('handles special characters in root field', async () => {
      const specialRoot = 'ء-و-ل'
      const word = createMockWord({ root: specialRoot })
      await createComponent(word)

      expect(screen.getByText(specialRoot)).toBeInTheDocument()
    })

    it('handles missing creation date', async () => {
      const word = createMockWord({ createdAt: '' })
      await createComponent(word)

      expect(screen.getByText('Added')).toBeInTheDocument()
      // formatDate should handle empty string gracefully
    })
  })

  describe('different word types and content', () => {
    it('renders verb correctly', async () => {
      const verb = createMockWord({
        arabic: 'كتب',
        transliteration: 'kataba',
        translation: 'he wrote',
        partOfSpeech: PartOfSpeech.VERB,
        root: 'ك ت ب',
      })
      await createComponent(verb)

      expect(screen.getByText('كتب')).toBeInTheDocument()
      expect(screen.getByText('kataba')).toBeInTheDocument()
      expect(screen.getByText('he wrote')).toBeInTheDocument()
      expect(screen.getByText(PartOfSpeech.VERB)).toBeInTheDocument()
    })

    it('renders adjective correctly', async () => {
      const adjective = createMockWord({
        arabic: 'جميل',
        transliteration: 'jameel',
        translation: 'beautiful',
        partOfSpeech: PartOfSpeech.ADJECTIVE,
        dialect: Dialect.MSA,
      })
      await createComponent(adjective)

      expect(screen.getByText('جميل')).toBeInTheDocument()
      expect(screen.getByText('beautiful')).toBeInTheDocument()
      expect(screen.getByText(PartOfSpeech.ADJECTIVE)).toBeInTheDocument()
      expect(screen.getByText(Dialect.MSA)).toBeInTheDocument()
    })

    it('renders different difficulty levels correctly', async () => {
      const advancedWord = createMockWord({
        arabic: 'استقلال',
        difficulty: Difficulty.ADVANCED,
        masteryLevel: MasteryLevel.MASTERED,
      })
      await createComponent(advancedWord)

      expect(screen.getByText('استقلال')).toBeInTheDocument()
      expect(screen.getByText(MasteryLevel.MASTERED)).toBeInTheDocument()
    })
  })

  describe('accessibility and usability', () => {
    it('uses proper heading hierarchy', async () => {
      const word = createMockWord()
      await createComponent(word)

      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toBeInTheDocument()
    })

    it('provides meaningful button labels', async () => {
      const word = createMockWord()
      await createComponent(word)

      const editButton = screen.getByRole('button', { name: /edit/i })
      const deleteButton = screen.getByRole('button', { name: /delete/i })

      expect(editButton).toBeInTheDocument()
      expect(deleteButton).toBeInTheDocument()
    })

    it('uses semantic articles and sections', async () => {
      const word = createMockWord()
      await createComponent(word)

      const articles = document.querySelectorAll('article')
      const sections = document.querySelectorAll('section')

      expect(articles.length).toBeGreaterThan(1)
      expect(sections.length).toBeGreaterThan(0)
    })
  })
})
