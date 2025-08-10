import type { Root } from '@/types'
import { fireEvent, render, screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RootsRootDetailHeader as RootDetailHeader } from '#components'

// Mock dependencies
vi.mock('~/utils/dateUtils', () => ({
  formatDate: vi.fn((dateString: string) => {
    if (dateString === '2024-01-01T00:00:00Z') return 'January 1, 2024'
    if (dateString === '2024-02-15T10:30:00Z') return 'February 15, 2024'
    return 'January 1, 2024'
  }),
}))

// Mock rootStore
const mockRootStore = {
  currentRootWithWords: null as { root: Root } | null,
}

vi.mock('~/stores/rootStore', () => ({
  useRootStore: () => mockRootStore,
}))

describe('RootDetailHeader', () => {
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

    return render(RootDetailHeader, {
      global: {
        stubs: {
          BaseButton: {
            template: '<button><slot /></button>',
            props: ['variant', 'size'],
          },
          BaseBadge: {
            template: '<span><slot /></span>',
            props: ['variant', 'size'],
          },
          BaseIcon: {
            template: '<svg><slot /></svg>',
            props: ['size'],
          },
        },
      },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders root display form as main title', () => {
      const root = createMockRoot()
      createComponent(root)

      const mainTitle = screen.getByRole('heading', { level: 1 })
      expect(mainTitle).toHaveTextContent('كتب')
    })

    it('renders root meaning when provided', () => {
      const root = createMockRoot({ meaning: 'writing and literature' })
      createComponent(root)

      expect(screen.getByText('writing and literature')).toBeInTheDocument()
    })

    it('does not render meaning section when not provided', () => {
      const root = createMockRoot({ meaning: undefined })
      createComponent(root)

      expect(screen.queryByText('writing, books')).not.toBeInTheDocument()
    })

    it('renders action buttons', () => {
      const root = createMockRoot()
      createComponent(root)

      expect(screen.getByText('Add Word')).toBeInTheDocument()
      expect(screen.getByText('Edit')).toBeInTheDocument()
    })
  })

  describe('root letters display', () => {
    it('renders individual letters correctly', () => {
      const root = createMockRoot({ letters: ['ف', 'ع', 'ل'] })
      createComponent(root)

      expect(screen.getByText('ف')).toBeInTheDocument()
      expect(screen.getByText('ع')).toBeInTheDocument()
      expect(screen.getByText('ل')).toBeInTheDocument()
    })

    it('handles different numbers of letters', () => {
      const bilateralRoot = createMockRoot({
        letters: ['ف', 'ي'],
        letterCount: 2,
        displayForm: 'في',
      })
      createComponent(bilateralRoot)

      expect(screen.getByText('ف')).toBeInTheDocument()
      expect(screen.getByText('ي')).toBeInTheDocument()
      expect(screen.queryByText('ع')).not.toBeInTheDocument()
    })
  })

  describe('root statistics', () => {
    it('displays letter count correctly', () => {
      const root = createMockRoot({ letterCount: 4 })
      createComponent(root)

      expect(screen.getByText('4')).toBeInTheDocument()
      expect(screen.getByText('Letters')).toBeInTheDocument()
    })

    it('displays word count correctly', () => {
      const root = createMockRoot({ wordCount: 42 })
      createComponent(root)

      expect(screen.getByText('42')).toBeInTheDocument()
      expect(screen.getByText('Words')).toBeInTheDocument()
    })

    it('displays normalized form correctly', () => {
      const root = createMockRoot({ normalizedForm: 'ف-ع-ل' })
      createComponent(root)

      expect(screen.getByText('Normalized')).toBeInTheDocument()
      expect(screen.getByText('ف-ع-ل')).toBeInTheDocument()
    })
  })

  describe('root type computation', () => {
    it('displays "Bilateral" for 2-letter roots', () => {
      const root = createMockRoot({ letterCount: 2 })
      createComponent(root)

      expect(screen.getByText('Bilateral')).toBeInTheDocument()
      expect(screen.getByText('Root Type')).toBeInTheDocument()
    })

    it('displays "Trilateral" for 3-letter roots', () => {
      const root = createMockRoot({ letterCount: 3 })
      createComponent(root)

      expect(screen.getByText('Trilateral')).toBeInTheDocument()
    })

    it('displays "Quadrilateral" for 4-letter roots', () => {
      const root = createMockRoot({ letterCount: 4 })
      createComponent(root)

      expect(screen.getByText('Quadrilateral')).toBeInTheDocument()
    })

    it('displays "Quinqueliteral" for 5-letter roots', () => {
      const root = createMockRoot({ letterCount: 5 })
      createComponent(root)

      expect(screen.getByText('Quinqueliteral')).toBeInTheDocument()
    })

    it('displays generic format for unusual letter counts', () => {
      const root = createMockRoot({ letterCount: 6 })
      createComponent(root)

      expect(screen.getByText('6-Letter')).toBeInTheDocument()
    })
  })

  describe('metadata display', () => {
    it('displays formatted creation date', () => {
      const root = createMockRoot()
      createComponent(root)

      expect(screen.getByText('Added')).toBeInTheDocument()
      expect(screen.getByText('January 1, 2024')).toBeInTheDocument()
    })
  })

  describe('event handling', () => {
    it('emits add-word event when Add Word button is clicked', async () => {
      const root = createMockRoot()
      const { emitted } = createComponent(root)

      const addWordButton = screen.getByText('Add Word').closest('button')
      await fireEvent.click(addWordButton!)

      expect(emitted()['add-word']).toBeTruthy()
      expect(emitted()['add-word']!.length).toBeGreaterThan(0)
    })

    it('emits edit event when Edit button is clicked', async () => {
      const root = createMockRoot()
      const { emitted } = createComponent(root)

      const editButton = screen.getByText('Edit').closest('button')
      await fireEvent.click(editButton!)

      expect(emitted().edit).toBeTruthy()
      expect(emitted().edit!.length).toBeGreaterThan(0)
    })
  })

  describe('accessibility and semantic structure', () => {
    it('uses proper heading hierarchy', () => {
      const root = createMockRoot()
      createComponent(root)

      const mainTitle = screen.getByRole('heading', { level: 1 })
      expect(mainTitle).toBeInTheDocument()
      expect(mainTitle).toHaveTextContent('كتب')
    })

    it('provides meaningful button text with icons', () => {
      const root = createMockRoot()
      createComponent(root)

      const addWordButton = screen.getByText('Add Word')
      const editButton = screen.getByText('Edit')

      expect(addWordButton).toBeInTheDocument()
      expect(editButton).toBeInTheDocument()
    })

    it('uses semantic HTML structure', () => {
      const root = createMockRoot()
      createComponent(root)

      const container = document.querySelector('.root-hero')
      expect(container).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('handles empty letters array gracefully', () => {
      const root = createMockRoot({ letters: [], letterCount: 0 })
      createComponent(root)

      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.getByText('0-Letter')).toBeInTheDocument()
    })

    it('handles very long meaning text', () => {
      const longMeaning =
        'This is an extremely long meaning that might wrap to multiple lines and should still be displayed correctly in the component without breaking the layout'
      const root = createMockRoot({ meaning: longMeaning })
      createComponent(root)

      expect(screen.getByText(longMeaning)).toBeInTheDocument()
    })

    it('handles special characters in display form', () => {
      const root = createMockRoot({
        displayForm: 'استخدم',
        normalizedForm: 'ا-س-ت-خ-د-م',
      })
      createComponent(root)

      const mainTitle = screen.getByRole('heading', { level: 1 })
      expect(mainTitle).toHaveTextContent('استخدم')

      expect(screen.getByText('Normalized')).toBeInTheDocument()
      expect(screen.getByText('ا-س-ت-خ-د-م')).toBeInTheDocument()
    })

    it('handles zero word count', () => {
      const root = createMockRoot({ wordCount: 0 })
      createComponent(root)

      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.getByText('Words')).toBeInTheDocument()
    })
  })

  describe('visual styling', () => {
    it('applies Arabic text styling to appropriate elements', () => {
      const root = createMockRoot()
      createComponent(root)

      const arabicElements = document.querySelectorAll('.arabic')
      expect(arabicElements.length).toBeGreaterThan(1) // Title and letters
    })
  })
})
