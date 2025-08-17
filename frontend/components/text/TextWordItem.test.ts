import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { TextWordItem } from '#components'
import type { WordSummary } from '~/types'

// Mock navigateTo
vi.mock('#app', () => ({
  navigateTo: vi.fn(),
}))

describe('TextWordItem', () => {
  const mockWordSummary: WordSummary = {
    id: '1',
    arabic: 'كلمة',
    transliteration: 'kalima',
    translation: 'word',
    partOfSpeech: 'NOUN',
    difficulty: 'INTERMEDIATE',
    dialect: 'MSA',
  }

  it('displays word information correctly', () => {
    render(TextWordItem, {
      props: {
        word: mockWordSummary,
      },
    })

    expect(screen.getByText('كلمة')).toBeInTheDocument()
    expect(screen.getByText('(kalima)')).toBeInTheDocument() // Transliteration in parentheses
    expect(screen.getByText('word')).toBeInTheDocument()
    expect(screen.getByText('NOUN')).toBeInTheDocument() // Full part of speech
    expect(screen.getByText('INTERMEDIATE')).toBeInTheDocument() // Full difficulty
  })

  it('handles missing optional fields', () => {
    const wordWithoutOptionals: WordSummary = {
      id: '2',
      arabic: 'نص',
      difficulty: 'BEGINNER',
      dialect: 'MSA',
    }

    render(TextWordItem, {
      props: {
        word: wordWithoutOptionals,
      },
    })

    expect(screen.getByText('نص')).toBeInTheDocument()
    expect(screen.getByText('BEGINNER')).toBeInTheDocument() // Full difficulty
    expect(screen.getByText('—')).toBeInTheDocument() // Placeholder for missing translation
    // Empty transliteration shows as empty parentheses
    expect(screen.getByText('()')).toBeInTheDocument()
  })

  it('shows dialect badge when not MSA', () => {
    const egyptianWord: WordSummary = {
      id: '3',
      arabic: 'عيش',
      translation: 'bread',
      difficulty: 'BEGINNER',
      dialect: 'EGYPTIAN',
    }

    render(TextWordItem, {
      props: {
        word: egyptianWord,
      },
    })

    expect(screen.getByText('EGYPTIAN')).toBeInTheDocument()
  })

  it('hides dialect badge for MSA', () => {
    render(TextWordItem, {
      props: {
        word: mockWordSummary,
      },
    })

    expect(screen.queryByText('MSA')).not.toBeInTheDocument()
  })

  it('renders as clickable component', async () => {
    render(TextWordItem, {
      props: {
        word: mockWordSummary,
      },
    })

    const wordItem = screen.getByText('كلمة').closest('.related-word-row')!

    // Check that the element is rendered and can be clicked
    expect(wordItem).toBeInTheDocument()
    expect(wordItem).toHaveClass('related-word-row')

    // Test that clicking doesn't throw an error
    await fireEvent.click(wordItem)
  })

  it('applies correct difficulty color for beginner', () => {
    const beginnerWord: WordSummary = {
      ...mockWordSummary,
      difficulty: 'BEGINNER',
    }

    render(TextWordItem, {
      props: {
        word: beginnerWord,
      },
    })

    expect(screen.getByText('BEGINNER')).toBeInTheDocument()
    expect(screen.getByText('BEGINNER')).toHaveClass('text-green-600')
  })

  it('applies correct difficulty color for intermediate', () => {
    const intermediateWord: WordSummary = {
      ...mockWordSummary,
      difficulty: 'INTERMEDIATE',
    }

    render(TextWordItem, {
      props: {
        word: intermediateWord,
      },
    })

    expect(screen.getByText('INTERMEDIATE')).toBeInTheDocument()
    expect(screen.getByText('INTERMEDIATE')).toHaveClass('text-orange-400')
  })

  it('applies correct difficulty color for advanced', () => {
    const advancedWord: WordSummary = {
      ...mockWordSummary,
      difficulty: 'ADVANCED',
    }

    render(TextWordItem, {
      props: {
        word: advancedWord,
      },
    })

    expect(screen.getByText('ADVANCED')).toBeInTheDocument()
    expect(screen.getByText('ADVANCED')).toHaveClass('text-red-600')
  })
})
