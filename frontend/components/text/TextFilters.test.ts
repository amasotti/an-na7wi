import { fireEvent, screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TextFilters } from '#components'
import { dialectOptions } from '~/constants/dialects'
import { difficultyOptions } from '~/constants/difficulty'
import { renderWithStore } from '~/test/test-utils'

const defaultProps = {
  searchQuery: '',
  selectedDialect: '',
  selectedDifficulty: '',
  activeTags: [],
  hasActiveFilters: false,
  dialectOptions: dialectOptions,
  difficultyOptions: difficultyOptions,
}

describe('TextFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search input', () => {
    renderWithStore(TextFilters, { props: defaultProps })

    const searchInput = screen.getByPlaceholderText('Search texts, titles, or content...')
    expect(searchInput).toBeInTheDocument()
  })

  it('renders dialect select', () => {
    renderWithStore(TextFilters, { props: defaultProps })

    const dialectSelect = screen.getByText('All Dialects')
    expect(dialectSelect).toBeInTheDocument()
  })

  it('renders difficulty select', () => {
    renderWithStore(TextFilters, { props: defaultProps })

    const difficultySelect = screen.getByText('All Difficulties')
    expect(difficultySelect).toBeInTheDocument()
  })

  it('emits search query updates', async () => {
    const { emitted } = renderWithStore(TextFilters, { props: defaultProps })

    const searchInput = screen.getByPlaceholderText('Search texts, titles, or content...')
    await fireEvent.update(searchInput, 'test search')

    expect(emitted('update:searchQuery')).toBeTruthy()
    expect(emitted('update:searchQuery')[0]).toEqual(['test search'])
  })

  it('shows active tags when provided', () => {
    renderWithStore(TextFilters, {
      props: {
        ...defaultProps,
        activeTags: ['grammar', 'vocabulary'],
      },
    })

    expect(screen.getByText('grammar')).toBeInTheDocument()
    expect(screen.getByText('vocabulary')).toBeInTheDocument()
  })

  it('shows clear all button when there are active filters', () => {
    renderWithStore(TextFilters, {
      props: {
        ...defaultProps,
        hasActiveFilters: true,
      },
    })

    expect(screen.getByText('Clear All')).toBeInTheDocument()
  })

  it('does not show clear all button when no active filters', () => {
    renderWithStore(TextFilters, {
      props: {
        ...defaultProps,
        hasActiveFilters: false,
      },
    })

    expect(screen.queryByText('Clear All')).not.toBeInTheDocument()
  })

  it('emits clear filters event when clear all clicked', async () => {
    const { emitted } = renderWithStore(TextFilters, {
      props: {
        ...defaultProps,
        hasActiveFilters: true,
      },
    })

    const clearButton = screen.getByText('Clear All')
    await fireEvent.click(clearButton)

    expect(emitted('clearFilters')).toBeTruthy()
  })
})
