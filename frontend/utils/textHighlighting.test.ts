import { describe, expect, it } from 'vitest'
import type { Annotation } from '@/types'
import { AnnotationType, MasteryLevel } from '@/types'
import { escapeHtml, getAnnotationColor, highlightAnnotations } from './textHighlighting'

describe('textHighlighting', () => {
  describe('escapeHtml', () => {
    it('escapes HTML entities', () => {
      const input = '<div>Test & "quotes" & \'apostrophes\'</div>'
      const expected =
        '&lt;div&gt;Test &amp; &quot;quotes&quot; &amp; &#x27;apostrophes&#x27;&lt;/div&gt;'
      expect(escapeHtml(input)).toBe(expected)
    })

    it('returns empty string for empty input', () => {
      expect(escapeHtml('')).toBe('')
    })
  })

  describe('getAnnotationColor', () => {
    it('returns custom color when provided', () => {
      expect(getAnnotationColor(AnnotationType.VOCABULARY, '#ff0000')).toBe('#ff0000')
    })

    it('returns correct color for GRAMMAR type', () => {
      expect(getAnnotationColor(AnnotationType.GRAMMAR)).toBe('#3b82f6')
    })

    it('returns correct color for VOCABULARY type', () => {
      expect(getAnnotationColor(AnnotationType.VOCABULARY)).toBe('#10b981')
    })

    it('returns correct color for CULTURAL type', () => {
      expect(getAnnotationColor(AnnotationType.CULTURAL)).toBe('#f59e0b')
    })

    it('returns default color for unknown type', () => {
      expect(getAnnotationColor('UNKNOWN' as AnnotationType)).toBe('#6b7280')
    })
  })

  describe('highlightAnnotations', () => {
    const mockAnnotation: Annotation = {
      id: '1',
      textId: 'text-1',
      anchorText: 'نص',
      content: 'This means "text"',
      type: AnnotationType.VOCABULARY,
      masteryLevel: MasteryLevel.KNOWN,
      needsReview: false,
      createdAt: '2023-01-01T00:00:00Z',
      linkedWords: [],
    }

    it('returns original text when no annotations', () => {
      const text = 'This is a test text'
      expect(highlightAnnotations(text, [])).toBe(text)
    })

    it('returns original text when text is empty', () => {
      expect(highlightAnnotations('', [mockAnnotation])).toBe('')
    })

    it('highlights single annotation correctly', () => {
      const text = 'هذا نص تجريبي'
      const result = highlightAnnotations(text, [mockAnnotation])

      expect(result).toContain('<span class="annotation-highlight"')
      expect(result).toContain('data-annotation-id="1"')
      expect(result).toContain('نص')
      expect(result).toContain('#10b981') // VOCABULARY color
      expect(result).toContain('This means &quot;text&quot;') // Escaped content
    })

    it('does not highlight when anchor text is not found', () => {
      const text = 'هذا كلام تجريبي'
      const result = highlightAnnotations(text, [mockAnnotation])
      expect(result).toBe(text)
    })

    it('handles multiple annotations correctly', () => {
      const text = 'هذا نص تجريبي'
      const annotation2: Annotation = {
        ...mockAnnotation,
        id: '2',
        anchorText: 'هذا',
        content: 'This means "this"',
        type: AnnotationType.GRAMMAR,
      }

      const result = highlightAnnotations(text, [mockAnnotation, annotation2])

      expect(result).toContain('data-annotation-id="1"')
      expect(result).toContain('data-annotation-id="2"')
      expect(result).toContain('#10b981') // VOCABULARY color
      expect(result).toContain('#3b82f6') // GRAMMAR color
    })

    it('sorts annotations by position and length', () => {
      const text = 'نص نص طويل'
      const shortAnnotation: Annotation = {
        ...mockAnnotation,
        id: '1',
        anchorText: 'نص',
        content: 'Short word',
      }
      const longAnnotation: Annotation = {
        ...mockAnnotation,
        id: '2',
        anchorText: 'نص طويل',
        content: 'Long phrase',
      }

      // Pass annotations in reverse order to test sorting
      const result = highlightAnnotations(text, [shortAnnotation, longAnnotation])

      // Should highlight the first occurrence with the longer annotation
      const firstHighlight = result.indexOf('data-annotation-id=')
      const firstId = result.substring(firstHighlight + 20, firstHighlight + 21)
      expect(firstId).toBe('1') // First "نص" gets highlighted first

      // Second occurrence should be highlighted with the longer annotation
      const secondHighlight = result.indexOf('data-annotation-id=', firstHighlight + 1)
      const secondId = result.substring(secondHighlight + 20, secondHighlight + 21)
      expect(secondId).toBe('2') // "نص طويل" phrase
    })
  })
})
