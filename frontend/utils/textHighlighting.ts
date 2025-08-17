import type { Annotation, AnnotationType } from '@/types'

/**
 * Escapes HTML entities for safe use in HTML attributes
 */
export const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Gets the highlight color for an annotation type
 */
export const getAnnotationColor = (type: AnnotationType, customColor?: string): string => {
  if (customColor) return customColor

  switch (type) {
    case 'GRAMMAR':
      return '#3b82f6' // blue
    case 'VOCABULARY':
      return '#10b981' // green
    case 'CULTURAL':
      return '#f59e0b' // amber
    default:
      return '#6b7280' // gray
  }
}

/**
 * Highlights annotations in text by wrapping them in spans
 */
export const highlightAnnotations = (text: string, annotations: Annotation[]): string => {
  if (!text || !annotations.length) return text

  // Sort annotations by position in text (earliest first) and then by length (longest first)
  const sortedAnnotations = [...annotations]
    .filter(annotation => text.includes(annotation.anchorText))
    .sort((a, b) => {
      const indexA = text.indexOf(a.anchorText)
      const indexB = text.indexOf(b.anchorText)
      if (indexA !== indexB) return indexA - indexB
      return b.anchorText.length - a.anchorText.length
    })

  if (!sortedAnnotations.length) return text

  let result = ''
  let currentIndex = 0

  for (const annotation of sortedAnnotations) {
    const { anchorText, id, type, color, content } = annotation
    const anchorIndex = text.indexOf(anchorText, currentIndex)

    // Skip if anchor text is not found or already processed
    if (anchorIndex < currentIndex) continue

    // Add text before the annotation
    result += text.substring(currentIndex, anchorIndex)

    // Get highlight color
    const highlightColor = getAnnotationColor(type, color)

    // Escape HTML entities in content for title attribute
    const escapedContent = escapeHtml(content)

    // Create highlighted span
    const highlightedSpan = `<span class="annotation-highlight cursor-pointer" style="text-decoration: underline; text-decoration-color: ${highlightColor}; text-decoration-thickness: 2px; position: relative;" data-annotation-id="${id}" title="${escapedContent}">${anchorText}</span>`

    result += highlightedSpan
    currentIndex = anchorIndex + anchorText.length
  }

  // Add remaining text
  result += text.substring(currentIndex)

  return result
}
