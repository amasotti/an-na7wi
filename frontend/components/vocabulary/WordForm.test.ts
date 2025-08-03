import { render, screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithStore } from '~/test/test-utils'
import type { SelectOption, Word } from '~/types'
import { Dialect, Difficulty, MasteryLevel, PartOfSpeech } from '~/types/enums'
import { VocabularyWordForm as WordForm } from '#components'

// Mock the services
vi.mock('~/composables/rootService', () => ({
  rootService: {
    normalizeRoot: vi.fn((root: string) =>
      Promise.resolve({
        valid: true,
        displayForm: root,
        searchForm: root,
      })
    ),
  },
}))

vi.mock('~/composables/wordService', () => ({
  wordService: {
    findByRoot: vi.fn(() =>
      Promise.resolve({
        items: [],
        page: 1,
        pageSize: 5,
        totalCount: 0,
      })
    ),
  },
}))

const mockWord: Word = {
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

const defaultProps = {
  open: true,
  loading: false,
  word: null,
  difficultyOptions: Object.values(Difficulty).map(d => ({
    value: d,
    label: d,
  })) as SelectOption<Difficulty>[],
  dialectOptions: Object.values(Dialect).map(d => ({
    value: d,
    label: d,
  })) as SelectOption<Dialect>[],
  masteryLevelOptions: Object.values(MasteryLevel).map(m => ({
    value: m,
    label: m,
  })) as SelectOption<MasteryLevel>[],
  partsOfSpeechOptions: Object.values(PartOfSpeech).map(p => ({
    value: p,
    label: p,
  })) as SelectOption<PartOfSpeech>[],
}

describe('WordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders in create mode when no word provided', () => {
    renderWithStore(WordForm, { props: defaultProps })

    expect(screen.getByText('Add New Word')).toBeInTheDocument()
    expect(screen.getByText('Add Word')).toBeInTheDocument()
  })

  it('renders in edit mode when word provided', () => {
    renderWithStore(WordForm, {
      props: { ...defaultProps, word: mockWord },
    })

    expect(screen.getByText('Edit Word')).toBeInTheDocument()
    expect(screen.getByText('Update Word')).toBeInTheDocument()
  })

  it('shows required field indicators', () => {
    renderWithStore(WordForm, { props: defaultProps })

    expect(screen.getByText('Arabic Word*')).toBeInTheDocument()
    expect(screen.getByText('Translation/Definition*')).toBeInTheDocument()
    expect(screen.getByText('Example Sentence')).toBeInTheDocument()
  })

  it('renders form fields', () => {
    renderWithStore(WordForm, { props: defaultProps })

    // Check for form labels (text content)
    expect(screen.getByText('Arabic Word*')).toBeInTheDocument()
    expect(screen.getByText('Translation/Definition*')).toBeInTheDocument()
    expect(screen.getByText('Transliteration')).toBeInTheDocument()

    // Check for input elements
    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toBeGreaterThan(0)
  })

  it('populates fields when editing', () => {
    renderWithStore(WordForm, {
      props: { ...defaultProps, word: mockWord },
    })

    expect(screen.getByDisplayValue('كتاب')).toBeInTheDocument()
    expect(screen.getByDisplayValue('kitab')).toBeInTheDocument()
    expect(screen.getByDisplayValue('book')).toBeInTheDocument()
  })
})
