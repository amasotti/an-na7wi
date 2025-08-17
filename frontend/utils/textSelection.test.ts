import { beforeEach, describe, expect, it, vi } from 'vitest'
import { clearSelection, getTextSelection } from './textSelection'

// Mock DOM APIs
const mockSelection = {
  isCollapsed: false,
  toString: vi.fn(),
  getRangeAt: vi.fn(),
  removeAllRanges: vi.fn(),
}

const mockRange = {
  getBoundingClientRect: vi.fn(),
}

describe('textSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'getSelection', {
      writable: true,
      value: vi.fn(() => mockSelection),
    })
  })

  describe('getTextSelection', () => {
    const mockEvent = {
      target: document.createElement('div'),
    } as unknown as MouseEvent

    const mockSectionRefs = {
      arabic: document.createElement('div'),
      transliteration: document.createElement('div'),
      translation: document.createElement('div'),
    }

    beforeEach(() => {
      mockSelection.isCollapsed = false
      mockSelection.toString.mockReturnValue('selected text')
      mockSelection.getRangeAt.mockReturnValue(mockRange)
      mockRange.getBoundingClientRect.mockReturnValue({
        left: 100,
        top: 200,
        width: 80,
        height: 20,
      })
    })

    it('returns null when selection is collapsed', () => {
      mockSelection.isCollapsed = true

      const result = getTextSelection(mockEvent, mockSectionRefs)

      expect(result).toBeNull()
    })

    it('returns null when no selection exists', () => {
      vi.mocked(window.getSelection).mockReturnValue(null)

      const result = getTextSelection(mockEvent, mockSectionRefs)

      expect(result).toBeNull()
    })

    it('returns null when selected text is empty', () => {
      mockSelection.toString.mockReturnValue('   ')

      const result = getTextSelection(mockEvent, mockSectionRefs)

      expect(result).toBeNull()
    })

    it('identifies arabic section correctly', () => {
      mockSectionRefs.arabic.appendChild(mockEvent.target as Node)

      const result = getTextSelection(mockEvent, mockSectionRefs)

      expect(result).toEqual({
        text: 'selected text',
        section: 'arabic',
        position: { x: 140, y: 200 }, // left + width/2
      })
    })

    it('identifies transliteration section correctly', () => {
      mockSectionRefs.transliteration.appendChild(mockEvent.target as Node)

      const result = getTextSelection(mockEvent, mockSectionRefs)

      expect(result).toEqual({
        text: 'selected text',
        section: 'transliteration',
        position: { x: 140, y: 200 },
      })
    })

    it('identifies translation section correctly', () => {
      mockSectionRefs.translation.appendChild(mockEvent.target as Node)

      const result = getTextSelection(mockEvent, mockSectionRefs)

      expect(result).toEqual({
        text: 'selected text',
        section: 'translation',
        position: { x: 140, y: 200 },
      })
    })

    it('returns null when target is not in any section', () => {
      // Create a separate element that's not in any section
      const outsideElement = document.createElement('span')
      const outsideEvent = {
        target: outsideElement,
      } as unknown as MouseEvent

      const result = getTextSelection(outsideEvent, mockSectionRefs)

      expect(result).toBeNull()
    })

    it('trims whitespace from selected text', () => {
      mockSelection.toString.mockReturnValue('  selected text  ')
      mockSectionRefs.arabic.appendChild(mockEvent.target as Node)

      const result = getTextSelection(mockEvent, mockSectionRefs)

      expect(result?.text).toBe('selected text')
    })

    it('handles missing section refs gracefully', () => {
      const incompleteSectionRefs = {
        arabic: mockSectionRefs.arabic,
        transliteration: null,
        translation: undefined,
      }

      mockSectionRefs.arabic.appendChild(mockEvent.target as Node)

      const result = getTextSelection(mockEvent, incompleteSectionRefs)

      expect(result?.section).toBe('arabic')
    })
  })

  describe('clearSelection', () => {
    it('calls removeAllRanges on selection', () => {
      clearSelection()

      expect(window.getSelection).toHaveBeenCalled()
      expect(mockSelection.removeAllRanges).toHaveBeenCalled()
    })

    it('handles null selection gracefully', () => {
      vi.mocked(window.getSelection).mockReturnValue(null)

      expect(() => clearSelection()).not.toThrow()
    })
  })
})
