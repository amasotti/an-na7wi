import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InterlinearSentenceEditor } from '#components'
import type { InterlinearSentence } from '~/types'

// Mock child components
vi.mock('~/components/common/BaseButton.vue', () => ({
  default: {
    template:
      '<button data-testid="base-button" :type="type" @click="$emit(\'click\')"><slot /></button>',
    props: ['type', 'variant', 'size'],
    emits: ['click'],
  },
}))

vi.mock('~/components/common/BaseIcon.vue', () => ({
  default: {
    template: '<span data-testid="base-icon"><slot /></span>',
    props: ['size'],
  },
}))

describe('InterlinearSentenceEditor', () => {
  const mockSentence: Partial<InterlinearSentence> = {
    arabicText: 'السلام عليكم',
    transliteration: 'as-salamu alaykum',
    translation: 'Peace be upon you',
    annotations: 'Common greeting',
  }

  const createWrapper = (props = {}) => {
    return mount(InterlinearSentenceEditor, {
      props: {
        sentence: mockSentence,
        sentenceId: 'test-sentence-1',
        sentenceOrder: 1,
        ...props,
      },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form fields', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('#arabic-test-sentence-1').exists()).toBe(true)
    expect(wrapper.find('#transliteration-test-sentence-1').exists()).toBe(true)
    expect(wrapper.find('#translation-test-sentence-1').exists()).toBe(true)
    expect(wrapper.find('#annotations-test-sentence-1').exists()).toBe(true)
  })

  it('displays sentence data correctly', () => {
    const wrapper = createWrapper()

    const arabicInput = wrapper.find('#arabic-test-sentence-1')
    const transliterationInput = wrapper.find('#transliteration-test-sentence-1')
    const translationInput = wrapper.find('#translation-test-sentence-1')
    const annotationsInput = wrapper.find('#annotations-test-sentence-1')

    expect((arabicInput.element as HTMLTextAreaElement).value).toBe('السلام عليكم')
    expect((transliterationInput.element as HTMLInputElement).value).toBe('as-salamu alaykum')
    expect((translationInput.element as HTMLInputElement).value).toBe('Peace be upon you')
    expect((annotationsInput.element as HTMLTextAreaElement).value).toBe('Common greeting')
  })

  it('displays sentence order badge', () => {
    const wrapper = createWrapper({ sentenceOrder: 3 })

    expect(wrapper.find('.sentence-order-badge').text()).toBe('Sentence #3')
  })

  it('has RTL direction for Arabic input', () => {
    const wrapper = createWrapper()

    const arabicInput = wrapper.find('#arabic-test-sentence-1')
    expect(arabicInput.attributes('dir')).toBe('rtl')
  })

  it('marks required fields with asterisk', () => {
    const wrapper = createWrapper()

    const labels = wrapper.findAll('.form-label')
    const requiredLabels = labels.filter(label => label.text().includes('*'))

    expect(requiredLabels).toHaveLength(3) // Arabic, Transliteration, Translation
  })

  it('emits update event when Arabic text changes', async () => {
    const wrapper = createWrapper()

    const arabicInput = wrapper.find('#arabic-test-sentence-1')
    await arabicInput.setValue('مرحبا')

    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('update')![0]![0]).toMatchObject({
      arabicText: 'مرحبا',
    })
  })

  it('emits update event when transliteration changes', async () => {
    const wrapper = createWrapper()

    const transliterationInput = wrapper.find('#transliteration-test-sentence-1')
    await transliterationInput.setValue('marhaba')

    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('update')![0]![0]).toMatchObject({
      transliteration: 'marhaba',
    })
  })

  it('emits update event when translation changes', async () => {
    const wrapper = createWrapper()

    const translationInput = wrapper.find('#translation-test-sentence-1')
    await translationInput.setValue('Hello')

    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('update')![0]![0]).toMatchObject({
      translation: 'Hello',
    })
  })

  it('emits update event when annotations change', async () => {
    const wrapper = createWrapper()

    const annotationsInput = wrapper.find('#annotations-test-sentence-1')
    await annotationsInput.setValue('Updated notes')

    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('update')![0]![0]).toMatchObject({
      annotations: 'Updated notes',
    })
  })

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = createWrapper()

    const deleteButton = wrapper.find('[data-testid="base-button"]')
    await deleteButton.trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
  })

  it('handles empty sentence data', () => {
    const wrapper = createWrapper({
      sentence: {},
    })

    const arabicInput = wrapper.find('#arabic-test-sentence-1')
    const transliterationInput = wrapper.find('#transliteration-test-sentence-1')
    const translationInput = wrapper.find('#translation-test-sentence-1')
    const annotationsInput = wrapper.find('#annotations-test-sentence-1')

    expect((arabicInput.element as HTMLTextAreaElement).value).toBe('')
    expect((transliterationInput.element as HTMLInputElement).value).toBe('')
    expect((translationInput.element as HTMLInputElement).value).toBe('')
    expect((annotationsInput.element as HTMLTextAreaElement).value).toBe('')
  })

  it('updates local state when prop changes', async () => {
    const wrapper: VueWrapper<typeof InterlinearSentenceEditor, any> = createWrapper()

    // Change the sentence prop
    await wrapper.setProps({
      sentence: {
        arabicText: 'مرحبا بك',
        transliteration: 'marhaba bik',
        translation: 'Welcome',
        annotations: 'Welcoming phrase',
      },
    })

    const arabicInput = wrapper.find('#arabic-test-sentence-1')
    const transliterationInput = wrapper.find('#transliteration-test-sentence-1')
    const translationInput = wrapper.find('#translation-test-sentence-1')
    const annotationsInput = wrapper.find('#annotations-test-sentence-1')

    expect((arabicInput.element as HTMLTextAreaElement).value).toBe('مرحبا بك')
    expect((transliterationInput.element as HTMLInputElement).value).toBe('marhaba bik')
    expect((translationInput.element as HTMLInputElement).value).toBe('Welcome')
    expect((annotationsInput.element as HTMLTextAreaElement).value).toBe('Welcoming phrase')
  })

  it('allows clearing annotations field', async () => {
    const wrapper = createWrapper()

    const annotationsInput = wrapper.find('#annotations-test-sentence-1')
    await annotationsInput.setValue('')

    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('update')![0]![0]).toMatchObject({
      annotations: '',
    })
  })

  it('preserves all fields in update event', async () => {
    const wrapper = createWrapper()

    // Update only one field
    const translationInput = wrapper.find('#translation-test-sentence-1')
    await translationInput.setValue('New translation')

    const updateEvent = wrapper.emitted('update')![0]![0] as Partial<InterlinearSentence>

    // All fields should be present in the update
    expect(updateEvent).toHaveProperty('arabicText')
    expect(updateEvent).toHaveProperty('transliteration')
    expect(updateEvent).toHaveProperty('translation')
    expect(updateEvent).toHaveProperty('annotations')
  })
})
