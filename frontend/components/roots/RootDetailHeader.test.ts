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

// Mock markdown-it plugin
const mockMarkdownit = {
  render: vi.fn((text: string) => `<p>${text}</p>`),
}

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

  const createComponent = (root: Root, props = {}) => {
    return render(RootDetailHeader, {
      props: { root, ...props },
      global: {
        stubs: {
          BaseButton: {
            template: '<button v-bind="$attrs"><slot /></button>',
            props: ['variant', 'size'],
          },
        },
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
    it('renders root display form as main title', () => {
      const root = createMockRoot()
      createComponent(root)

      const mainTitle = screen.getByRole('heading', { level: 1 })
      expect(mainTitle).toHaveTextContent('كتب')
      expect(mainTitle).toHaveClass('text-5xl', 'font-bold', 'arabic')
    })

    it('renders root meaning when provided', () => {
      const root = createMockRoot({ meaning: 'writing and literature' })
      createComponent(root)

      expect(screen.getByText('writing and literature')).toBeInTheDocument()
      expect(screen.getByText('writing and literature')).toHaveClass('text-xl', 'text-gray-700')
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

    it('applies correct styling to letter boxes', () => {
      const root = createMockRoot()
      createComponent(root)

      const letterElements = screen.getAllByText(/^[كتب]$/)
      letterElements.forEach(element => {
        expect(element).toHaveClass('w-12', 'h-12', 'arabic', 'text-xl', 'font-bold')
      })
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
      const normalizedElements = screen.getAllByText('ف-ع-ل')
      expect(normalizedElements.length).toBeGreaterThan(0)
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

  describe('root information section', () => {
    it('displays display form in info section', () => {
      const root = createMockRoot({ displayForm: 'درس' })
      createComponent(root)

      expect(screen.getByText('Display Form:')).toBeInTheDocument()
      const displayFormElements = screen.getAllByText('درس')
      expect(displayFormElements.length).toBeGreaterThan(0) // Appears in main title and info
    })

    it('displays normalized form in info section', () => {
      const root = createMockRoot({ normalizedForm: 'د-ر-س' })
      createComponent(root)

      expect(screen.getByText('Normalized:')).toBeInTheDocument()
      const normalizedElements = screen.getAllByText('د-ر-س')
      expect(normalizedElements.length).toBeGreaterThan(0) // Appears in stats and info sections
    })

    it('displays formatted creation date', () => {
      const root = createMockRoot()
      createComponent(root)

      expect(screen.getByText('Added:')).toBeInTheDocument()
      expect(screen.getByText('January 1, 2024')).toBeInTheDocument()
    })

    it('displays formatted update date', () => {
      const root = createMockRoot()
      createComponent(root)

      expect(screen.getByText('Updated:')).toBeInTheDocument()
      expect(screen.getByText('February 15, 2024')).toBeInTheDocument()
    })
  })

  describe('linguistic analysis section', () => {
    it('renders analysis when provided', () => {
      const root = createMockRoot({
        analysis: 'This is a detailed linguistic analysis of the root.',
      })
      createComponent(root)

      expect(screen.getByText('Linguistic Analysis')).toBeInTheDocument()
      expect(mockMarkdownit.render).toHaveBeenCalledWith(
        'This is a detailed linguistic analysis of the root.'
      )
    })

    it('does not render analysis section when not provided', () => {
      const root = createMockRoot({ analysis: undefined })
      createComponent(root)

      expect(screen.queryByText('Linguistic Analysis')).not.toBeInTheDocument()
    })

    it('applies proper styling to analysis section', () => {
      const root = createMockRoot({ analysis: 'Some analysis' })
      createComponent(root)

      const analysisSection = screen.getByText('Linguistic Analysis').closest('div')
      expect(analysisSection).toHaveClass('bg-blue-50', 'border-blue-200')
    })

    it('renders markdown analysis correctly', () => {
      const analysisText = '**Bold text** and *italic* analysis.'
      const root = createMockRoot({ analysis: analysisText })
      createComponent(root)

      expect(mockMarkdownit.render).toHaveBeenCalledWith(analysisText)
    })
  })

  describe('event handling', () => {
    it('emits add-word event when Add Word button is clicked', async () => {
      const root = createMockRoot()
      const { emitted } = createComponent(root)

      const addWordButton = screen.getByText('Add Word').closest('button')
      await fireEvent.click(addWordButton!)

      expect(emitted()['add-word']).toBeTruthy()
      expect(emitted()['add-word'].length).toBeGreaterThan(0)
    })

    it('emits edit event when Edit button is clicked', async () => {
      const root = createMockRoot()
      const { emitted } = createComponent(root)

      const editButton = screen.getByText('Edit').closest('button')
      await fireEvent.click(editButton!)

      expect(emitted().edit).toBeTruthy()
      expect(emitted().edit.length).toBeGreaterThan(0)
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

      const container = document.querySelector('.container-header')
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
      const normalizedElements = screen.getAllByText('ا-س-ت-خ-د-م')
      expect(normalizedElements.length).toBeGreaterThan(0)
    })

    it('handles zero word count', () => {
      const root = createMockRoot({ wordCount: 0 })
      createComponent(root)

      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.getByText('Words')).toBeInTheDocument()
    })

    it('handles missing analysis gracefully', () => {
      const root = createMockRoot({ analysis: '' })
      createComponent(root)

      expect(screen.queryByText('Linguistic Analysis')).not.toBeInTheDocument()
    })
  })

  describe('responsive layout', () => {
    it('applies responsive grid classes for statistics', () => {
      const root = createMockRoot()
      createComponent(root)

      const statsGrid = document.querySelector('.grid.grid-cols-2.md\\:grid-cols-4')
      expect(statsGrid).toBeInTheDocument()
    })

    it('applies responsive grid classes for info section', () => {
      const root = createMockRoot()
      createComponent(root)

      const infoGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2')
      expect(infoGrid).toBeInTheDocument()
    })

    it('centers content appropriately', () => {
      const root = createMockRoot()
      createComponent(root)

      const centerContainer = document.querySelector('.text-center.space-y-6')
      expect(centerContainer).toBeInTheDocument()
    })
  })

  describe('visual styling', () => {
    it('applies Arabic text styling to appropriate elements', () => {
      const root = createMockRoot()
      createComponent(root)

      const arabicElements = document.querySelectorAll('.arabic')
      expect(arabicElements.length).toBeGreaterThan(2) // Title, letters, info sections
    })

    it('applies proper color coding to statistics', () => {
      const root = createMockRoot()
      createComponent(root)

      // Check that different stats have different color classes
      const letterCount = screen.getByText(root.letterCount.toString()).closest('div')
      const wordCount = screen.getByText(root.wordCount.toString()).closest('div')

      expect(letterCount).toHaveClass('text-primary-600')
      expect(wordCount).toHaveClass('text-green-600')
    })

    it('applies gradient styling to letter boxes', () => {
      const root = createMockRoot()
      createComponent(root)

      const letterBoxes = document.querySelectorAll(
        '.bg-gradient-to-br.from-primary-100.to-blue-100'
      )
      expect(letterBoxes.length).toBe(root.letters.length)
    })
  })
})
