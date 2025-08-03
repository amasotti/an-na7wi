import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { TextEmptyState as EmptyState } from '#components'

describe('EmptyState', () => {
  it('renders default empty state', () => {
    render(EmptyState)

    expect(screen.getByText('No texts found')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Start your Arabic learning journey by creating your first text with transliteration and translation.'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('Create Your First Text')).toBeInTheDocument()
  })

  it('renders filtered empty state', () => {
    render(EmptyState, {
      props: { hasFilters: true },
    })

    expect(screen.getByText('No texts match your filters')).toBeInTheDocument()
    expect(
      screen.getByText('Try adjusting your search criteria or clear your filters to see all texts.')
    ).toBeInTheDocument()
    expect(screen.getByText('Clear Filters')).toBeInTheDocument()
  })

  it('emits create event when create button clicked', async () => {
    const { emitted } = render(EmptyState)

    const createButton = screen.getByText('Create Your First Text')
    await fireEvent.click(createButton)

    expect(emitted().create).toBeTruthy()
  })

  it('emits clear-filters event when clear filters button clicked', async () => {
    const { emitted } = render(EmptyState, {
      props: { hasFilters: true },
    })

    const clearButton = screen.getByText('Clear Filters')
    await fireEvent.click(clearButton)

    expect(emitted()['clear-filters']).toBeTruthy()
  })

  it('emits browse-examples event when browse examples button clicked', async () => {
    const { emitted } = render(EmptyState)

    const browseButton = screen.getByText('Browse Examples')
    await fireEvent.click(browseButton)

    expect(emitted()['browse-examples']).toBeTruthy()
  })
})
