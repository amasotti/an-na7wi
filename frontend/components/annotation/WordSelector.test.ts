import { fireEvent, screen, waitFor } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AnnotationWordSelector as WordSelector } from '#components'
import { renderWithStore } from '~/test/test-utils'
import type { WordSearchResult } from '~/types'
import { wordService } from '~/composables/wordService'

vi.mock('~/composables/wordService', () => ({
  wordService: {
    searchWords: vi.fn(),
  },
}))

const sampleWords: WordSearchResult[] = [
  { id: '1', arabic: 'كِتاب', transliteration: 'kitāb', translation: 'book' },
  { id: '2', arabic: 'بَيْت', transliteration: 'bayt', translation: 'house' },
]

describe('WordSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderComponent = (props: { modelValue: WordSearchResult[]; label?: string } = { modelValue: [] }) =>
    renderWithStore(WordSelector, { props })

  it('renders the default label', () => {
    renderComponent()
    expect(screen.getByText('Linked Words (optional)')).toBeInTheDocument()
  })

  it('renders custom label when provided', () => {
    renderComponent({ modelValue: [], label: 'Custom Label' })
    expect(screen.getByText('Custom Label')).toBeInTheDocument()
  })

  it('shows search results after typing 3+ characters', async () => {
    const mockSearchWords = vi.mocked(wordService.searchWords)
    mockSearchWords.mockResolvedValue(sampleWords)
    renderComponent()

    const input = screen.getByRole('searchbox')
    await fireEvent.focus(input)
    await fireEvent.update(input, 'kit')
    
    await waitFor(() => {
      expect(mockSearchWords).toHaveBeenCalledWith('kit')
    }, { timeout: 1000 })

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    }, { timeout: 1000 })
    expect(screen.getAllByRole('option')).toHaveLength(2)
  })

  it('emits update:modelValue when a word is selected', async () => {
    const mockSearchWords = vi.mocked(wordService.searchWords)
    mockSearchWords.mockResolvedValue(sampleWords)
    const { emitted } = renderComponent()

    const input = screen.getByRole('searchbox')
    await fireEvent.focus(input)
    await fireEvent.update(input, 'kit')

    await waitFor(() => {
      expect(screen.getByText('كِتاب')).toBeInTheDocument()
    }, { timeout: 1000 })

    const button = screen.getByText('كِتاب').closest('button')
    if (button) {
      await fireEvent.click(button)
    }

    const emittedUpdateValue = emitted()['update:modelValue'] as unknown as WordSearchResult[][]

    expect(emittedUpdateValue).toBeTruthy()
    expect(emittedUpdateValue[0]![0]).toEqual([sampleWords[0]])
  })

  it('renders selected words correctly', () => {
    renderComponent({ modelValue: [sampleWords[0]!] })

    expect(screen.getByText('كِتاب')).toBeInTheDocument()
    expect(screen.getByText('kitāb')).toBeInTheDocument()
    expect(screen.getByText('Linked Words (1)')).toBeInTheDocument()
  })

  it('removes a word when clicking remove button', async () => {
    const { emitted } = renderComponent({ modelValue: [sampleWords[0]!] })

    const removeBtn = screen.getByLabelText('Remove linked word')
    await fireEvent.click(removeBtn)

    const emittedUpdateValue = emitted()['update:modelValue'] as unknown as WordSearchResult[][]

    expect(emittedUpdateValue).toBeTruthy()
    expect(emittedUpdateValue[0]![0]).toEqual([])
  })

  it('does not search when query is less than 3 characters', async () => {
    const mockSearchWords = vi.mocked(wordService.searchWords)
    renderComponent()

    const input = screen.getByRole('searchbox')
    await fireEvent.update(input, 'ki')

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
    expect(mockSearchWords).not.toHaveBeenCalled()
  })

  it('calls search service with debounce delay', async () => {
    const mockSearchWords = vi.mocked(wordService.searchWords)
    mockSearchWords.mockResolvedValue(sampleWords)
    renderComponent()

    const input = screen.getByRole('searchbox')
    await fireEvent.update(input, 'kit')

    expect(mockSearchWords).not.toHaveBeenCalled()
    
    await waitFor(() => {
      expect(mockSearchWords).toHaveBeenCalledWith('kit')
    }, { timeout: 1000 })
  })

  it('filters out already selected words from search results', async () => {
    const mockSearchWords = vi.mocked(wordService.searchWords)
    mockSearchWords.mockResolvedValue(sampleWords)
    renderComponent({ modelValue: [sampleWords[0]!] })

    const input = screen.getByRole('searchbox')
    await fireEvent.focus(input)
    await fireEvent.update(input, 'kit')

    await waitFor(() => {
      expect(mockSearchWords).toHaveBeenCalledWith('kit')
    }, { timeout: 1000 })
    
    await waitFor(() => {
      expect(screen.queryByText('بَيْت')).toBeInTheDocument()
    }, { timeout: 1000 })
    
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(1)
  })

  it('handles search errors gracefully', async () => {
    const mockSearchWords = vi.mocked(wordService.searchWords)
    mockSearchWords.mockRejectedValue(new Error('Search failed'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    renderComponent()

    const input = screen.getByRole('searchbox')
    await fireEvent.update(input, 'test')

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to search words:', expect.any(Error))
    })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('clears search when input is empty', async () => {
    const mockSearchWords = vi.mocked(wordService.searchWords)
    mockSearchWords.mockResolvedValue(sampleWords)
    renderComponent()

    const input = screen.getByRole('searchbox')
    await fireEvent.update(input, 'test')
    await fireEvent.update(input, '')

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('shows correct count of selected words', () => {
    renderComponent({ modelValue: [...sampleWords] })
    expect(screen.getByText('Linked Words (2)')).toBeInTheDocument()
  })

  it('does not show selected words section when no words selected', () => {
    renderComponent({ modelValue: [] })
    expect(screen.queryByText('Linked Words (0)')).not.toBeInTheDocument()
  })
})
