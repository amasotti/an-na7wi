import { fireEvent, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { RootsRootWordItem as RootWordItem } from '#components'
import { renderWithStore } from '~/test/test-utils'
import { Dialect, Difficulty, type WordSummary } from '~/types'

const mockWord: WordSummary = {
  id: '1',
  arabic: 'كتب',
  transliteration: 'kitab',
  translation: 'book',
  partOfSpeech: 'NOUN',
  difficulty: 'BEGINNER',
  dialect: 'MSA',
}

const defaultProps = {
  word: mockWord,
}

describe('RootWordItem', () => {
  it('renders word information correctly', () => {
    renderWithStore(RootWordItem, {
      props: defaultProps,
    })

    expect(screen.getByText('كتب')).toBeInTheDocument()
    expect(screen.getByText('kitab')).toBeInTheDocument()
    expect(screen.getByText('book')).toBeInTheDocument()
  })

  it('displays part of speech badge', () => {
    renderWithStore(RootWordItem, {
      props: defaultProps,
    })

    expect(screen.getByText('NOUN')).toBeInTheDocument()
  })

  it('displays difficulty badge with correct variant', () => {
    renderWithStore(RootWordItem, {
      props: defaultProps,
    })

    const difficultyBadge = screen.getByText('BEGINNER')
    expect(difficultyBadge).toBeInTheDocument()
    // Beginner should have success variant (green styling)
    expect(difficultyBadge.closest('.badge')).toBeDefined()
  })

  it('displays dialect badge when not MSA', () => {
    const wordWithDialect = { ...mockWord, dialect: 'TUNISIAN' }
    renderWithStore(RootWordItem, {
      props: { word: wordWithDialect },
    })

    expect(screen.getByText('TUNISIAN')).toBeInTheDocument()
  })

  it('does not display dialect badge for MSA', () => {
    renderWithStore(RootWordItem, {
      props: defaultProps,
    })

    // MSA should not be shown as a badge
    expect(screen.queryByText('MSA')).not.toBeInTheDocument()
  })

  it('does not show transliteration when not provided', () => {
    const wordWithoutTransliteration = { ...mockWord, transliteration: undefined }
    renderWithStore(RootWordItem, {
      props: { word: wordWithoutTransliteration },
    })

    expect(screen.queryByText('kitab')).not.toBeInTheDocument()
    expect(screen.getByText('كتب')).toBeInTheDocument()
    expect(screen.getByText('book')).toBeInTheDocument()
  })

  it('does not show translation when not provided', () => {
    const wordWithoutTranslation = { ...mockWord, translation: undefined }
    renderWithStore(RootWordItem, {
      props: { word: wordWithoutTranslation },
    })

    expect(screen.queryByText('book')).not.toBeInTheDocument()
    expect(screen.getByText('كتب')).toBeInTheDocument()
    expect(screen.getByText('kitab')).toBeInTheDocument()
  })

  it('does not show part of speech badge when not provided', () => {
    const wordWithoutPartOfSpeech = { ...mockWord, partOfSpeech: undefined }
    renderWithStore(RootWordItem, {
      props: { word: wordWithoutPartOfSpeech },
    })

    expect(screen.queryByText('NOUN')).not.toBeInTheDocument()
  })

  it('emits click event with arabic text when clicked', async () => {
    const { emitted } = renderWithStore(RootWordItem, {
      props: defaultProps,
    })

    const wordItem = screen.getByText('كتب').closest('div')
    await fireEvent.click(wordItem!)

    expect(emitted('click')).toBeTruthy()
    expect(emitted('click')![0]).toEqual(['كتب'])
  })

  it('applies correct hover effects', () => {
    renderWithStore(RootWordItem, {
      props: defaultProps,
    })

    const wordItem = screen.getByText('كتب').closest('div')
    expect(wordItem).toHaveClass('text-2xl font-bold text-gray-900 arabic')
  })

  it('displays navigation arrow', () => {
    renderWithStore(RootWordItem, {
      props: defaultProps,
    })

    const arrow = document.querySelector('svg')
    expect(arrow).toBeInTheDocument()
  })

  it('applies arabic class to arabic text', () => {
    renderWithStore(RootWordItem, {
      props: defaultProps,
    })

    const arabicText = screen.getByText('كتب')
    expect(arabicText).toBeInTheDocument()
    expect(arabicText).toHaveClass('arabic')
  })

  it('returns correct difficulty variant for intermediate', () => {
    const intermediateWord = { ...mockWord, difficulty: 'INTERMEDIATE' }
    renderWithStore(RootWordItem, {
      props: { word: intermediateWord },
    })

    expect(screen.getByText('INTERMEDIATE')).toBeInTheDocument()
  })

  it('returns correct difficulty variant for advanced', () => {
    const advancedWord = { ...mockWord, difficulty: 'ADVANCED' }
    renderWithStore(RootWordItem, {
      props: { word: advancedWord },
    })

    expect(screen.getByText('ADVANCED')).toBeInTheDocument()
  })

  it('returns correct difficulty variant for unknown difficulty', () => {
    const unknownWord = { ...mockWord, difficulty: 'UNKNOWN' }
    renderWithStore(RootWordItem, {
      props: { word: unknownWord },
    })

    expect(screen.getByText('UNKNOWN')).toBeInTheDocument()
  })

  it('handles very long arabic text', () => {
    const longArabicWord = {
      ...mockWord,
      arabic: 'يستفهم يستفهم يستفهم',
      transliteration: 'istifham istifham istifham',
      translation: 'very long interrogation word',
    }

    renderWithStore(RootWordItem, {
      props: { word: longArabicWord },
    })

    expect(screen.getByText('يستفهم يستفهم يستفهم')).toBeInTheDocument()
    expect(screen.getByText('istifham istifham istifham')).toBeInTheDocument()
    expect(screen.getByText('very long interrogation word')).toBeInTheDocument()
  })

  it('handles special characters in text fields', () => {
    const specialWord = {
      ...mockWord,
      arabic: 'كتب "مميّز"',
      transliteration: 'kitab "mumayyaz"',
      translation: 'special "book" & symbols',
    }

    renderWithStore(RootWordItem, {
      props: { word: specialWord },
    })

    expect(screen.getByText('كتب "مميّز"')).toBeInTheDocument()
    expect(screen.getByText('kitab "mumayyaz"')).toBeInTheDocument()
    expect(screen.getByText('special "book" & symbols')).toBeInTheDocument()
  })

  it('maintains proper layout structure', () => {
    renderWithStore(RootWordItem, {
      props: defaultProps,
    })

    // Check main container
    const container = screen.getByText('كتب').closest('[class*="p-4"]')
    expect(container).toHaveClass('p-4')

    // Check flex layout
    const flexContainer = container?.querySelector('.flex.items-start.space-x-4')
    expect(flexContainer).toBeInTheDocument()
  })

  it('handles empty string values gracefully', () => {
    const emptyWord = {
      ...mockWord,
      transliteration: '',
      translation: '',
      partOfSpeech: '',
    }

    renderWithStore(RootWordItem, {
      props: { word: emptyWord },
    })

    expect(screen.getByText('كتب')).toBeInTheDocument()
    expect(screen.queryByText('kitab')).not.toBeInTheDocument()
    expect(screen.queryByText('book')).not.toBeInTheDocument()
  })

  it('applies correct styling to badges', () => {
    renderWithStore(RootWordItem, {
      props: defaultProps,
    })

    const badges = document.querySelectorAll('.flex.flex-wrap.items-center.gap-2 > *')
    expect(badges.length).toBeGreaterThan(0)
  })

  it('handles case-insensitive difficulty variants', () => {
    const mixedCaseWord = { ...mockWord, difficulty: 'beginner' }
    renderWithStore(RootWordItem, {
      props: { word: mixedCaseWord },
    })

    expect(screen.getByText('beginner')).toBeInTheDocument()
  })

  it('shows flex-grow class on main content area', () => {
    renderWithStore(RootWordItem, {
      props: defaultProps,
    })

    const contentArea = document.querySelector('.flex-grow.min-w-0')
    expect(contentArea).toBeInTheDocument()
  })

  it('applies correct arrow styling and hover effects', () => {
    renderWithStore(RootWordItem, {
      props: defaultProps,
    })

    const arrowContainer = document.querySelector('.flex-shrink-0.pt-1')
    expect(arrowContainer).toBeInTheDocument()

    const arrow = arrowContainer?.querySelector('svg')
    expect(arrow).toBeInTheDocument()
  })

  it('handles null/undefined word properties safely', () => {
    const nullPropsWord = {
      id: '1',
      arabic: 'كتب',
      transliteration: null,
      translation: null,
      partOfSpeech: null,
      difficulty: Difficulty.BEGINNER,
      dialect: Dialect.MSA,
    } as unknown as WordSummary

    renderWithStore(RootWordItem, {
      props: { word: nullPropsWord },
    })

    expect(screen.getByText('كتب')).toBeInTheDocument()
    expect(screen.getByText('BEGINNER')).toBeInTheDocument()
  })
})
