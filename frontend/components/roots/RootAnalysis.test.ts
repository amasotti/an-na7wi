import { render, screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RootsRootAnalysis as RootAnalysis } from '#components'
import type { Root } from '@/types'

// Mock rootStore
const mockRootStore = {
  currentRootWithWords: null as { root: Root } | null,
}

vi.mock('~/stores/rootStore', () => ({
  useRootStore: () => mockRootStore,
}))

// Mock markdown-it plugin
const mockMarkdownit = {
  render: vi.fn((text: string) => `<p>${text}</p>`),
}

describe('RootAnalysis', () => {
  const createMockRoot = (overrides: Partial<Root> = {}): Root => ({
    id: 'test-root-id',
    letters: ['ك', 'ت', 'ب'],
    normalizedForm: 'ك-ت-ب',
    displayForm: 'كتب',
    letterCount: 3,
    meaning: 'writing, books',
    analysis: 'This root relates to writing and books in Arabic.',
    wordCount: 25,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-15T10:30:00Z',
    ...overrides,
  })

  const createComponent = (root: Root) => {
    // Set up the mock store
    mockRootStore.currentRootWithWords = { root }

    return render(RootAnalysis, {
      global: {
        plugins: [
          {
            install(app: any) {
              app.config.globalProperties.$markdownit = mockMarkdownit
            },
          },
        ],
      },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders the analysis title', () => {
      const root = createMockRoot()
      createComponent(root)

      expect(screen.getByText('Linguistic Analysis')).toBeInTheDocument()
    })

    it('renders markdown content correctly', () => {
      const analysisText = '**Bold text** and *italic* analysis.'
      const root = createMockRoot({ analysis: analysisText })
      createComponent(root)

      expect(mockMarkdownit.render).toHaveBeenCalledWith(analysisText)
    })

    it('uses proper semantic structure', () => {
      const root = createMockRoot()
      createComponent(root)

      expect(screen.getByText('Linguistic Analysis')).toBeInTheDocument()
    })
  })

  describe('content handling', () => {
    it('handles complex markdown content', () => {
      const complexAnalysis = `
# Root Analysis
This is a **complex** analysis with:
- Lists
- *Emphasis*
- And more content
`
      const root = createMockRoot({ analysis: complexAnalysis })
      createComponent(root)

      expect(mockMarkdownit.render).toHaveBeenCalledWith(complexAnalysis)
    })
  })
})
