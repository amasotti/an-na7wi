import { screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { TextContent } from '#components'
import { renderWithStore } from '~/test/test-utils'
import type { Text } from '~/types'
import { Dialect, Difficulty } from '~/types/enums'

const mockText: Text = {
  id: '1',
  title: 'Test Arabic Text',
  arabicContent: 'هذا نص تجريبي',
  translation: 'This is a test text',
  transliteration: 'hatha nass tajribi',
  dialect: Dialect.MSA,
  difficulty: Difficulty.BEGINNER,
  tags: ['test'],
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  wordCount: 3,
}

describe('TextContent', () => {
  it('renders all text sections when all content is provided', () => {
    renderWithStore(TextContent, {
      props: { displayText: mockText },
    })

    expect(screen.getByText('Arabic Text')).toBeInTheDocument()
    expect(screen.getByText('هذا نص تجريبي')).toBeInTheDocument()
    expect(screen.getByText('Transliteration')).toBeInTheDocument()
    expect(screen.getByText('hatha nass tajribi')).toBeInTheDocument()
    expect(screen.getByText('Translation')).toBeInTheDocument()
    expect(screen.getByText('This is a test text')).toBeInTheDocument()
  })

  it('shows "No content" when arabicContent is empty', () => {
    const emptyText = { ...mockText, arabicContent: '' }
    renderWithStore(TextContent, {
      props: { displayText: emptyText },
    })

    expect(screen.getByText('No content')).toBeInTheDocument()
  })

  it('shows "No content" when displayText is null', () => {
    renderWithStore(TextContent, {
      props: { displayText: null },
    })

    expect(screen.getByText('No content')).toBeInTheDocument()
  })

  it('does not render transliteration section when transliteration is empty', () => {
    const textWithoutTransliteration = { ...mockText, transliteration: '' }
    renderWithStore(TextContent, {
      props: { displayText: textWithoutTransliteration },
    })

    expect(screen.queryByText('Transliteration')).not.toBeInTheDocument()
    expect(screen.getByText('Arabic Text')).toBeInTheDocument()
    expect(screen.getByText('Translation')).toBeInTheDocument()
  })

  it('does not render transliteration section when transliteration is undefined', () => {
    // biome-ignore lint/suspicious/noExplicitAny: mock data may not have this field
    const textWithoutTransliteration = { ...mockText, transliteration: undefined as any }
    renderWithStore(TextContent, {
      props: { displayText: textWithoutTransliteration },
    })

    expect(screen.queryByText('Transliteration')).not.toBeInTheDocument()
  })

  it('does not render translation section when translation is empty', () => {
    const textWithoutTranslation = { ...mockText, translation: '' }
    renderWithStore(TextContent, {
      props: { displayText: textWithoutTranslation },
    })

    expect(screen.queryByText('Translation')).not.toBeInTheDocument()
    expect(screen.getByText('Arabic Text')).toBeInTheDocument()
    expect(screen.getByText('Transliteration')).toBeInTheDocument()
  })

  it('does not render translation section when translation is undefined', () => {
    // biome-ignore lint/suspicious/noExplicitAny: mock data may not have this field
    const textWithoutTranslation = { ...mockText, translation: undefined as any }
    renderWithStore(TextContent, {
      props: { displayText: textWithoutTranslation },
    })

    expect(screen.queryByText('Translation')).not.toBeInTheDocument()
  })

  it('renders only arabic content when other fields are missing', () => {
    const minimalText = {
      ...mockText,
      transliteration: '',
      translation: '',
    }
    renderWithStore(TextContent, {
      props: { displayText: minimalText },
    })

    expect(screen.getByText('Arabic Text')).toBeInTheDocument()
    expect(screen.getByText('هذا نص تجريبي')).toBeInTheDocument()
    expect(screen.queryByText('Transliteration')).not.toBeInTheDocument()
    expect(screen.queryByText('Translation')).not.toBeInTheDocument()
  })

  it('applies correct CSS classes for styling', () => {
    renderWithStore(TextContent, {
      props: { displayText: mockText },
    })

    const arabicText = screen.getByText('هذا نص تجريبي')
    expect(arabicText).toHaveClass(
      'text-2xl',
      'leading-relaxed',
      'text-gray-900',
      'font-arabic',
      'text-right'
    )
    expect(arabicText).toHaveAttribute('dir', 'rtl')
    expect(arabicText).toHaveAttribute('lang', 'ar')

    const transliterationText = screen.getByText('hatha nass tajribi')
    expect(transliterationText).toHaveClass('text-lg', 'leading-relaxed', 'text-gray-700', 'italic')

    const translationText = screen.getByText('This is a test text')
    expect(translationText).toHaveClass('text-lg', 'leading-relaxed', 'text-gray-800')
  })

  it('applies correct background colors for each section', () => {
    renderWithStore(TextContent, {
      props: { displayText: mockText },
    })

    const arabicText = screen.getByText('هذا نص تجريبي')
    expect(arabicText).toHaveClass('bg-gray-50')

    const transliterationText = screen.getByText('hatha nass tajribi')
    expect(transliterationText).toHaveClass('bg-blue-50')

    const translationText = screen.getByText('This is a test text')
    expect(translationText).toHaveClass('bg-green-50')
  })

  it('handles very long content appropriately', () => {
    const longText = {
      ...mockText,
      arabicContent:
        'هذا نص طويل جداً يحتوي على كلمات كثيرة ويجب أن يظهر بشكل مناسب في المكون مع الحفاظ على التنسيق الصحيح',
      transliteration:
        'hatha nass taweel jiddan yahtawi ala kalimat katheerah wa yajib an yadhhar bishakl munaasib fil mukawwin maa al-hifaadh ala al-tanseeg al-saheeh',
      translation:
        'This is a very long text that contains many words and should display appropriately in the component while maintaining proper formatting',
    }

    renderWithStore(TextContent, {
      props: { displayText: longText },
    })

    expect(screen.getByText(longText.arabicContent)).toBeInTheDocument()
    expect(screen.getByText(longText.transliteration)).toBeInTheDocument()
    expect(screen.getByText(longText.translation)).toBeInTheDocument()
  })
})
