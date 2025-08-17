import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import type { Annotation } from '@/types'
import { AnnotationType, MasteryLevel } from '@/types'

// Mock the text selection utility
vi.mock('@/utils/textSelection', () => ({
  getTextSelection: vi.fn(),
  clearSelection: vi.fn(),
}))

const { getTextSelection } = await import('@/utils/textSelection')

// Mock Vue lifecycle hooks to avoid warnings in tests
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    onMounted: vi.fn(fn => fn()),
    onUnmounted: vi.fn(),
  }
})

// Mock DOM
Object.defineProperty(document, 'addEventListener', {
  value: vi.fn(),
  writable: true,
})

Object.defineProperty(document, 'removeEventListener', {
  value: vi.fn(),
  writable: true,
})

Object.defineProperty(document, 'querySelectorAll', {
  value: vi.fn(),
  writable: true,
})

describe('useAnnotationInteraction', () => {
  const mockAnnotations = ref<Annotation[]>([
    {
      id: '1',
      textId: 'text-1',
      anchorText: 'نص',
      content: 'This means text',
      type: AnnotationType.VOCABULARY,
      masteryLevel: MasteryLevel.KNOWN,
      needsReview: false,
      createdAt: '2023-01-01T00:00:00Z',
      linkedWords: [],
    },
  ])

  const mockSectionRefs = {
    arabic: ref<HTMLElement | null>(document.createElement('div')),
    transliteration: ref<HTMLElement | null>(document.createElement('div')),
    translation: ref<HTMLElement | null>(document.createElement('div')),
  }

  const mockEmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getTextSelection).mockReturnValue(null)
  })

  describe('core functionality', () => {
    it('exports the correct interface', async () => {
      const { useAnnotationInteraction } = await import('./useAnnotationInteraction')
      const composable = useAnnotationInteraction(mockAnnotations, mockSectionRefs, mockEmit)

      expect(composable).toHaveProperty('selectedText')
      expect(composable).toHaveProperty('selectedSection')
      expect(composable).toHaveProperty('handleTextSelection')
      expect(composable).toHaveProperty('createAnnotationFromSelection')
    })
  })

  describe('handleTextSelection', () => {
    it('emits textSelected when valid selection is made', async () => {
      const { useAnnotationInteraction } = await import('./useAnnotationInteraction')
      const { handleTextSelection } = useAnnotationInteraction(
        mockAnnotations,
        mockSectionRefs,
        mockEmit
      )

      const mockSelectionInfo = {
        text: 'selected text',
        section: 'arabic' as const,
        position: { x: 100, y: 200 },
      }

      vi.mocked(getTextSelection).mockReturnValue(mockSelectionInfo)

      const mockEvent = new MouseEvent('mouseup')
      handleTextSelection(mockEvent)

      expect(mockEmit).toHaveBeenCalledWith('textSelected', {
        selectedText: 'selected text',
        position: { x: 100, y: 200 },
      })
    })

    it('emits selectionCleared when no valid selection', async () => {
      const { useAnnotationInteraction } = await import('./useAnnotationInteraction')
      const { handleTextSelection } = useAnnotationInteraction(
        mockAnnotations,
        mockSectionRefs,
        mockEmit
      )

      vi.mocked(getTextSelection).mockReturnValue(null)

      const mockEvent = new MouseEvent('mouseup')
      handleTextSelection(mockEvent)

      expect(mockEmit).toHaveBeenCalledWith('selectionCleared')
    })
  })

  describe('createAnnotationFromSelection', () => {
    it('returns selection data when text is selected', async () => {
      const { useAnnotationInteraction } = await import('./useAnnotationInteraction')
      const { selectedText, selectedSection, createAnnotationFromSelection } =
        useAnnotationInteraction(mockAnnotations, mockSectionRefs, mockEmit)

      // Simulate selection
      selectedText.value = 'test text'
      selectedSection.value = 'arabic'

      const result = createAnnotationFromSelection()

      expect(result).toEqual({
        selectedText: 'test text',
        selectedSection: 'arabic',
      })
    })

    it('returns null when no text is selected', async () => {
      const { useAnnotationInteraction } = await import('./useAnnotationInteraction')
      const { createAnnotationFromSelection } = useAnnotationInteraction(
        mockAnnotations,
        mockSectionRefs,
        mockEmit
      )

      const result = createAnnotationFromSelection()

      expect(result).toBeNull()
    })
  })

  describe('annotation click listeners', () => {
    it('sets up click listeners for annotation highlights', async () => {
      const mockHighlight = document.createElement('span')
      mockHighlight.dataset.annotationId = '1'
      mockHighlight.addEventListener = vi.fn()

      vi.mocked(document.querySelectorAll).mockReturnValue([mockHighlight] as any)

      const { useAnnotationInteraction } = await import('./useAnnotationInteraction')
      useAnnotationInteraction(mockAnnotations, mockSectionRefs, mockEmit)

      // Wait for setTimeout to complete
      await new Promise(resolve => setTimeout(resolve, 150))

      expect(mockHighlight.addEventListener).toHaveBeenCalledWith('click', expect.any(Function))
    })
  })

  describe('lifecycle management', () => {
    it('sets up event listener on initialization', async () => {
      const { useAnnotationInteraction } = await import('./useAnnotationInteraction')
      useAnnotationInteraction(mockAnnotations, mockSectionRefs, mockEmit)

      expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function))
    })
  })

  describe('utility integration', () => {
    it('calls getTextSelection with correct parameters', async () => {
      const { useAnnotationInteraction } = await import('./useAnnotationInteraction')
      const { handleTextSelection } = useAnnotationInteraction(
        mockAnnotations,
        mockSectionRefs,
        mockEmit
      )

      const mockEvent = new MouseEvent('mouseup')
      handleTextSelection(mockEvent)

      expect(getTextSelection).toHaveBeenCalledWith(mockEvent, {
        arabic: mockSectionRefs.arabic.value,
        transliteration: mockSectionRefs.transliteration.value,
        translation: mockSectionRefs.translation.value,
      })
    })
  })
})
