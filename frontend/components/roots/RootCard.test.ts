import { fireEvent, screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithStore } from '~/test/test-utils'
import type { Root } from '~/types'
import { RootsRootCard as RootCard } from '#components'

const mockRoot: Root = {
  id: '1',
  letters: ['ك', 'ت', 'ب'],
  normalizedForm: 'كتب',
  displayForm: 'ك-ت-ب',
  letterCount: 3,
  meaning: 'related to writing',
  wordCount: 5,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
}

const mockRootWithoutMeaning: Root = {
  ...mockRoot,
  meaning: undefined,
}

const mockEmptyRoot: Root = {
  ...mockRoot,
  wordCount: 0,
}

describe('RootCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders root information correctly', () => {
    renderWithStore(RootCard, {
      props: { root: mockRoot },
    })

    expect(screen.getByText('ك-ت-ب')).toBeInTheDocument()
    expect(screen.getByText('related to writing')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('handles root without meaning', () => {
    renderWithStore(RootCard, {
      props: { root: mockRootWithoutMeaning },
    })

    expect(screen.getByText('ك-ت-ب')).toBeInTheDocument()
    expect(screen.queryByText('related to writing')).not.toBeInTheDocument()
  })

  it('emits click event when card is clicked', async () => {
    const { emitted } = renderWithStore(RootCard, {
      props: { root: mockRoot },
    })

    const card = screen.getByText('ك-ت-ب').closest('article')
    await fireEvent.click(card!)

    expect(emitted('click')).toBeTruthy()
  })

  it('shows delete button when showDeleteButton is true and wordCount is 0', () => {
    renderWithStore(RootCard, {
      props: {
        root: mockEmptyRoot,
        showDeleteButton: true,
      },
    })

    const deleteButton = screen.getByTitle('Delete root')
    expect(deleteButton).toBeInTheDocument()
  })

  it('emits delete event when delete button is clicked', async () => {
    const { emitted } = renderWithStore(RootCard, {
      props: {
        root: mockEmptyRoot,
        showDeleteButton: true,
      },
    })

    const deleteButton = screen.getByTitle('Delete root')
    await fireEvent.click(deleteButton)

    expect(emitted('delete')).toBeTruthy()
    expect(emitted('delete')[0]).toEqual(['1'])
  })

  it('prevents event propagation when delete button is clicked', async () => {
    const { emitted } = renderWithStore(RootCard, {
      props: {
        root: mockEmptyRoot,
        showDeleteButton: true,
      },
    })

    const deleteButton = screen.getByTitle('Delete root')
    await fireEvent.click(deleteButton)

    expect(emitted('click')).toBeFalsy()
    expect(emitted('delete')).toBeTruthy()
  })

  it('applies desktop styling when mobile prop is false', () => {
    renderWithStore(RootCard, {
      props: {
        root: mockRoot,
        mobile: false,
      },
    })

    const rootText = screen.getByText('ك-ت-ب')
    expect(rootText).toHaveClass('text-2xl')
  })
})
