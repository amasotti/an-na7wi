import { render, screen } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTextStore } from '~/stores/textStore'
import type { WordSummary } from '~/types'
import TextWords from './TextWords.vue'

// Mock navigation
vi.mock('#app', () => ({
  navigateTo: vi.fn(),
}))

describe('TextWords', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockWords: WordSummary[] = [
    {
      id: '1',
      arabic: 'كلمة',
      transliteration: 'kalima',
      translation: 'word',
      partOfSpeech: 'NOUN',
      difficulty: 'INTERMEDIATE',
      dialect: 'MSA',
    },
    {
      id: '2',
      arabic: 'جميل',
      transliteration: 'jamil',
      translation: 'beautiful',
      partOfSpeech: 'ADJECTIVE',
      difficulty: 'BEGINNER',
      dialect: 'MSA',
    },
  ]

  it('displays word count in header', () => {
    const store = useTextStore()
    store.textWords = mockWords
    store.textWordsLoading = false

    render(TextWords)

    expect(screen.getByText('2 words')).toBeInTheDocument()
  })

  it('displays words when provided', () => {
    const store = useTextStore()
    store.textWords = mockWords
    store.textWordsLoading = false

    render(TextWords)

    expect(screen.getByText('كلمة')).toBeInTheDocument()
    expect(screen.getByText('جميل')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    const store = useTextStore()
    store.textWords = []
    store.textWordsLoading = true

    render(TextWords)

    // Check for loading animation class
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('shows empty state when no words', () => {
    const store = useTextStore()
    store.textWords = []
    store.textWordsLoading = false

    render(TextWords)

    expect(
      screen.getByText('No vocabulary words are referenced in annotations for this text.')
    ).toBeInTheDocument()
  })

  it('shows correct title and headers', () => {
    const store = useTextStore()
    store.textWords = mockWords
    store.textWordsLoading = false

    render(TextWords)

    expect(screen.getByText('Related Words')).toBeInTheDocument()
    expect(screen.getByText('Word')).toBeInTheDocument()
    expect(screen.getByText('Translation')).toBeInTheDocument()
    expect(screen.getByText('Details')).toBeInTheDocument()
  })
})
