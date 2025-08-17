/**
 * Text selection utilities for handling user text selections
 */

export interface SelectionInfo {
  text: string
  position: { x: number; y: number }
  section: 'arabic' | 'transliteration' | 'translation' | null
}

/**
 * Gets the current text selection and its position
 */
export const getTextSelection = (
  event: MouseEvent,
  sectionRefs: {
    arabic?: HTMLElement | null
    transliteration?: HTMLElement | null
    translation?: HTMLElement | null
  }
): SelectionInfo | null => {
  const selection = window.getSelection()

  if (!selection || selection.isCollapsed) {
    return null
  }

  const selectedText = selection.toString().trim()
  if (!selectedText) return null

  // Determine which section was selected
  const target = event.target as HTMLElement
  let section: 'arabic' | 'transliteration' | 'translation' | null = null

  if (sectionRefs.arabic?.contains(target)) {
    section = 'arabic'
  } else if (sectionRefs.transliteration?.contains(target)) {
    section = 'transliteration'
  } else if (sectionRefs.translation?.contains(target)) {
    section = 'translation'
  }

  if (!section) return null

  // Get position for toolbar
  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()

  return {
    text: selectedText,
    position: {
      x: rect.left + rect.width / 2,
      y: rect.top,
    },
    section,
  }
}

/**
 * Clears the current text selection
 */
export const clearSelection = () => {
  window.getSelection()?.removeAllRanges()
}
