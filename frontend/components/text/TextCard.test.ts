import { fireEvent, screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithStore } from '~/test/test-utils'
import type { Text } from '~/types'
import { Dialect, Difficulty } from '~/types/enums'
import { TextCard } from '#components'

// Mock router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock text store
const mockUpdateText = vi.fn()
const mockDeleteText = vi.fn()
vi.mock('~/stores/textStore', () => ({
  useTextStore: () => ({
    updateText: mockUpdateText,
    deleteText: mockDeleteText,
  }),
}))

const mockText: Text = {
  id: '1',
  title: 'Test Arabic Text',
  arabicContent: 'هذا نص تجريبي',
  translation: 'This is a test text',
  transliteration: 'hatha nass tajribi',
  dialect: Dialect.MSA,
  difficulty: Difficulty.BEGINNER,
  tags: ['test', 'arabic'],
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  wordCount: 3,
}

describe('TextCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders text information correctly', () => {
    renderWithStore(TextCard, {
      props: { text: mockText },
    })

    expect(screen.getByText('Test Arabic Text')).toBeInTheDocument()
    expect(screen.getByText('هذا نص تجريبي')).toBeInTheDocument()
  })

  it('displays difficulty badge', () => {
    renderWithStore(TextCard, {
      props: { text: mockText },
    })

    expect(screen.getByText('BEGINNER')).toBeInTheDocument()
  })

  it('displays dialect badge', () => {
    renderWithStore(TextCard, {
      props: { text: mockText },
    })

    expect(screen.getByText('MSA')).toBeInTheDocument()
  })

  it('displays tags', () => {
    renderWithStore(TextCard, {
      props: { text: mockText },
    })

    expect(screen.getByText('test')).toBeInTheDocument()
    expect(screen.getByText('arabic')).toBeInTheDocument()
  })

  it('shows word count', () => {
    renderWithStore(TextCard, {
      props: { text: mockText },
    })

    expect(screen.getByText('3 words')).toBeInTheDocument()
  })

  it('opens dropdown menu when actions button clicked', async () => {
    renderWithStore(TextCard, {
      props: { text: mockText },
    })

    const actionsButton = screen.getByRole('button')
    await fireEvent.click(actionsButton)

    expect(screen.getByText('View Text')).toBeInTheDocument()
    expect(screen.getByText('Edit Text')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('navigates to text view when View Text clicked', async () => {
    renderWithStore(TextCard, {
      props: { text: mockText },
    })

    const actionsButton = screen.getByRole('button')
    await fireEvent.click(actionsButton)

    const viewText = screen.getByText('View Text')
    expect(viewText).toBeInTheDocument()
  })

  it('emits edit event when Edit Text clicked', async () => {
    const { emitted } = renderWithStore(TextCard, {
      props: { text: mockText },
    })

    const actionsButton = screen.getByRole('button')
    await fireEvent.click(actionsButton)

    const editButton = screen.getByText('Edit Text')
    await fireEvent.click(editButton)

    expect(emitted('edit')).toBeTruthy()
    expect(emitted('edit')[0]).toEqual([mockText.id])
  })

  it('emits delete event when Delete clicked', async () => {
    const { emitted } = renderWithStore(TextCard, {
      props: { text: mockText },
    })

    const actionsButton = screen.getByRole('button')
    await fireEvent.click(actionsButton)

    const deleteButton = screen.getByText('Delete')
    await fireEvent.click(deleteButton)

    expect(emitted('delete')).toBeTruthy()
    expect(emitted('delete')[0]).toEqual([mockText.id])
  })

  it('closes dropdown when clicking outside', async () => {
    renderWithStore(TextCard, {
      props: { text: mockText },
    })

    const actionsButton = screen.getByRole('button')
    await fireEvent.click(actionsButton)

    expect(screen.getByText('View Text')).toBeInTheDocument()

    // Click outside the dropdown
    await fireEvent.click(document.body)

    expect(screen.queryByText('View Text')).not.toBeInTheDocument()
  })

  it('handles text with no tags', () => {
    const textWithoutTags = { ...mockText, tags: [] }
    renderWithStore(TextCard, {
      props: { text: textWithoutTags },
    })

    expect(screen.getByText('Test Arabic Text')).toBeInTheDocument()
  })

  it('handles text with long content', () => {
    const longText = {
      ...mockText,
      arabicContent: 'هذا نص طويل جداً يحتوي على كلمات كثيرة ويجب أن يظهر بشكل مناسب في البطاقة',
      translation:
        'This is a very long text that contains many words and should display properly in the card',
    }

    renderWithStore(TextCard, {
      props: { text: longText },
    })

    expect(screen.getByText('Test Arabic Text')).toBeInTheDocument()
  })
})
