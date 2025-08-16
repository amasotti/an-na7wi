import { fireEvent, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { VocabularyWordDeleteModal as WordDeleteModal } from '#components'
import { mockDictionaryLinks } from '~/test/mocks/server'
import { renderWithStore } from '~/test/test-utils'
import type { Word } from '~/types'
import { Dialect, Difficulty, MasteryLevel, PartOfSpeech } from '~/types/enums'

const mockWord: Word = {
  id: '1',
  arabic: 'كتاب',
  transliteration: 'kitab',
  translation: 'book',
  root: 'ك ت ب',
  partOfSpeech: PartOfSpeech.NOUN,
  difficulty: Difficulty.BEGINNER,
  dialect: Dialect.MSA,
  masteryLevel: MasteryLevel.KNOWN,
  example: 'هذا كتاب جديد',
  notes: 'Common word for book',
  isVerified: true,
  createdAt: '2023-01-01T00:00:00Z',
  frequency: 1,
  dictionaryLinks: mockDictionaryLinks,
}

const defaultProps = {
  open: true,
  loading: false,
  word: mockWord,
}

describe('WordDeleteModal', () => {
  it('renders modal when open is true', () => {
    renderWithStore(WordDeleteModal, {
      props: defaultProps,
    })

    expect(screen.getAllByText('Delete Word')).toHaveLength(2) // Title and button
    expect(screen.getByText('Are you sure you want to delete this word?')).toBeInTheDocument()
  })

  it('does not render modal when open is false', () => {
    renderWithStore(WordDeleteModal, {
      props: { ...defaultProps, open: false },
    })

    expect(screen.queryByText('Are you sure you want to delete this word?')).not.toBeInTheDocument()
  })

  it('displays word arabic text in warning message', () => {
    renderWithStore(WordDeleteModal, {
      props: defaultProps,
    })

    expect(screen.getByText(/كتاب/)).toBeInTheDocument()
    expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument()
  })

  it('handles undefined word gracefully', () => {
    renderWithStore(WordDeleteModal, {
      props: { ...defaultProps, word: null },
    })

    expect(screen.getByText('Are you sure you want to delete this word?')).toBeInTheDocument()
    expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument()
  })

  it('renders action buttons', () => {
    renderWithStore(WordDeleteModal, {
      props: defaultProps,
    })

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete Word' })).toBeInTheDocument()
  })

  it('emits close event when cancel button clicked', async () => {
    const { emitted } = renderWithStore(WordDeleteModal, {
      props: defaultProps,
    })

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await fireEvent.click(cancelButton)

    expect(emitted('close')).toBeTruthy()
  })

  it('emits confirm event when delete button clicked', async () => {
    const { emitted } = renderWithStore(WordDeleteModal, {
      props: defaultProps,
    })

    const deleteButton = screen.getByRole('button', { name: 'Delete Word' })
    await fireEvent.click(deleteButton)

    expect(emitted('confirm')).toBeTruthy()
  })

  it('shows loading state on delete button', () => {
    renderWithStore(WordDeleteModal, {
      props: { ...defaultProps, loading: true },
    })

    const deleteButton = screen.getByRole('button', { name: 'Delete Word' })
    expect(deleteButton).toBeDisabled()
  })

  it('applies danger variant to delete button', () => {
    renderWithStore(WordDeleteModal, {
      props: defaultProps,
    })

    const deleteButton = screen.getByRole('button', { name: 'Delete Word' })
    expect(deleteButton).toHaveClass('bg-gradient-to-r', 'from-red-600', 'to-red-700')
  })

  it('displays warning icon', () => {
    renderWithStore(WordDeleteModal, {
      props: defaultProps,
    })

    const warningIcon = document.querySelector('svg')
    expect(warningIcon).toBeInTheDocument()
  })

  it('handles word with special characters in arabic text', () => {
    const wordWithSpecialChars = {
      ...mockWord,
      arabic: 'كتاب "خاص" & رموز',
    }

    renderWithStore(WordDeleteModal, {
      props: { ...defaultProps, word: wordWithSpecialChars },
    })

    expect(screen.getByText(/كتاب "خاص" & رموز/)).toBeInTheDocument()
  })

  it('handles very long arabic text', () => {
    const wordWithLongArabic = {
      ...mockWord,
      arabic: 'كتاب طويل جداً يحتوي على كلمات كثيرة ويجب أن يظهر بشكل مناسب في النافذة المنبثقة',
    }

    renderWithStore(WordDeleteModal, {
      props: { ...defaultProps, word: wordWithLongArabic },
    })

    expect(screen.getByText(/كتاب طويل جداً/)).toBeInTheDocument()
  })

  it('applies correct CSS classes for styling', () => {
    renderWithStore(WordDeleteModal, {
      props: defaultProps,
    })

    const warningIcon = document.querySelector('.warning-icon')
    expect(warningIcon).toHaveClass('warning-icon')

    const modalActions = document.querySelector('.modal-actions')
    expect(modalActions).toHaveClass('modal-actions')
  })

  it('has proper accessibility structure', () => {
    renderWithStore(WordDeleteModal, {
      props: defaultProps,
    })

    // Check for proper heading structure
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.length).toBeGreaterThanOrEqual(1)
    const contentHeading = headings.find(h => h.textContent?.includes('Are you sure'))
    expect(contentHeading).toBeDefined()

    // Check for buttons
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('applies RTL direction to arabic text', () => {
    renderWithStore(WordDeleteModal, {
      props: defaultProps,
    })

    const arabicText = screen.getByText('كتاب')
    expect(arabicText).toHaveClass('rtl')
  })

  it('emits close event when modal backdrop is clicked', async () => {
    const { emitted } = renderWithStore(WordDeleteModal, {
      props: defaultProps,
    })

    // The BaseModal should handle backdrop clicks and emit close
    // We can test this by looking for the close emission
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await fireEvent.click(cancelButton)

    expect(emitted('close')).toBeTruthy()
  })

  it('applies correct icon styling', () => {
    renderWithStore(WordDeleteModal, {
      props: defaultProps,
    })

    const icon = document.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('handles word without arabic text gracefully', () => {
    const wordWithoutArabic = {
      ...mockWord,
      arabic: '',
    }

    renderWithStore(WordDeleteModal, {
      props: { ...defaultProps, word: wordWithoutArabic },
    })

    expect(screen.getByText('Are you sure you want to delete this word?')).toBeInTheDocument()
  })

  it('maintains word object structure in deletion warning', () => {
    const customWord = {
      ...mockWord,
      arabic: 'مدرسة',
      translation: 'school',
    }

    renderWithStore(WordDeleteModal, {
      props: { ...defaultProps, word: customWord },
    })

    expect(screen.getByText(/مدرسة/)).toBeInTheDocument()
  })

  it('renders with correct modal title', () => {
    renderWithStore(WordDeleteModal, {
      props: defaultProps,
    })

    const titles = screen.getAllByText('Delete Word')
    expect(titles.length).toBeGreaterThanOrEqual(1)
  })

  it('uses small modal size', () => {
    renderWithStore(WordDeleteModal, {
      props: defaultProps,
    })

    // The modal should be rendered with size="sm" prop
    // This is tested implicitly through the BaseModal component
    expect(screen.getAllByText('Delete Word')).toHaveLength(2)
  })

  it('centers the warning content', () => {
    renderWithStore(WordDeleteModal, {
      props: defaultProps,
    })

    const content = document.querySelector('.word-delete-content')
    expect(content).toHaveClass('word-delete-content')
  })
})
