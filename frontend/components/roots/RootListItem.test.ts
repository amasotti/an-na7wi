import { fireEvent, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { RootsRootListItem as RootListItem } from '#components'
import { renderWithStore } from '~/test/test-utils'
import type { Root } from '~/types'

const mockRoot: Root = {
  id: '1',
  letters: ['ك', 'ت', 'ب'],
  normalizedForm: 'كتب',
  displayForm: 'ك ت ب',
  letterCount: 3,
  meaning: 'related to writing',
  wordCount: 15,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
}

const defaultProps = {
  root: mockRoot,
  showDeleteButton: false,
}

describe('RootListItem', () => {
  it('renders root information correctly', () => {
    renderWithStore(RootListItem, {
      props: defaultProps,
    })

    expect(screen.getByText('ك ت ب')).toBeInTheDocument()
    expect(screen.getByText('3 letters')).toBeInTheDocument()
    expect(screen.getByText('15 words')).toBeInTheDocument()
    expect(screen.getByText('related to writing')).toBeInTheDocument()
  })

  it('renders individual root letters', () => {
    renderWithStore(RootListItem, {
      props: defaultProps,
    })

    expect(screen.getByText('ك')).toBeInTheDocument()
    expect(screen.getByText('ت')).toBeInTheDocument()
    expect(screen.getByText('ب')).toBeInTheDocument()
  })

  it('does not show meaning when not provided', () => {
    const rootWithoutMeaning = { ...mockRoot, meaning: undefined }
    renderWithStore(RootListItem, {
      props: { ...defaultProps, root: rootWithoutMeaning },
    })

    expect(screen.queryByText('related to writing')).not.toBeInTheDocument()
  })

  it('emits click event when item is clicked', async () => {
    const { emitted } = renderWithStore(RootListItem, {
      props: defaultProps,
    })

    const listItem = screen.getByText('ك ت ب').closest('[class*="p-4"]')
    await fireEvent.click(listItem!)

    expect(emitted('click')).toBeTruthy()
  })

  it('shows delete button when showDeleteButton is true and wordCount is 0', () => {
    const rootWithNoWords = { ...mockRoot, wordCount: 0 }
    renderWithStore(RootListItem, {
      props: {
        root: rootWithNoWords,
        showDeleteButton: true,
      },
    })

    const deleteButton = screen.getByTitle('Delete root')
    expect(deleteButton).toBeInTheDocument()
  })

  it('does not show delete button when showDeleteButton is false', () => {
    const rootWithNoWords = { ...mockRoot, wordCount: 0 }
    renderWithStore(RootListItem, {
      props: {
        root: rootWithNoWords,
        showDeleteButton: false,
      },
    })

    expect(screen.queryByTitle('Delete root')).not.toBeInTheDocument()
  })

  it('does not show delete button when wordCount is greater than 0', () => {
    renderWithStore(RootListItem, {
      props: {
        ...defaultProps,
        showDeleteButton: true,
      },
    })

    expect(screen.queryByTitle('Delete root')).not.toBeInTheDocument()
  })

  it('emits delete event when delete button is clicked', async () => {
    const rootWithNoWords = { ...mockRoot, wordCount: 0 }
    const { emitted } = renderWithStore(RootListItem, {
      props: {
        root: rootWithNoWords,
        showDeleteButton: true,
      },
    })

    const deleteButton = screen.getByTitle('Delete root')
    await fireEvent.click(deleteButton)

    expect(emitted('delete')).toBeTruthy()
    expect(emitted('delete')[0]).toEqual(['1'])
  })

  it('stops propagation when delete button is clicked', async () => {
    const rootWithNoWords = { ...mockRoot, wordCount: 0 }
    const { emitted } = renderWithStore(RootListItem, {
      props: {
        root: rootWithNoWords,
        showDeleteButton: true,
      },
    })

    const deleteButton = screen.getByTitle('Delete root')
    await fireEvent.click(deleteButton)

    // Delete event should be emitted but click event should not
    expect(emitted('delete')).toBeTruthy()
    expect(emitted('click')).toBeFalsy()
  })

  it('applies correct CSS classes for hover effects', () => {
    renderWithStore(RootListItem, {
      props: defaultProps,
    })

    const listItem = screen.getByText('ك ت ب').closest('[class*="p-4"]')
    expect(listItem).toHaveClass('hover:bg-gray-50', 'cursor-pointer', 'transition-colors', 'group')
  })

  it('displays navigation arrow', () => {
    renderWithStore(RootListItem, {
      props: defaultProps,
    })

    const arrow = document.querySelector('svg')
    expect(arrow).toBeInTheDocument()
  })

  it('handles root with different letter counts', () => {
    const quadriliteralRoot = {
      ...mockRoot,
      letters: ['ج', 'م', 'ه', 'ر'],
      letterCount: 4,
      displayForm: 'ج م ه ر',
    }

    renderWithStore(RootListItem, {
      props: { ...defaultProps, root: quadriliteralRoot },
    })

    expect(screen.getByText('ج م ه ر')).toBeInTheDocument()
    expect(screen.getByText('4 letters')).toBeInTheDocument()
    expect(screen.getByText('ج')).toBeInTheDocument()
    expect(screen.getByText('م')).toBeInTheDocument()
    expect(screen.getByText('ه')).toBeInTheDocument()
    expect(screen.getByText('ر')).toBeInTheDocument()
  })

  it('handles root with zero words correctly', () => {
    const rootWithNoWords = { ...mockRoot, wordCount: 0 }
    renderWithStore(RootListItem, {
      props: { ...defaultProps, root: rootWithNoWords },
    })

    expect(screen.getByText('0 words')).toBeInTheDocument()
  })

  it('handles root with single word correctly', () => {
    const rootWithOneWord = { ...mockRoot, wordCount: 1 }
    renderWithStore(RootListItem, {
      props: { ...defaultProps, root: rootWithOneWord },
    })

    expect(screen.getByText('1 words')).toBeInTheDocument()
  })

  it('applies arabic class to display form', () => {
    renderWithStore(RootListItem, {
      props: defaultProps,
    })

    const displayForm = screen.getByText('ك ت ب')
    expect(displayForm).toHaveClass('arabic')
  })

  it('applies arabic class to individual letters', () => {
    renderWithStore(RootListItem, {
      props: defaultProps,
    })

    const letterElements = screen.getAllByText(/^[كتب]$/)

    for (const letter of letterElements) {
      expect(letter).toHaveClass('arabic')
    }
  })

  it('shows correct letter styling', () => {
    renderWithStore(RootListItem, {
      props: defaultProps,
    })

    const letterK = screen.getByText('ك')
    expect(letterK).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'w-6',
      'h-6',
      'bg-gray-100',
      'text-gray-700',
      'text-sm',
      'font-medium',
      'rounded',
      'arabic'
    )
  })

  it('handles very long meaning text', () => {
    const rootWithLongMeaning = {
      ...mockRoot,
      meaning:
        'This is a very long meaning text that describes the semantic field of this Arabic root in great detail with many descriptive words',
    }

    renderWithStore(RootListItem, {
      props: { ...defaultProps, root: rootWithLongMeaning },
    })

    expect(screen.getByText(/This is a very long meaning text/)).toBeInTheDocument()
  })

  it('handles special characters in meaning', () => {
    const rootWithSpecialMeaning = {
      ...mockRoot,
      meaning: 'meaning with "quotes" & symbols',
    }

    renderWithStore(RootListItem, {
      props: { ...defaultProps, root: rootWithSpecialMeaning },
    })

    expect(screen.getByText('meaning with "quotes" & symbols')).toBeInTheDocument()
  })

  it('maintains consistent layout structure', () => {
    renderWithStore(RootListItem, {
      props: defaultProps,
    })

    // Check main layout structure - get the root container
    const container = screen.getByText('ك ت ب').closest('[class*="p-4"]')
    expect(container).toHaveClass('p-4')

    // Check flex layout
    const flexContainer = container?.querySelector('.flex.items-center.justify-between')
    expect(flexContainer).toBeInTheDocument()
  })
})
