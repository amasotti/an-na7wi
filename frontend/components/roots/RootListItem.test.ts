import { fireEvent, screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithStore } from '~/test/test-utils'
import type { Root } from '~/types'
import { RootsRootListItem as RootListItem } from '#components'

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

describe('RootListItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders root information correctly', () => {
    renderWithStore(RootListItem, {
      props: { root: mockRoot },
    })

    expect(screen.getByText('ك-ت-ب')).toBeInTheDocument()
    expect(screen.getByText('related to writing')).toBeInTheDocument()
    expect(screen.getByText('3 letters')).toBeInTheDocument()
    expect(screen.getByText('5 words')).toBeInTheDocument()
  })

  it('renders root letters individually', () => {
    renderWithStore(RootListItem, {
      props: { root: mockRoot },
    })

    expect(screen.getByText('ك')).toBeInTheDocument()
    expect(screen.getByText('ت')).toBeInTheDocument()
    expect(screen.getByText('ب')).toBeInTheDocument()
  })

  it('handles root without meaning', () => {
    renderWithStore(RootListItem, {
      props: { root: mockRootWithoutMeaning },
    })

    expect(screen.getByText('ك-ت-ب')).toBeInTheDocument()
    expect(screen.queryByText('related to writing')).not.toBeInTheDocument()
  })

  it('emits click event when item is clicked', async () => {
    const { emitted } = renderWithStore(RootListItem, {
      props: { root: mockRoot },
    })

    const item = screen.getByText('ك-ت-ب').closest('div')
    await fireEvent.click(item!)

    expect(emitted('click')).toBeTruthy()
  })

  it('shows delete button when showDeleteButton is true and wordCount is 0', () => {
    renderWithStore(RootListItem, {
      props: {
        root: mockEmptyRoot,
        showDeleteButton: true,
      },
    })

    const deleteButton = screen.getByTitle('Delete root')
    expect(deleteButton).toBeInTheDocument()
  })

  it('hides delete button when wordCount > 0', () => {
    renderWithStore(RootListItem, {
      props: {
        root: mockRoot,
        showDeleteButton: true,
      },
    })

    expect(screen.queryByTitle('Delete root')).not.toBeInTheDocument()
  })

  it('hides delete button when showDeleteButton is false', () => {
    renderWithStore(RootListItem, {
      props: {
        root: mockEmptyRoot,
        showDeleteButton: false,
      },
    })

    expect(screen.queryByTitle('Delete root')).not.toBeInTheDocument()
  })

  it('emits delete event when delete button is clicked', async () => {
    const { emitted } = renderWithStore(RootListItem, {
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
    const { emitted } = renderWithStore(RootListItem, {
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

  it('shows hover indicator on mouse enter', () => {
    renderWithStore(RootListItem, {
      props: { root: mockRoot },
    })

    const container = screen.getByText('ك-ت-ب').closest('div[class*="hover:bg-gray-50"]')
    expect(container).toHaveClass('hover:bg-gray-50')
  })

  it('displays different letter counts correctly', () => {
    const quadriliteralRoot: Root = {
      ...mockRoot,
      letters: ['ف', 'ع', 'ل', 'ن'],
      letterCount: 4,
      displayForm: 'ف-ع-ل-ن',
    }

    renderWithStore(RootListItem, {
      props: { root: quadriliteralRoot },
    })

    expect(screen.getByText('4 letters')).toBeInTheDocument()
    expect(screen.getByText('ف')).toBeInTheDocument()
    expect(screen.getByText('ع')).toBeInTheDocument()
    expect(screen.getByText('ل')).toBeInTheDocument()
    expect(screen.getByText('ن')).toBeInTheDocument()
  })

  it('handles zero word count correctly', () => {
    renderWithStore(RootListItem, {
      props: { root: mockEmptyRoot },
    })

    expect(screen.getByText('0 words')).toBeInTheDocument()
  })

  it('handles large word count correctly', () => {
    const rootWithManyWords: Root = {
      ...mockRoot,
      wordCount: 100,
    }

    renderWithStore(RootListItem, {
      props: { root: rootWithManyWords },
    })

    expect(screen.getByText('100 words')).toBeInTheDocument()
  })
})
