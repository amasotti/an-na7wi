import { screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { exampleService } from '~/composables/exampleService'
import { mockDictionaryLinks } from '~/test/mocks/server'
import { renderWithStore } from '~/test/test-utils'
import type { ExampleGenerationResponse, Word } from '~/types'
import { Dialect, Difficulty, MasteryLevel, PartOfSpeech } from '~/types/enums'
import { VocabularyWordForm as WordForm } from '#components'
import {mockedExample} from "~/test/mocks/examples.mock";

// Mock the services
vi.mock('~/composables/rootService', () => ({
  rootService: {
    normalizeRoot: vi.fn((root: string) =>
      Promise.resolve({
        valid: true,
        displayForm: root,
        searchForm: root,
      })
    ),
  },
}))

vi.mock('~/composables/wordService', () => ({
  wordService: {
    findByRoot: vi.fn(() =>
      Promise.resolve({
        items: [],
        page: 1,
        pageSize: 5,
        totalCount: 0,
      })
    ),
  },
}))

// Mock the example service
vi.mock('~/composables/exampleService', () => ({
  exampleService: {
    generateExamples: vi.fn(),
  },
}))

const mockWord: Word = {
  id: '1',
  arabic: 'كتاب',
  transliteration: 'kitab',
  translation: 'book',
  root: 'ك ت ب',
  partOfSpeech: PartOfSpeech.NOUN,
  difficulty: Difficulty.BEGINNER,
  dialect: Dialect.MSA,
  masteryLevel: MasteryLevel.NEW,
  example: 'هذا كتاب جديد',
  notes: 'Common word for book',
  isVerified: true,
  createdAt: new Date().toISOString(),
  frequency: 1,
  dictionaryLinks: mockDictionaryLinks,
}

const defaultProps = {
  open: true,
  loading: false,
  word: null,
}

describe('WordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('has proper accessibility structure', () => {
    renderWithStore(WordForm, { props: defaultProps })

    // Check for proper form structure
    expect(screen.getByRole('form')).toBeInTheDocument()

    // Check for section headings
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.length).toBeGreaterThanOrEqual(6) // At least 6 sections

    // Check for proper aria labels
    expect(screen.getByLabelText('Word form')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Form actions' })).toBeInTheDocument()
  })

  it('renders in create mode when no word provided', () => {
    renderWithStore(WordForm, { props: defaultProps })

    expect(screen.getByText('Add New Word')).toBeInTheDocument()
    expect(screen.getByText('Add Word')).toBeInTheDocument()
  })

  it('renders in edit mode when word provided', () => {
    renderWithStore(WordForm, {
      props: { ...defaultProps, word: mockWord },
    })

    expect(screen.getByText('Edit Word')).toBeInTheDocument()
    expect(screen.getByText('Update Word')).toBeInTheDocument()
  })

  it('shows required field indicators', () => {
    renderWithStore(WordForm, { props: defaultProps })

    expect(screen.getByText('Arabic Word')).toBeInTheDocument()
    expect(screen.getByText('Translation/Definition')).toBeInTheDocument()
    // Check for required select fields - look for the specific label text
    expect(screen.getByText('Dialect')).toBeInTheDocument()
  })

  it('renders form fields and sections', () => {
    renderWithStore(WordForm, { props: defaultProps })

    // Check for section headings
    expect(screen.getByText('Primary Information')).toBeInTheDocument()
    expect(screen.getByText('Example Usage')).toBeInTheDocument()
    expect(screen.getByText('Classification')).toBeInTheDocument()
    expect(screen.getByText('Resources & Links')).toBeInTheDocument()
    expect(screen.getByText('Additional Notes')).toBeInTheDocument()

    // Check for form labels (text content)
    expect(screen.getByText('Arabic Word')).toBeInTheDocument()
    expect(screen.getByText('Translation/Definition')).toBeInTheDocument()
    expect(screen.getByText('Transliteration')).toBeInTheDocument()

    // Check for input elements
    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toBeGreaterThan(0)
  })

  it('populates fields when editing', () => {
    renderWithStore(WordForm, {
      props: { ...defaultProps, word: mockWord },
    })

    expect(screen.getByDisplayValue('كتاب')).toBeInTheDocument()
    expect(screen.getByDisplayValue('kitab')).toBeInTheDocument()
    expect(screen.getByDisplayValue('book')).toBeInTheDocument()
    expect(screen.getByDisplayValue('هذا كتاب جديد')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Common word for book')).toBeInTheDocument()
  })

  describe('Example Generation', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('shows generate examples button when arabic text is present', () => {
      renderWithStore(WordForm, {
        props: { ...defaultProps, word: mockWord },
      })

      expect(screen.getByText('Generate Examples')).toBeInTheDocument()
    })

    it('hides generate examples button when arabic text is empty', () => {
      const emptyWord = { ...mockWord, arabic: '' }
      renderWithStore(WordForm, {
        props: { ...defaultProps, word: emptyWord },
      })

      expect(screen.queryByText('Generate Examples')).not.toBeInTheDocument()
    })

    it('calls example service with arabic word and part of speech context', async () => {
      const mockResponse: ExampleGenerationResponse = {
        examples: [
          mockedExample,
        ],
      }
      const mockedGenerateExamples = vi.mocked(exampleService.generateExamples)
      mockedGenerateExamples.mockResolvedValue(mockResponse)

      renderWithStore(WordForm, {
        props: { ...defaultProps, word: mockWord },
      })

      const generateButton = screen.getByText('Generate Examples')
      await generateButton.click()

      expect(mockedGenerateExamples).toHaveBeenCalledWith({
        arabic: 'كتاب',
        context: PartOfSpeech.NOUN,
      })
    })

    it('uses undefined context when part of speech is unknown', async () => {
      const wordWithUnknownPos = { ...mockWord, partOfSpeech: PartOfSpeech.UNKNOWN }
      const mockResponse: ExampleGenerationResponse = {
        examples: [
          {
            arabic: 'هذا كتاب',
            transliteration: 'hatha kitab',
            english: 'This is a book',
          },
        ],
      }
      const mockedGenerateExamples = vi.mocked(exampleService.generateExamples)
      mockedGenerateExamples.mockResolvedValue(mockResponse)

      renderWithStore(WordForm, {
        props: { ...defaultProps, word: wordWithUnknownPos },
      })

      const generateButton = screen.getByText('Generate Examples')
      await generateButton.click()

      expect(mockedGenerateExamples).toHaveBeenCalledWith({
        arabic: 'كتاب',
        context: undefined,
      })
    })

    it('displays generated examples with click instructions', async () => {
      const mockResponse: ExampleGenerationResponse = {
        examples: [
          {
            arabic: 'هذا كتاب مفيد',
            transliteration: 'hatha kitab mufid',
            english: 'This is a useful book',
          },
          {
            arabic: 'أقرأ الكتاب',
            transliteration: 'aqra al-kitab',
            english: 'I read the book',
          },
        ],
      }
      const mockedGenerateExamples = vi.mocked(exampleService.generateExamples)
      mockedGenerateExamples.mockResolvedValue(mockResponse)

      renderWithStore(WordForm, {
        props: { ...defaultProps, word: mockWord },
      })

      const generateButton = screen.getByText('Generate Examples')
      await generateButton.click()

      // Wait for examples to be displayed
      await vi.waitFor(() => {
        expect(screen.getByText('Generated Examples')).toBeInTheDocument()
        expect(screen.getByText('هذا كتاب مفيد')).toBeInTheDocument()
        expect(screen.getByText('This is a useful book')).toBeInTheDocument()
        expect(screen.getByText('أقرأ الكتاب')).toBeInTheDocument()
        expect(screen.getByText('I read the book')).toBeInTheDocument()
        expect(
          screen.getByText('Click on an example to add it to the example field')
        ).toBeInTheDocument()
      })
    })

    it('handles example generation errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockedGenerateExamples = vi.mocked(exampleService.generateExamples)
      mockedGenerateExamples.mockRejectedValue(new Error('API Error'))

      renderWithStore(WordForm, {
        props: { ...defaultProps, word: mockWord },
      })

      const generateButton = screen.getByText('Generate Examples')
      await generateButton.click()

      expect(consoleSpy).toHaveBeenCalledWith('Failed to generate examples:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })
})
