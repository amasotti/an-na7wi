import { fireEvent, screen, waitFor } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithStore } from '~/test/test-utils'
import type { RootStatistics } from '~/types'
import { RootsHeader } from '#components'

const mockStatistics: RootStatistics = {
  totalRoots: 150,
  triLiteral: 120,
  quadriLiteral: 25,
  quinqueLiteral: 5,
  otherCounts: { 2: 0, 6: 0 },
}

const defaultProps = {
  totalCount: 150,
  statistics: mockStatistics,
}

// Mock lodash debounce to make it synchronous for testing
vi.mock('lodash-es', () => ({
  debounce: (fn: any) => fn,
}))

describe('RootsHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the main title and description', () => {
    renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    expect(screen.getByText('Arabic Roots')).toBeInTheDocument()
    expect(screen.getByText('Explore 150 Arabic roots and their derived words')).toBeInTheDocument()
  })

  it('renders add root button', () => {
    renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    expect(screen.getByRole('button', { name: /Add Root/ })).toBeInTheDocument()
  })

  it('emits add-root event when button clicked', async () => {
    const { emitted } = renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    const addButton = screen.getByRole('button', { name: /Add Root/ })
    await fireEvent.click(addButton)

    expect(emitted('add-root')).toBeTruthy()
  })

  it('renders search input with correct placeholder', () => {
    renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    const searchInput = screen.getByPlaceholderText('Search roots by letters, form, or meaning...')
    expect(searchInput).toBeInTheDocument()
  })

  it('emits search event when typing in search input', async () => {
    const { emitted } = renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    const searchInput = screen.getByPlaceholderText('Search roots by letters, form, or meaning...')
    await fireEvent.update(searchInput, 'C*(')

    await waitFor(() => {
      expect(emitted('search')).toBeTruthy()
      expect(emitted('search')[0]).toEqual(['C*('])
    })
  })

  it('emits search event when pressing enter in search input', async () => {
    const { emitted } = renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    const searchInput = screen.getByPlaceholderText('Search roots by letters, form, or meaning...')
    await fireEvent.update(searchInput, 'test')
    await fireEvent.keyUp(searchInput, { key: 'Enter' })

    expect(emitted('search')).toBeTruthy()
  })

  it('renders letter count filter with options', () => {
    renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    const select = screen.getByRole('combobox', { name: 'Letter Count Filter' }) as HTMLSelectElement
    expect(select).toBeInTheDocument()
    expect(select.selectedOptions[0]!).toHaveTextContent('Letter Count')
  })

  it('emits filter-changed event when filter is updated', async () => {
    const { emitted } = renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    // Find the letter count select and change it
    const selects = screen.getAllByRole('combobox')
    if (selects.length > 0) {
      await fireEvent.update(selects[0]!, '3')
      
      await waitFor(() => {
        expect(emitted('filter-changed')).toBeTruthy()
      })
    }
  })

  it('shows clear filters button when filters are active', async () => {
    renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    // Type in search to activate filters
    const searchInput = screen.getByPlaceholderText('Search roots by letters, form, or meaning...')
    await fireEvent.update(searchInput, 'test')

    await waitFor(() => {
      expect(screen.getByText('Clear Filters')).toBeInTheDocument()
    })
  })

  it('does not show clear filters button when no filters are active', () => {
    renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument()
  })

  it('clears filters when clear button is clicked', async () => {
    const { emitted } = renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    // Activate filters first
    const searchInput = screen.getByPlaceholderText('Search roots by letters, form, or meaning...')
    await fireEvent.update(searchInput, 'test')

    await waitFor(() => {
      const clearButton = screen.getByText('Clear Filters')
      expect(clearButton).toBeInTheDocument()
    })

    const clearButton = screen.getByText('Clear Filters')
    await fireEvent.click(clearButton)

    // Search input should be cleared
    expect(searchInput).toHaveValue('')
    expect(emitted('filter-changed')).toBeTruthy()
  })

  it('displays statistics on desktop', () => {
    renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    // Statistics should be present but hidden on mobile
    const desktopStats = document.querySelector('.hidden.md\\:block')
    expect(desktopStats).toBeInTheDocument()
  })

  it('displays statistics on mobile', () => {
    renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    // Mobile statistics should be present
    const mobileStats = document.querySelector('.md\\:hidden')
    expect(mobileStats).toBeInTheDocument()
  })

  it('handles missing statistics gracefully', () => {
    renderWithStore(RootsHeader, {
      props: {
        totalCount: 0,
        statistics: null,
      },
    })

    expect(screen.getByText('Explore 0 Arabic roots and their derived words')).toBeInTheDocument()
    expect(screen.queryByText('150')).not.toBeInTheDocument()
  })

  it('displays search icon in search input', () => {
    renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    const searchIcon = document.querySelector('svg')
    expect(searchIcon).toBeInTheDocument()
  })

  it('applies correct styling to main container', () => {
    renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    const container = document.querySelector('.bg-white.rounded-xl.shadow-sm')
    expect(container).toBeInTheDocument()
    expect(container).toHaveClass('border', 'border-gray-200', 'p-6')
  })

  it('handles very long search queries', async () => {
    const { emitted } = renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    const longQuery = 'a'.repeat(100)
    const searchInput = screen.getByPlaceholderText('Search roots by letters, form, or meaning...')
    await fireEvent.update(searchInput, longQuery)

    await waitFor(() => {
      expect(emitted('search')).toBeTruthy()
      expect(emitted('search')[0]).toEqual([longQuery])
    })
  })

  it('handles arabic text in search input', async () => {
    const { emitted } = renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    const arabicQuery = 'C*( B1# /13'
    const searchInput = screen.getByPlaceholderText('Search roots by letters, form, or meaning...')
    await fireEvent.update(searchInput, arabicQuery)

    await waitFor(() => {
      expect(emitted('search')).toBeTruthy()
      expect(emitted('search')[0]).toEqual([arabicQuery])
    })
  })

  it('shows add root button text on desktop', () => {
    renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    // The span with "Add Root" should have sm:inline class (hidden on mobile)
    const buttonText = screen.getByText('Add Root')
    expect(buttonText).toHaveClass('hidden', 'sm:inline')
  })

  it('emits filter-changed on mount', async () => {
    const { emitted } = renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    // Should emit filter-changed on mount due to onMounted hook
    await waitFor(() => {
      expect(emitted('filter-changed')).toBeTruthy()
    })
  })

  it('maintains filter state correctly', async () => {
    renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    const searchInput = screen.getByPlaceholderText('Search roots by letters, form, or meaning...')
    
    // Type something
    await fireEvent.update(searchInput, 'test')
    expect(searchInput).toHaveValue('test')

    // Clear filters
    await waitFor(() => {
      const clearButton = screen.getByText('Clear Filters')
      expect(clearButton).toBeInTheDocument()
    })

    const clearButton = screen.getByText('Clear Filters')
    await fireEvent.click(clearButton)

    // Should be cleared
    expect(searchInput).toHaveValue('')
  })

  it('has proper layout structure', () => {
    renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    // Check main layout elements
    const flexContainer = document.querySelector('.flex.items-center.justify-between')
    expect(flexContainer).toBeInTheDocument()

    const spaceY = document.querySelector('.space-y-4')
    expect(spaceY).toBeInTheDocument()
  })

  it('handles filter changes correctly', async () => {
    const { emitted } = renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    // Change search input
    const searchInput = screen.getByPlaceholderText('Search roots by letters, form, or meaning...')
    await fireEvent.update(searchInput, 'test')

    await waitFor(() => {
      expect(emitted('search')).toBeTruthy()
      const lastEmit = emitted('search')[emitted('search').length - 1] as any[]
      expect(lastEmit).toMatchObject(['test'])
    })
  })
})
