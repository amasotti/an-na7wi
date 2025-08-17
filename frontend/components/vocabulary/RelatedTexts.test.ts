import { render, screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { VocabularyRelatedTexts as RelatedTexts } from '#components'
import { mockWord } from '~/test/mocks/server'
import { mockTextReferences } from '~/test/mocks/texts.mock'
import type { TextReference, Word } from '~/types'
import { Difficulty } from '~/types/enums'

// Mock utilities
vi.mock('~/utils/dateUtils', () => ({
  formatDate: vi.fn((dateString: string) => {
    if (dateString === '2024-01-15T10:30:00Z') return 'Jan 15, 2024'
    if (dateString === '2024-01-20T14:15:00Z') return 'Jan 20, 2024'
    if (dateString === '2024-02-01T09:00:00Z') return 'Feb 1, 2024'
    return dateString
  }),
}))

vi.mock('#app', () => ({
  navigateTo: vi.fn(),
}))

// Reactive refs for test state
const mockCurrentWord = ref<Word | null>(null)
const mockLoading = ref(false)
const mockLinkedTexts = ref<TextReference[]>([])
const mockGetLinkedTexts = vi.fn()

// Mock store
vi.mock('~/stores/wordStore', () => ({
  useWordStore: () => ({
    currentWord: mockCurrentWord,
    loading: mockLoading,
    linkedTextsToCurrentWord: mockLinkedTexts,
    getLinkedTexts: mockGetLinkedTexts,
  }),
}))

describe('RelatedTexts', () => {
  const createMockText = (overrides: Partial<TextReference> = {}): TextReference => ({
    ...mockTextReferences[0]!,
    ...overrides,
  })

  const renderComponent = async (texts: TextReference[] = [], loading = false) => {
    mockLinkedTexts.value = texts
    mockLoading.value = loading
    mockCurrentWord.value = mockWord

    const wrapper = render(RelatedTexts, {
      global: {
        stubs: {
          LoadingEffect: {
            template: '<div data-testid="loading">Loading...</div>',
          },
          BaseIcon: {
            template: '<span data-testid="icon"><slot /></span>',
          },
          BaseEmptyState: {
            template: '<div data-testid="empty-state">No related texts found</div>',
            props: ['link', 'link-text', 'message'],
          },
        },
      },
    })

    await nextTick()
    return wrapper
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockCurrentWord.value = null
    mockLoading.value = false
    mockLinkedTexts.value = []
    mockGetLinkedTexts.mockResolvedValue(undefined)
  })

  it('shows loading state', async () => {
    await renderComponent([], true)
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.queryByText('Related Texts')).not.toBeInTheDocument()
  })

  it('shows empty state when no texts', async () => {
    await renderComponent([])
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('shows texts when available', async () => {
    const texts = [createMockText()]
    await renderComponent(texts)
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument()
    expect(screen.getByText('Related Texts')).toBeInTheDocument()
  })

  it('renders text content correctly', async () => {
    const text = createMockText({
      title: 'Test Arabic Text',
      difficulty: Difficulty.INTERMEDIATE,
      createdAt: '2024-01-15T10:30:00Z',
      tags: ['grammar', 'vocabulary', 'reading'],
    })

    await renderComponent([text])

    expect(screen.getByText('Related Texts')).toBeInTheDocument()
    expect(screen.getByText('Test Arabic Text')).toBeInTheDocument()
    expect(screen.getByText('INTERMEDIATE')).toBeInTheDocument()
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
    expect(screen.getByText('grammar')).toBeInTheDocument()
    expect(screen.getByText('vocabulary')).toBeInTheDocument()
    expect(screen.getByText('reading')).toBeInTheDocument()
  })

  it('handles tag overflow', async () => {
    const text = createMockText({
      tags: ['grammar', 'vocabulary', 'reading', 'culture', 'literature'],
    })

    await renderComponent([text])

    expect(screen.getByText('+2 more')).toBeInTheDocument()
    expect(screen.queryByText('culture')).not.toBeInTheDocument()
  })

  it('calls getLinkedTexts on mount', async () => {
    await renderComponent([])
    expect(mockGetLinkedTexts).toHaveBeenCalledOnce()
  })
})
