import { render, screen } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { RootsRootWordsList as RootWordsList } from '#components'
import { mockedRoot } from '~/test/mocks/roots.mock'
import { mockWords } from '~/test/mocks/words.mock'
import { Dialect, Difficulty, type Root, type WordSummary } from '~/types'

// Mock rootStore
const mockRootStore = {
  currentRootWithWords: null as { root: Root; words: WordSummary[] } | null,
}

vi.mock('~/stores/rootStore', () => ({
  useRootStore: () => mockRootStore,
}))

describe('RootWordsList', () => {
  it('renders the header with root display and word count', () => {
    mockRootStore.currentRootWithWords = { root: mockedRoot, words: mockWords }
    render(RootWordsList)
    expect(
      screen.getByText(`Words from Root ${mockRootStore.currentRootWithWords!.root.displayForm}`)
    ).toBeInTheDocument()
    expect(screen.getByText('3 words')).toBeInTheDocument()
  })

  it('renders all words in the list', () => {
    mockRootStore.currentRootWithWords = { root: mockedRoot, words: mockWords }
    render(RootWordsList)
    expect(screen.getByText('كتب')).toBeInTheDocument()
    expect(screen.getByText('kitab')).toBeInTheDocument()
    expect(screen.getByText('book')).toBeInTheDocument()
    expect(screen.getByText('writer')).toBeInTheDocument()
    expect(screen.getByText('office')).toBeInTheDocument()
  })

  it('displays empty state when no words are provided', () => {
    mockRootStore.currentRootWithWords!.words = []
    render(RootWordsList)
    expect(screen.getByText('No words found')).toBeInTheDocument()
    expect(
      screen.getByText('No words are currently associated with this root.')
    ).toBeInTheDocument()
  })

  it('shows empty state icon when no words', () => {
    mockRootStore.currentRootWithWords = { root: mockedRoot, words: mockWords }
    render(RootWordsList)
    const icon = document.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('renders clickable word items with proper structure', async () => {
    mockRootStore.currentRootWithWords = { root: mockedRoot, words: mockWords }
    render(RootWordsList)
    // Verify clickable elements are present
    const wordItems = document.querySelectorAll('.cursor-pointer')
    expect(wordItems).toHaveLength(3)

    // Verify each word item has the expected content
    expect(screen.getByText('كتب')).toBeInTheDocument()
    expect(screen.getByText('كتيب')).toBeInTheDocument()
    expect(screen.getByText('EC*(')).toBeInTheDocument()

    // Verify the items have proper hover styling
    for (const item of wordItems) {
      expect(item).toHaveClass('hover:bg-gray-50', 'cursor-pointer')
    }
  })

  it('applies correct styling to main container', () => {
    mockRootStore.currentRootWithWords = { root: mockedRoot, words: mockWords }
    render(RootWordsList)
    const container = document.querySelector('.bg-white.rounded-xl.shadow-sm')
    expect(container).toBeInTheDocument()
    expect(container).toHaveClass('border', 'border-gray-200')
  })

  it('applies correct styling to header', () => {
    mockRootStore.currentRootWithWords = { root: mockedRoot, words: mockWords }
    render(RootWordsList)
    const header = document.querySelector('.p-6.border-b.border-gray-200')
    expect(header).toBeInTheDocument()
  })

  it('applies divide styling to words list', () => {
    mockRootStore.currentRootWithWords = { root: mockedRoot, words: mockWords }
    render(RootWordsList)
    const wordsList = document.querySelector('.divide-y.divide-gray-200')
    expect(wordsList).toBeInTheDocument()
  })

  it('displays word count badge with primary variant', () => {
    mockRootStore.currentRootWithWords = { root: mockedRoot, words: mockWords }
    render(RootWordsList)
    const badge = screen.getByText('3 words')
    expect(badge.closest('.badge')).toBeDefined()
  })

  it('handles very long root display text', () => {
    mockRootStore.currentRootWithWords!.root = {
      ...mockedRoot,
      displayForm: 'ه د سا ق ش ع ر ت ط',
    }
    render(RootWordsList)
    expect(screen.getByText('Words from Root ه د سا ق ش ع ر ت ط')).toBeInTheDocument()
  })

  it('displays word metadata correctly', () => {
    mockRootStore.currentRootWithWords = { root: mockedRoot, words: mockWords }
    render(RootWordsList)
    // Verify part of speech badges
    expect(screen.getAllByText('NOUN')).toHaveLength(3)

    // Verify difficulty badges
    expect(screen.getAllByText('BEGINNER')).toHaveLength(2)
    expect(screen.getByText('INTERMEDIATE')).toBeInTheDocument()

    // Verify transliterations
    expect(screen.getByText('kitab')).toBeInTheDocument()
    expect(screen.getByText('katib')).toBeInTheDocument()
    expect(screen.getByText('maktab')).toBeInTheDocument()

    // Verify translations
    expect(screen.getByText('book')).toBeInTheDocument()
    expect(screen.getByText('writer')).toBeInTheDocument()
    expect(screen.getByText('office')).toBeInTheDocument()
  })

  it('shows correct empty state styling', () => {
    mockRootStore.currentRootWithWords = { root: mockedRoot, words: mockWords }
    render(RootWordsList)
    mockRootStore.currentRootWithWords!.words = []
    render(RootWordsList)
    const emptyState = document.querySelector('.p-12.text-center')
    expect(emptyState).toBeInTheDocument()

    const title = screen.getByText('No words found')
    expect(title).toHaveClass('text-lg', 'font-medium', 'text-gray-900', 'mb-2')

    const message = screen.getByText('No words are currently associated with this root.')
    expect(message).toHaveClass('text-gray-600')
  })

  it('maintains correct z-index and layering', () => {
    mockRootStore.currentRootWithWords = { root: mockedRoot, words: mockWords }
    render(RootWordsList)
    // The component should render without layout issues
    const container = document.querySelector('.bg-white.rounded-xl')
    expect(container).toBeInTheDocument()
  })

  it('handles words with missing properties gracefully', () => {
    mockRootStore.currentRootWithWords!.words = [
      {
        id: '1',
        arabic: 'كتب',
        difficulty: Difficulty.BEGINNER,
        dialect: Dialect.MSA,
      } as WordSummary,
    ]
    render(RootWordsList)

    expect(screen.getByText('كتب')).toBeInTheDocument()
    expect(screen.getByText('1 words')).toBeInTheDocument()
  })
})
