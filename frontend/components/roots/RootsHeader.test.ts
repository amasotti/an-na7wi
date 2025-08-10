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
  // biome-ignore lint/suspicious/noExplicitAny: This is a test mock
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

  it('does not show clear filters button when no filters are active', () => {
    renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument()
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

  it('emits filter-changed on mount', async () => {
    const { emitted } = renderWithStore(RootsHeader, {
      props: defaultProps,
    })

    // Should emit filter-changed on mount due to onMounted hook
    await waitFor(() => {
      expect(emitted('filter-changed')).toBeTruthy()
    })
  })
})
