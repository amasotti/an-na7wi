import { fireEvent, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { TextDeleteModal } from '#components'
import { renderWithStore } from '~/test/test-utils'
import type { Text } from '~/types'
import { Dialect, Difficulty } from '~/types/enums'

const mockText: Text = {
  id: '1',
  title: 'Test Arabic Text',
  arabicContent: 'هذا نص تجريبي',
  translation: 'This is a test text',
  transliteration: 'hatha nass tajribi',
  dialect: Dialect.MSA,
  difficulty: Difficulty.BEGINNER,
  tags: ['test'],
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  wordCount: 3,
}

const defaultProps = {
  open: true,
  loading: false,
  text: mockText,
}

describe('TextDeleteModal', () => {
  it('renders modal when open is true', () => {
    renderWithStore(TextDeleteModal, {
      props: defaultProps,
    })

    expect(screen.getByRole('heading', { name: 'Delete Text' })).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to delete this text?')).toBeInTheDocument()
  })

  it('does not render modal when open is false', () => {
    renderWithStore(TextDeleteModal, {
      props: { ...defaultProps, open: false },
    })

    expect(screen.queryByRole('heading', { name: 'Delete Text' })).not.toBeInTheDocument()
  })

  it('displays text title in warning message', () => {
    renderWithStore(TextDeleteModal, {
      props: defaultProps,
    })

    expect(screen.getByText(/Test Arabic Text/)).toBeInTheDocument()
    expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument()
  })

  it('handles undefined text gracefully', () => {
    renderWithStore(TextDeleteModal, {
      props: { ...defaultProps, text: null },
    })

    expect(screen.getByText('Are you sure you want to delete this text?')).toBeInTheDocument()
    expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument()
  })

  it('displays warning about what will be deleted', () => {
    renderWithStore(TextDeleteModal, {
      props: defaultProps,
    })

    expect(screen.getByText('This will also delete:')).toBeInTheDocument()
    expect(screen.getByText('All text versions and history')).toBeInTheDocument()
    expect(screen.getByText('Associated annotations')).toBeInTheDocument()
    expect(screen.getByText('Text-word relationships')).toBeInTheDocument()
  })

  it('renders action buttons', () => {
    renderWithStore(TextDeleteModal, {
      props: defaultProps,
    })

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('emits close event when cancel button clicked', async () => {
    const { emitted } = renderWithStore(TextDeleteModal, {
      props: defaultProps,
    })

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await fireEvent.click(cancelButton)

    expect(emitted('close')).toBeTruthy()
  })

  it('emits confirm event when delete button clicked', async () => {
    const { emitted } = renderWithStore(TextDeleteModal, {
      props: defaultProps,
    })

    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    await fireEvent.click(deleteButton)

    expect(emitted('confirm')).toBeTruthy()
  })

  it('shows loading state on delete button', () => {
    renderWithStore(TextDeleteModal, {
      props: { ...defaultProps, loading: true },
    })

    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    expect(deleteButton).toBeDisabled()
  })

  it('applies danger variant to delete button', () => {
    renderWithStore(TextDeleteModal, {
      props: defaultProps,
    })

    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    expect(deleteButton).toBeInTheDocument()
  })

  it('displays warning icon', () => {
    renderWithStore(TextDeleteModal, {
      props: defaultProps,
    })

    const warningIcon = document.querySelector('svg')
    expect(warningIcon).toBeInTheDocument()
  })

  it('handles text with special characters in title', () => {
    const textWithSpecialChars = {
      ...mockText,
      title: 'Test "Special" Characters & Symbols',
    }

    renderWithStore(TextDeleteModal, {
      props: { ...defaultProps, text: textWithSpecialChars },
    })

    expect(screen.getByText(/Test "Special" Characters & Symbols/)).toBeInTheDocument()
  })

  it('handles very long text title', () => {
    const textWithLongTitle = {
      ...mockText,
      title:
        'This is a very long text title that should still display correctly in the delete confirmation modal without breaking the layout',
    }

    renderWithStore(TextDeleteModal, {
      props: { ...defaultProps, text: textWithLongTitle },
    })

    expect(screen.getByText(/This is a very long text title/)).toBeInTheDocument()
  })

  it('applies correct CSS classes for styling', () => {
    renderWithStore(TextDeleteModal, {
      props: defaultProps,
    })

    const warningSection = screen.getByText('This will also delete:').closest('div')
    expect(warningSection).toHaveClass('text-sm', 'text-gray-500', 'bg-gray-50')
  })

  it('has proper accessibility structure', () => {
    renderWithStore(TextDeleteModal, {
      props: defaultProps,
    })

    // Check for proper heading structure
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings).toHaveLength(2)
    expect(headings[0]).toHaveTextContent('Delete Text')
    expect(headings[1]).toHaveTextContent('Are you sure you want to delete this text?')

    // Check for list structure
    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()

    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(3)
  })
})
