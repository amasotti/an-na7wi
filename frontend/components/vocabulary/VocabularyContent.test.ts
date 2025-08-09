import {fireEvent, screen} from '@testing-library/vue'
import {describe, expect, it} from 'vitest'
import {renderWithStore} from '~/test/test-utils'
import {DictionaryType, type SelectOption, type Word} from '~/types'
import {Dialect, Difficulty, MasteryLevel, PartOfSpeech} from '~/types/enums'
import {VocabularyContent} from '#components'

const mockWord: Word = {
  id: '1',
  arabic: 'كتاب',
  transliteration: 'kitab',
  translation: 'book',
  root: 'ك ت ب',
  partOfSpeech: PartOfSpeech.NOUN,
  difficulty: Difficulty.BEGINNER,
  dialect: Dialect.MSA,
  masteryLevel: MasteryLevel.KNOWN,
  example: 'هذا كتاب جديد',
  notes: 'Common word for book',
  isVerified: true,
  createdAt: '2023-01-01T00:00:00Z',
  frequency: 1,
  dictionaryLinks: [
    {
      url: 'https://example.com/dictionary/kitab',
      type: DictionaryType.ALMANY,
      displayName: 'Example Dictionary',
      id: '1',
    },
  ],
}

const mockWords: Word[] = [
  mockWord,
  {
    ...mockWord,
    id: '2',
    arabic: 'بيت',
    transliteration: 'bayt',
    translation: 'house',
    root: 'ب ي ت',
  },
]

const defaultProps = {
  displayWords: mockWords,
  loading: false,
  searchLoading: false,
  isSearching: false,
  filters: {
    search: '',
    difficulty: '',
    dialect: '',
    masteryLevel: '',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    totalCount: 25,
  },
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
}

describe('VocabularyContent', () => {
  it('renders word filters', () => {
    renderWithStore(VocabularyContent, {
      props: defaultProps,
    })

    expect(screen.getByPlaceholderText('Search words...')).toBeInTheDocument()
    expect(screen.getByText('All Difficulties')).toBeInTheDocument()
    expect(screen.getByText('All Dialects')).toBeInTheDocument()
    expect(screen.getByText('All Levels')).toBeInTheDocument()
  })

  it('displays loading state', () => {
    renderWithStore(VocabularyContent, {
      props: { ...defaultProps, loading: true },
    })

    expect(screen.getByText('Loading words...')).toBeInTheDocument()
    const spinner = document.querySelector('.loading-spinner')
    expect(spinner).toBeInTheDocument()
  })

  it('displays search loading state', () => {
    renderWithStore(VocabularyContent, {
      props: { ...defaultProps, searchLoading: true },
    })

    expect(screen.getByText('Searching words...')).toBeInTheDocument()
    const spinner = document.querySelector('.loading-spinner')
    expect(spinner).toBeInTheDocument()
  })

  it('shows empty state when no words exist', () => {
    renderWithStore(VocabularyContent, {
      props: { ...defaultProps, displayWords: [] },
    })

    expect(screen.getByText('No words found')).toBeInTheDocument()
    expect(
      screen.getByText('Start building your vocabulary by adding new words.')
    ).toBeInTheDocument()
    expect(screen.getByText('Add Your First Word')).toBeInTheDocument()
  })

  it('shows search results empty state when searching', () => {
    renderWithStore(VocabularyContent, {
      props: {
        ...defaultProps,
        displayWords: [],
        isSearching: true,
        filters: { ...defaultProps.filters, search: 'test' },
      },
    })

    expect(screen.getByText('No results found')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your search terms or filters.')).toBeInTheDocument()
    expect(screen.getByText('Clear Search')).toBeInTheDocument()
    expect(screen.getByText('Add Word')).toBeInTheDocument()
  })

  it('emits clear-search when clear search button clicked', async () => {
    const { emitted } = renderWithStore(VocabularyContent, {
      props: {
        ...defaultProps,
        displayWords: [],
        isSearching: true,
        filters: { ...defaultProps.filters, search: 'test' },
      },
    })

    const clearButton = screen.getByText('Clear Search')
    await fireEvent.click(clearButton)

    expect(emitted('clear-search')).toBeTruthy()
  })

  it('emits add-word when add word button clicked', async () => {
    const { emitted } = renderWithStore(VocabularyContent, {
      props: { ...defaultProps, displayWords: [] },
    })

    const addButton = screen.getByText('Add Your First Word')
    await fireEvent.click(addButton)

    expect(emitted('add-word')).toBeTruthy()
  })

  it('displays word table when words are available', () => {
    renderWithStore(VocabularyContent, {
      props: defaultProps,
    })

    expect(screen.getByText('Word')).toBeInTheDocument()
    expect(screen.getByText('Translation')).toBeInTheDocument()
    expect(screen.getByText('كتاب')).toBeInTheDocument()
    expect(screen.getByText('book')).toBeInTheDocument()
  })

  it('shows pagination for non-search results', () => {
    renderWithStore(VocabularyContent, {
      props: defaultProps,
    })

    expect(screen.getByText(/Showing/)).toBeInTheDocument()
    expect(screen.getByText(/results/)).toBeInTheDocument()
    // Check for pagination buttons with icons instead of text
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(2) // Should have prev, next, and page numbers
  })

  it('does not show pagination for search results', () => {
    renderWithStore(VocabularyContent, {
      props: {
        ...defaultProps,
        isSearching: true,
        filters: { ...defaultProps.filters, search: 'test' },
      },
    })

    expect(screen.queryByText(/Showing [0-9]+ to [0-9]+ of [0-9]+ results/)).not.toBeInTheDocument()
    // Should have fewer buttons when pagination is hidden
    const buttons = screen.getAllByRole('button')
    const nonWordTableButtons = buttons.filter(
      btn => !btn.getAttribute('title')?.includes('word') && !btn.textContent?.includes('كتاب')
    )
    expect(nonWordTableButtons.length).toBeLessThan(5) // Only filter and action buttons, no pagination
  })

  it('shows search results info when searching', () => {
    renderWithStore(VocabularyContent, {
      props: {
        ...defaultProps,
        isSearching: true,
        filters: { ...defaultProps.filters, search: 'test' },
      },
    })

    expect(screen.getByText(/Showing 2 search results for "test"/)).toBeInTheDocument()
  })

  it('shows singular search result info for one result', () => {
    renderWithStore(VocabularyContent, {
      props: {
        ...defaultProps,
        displayWords: [mockWord],
        isSearching: true,
        filters: { ...defaultProps.filters, search: 'book' },
      },
    })

    expect(screen.getByText(/Showing 1 search result for "book"/)).toBeInTheDocument()
  })

  it('calculates pagination info correctly', () => {
    const paginationProps = {
      ...defaultProps,
      pagination: {
        page: 2,
        pageSize: 10,
        totalCount: 25,
      },
    }

    renderWithStore(VocabularyContent, {
      props: paginationProps,
    })

    expect(screen.getByText(/Showing/)).toBeInTheDocument()
    const twentyFiveElements = screen.getAllByText(/25/)
    expect(twentyFiveElements.length).toBeGreaterThan(0)
    expect(screen.getByText(/results/)).toBeInTheDocument()
  })

  it('handles edge case pagination on last page', () => {
    const paginationProps = {
      ...defaultProps,
      pagination: {
        page: 3,
        pageSize: 10,
        totalCount: 25,
      },
    }

    renderWithStore(VocabularyContent, {
      props: paginationProps,
    })

    expect(screen.getByText(/Showing/)).toBeInTheDocument()
    const twentyFiveElements = screen.getAllByText(/25/)
    expect(twentyFiveElements.length).toBeGreaterThan(0)
    expect(screen.getByText(/results/)).toBeInTheDocument()
  })

  it('applies correct CSS classes', () => {
    renderWithStore(VocabularyContent, {
      props: defaultProps,
    })

    const container = document.querySelector('.vocabulary-content')
    expect(container).toHaveClass('vocabulary-content')
  })

  it('emits search-input event from filters', async () => {
    const { emitted } = renderWithStore(VocabularyContent, {
      props: defaultProps,
    })

    const searchInput = screen.getByPlaceholderText('Search words...')
    await fireEvent.update(searchInput, 'test')

    expect(emitted('search-input')).toBeTruthy()
  })

  it('emits filter-change event from filters', async () => {
    const { emitted } = renderWithStore(VocabularyContent, {
      props: defaultProps,
    })

    // Simulate filter change by finding the first select element (difficulty)
    const selects = screen.getAllByRole('combobox')
    await fireEvent.update(selects[0]!, 'BEGINNER')

    expect(emitted('filter-change')).toBeTruthy()
  })

  it('shows pagination component when not searching', () => {
    renderWithStore(VocabularyContent, {
      props: defaultProps,
    })

    // Just check that pagination info text is present
    expect(screen.getByText(/Showing/)).toBeInTheDocument()
    expect(screen.getByText(/results/)).toBeInTheDocument()

    // Check that we have pagination buttons (find buttons with numeric content)
    const buttons = screen.getAllByRole('button')
    const numericButtons = buttons.filter(btn => /^\d+$/.test(btn.textContent || ''))
    expect(numericButtons.length).toBeGreaterThan(0)
  })

  it('emits edit-word event from word table', async () => {
    const { emitted } = renderWithStore(VocabularyContent, {
      props: defaultProps,
    })

    const editButtons = screen.getAllByTitle('Edit word')
    await fireEvent.click(editButtons[0]!)

    expect(emitted('edit-word')).toBeTruthy()
  })

  it('emits delete-word event from word table', async () => {
    const { emitted } = renderWithStore(VocabularyContent, {
      props: defaultProps,
    })

    const deleteButtons = screen.getAllByTitle('Delete word')
    await fireEvent.click(deleteButtons[0]!)

    expect(emitted('delete-word')).toBeTruthy()
  })

  it('handles empty displayWords array', () => {
    renderWithStore(VocabularyContent, {
      props: { ...defaultProps, displayWords: [] },
    })

    expect(screen.getByText('No words found')).toBeInTheDocument()
  })

  it('shows correct empty state icon', () => {
    renderWithStore(VocabularyContent, {
      props: { ...defaultProps, displayWords: [] },
    })

    const icon = document.querySelector('.empty-state-icon svg')
    expect(icon).toBeInTheDocument()
  })

  it('applies correct styling to loading spinner', () => {
    renderWithStore(VocabularyContent, {
      props: { ...defaultProps, loading: true },
    })

    const spinner = document.querySelector('.loading-spinner')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('loading-spinner')
  })

  it('applies correct styling to empty state', () => {
    renderWithStore(VocabularyContent, {
      props: { ...defaultProps, displayWords: [] },
    })

    const emptyState = document.querySelector('.empty-state')
    expect(emptyState).toBeInTheDocument()
    expect(emptyState).toHaveClass('empty-state')
  })
})
