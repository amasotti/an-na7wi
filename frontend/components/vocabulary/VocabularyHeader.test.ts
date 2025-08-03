import { fireEvent, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { renderWithStore } from '~/test/test-utils'
import { VocabularyHeader } from '#components'

const defaultProps = {
  isSearching: false,
  searchLoading: false,
  searchResultsCount: 0,
}

describe('VocabularyHeader', () => {
  it('renders the main title', () => {
    renderWithStore(VocabularyHeader, {
      props: defaultProps,
    })

    expect(screen.getByText('Vocabulary Manager')).toBeInTheDocument()
  })

  it('renders add new word button', () => {
    renderWithStore(VocabularyHeader, {
      props: defaultProps,
    })

    expect(screen.getByText('Add New Word')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add New Word' })).toBeInTheDocument()
  })

  it('emits add-word event when button clicked', async () => {
    const { emitted } = renderWithStore(VocabularyHeader, {
      props: defaultProps,
    })

    const addButton = screen.getByText('Add New Word')
    await fireEvent.click(addButton)

    expect(emitted('add-word')).toBeTruthy()
  })

  it('does not show subtitle when not searching', () => {
    renderWithStore(VocabularyHeader, {
      props: defaultProps,
    })

    expect(screen.queryByText(/Searching/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Found/)).not.toBeInTheDocument()
  })

  it('shows searching indicator when search is loading', () => {
    renderWithStore(VocabularyHeader, {
      props: {
        ...defaultProps,
        isSearching: true,
        searchLoading: true,
      },
    })

    expect(screen.getByText('Searching...')).toBeInTheDocument()
  })

  it('shows search results count when searching complete', () => {
    renderWithStore(VocabularyHeader, {
      props: {
        ...defaultProps,
        isSearching: true,
        searchLoading: false,
        searchResultsCount: 5,
      },
    })

    expect(screen.getByText('Found 5 results')).toBeInTheDocument()
  })

  it('shows singular result text for one result', () => {
    renderWithStore(VocabularyHeader, {
      props: {
        ...defaultProps,
        isSearching: true,
        searchLoading: false,
        searchResultsCount: 1,
      },
    })

    expect(screen.getByText('Found 1 result')).toBeInTheDocument()
  })

  it('shows zero results correctly', () => {
    renderWithStore(VocabularyHeader, {
      props: {
        ...defaultProps,
        isSearching: true,
        searchLoading: false,
        searchResultsCount: 0,
      },
    })

    expect(screen.getByText('Found 0 results')).toBeInTheDocument()
  })

  it('applies correct CSS classes', () => {
    renderWithStore(VocabularyHeader, {
      props: defaultProps,
    })

    const header = document.querySelector('.vocabulary-header')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('vocabulary-header')

    const title = screen.getByText('Vocabulary Manager')
    expect(title).toHaveClass('vocabulary-title')
  })

  it('has correct accessibility structure', () => {
    renderWithStore(VocabularyHeader, {
      props: defaultProps,
    })

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Vocabulary Manager')

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('renders add icon in button', () => {
    renderWithStore(VocabularyHeader, {
      props: defaultProps,
    })

    const button = screen.getByRole('button')
    const icon = button.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('handles various search result counts correctly', () => {
    const testCases = [
      { count: 0, expected: 'Found 0 results' },
      { count: 1, expected: 'Found 1 result' },
      { count: 2, expected: 'Found 2 results' },
      { count: 100, expected: 'Found 100 results' },
    ]

    for (const { count, expected } of testCases) {
      const { unmount } = renderWithStore(VocabularyHeader, {
        props: {
          ...defaultProps,
          isSearching: true,
          searchLoading: false,
          searchResultsCount: count,
        },
      })

      expect(screen.getByText(expected)).toBeInTheDocument()
      unmount()
    }
  })

  it('shows correct layout structure', () => {
    renderWithStore(VocabularyHeader, {
      props: defaultProps,
    })

    const headerContent = document.querySelector('.header-content')
    expect(headerContent).toBeInTheDocument()
    expect(headerContent).toHaveClass('header-content')
  })

  it('subtitle has correct styling when shown', () => {
    renderWithStore(VocabularyHeader, {
      props: {
        ...defaultProps,
        isSearching: true,
        searchResultsCount: 5,
      },
    })

    const subtitle = screen.getByText('Found 5 results')
    expect(subtitle).toHaveClass('vocabulary-subtitle')
  })

  it('prioritizes searchLoading over searchResultsCount', () => {
    renderWithStore(VocabularyHeader, {
      props: {
        ...defaultProps,
        isSearching: true,
        searchLoading: true,
        searchResultsCount: 10,
      },
    })

    expect(screen.getByText('Searching...')).toBeInTheDocument()
    expect(screen.queryByText('Found 10 results')).not.toBeInTheDocument()
  })
})
