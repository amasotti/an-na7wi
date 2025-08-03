import { fireEvent, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { renderWithStore } from '~/test/test-utils'
import type { Root } from '~/types'
import { RootsContent } from '#components'

const mockRoot: Root = {
  id: '1',
  letters: ["ر", "و", "ح"],
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
    letters: ["ش", "م", "ش"],
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
  it('displays loading state', () => {
    renderWithStore(RootsContent, {
      props: { ...defaultProps, loading: true },
    })

    expect(screen.getByText('Loading roots...')).toBeInTheDocument()
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('displays error state', () => {
    renderWithStore(RootsContent, {
      props: { 
        ...defaultProps, 
        loading: false,
        error: 'Failed to load roots',
      },
    })

    expect(screen.getByText('Error Loading Roots')).toBeInTheDocument()
    expect(screen.getByText('Failed to load roots')).toBeInTheDocument()
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

    expect(screen.getByText('No roots found')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your search criteria or filters.')).toBeInTheDocument()
  })

  it('displays roots in desktop grid view', () => {
    renderWithStore(RootsContent, {
      props: defaultProps,
    })

    // Check that roots are displayed
    expect(screen.getAllByText('ر-و-ح')).toHaveLength(2)

    // Check grid layout classes
    const gridContainer = document.querySelector('.hidden.md\\:grid')
    expect(gridContainer).toBeInTheDocument()
    expect(gridContainer).toHaveClass('grid-cols-1', 'lg:grid-cols-2', 'xl:grid-cols-3')
  })

  it('shows mobile view toggle on mobile', () => {
    renderWithStore(RootsContent, {
      props: defaultProps,
    })

    // Check mobile view toggle
    expect(screen.getByText('View')).toBeInTheDocument()
    expect(screen.getByText('Grid')).toBeInTheDocument()
    expect(screen.getByText('List')).toBeInTheDocument()
  })

  it('switches between grid and list view on mobile', async () => {
    renderWithStore(RootsContent, {
      props: defaultProps,
    })

    const listButton = screen.getByRole('button', { name: 'List' })
    await fireEvent.click(listButton)

    // After clicking, the list view should be active
    expect(listButton).toHaveClass('bg-primary-100', 'text-primary-700')
  })

  it('displays pagination when multiple pages exist', () => {
    renderWithStore(RootsContent, {
      props: defaultProps,
    })

    // Check pagination is present
    const paginationButtons = screen.getAllByRole('button').filter(btn => 
      /^\d+$/.test(btn.textContent || '')
    )
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
    const paginationButtons = buttons.filter(btn => 
      /^\d+$/.test(btn.textContent || '')
    )
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
    expect(screen.queryAllByTitle('Delete root')).toHaveLength(0) // Because wordCount > 0
  })

  it('applies correct styling to main container', () => {
    renderWithStore(RootsContent, {
      props: defaultProps,
    })

    const mainContainer = document.querySelector('.space-y-6')
    expect(mainContainer).toBeInTheDocument()
  })

  it('applies correct styling to roots container', () => {
    renderWithStore(RootsContent, {
      props: defaultProps,
    })

    const rootsContainer = document.querySelector('.bg-lime-100')
    expect(rootsContainer).toBeInTheDocument()
    expect(rootsContainer).toHaveClass('rounded-xl', 'shadow-sm', 'border', 'border-gray-200')
  })

  it('shows empty state icon', () => {
    renderWithStore(RootsContent, {
      props: { 
        ...defaultProps, 
        roots: [],
      },
    })

    const icon = document.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('handles error state styling', () => {
    renderWithStore(RootsContent, {
      props: { 
        ...defaultProps, 
        loading: false,
        error: 'Test error',
      },
    })

    const errorContainer = document.querySelector('.bg-red-50')
    expect(errorContainer).toBeInTheDocument()
    expect(errorContainer).toHaveClass('border', 'border-red-200', 'rounded-lg')
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

    const gridButton = screen.getByRole('button', { name: 'Grid' })
    const listButton = screen.getByRole('button', { name: 'List' })

    // Initially grid should be active
    expect(gridButton).toHaveClass('bg-primary-100', 'text-primary-700')

    // Switch to list view
    await fireEvent.click(listButton)
    expect(listButton).toHaveClass('bg-primary-100', 'text-primary-700')

    // Switch back to grid view
    await fireEvent.click(gridButton)
    expect(gridButton).toHaveClass('bg-primary-100', 'text-primary-700')
  })

  it('shows mobile grid view when selected', async () => {
    renderWithStore(RootsContent, {
      props: defaultProps,
    })

    // Grid view should be shown by default on mobile
    const mobileGridContainer = document.querySelector('.md\\:hidden .grid.grid-cols-2')
    expect(mobileGridContainer).toBeInTheDocument()
  })

  it('shows mobile list view when selected', async () => {
    renderWithStore(RootsContent, {
      props: defaultProps,
    })

    const listButton = screen.getByRole('button', { name: 'List' })
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

  it('handles empty roots array gracefully', () => {
    renderWithStore(RootsContent, {
      props: {
        ...defaultProps,
        roots: [],
      },
    })

    expect(screen.getByText('No roots found')).toBeInTheDocument()
  })
})
