import { fireEvent, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { renderWithStore } from '~/test/test-utils'
import type { Root } from '~/types'
import { RootsContent } from '#components'

const mockRoot: Root = {
  id: '1',
  letters: ['ر', 'و', 'ح'],
  normalizedForm: 'روج',
  displayForm: 'ر-و-ح',
  letterCount: 3,
  meaning: 'related to writing',
  wordCount: 15,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
}

const mockRoots: Root[] = [
  mockRoot,
  {
    ...mockRoot,
    id: '2',
    letters: ['ش', 'م', 'ش'],
    normalizedForm: 'شمس',
    displayForm: 'ش-م-س',
    meaning: 'related to reading',
    wordCount: 12,
  },
]

const defaultProps = {
  roots: mockRoots,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    size: 10,
    totalCount: 25,
    totalPages: 3,
  },
  showDeleteButtons: false,
}

describe('RootsContent', () => {
  it('displays error state', () => {
    renderWithStore(RootsContent, {
      props: {
        ...defaultProps,
        loading: false,
        error: 'Failed to load roots',
      },
    })

    expect(screen.getAllByText('Failed to load roots').length).toBeGreaterThan(0)
  })

  it('displays empty state when no roots', () => {
    renderWithStore(RootsContent, {
      props: {
        ...defaultProps,
        roots: [],
        loading: false,
        error: null,
      },
    })

    expect(screen.getByText('No roots found. Start by creating a new root.')).toBeInTheDocument()
    expect(screen.getByText('Create Root')).toBeInTheDocument()
  })

  it('displays pagination when multiple pages exist', () => {
    renderWithStore(RootsContent, {
      props: defaultProps,
    })

    // Check pagination is present
    const paginationButtons = screen
      .getAllByRole('button')
      .filter(btn => /^\d+$/.test(btn.textContent || ''))
    expect(paginationButtons.length).toBeGreaterThan(0)
  })

  it('does not display pagination when only one page', () => {
    renderWithStore(RootsContent, {
      props: {
        ...defaultProps,
        pagination: {
          ...defaultProps.pagination,
          totalPages: 1,
        },
      },
    })

    // Pagination should be hidden
    const buttons = screen.getAllByRole('button')
    const paginationButtons = buttons.filter(btn => /^\d+$/.test(btn.textContent || ''))
    expect(paginationButtons.length).toBe(0)
  })

  it('emits root-deleted event when delete button is clicked', async () => {
    const rootsWithNoWords = mockRoots.map(root => ({ ...root, wordCount: 0 }))
    const { emitted } = renderWithStore(RootsContent, {
      props: {
        ...defaultProps,
        roots: rootsWithNoWords,
        showDeleteButtons: true,
      },
    })

    // Find and click delete button
    const deleteButton = screen.getAllByTitle('Delete root')[0] as HTMLButtonElement
    await fireEvent.click(deleteButton)

    expect(emitted('root-deleted')).toBeTruthy()
  })

  it('passes showDeleteButtons prop to child components', () => {
    renderWithStore(RootsContent, {
      props: {
        ...defaultProps,
        showDeleteButtons: true,
      },
    })

    // This is tested indirectly through the presence of delete buttons
    // when roots have wordCount: 0
    expect(screen.queryAllByTitle('Delete root').length).toBeGreaterThan(0)
  })

  it('applies correct styling to main container', () => {
    renderWithStore(RootsContent, {
      props: defaultProps,
    })

    const mainContainer = document.querySelector('.space-y-6')
    expect(mainContainer).toBeInTheDocument()
  })

  it('handles loading state styling', () => {
    renderWithStore(RootsContent, {
      props: { ...defaultProps, loading: true },
    })

    const loadingContainer = document.querySelector('.bg-white.rounded-xl.shadow-sm')
    expect(loadingContainer).toBeInTheDocument()
  })

  it('maintains view mode state correctly', async () => {
    renderWithStore(RootsContent, {
      props: defaultProps,
    })

    const gridButton = screen.getByRole('button', { name: 'Card view' })
    const listButton = screen.getByRole('button', { name: 'Table view' })

    // Initially grid should be active
    expect(gridButton).toHaveClass('toggle-button toggle-button-active')

    // Switch to list view
    await fireEvent.click(listButton)
    expect(listButton).toHaveClass('toggle-button toggle-button-active')

    // Switch back to grid view
    await fireEvent.click(gridButton)
    expect(gridButton).toHaveClass('toggle-button toggle-button-active')
  })

  it('shows mobile list view when selected', async () => {
    renderWithStore(RootsContent, {
      props: defaultProps,
    })

    const listButton = screen.getByRole('button', { name: 'Table view' })
    await fireEvent.click(listButton)

    // List view should be shown after clicking
    const mobileListContainer = document.querySelector('.divide-y.divide-gray-200')
    expect(mobileListContainer).toBeInTheDocument()
  })

  it('handles single root correctly', () => {
    renderWithStore(RootsContent, {
      props: {
        ...defaultProps,
        roots: [mockRoot],
      },
    })

    expect(screen.getAllByText('ر-و-ح')).not.toHaveLength(0)
    expect(screen.getAllByText('related to writing')).not.toHaveLength(0)
  })
})
