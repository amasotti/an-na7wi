import { fireEvent, screen, waitFor } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithStore } from '~/test/test-utils'
import type { Text } from '~/types'
import { Dialect, Difficulty } from '~/types/enums'
import { TextModal } from '#components'

// Mock text service
vi.mock('~/composables/textService', () => ({
  textService: {
    transliterateText: vi.fn(),
  },
}))

const defaultProps = {
  open: true,
  loading: false,
  text: null,
}

const mockText: Text = {
  id: '1',
  title: 'Test Text',
  arabicContent: 'هذا نص تجريبي',
  transliteration: 'hatha nass tajribi',
  translation: 'This is test text',
  comments: 'Test comment',
  tags: ['test', 'grammar'],
  difficulty: Difficulty.BEGINNER,
  dialect: Dialect.MSA,
  wordCount: 3,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('TextModal', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { textService } = await import('~/composables/textService')
    vi.mocked(textService.transliterateText).mockResolvedValue({
      transliteratedText: 'hatha nass',
      originalText: 'هذا نص',
    })
  })

  describe('Create mode', () => {
    it('renders create modal when open is true and no text provided', () => {
      renderWithStore(TextModal, {
        props: defaultProps,
      })

      expect(screen.getByText('Create New Text')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter a descriptive title...')).toBeInTheDocument()
      expect(screen.getByText('Arabic Content')).toBeInTheDocument()
      expect(screen.getByText('Create Text')).toBeInTheDocument()
    })

    it('disables submit button when form is invalid in create mode', () => {
      renderWithStore(TextModal, {
        props: defaultProps,
      })

      const submitButton = screen.getByRole('button', { name: 'Create new text' })
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Edit mode', () => {
    it('renders edit modal when text is provided', () => {
      renderWithStore(TextModal, {
        props: { ...defaultProps, text: mockText },
      })

      expect(screen.getByText('Edit Text')).toBeInTheDocument()
      expect(screen.getByText('Save Changes')).toBeInTheDocument()
    })

    it('populates form fields with text data in edit mode', () => {
      renderWithStore(TextModal, {
        props: { ...defaultProps, text: mockText },
      })

      expect(screen.getByDisplayValue('Test Text')).toBeInTheDocument()
      expect(screen.getByDisplayValue('هذا نص تجريبي')).toBeInTheDocument()
      expect(screen.getByDisplayValue('hatha nass tajribi')).toBeInTheDocument()
      expect(screen.getByDisplayValue('This is test text')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test comment')).toBeInTheDocument()
    })

    it('displays tags in edit mode', () => {
      renderWithStore(TextModal, {
        props: { ...defaultProps, text: mockText },
      })

      expect(screen.getByText('test')).toBeInTheDocument()
      expect(screen.getByText('grammar')).toBeInTheDocument()
    })
  })

  describe('Common functionality', () => {
    it('does not render modal when open is false', () => {
      renderWithStore(TextModal, {
        props: { ...defaultProps, open: false },
      })

      expect(screen.queryByText('Create New Text')).not.toBeInTheDocument()
      expect(screen.queryByText('Edit Text')).not.toBeInTheDocument()
    })

    it('renders all form sections', () => {
      renderWithStore(TextModal, {
        props: defaultProps,
      })

      expect(screen.getByText('Basic Information')).toBeInTheDocument()
      expect(screen.getByText('Arabic Content')).toBeInTheDocument()
      expect(screen.getByText('Language Support')).toBeInTheDocument()
      expect(screen.getByText('Categories & Tags')).toBeInTheDocument()
      expect(screen.getByText('Additional Notes')).toBeInTheDocument()
    })

    it('renders all form fields', () => {
      renderWithStore(TextModal, {
        props: defaultProps,
      })

      expect(screen.getByPlaceholderText('Enter a descriptive title...')).toBeInTheDocument()
      expect(screen.getByText('Difficulty Level')).toBeInTheDocument()
      expect(screen.getByText('Dialect')).toBeInTheDocument()
      expect(screen.getByText('Arabic Text')).toBeInTheDocument()
      expect(screen.getByText('Transliteration')).toBeInTheDocument()
      expect(screen.getByText('Translation')).toBeInTheDocument()
      expect(screen.getByText('Tags')).toBeInTheDocument()
      expect(screen.getByText('Comments & Notes')).toBeInTheDocument()
    })

    it('shows difficulty and dialect selectors', () => {
      renderWithStore(TextModal, {
        props: defaultProps,
      })

      expect(screen.getByText('Select difficulty')).toBeInTheDocument()
      expect(screen.getByText('Select dialect')).toBeInTheDocument()
    })

    it('renders action buttons', () => {
      renderWithStore(TextModal, {
        props: defaultProps,
      })

      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Create new text' })).toBeInTheDocument()
    })

    it('emits close event when cancel button clicked', async () => {
      const { emitted } = renderWithStore(TextModal, {
        props: defaultProps,
      })

      const cancelButton = screen.getByText('Cancel')
      await fireEvent.click(cancelButton)

      expect(emitted('close')).toBeTruthy()
    })

    it('handles text input correctly', async () => {
      renderWithStore(TextModal, {
        props: defaultProps,
      })

      const titleInput = screen.getByPlaceholderText('Enter a descriptive title...')
      await fireEvent.update(titleInput, 'Test Arabic Text')
      expect(titleInput).toHaveValue('Test Arabic Text')

      const arabicInput = screen.getByPlaceholderText('أدخل النص العربي هنا...')
      await fireEvent.update(arabicInput, 'هذا نص عربي')
      expect(arabicInput).toHaveValue('هذا نص عربي')

      const transliterationInput = screen.getByPlaceholderText('Enter romanized pronunciation...')
      await fireEvent.update(transliterationInput, 'hatha nass arabi')
      expect(transliterationInput).toHaveValue('hatha nass arabi')

      const translationInput = screen.getByPlaceholderText('Enter English translation...')
      await fireEvent.update(translationInput, 'This is Arabic text')
      expect(translationInput).toHaveValue('This is Arabic text')

      const commentsInput = screen.getByPlaceholderText(
        'Add contextual notes, cultural insights, teaching tips, or other comments...'
      )
      await fireEvent.update(commentsInput, 'Test comment')
      expect(commentsInput).toHaveValue('Test comment')
    })

    it('handles tag input with enter key', async () => {
      renderWithStore(TextModal, {
        props: defaultProps,
      })

      const tagInput = screen.getByPlaceholderText('Add tags (comma separated)...')
      await fireEvent.update(tagInput, 'grammar')
      await fireEvent.keyDown(tagInput, { key: 'Enter' })

      expect(screen.getByText('grammar')).toBeInTheDocument()
      expect(tagInput).toHaveValue('')
    })

    it('handles tag input with comma key', async () => {
      renderWithStore(TextModal, {
        props: defaultProps,
      })

      const tagInput = screen.getByPlaceholderText('Add tags (comma separated)...')
      await fireEvent.update(tagInput, 'vocabulary')
      await fireEvent.keyDown(tagInput, { key: ',' })

      expect(tagInput).toBeInTheDocument()
    })

    it('handles tag input with blur event', async () => {
      renderWithStore(TextModal, {
        props: defaultProps,
      })

      const tagInput = screen.getByPlaceholderText('Add tags (comma separated)...')
      await fireEvent.update(tagInput, 'culture')
      await fireEvent.blur(tagInput)

      expect(tagInput).toHaveValue('')
    })

    it('handles multiple tags input', async () => {
      renderWithStore(TextModal, {
        props: defaultProps,
      })

      const tagInput = screen.getByPlaceholderText('Add tags (comma separated)...')
      await fireEvent.update(tagInput, 'grammar, vocabulary, culture')
      await fireEvent.keyDown(tagInput, { key: 'Enter' })

      expect(tagInput).toHaveValue('')
    })

    it('shows auto-transliterate button when arabic content exists', async () => {
      renderWithStore(TextModal, {
        props: defaultProps,
      })

      const arabicInput = screen.getByPlaceholderText('أدخل النص العربي هنا...')
      await fireEvent.update(arabicInput, 'هذا نص')

      expect(screen.getByText('Auto-generate')).toBeInTheDocument()
    })

    it('does not show auto-transliterate button when arabic content is empty', () => {
      renderWithStore(TextModal, {
        props: defaultProps,
      })

      expect(screen.queryByText('Auto-generate')).not.toBeInTheDocument()
    })

    it('handles auto-transliteration', async () => {
      renderWithStore(TextModal, {
        props: defaultProps,
      })

      const arabicInput = screen.getByPlaceholderText('أدخل النص العربي هنا...')
      await fireEvent.update(arabicInput, 'هذا نص')

      const transliterateButton = screen.getByText('Auto-generate')
      await fireEvent.click(transliterateButton)

      const { textService } = await import('~/composables/textService')
      expect(textService.transliterateText).toHaveBeenCalledWith('هذا نص')

      await waitFor(() => {
        const transliterationInput = screen.getByPlaceholderText('Enter romanized pronunciation...')
        expect(transliterationInput).toHaveValue('hatha nass')
      })
    })

    it('handles transliteration error gracefully', async () => {
      const { textService } = await import('~/composables/textService')
      vi.mocked(textService.transliterateText).mockRejectedValue(new Error('API Error'))

      renderWithStore(TextModal, {
        props: defaultProps,
      })

      const arabicInput = screen.getByPlaceholderText('أدخل النص العربي هنا...')
      await fireEvent.update(arabicInput, 'هذا نص')

      const transliterateButton = screen.getByText('Auto-generate')
      await fireEvent.click(transliterateButton)

      expect(textService.transliterateText).toHaveBeenCalledWith('هذا نص')

      await waitFor(() => {
        expect(transliterateButton).not.toBeDisabled()
      })
    })

    it('shows loading state on submit button', () => {
      renderWithStore(TextModal, {
        props: { ...defaultProps, loading: true },
      })

      const submitButton = screen.getByRole('button', { name: 'Create new text' })
      expect(submitButton).toBeDisabled()
    })

    it('resets form when modal is closed and reopened', async () => {
      const { rerender } = renderWithStore(TextModal, {
        props: defaultProps,
      })

      // Fill in some data
      const titleInput = screen.getByPlaceholderText('Enter a descriptive title...')
      await fireEvent.update(titleInput, 'Test Title')

      // Close modal
      await rerender({ ...defaultProps, open: false })

      // Reopen modal
      await rerender({ ...defaultProps, open: true })

      // Form should be reset
      const newTitleInput = screen.getByPlaceholderText('Enter a descriptive title...')
      expect(newTitleInput).toHaveValue('')
    })
  })
})
