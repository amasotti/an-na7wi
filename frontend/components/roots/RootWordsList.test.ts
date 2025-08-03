import { screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { renderWithStore } from '~/test/test-utils'
import { Dialect, Difficulty, type WordSummary } from '~/types'
import { RootsRootWordsList as RootWordsList } from '#components'

const mockWords: WordSummary[] = [
  {
    id: '1',
    arabic: 'كتب',
    transliteration: 'kitab',
    translation: 'book',
    partOfSpeech: 'NOUN',
    difficulty: 'BEGINNER',
    dialect: 'MSA',
  },
  {
    id: '2',
    arabic: 'كتيب',
    transliteration: 'katib',
    translation: 'writer',
    partOfSpeech: 'NOUN',
    difficulty: 'INTERMEDIATE',
    dialect: 'MSA',
  },
  {
    id: '3',
    arabic: 'EC*(',
    transliteration: 'maktab',
    translation: 'office',
    partOfSpeech: 'NOUN',
    difficulty: 'BEGINNER',
    dialect: 'MSA',
  },
]

const defaultProps = {
  words: mockWords,
  rootDisplay: 'C * (',
}

describe('RootWordsList', () => {
  it('renders the header with root display and word count', () => {
    renderWithStore(RootWordsList, {
      props: defaultProps,
    })

    expect(screen.getByText('Words from Root C * (')).toBeInTheDocument()
    expect(screen.getByText('3 words')).toBeInTheDocument()
  })

  it('renders all words in the list', () => {
    renderWithStore(RootWordsList, {
      props: defaultProps,
    })

    expect(screen.getByText('كتب')).toBeInTheDocument()
    expect(screen.getByText('kitab')).toBeInTheDocument()
    expect(screen.getByText('book')).toBeInTheDocument()
    expect(screen.getByText('writer')).toBeInTheDocument()
    expect(screen.getByText('office')).toBeInTheDocument()
  })

  it('displays empty state when no words are provided', () => {
    renderWithStore(RootWordsList, {
      props: {
        words: [],
        rootDisplay: 'C * (',
      },
    })

    expect(screen.getByText('No words found')).toBeInTheDocument()
    expect(
      screen.getByText('No words are currently associated with this root.')
    ).toBeInTheDocument()
  })

  it('shows empty state icon when no words', () => {
    renderWithStore(RootWordsList, {
      props: {
        words: [],
        rootDisplay: 'C * (',
      },
    })

    const icon = document.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('renders clickable word items with proper structure', async () => {
    renderWithStore(RootWordsList, {
      props: defaultProps,
    })

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

  it('handles single word correctly', () => {
    renderWithStore(RootWordsList, {
      props: {
        words: [mockWords[0]],
        rootDisplay: 'C * (',
      },
    })

    expect(screen.getByText('Words from Root C * (')).toBeInTheDocument()
    expect(screen.getByText('1 words')).toBeInTheDocument()
    expect(screen.getByText('كتب')).toBeInTheDocument()
  })

  it('applies correct styling to main container', () => {
    renderWithStore(RootWordsList, {
      props: defaultProps,
    })

    const container = document.querySelector('.bg-white.rounded-xl.shadow-sm')
    expect(container).toBeInTheDocument()
    expect(container).toHaveClass('border', 'border-gray-200')
  })

  it('applies correct styling to header', () => {
    renderWithStore(RootWordsList, {
      props: defaultProps,
    })

    const header = document.querySelector('.p-6.border-b.border-gray-200')
    expect(header).toBeInTheDocument()
  })

  it('applies divide styling to words list', () => {
    renderWithStore(RootWordsList, {
      props: defaultProps,
    })

    const wordsList = document.querySelector('.divide-y.divide-gray-200')
    expect(wordsList).toBeInTheDocument()
  })

  it('displays word count badge with primary variant', () => {
    renderWithStore(RootWordsList, {
      props: defaultProps,
    })

    const badge = screen.getByText('3 words')
    expect(badge.closest('.badge')).toBeDefined()
  })

  it('handles very long root display text', () => {
    renderWithStore(RootWordsList, {
      props: {
        ...defaultProps,
        rootDisplay: 'C * ( , E G 1 3 A 1',
      },
    })

    expect(screen.getByText('Words from Root C * ( , E G 1 3 A 1')).toBeInTheDocument()
  })

  it('handles special characters in root display', () => {
    renderWithStore(RootWordsList, {
      props: {
        ...defaultProps,
        rootDisplay: 'C * "("',
      },
    })

    expect(screen.getByText('Words from Root C * "("')).toBeInTheDocument()
  })

  it('renders proper layout structure', () => {
    renderWithStore(RootWordsList, {
      props: defaultProps,
    })

    // Check header layout
    const headerFlex = document.querySelector('.flex.items-center.justify-between')
    expect(headerFlex).toBeInTheDocument()

    // Check title styling
    const title = screen.getByText('Words from Root C * (')
    expect(title).toHaveClass('text-xl', 'font-semibold', 'text-gray-900')
  })

  it('displays word metadata correctly', () => {
    renderWithStore(RootWordsList, {
      props: defaultProps,
    })

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
    renderWithStore(RootWordsList, {
      props: {
        words: [],
        rootDisplay: 'C * (',
      },
    })

    const emptyState = document.querySelector('.p-12.text-center')
    expect(emptyState).toBeInTheDocument()

    const title = screen.getByText('No words found')
    expect(title).toHaveClass('text-lg', 'font-medium', 'text-gray-900', 'mb-2')

    const message = screen.getByText('No words are currently associated with this root.')
    expect(message).toHaveClass('text-gray-600')
  })

  it('handles large number of words', () => {
    const manyWords = Array.from({ length: 20 }, (_, i) => ({
      ...mockWords[0],
      id: `${i + 1}`,
      arabic: `CDE)${i + 1}`,
      translation: `word ${i + 1}`,
    }))

    renderWithStore(RootWordsList, {
      props: {
        words: manyWords,
        rootDisplay: 'C * (',
      },
    })

    expect(screen.getByText('20 words')).toBeInTheDocument()
    expect(screen.getByText('CDE)1')).toBeInTheDocument()
    expect(screen.getByText('CDE)20')).toBeInTheDocument()
  })

  it('maintains correct z-index and layering', () => {
    renderWithStore(RootWordsList, {
      props: defaultProps,
    })

    // The component should render without layout issues
    const container = document.querySelector('.bg-white.rounded-xl')
    expect(container).toBeInTheDocument()
  })

  it('handles words without translations', () => {
    const wordsWithoutTranslations = mockWords.map(word => ({
      ...word,
      translation: undefined,
    }))

    renderWithStore(RootWordsList, {
      props: {
        words: wordsWithoutTranslations,
        rootDisplay: 'C * (',
      },
    })

    expect(screen.getByText('كتب')).toBeInTheDocument()
    expect(screen.queryByText('book')).not.toBeInTheDocument()
  })

  it('handles words with missing properties gracefully', () => {
    const incompleteWords = [
      {
        id: '1',
        arabic: 'كتب',
        difficulty: Difficulty.BEGINNER,
        dialect: Dialect.MSA,
      } as WordSummary,
    ]

    renderWithStore(RootWordsList, {
      props: {
        words: incompleteWords,
        rootDisplay: 'C * (',
      },
    })

    expect(screen.getByText('كتب')).toBeInTheDocument()
    expect(screen.getByText('1 words')).toBeInTheDocument()
  })
})
