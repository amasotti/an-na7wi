import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AnnotationForm } from '#components'
import { exampleService } from '~/composables/exampleService'
import { mockedExample } from '~/test/mocks/examples.mock'
import type { Annotation, ExampleGenerationResponse } from '~/types'
import { AnnotationType, MasteryLevel } from '~/types'

// Mock child components
vi.mock('../common/BaseModal.vue', () => ({
  default: {
    template: '<div data-testid="base-modal"><slot /></div>',
    props: ['open', 'title', 'size'],
    emits: ['close'],
  },
}))

vi.mock('../common/BaseButton.vue', () => ({
  default: {
    template:
      '<button data-testid="base-button" :type="type" @click="$emit(\'click\')"><slot /></button>',
    props: ['type', 'variant', 'loading', 'size'],
    emits: ['click'],
  },
}))

vi.mock('../common/BaseIcon.vue', () => ({
  default: {
    template: '<span data-testid="base-icon" :class="name"></span>',
    props: ['name'],
  },
}))

// Mock the example service
vi.mock('~/composables/exampleService', () => ({
  exampleService: {
    generateExamples: vi.fn(),
  },
}))

describe('AnnotationForm', () => {
  const mockAnnotation: Annotation = {
    id: '1',
    textId: '1',
    type: AnnotationType.VOCABULARY,
    content: 'هذا',
    anchorText: 'هذا نص تجريبي',
    needsReview: false,
    masteryLevel: MasteryLevel.MASTERED,
    createdAt: '2024-01-01T00:00:00Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly when closed', () => {
    const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
      props: {
        open: false,
      },
    })

    expect(wrapper.find('[data-testid="base-modal"]').exists()).toBe(true)
  })

  it('renders form fields when open', () => {
    const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
      props: {
        open: true,
      },
    })

    expect(wrapper.find('#anchorText').exists()).toBe(true)
    expect(wrapper.find('#content').exists()).toBe(true)
    expect(wrapper.find('#type').exists()).toBe(true)
    expect(wrapper.find('#masteryLevel').exists()).toBe(true)
    expect(wrapper.find('#needsReview').exists()).toBe(true)
  })

  it('shows correct title for new annotation', () => {
    const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
      props: {
        open: true,
      },
    })

    const modal = wrapper.findComponent({ name: 'BaseModal' })
    expect(modal.props('title')).toBe('New Annotation')
  })

  it('shows correct title for editing annotation', () => {
    const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
      props: {
        open: true,
        annotation: mockAnnotation,
      },
    })

    const modal = wrapper.findComponent({ name: 'BaseModal' })
    expect(modal.props('title')).toBe('Edit Annotation')
  })

  it('populates form with annotation data when editing', async () => {
    const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
      props: {
        open: true,
        annotation: mockAnnotation,
      },
    })

    await wrapper.vm.$nextTick()

    const anchorTextInput = wrapper.find('#anchorText').element as unknown as HTMLInputElement
    const contentInput = wrapper.find('#content').element as unknown as HTMLInputElement
    const typeSelect = wrapper.find('#type').element as unknown as HTMLInputElement
    const masteryLevelSelect = wrapper.find('#masteryLevel').element as unknown as HTMLInputElement
    const needsReviewCheckbox = wrapper.find('#needsReview').element as unknown as HTMLInputElement

    expect(anchorTextInput.value).toBe(mockAnnotation.anchorText)
    expect(contentInput.value).toBe(mockAnnotation.content)
    expect(typeSelect.value).toBe(mockAnnotation.type)
    expect(masteryLevelSelect.value).toBe(mockAnnotation.masteryLevel)
    expect(needsReviewCheckbox.value).toBe('on')
  })

  it('uses selectedText for new annotation', async () => {
    const selectedText = 'selected text'
    const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
      props: {
        open: true,
        selectedText,
      },
    })

    await wrapper.vm.$nextTick()

    const anchorTextInput = wrapper.find('#anchorText').element as unknown as HTMLInputElement

    expect(anchorTextInput.value).toBe(selectedText)
  })

  it('disables anchor text when editing and canEditAnchorText is false', () => {
    const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
      props: {
        open: true,
        annotation: mockAnnotation,
        canEditAnchorText: false,
      },
    })

    const anchorTextInput = wrapper.find('#anchorText')
    expect(anchorTextInput.attributes('disabled')).toBeDefined()
    expect(anchorTextInput.classes()).toContain('bg-gray-100')
  })

  it('enables anchor text when editing and canEditAnchorText is true', () => {
    const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
      props: {
        open: true,
        annotation: mockAnnotation,
        canEditAnchorText: true,
      },
    })

    const anchorTextInput = wrapper.find('#anchorText')
    expect(anchorTextInput.attributes('disabled')).toBeUndefined()
    expect(anchorTextInput.classes()).not.toContain('bg-gray-100')
  })

  it('shows delete button when editing', () => {
    const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
      props: {
        open: true,
        annotation: mockAnnotation,
      },
    })

    const deleteButton = wrapper
      .findAll('[data-testid="base-button"]')
      .find(button => button.text().includes('Delete'))
    expect(deleteButton).toBeDefined()
  })

  it('does not show delete button when creating new annotation', () => {
    const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
      props: {
        open: true,
      },
    })

    const deleteButton = wrapper
      .findAll('[data-testid="base-button"]')
      .find(button => button.text().includes('Delete'))
    expect(deleteButton).toBeUndefined()
  })

  it('emits submit event with form data', async () => {
    const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
      props: {
        open: true,
      },
    })

    await wrapper.find('#anchorText').setValue('test anchor')
    await wrapper.find('#content').setValue('test content')
    await wrapper.find('#type').setValue(AnnotationType.GRAMMAR)
    await wrapper.find('#masteryLevel').setValue(MasteryLevel.MASTERED)
    await wrapper.find('#needsReview').setValue(true)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')![0]).toEqual([
      {
        anchorText: 'test anchor',
        content: 'test content',
        type: AnnotationType.GRAMMAR,
        masteryLevel: MasteryLevel.MASTERED,
        needsReview: true,
        color: '#32a7cf',
      },
    ])
  })

  it('emits close event when modal is closed', () => {
    const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
      props: {
        open: true,
      },
    })

    const modal = wrapper.findComponent({ name: 'BaseModal' })
    modal.vm.$emit('close')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits delete event when delete button is clicked and confirmed', async () => {
    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
      props: {
        open: true,
        annotation: mockAnnotation,
      },
    })

    // Call the handleDelete method directly
    await wrapper.vm.handleDelete()

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this annotation?')
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')![0]).toEqual([mockAnnotation.id])
    expect(wrapper.emitted('close')).toBeTruthy()

    confirmSpy.mockRestore()
  })

  it('does not emit delete event when deletion is not confirmed', async () => {
    // Mock window.confirm to return false
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

    const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
      props: {
        open: true,
        annotation: mockAnnotation,
      },
    })

    // Call the handleDelete method directly
    await wrapper.vm.handleDelete()

    expect(confirmSpy).toHaveBeenCalled()
    expect(wrapper.emitted('delete')).toBeFalsy()

    confirmSpy.mockRestore()
  })

  it('resets form when modal is closed', async () => {
    const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
      props: {
        open: true,
        selectedText: 'initial text',
      },
    })

    // Fill form with data
    await wrapper.find('#content').setValue('some content')

    // Close modal
    await wrapper.setProps({ open: false })

    // Reopen modal
    await wrapper.setProps({ open: true })

    const anchorTextInput = wrapper.find('#anchorText').element as unknown as HTMLInputElement
    const contentInput = wrapper.find('#content').element as unknown as HTMLInputElement

    expect(anchorTextInput.value).toBe('initial text')
    expect(contentInput.value).toBe('')
  })

  it('handles all annotation types and mastery levels', () => {
    const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
      props: {
        open: true,
      },
    })

    const typeOptions = wrapper.find('#type').findAll('option')
    const masteryOptions = wrapper.find('#masteryLevel').findAll('option')

    expect(typeOptions.length).toBe(Object.values(AnnotationType).length)
    expect(masteryOptions.length).toBe(Object.values(MasteryLevel).length)
  })

  describe('Example Generation', () => {
    it('shows generate examples button when anchor text is present', async () => {
      const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
        props: {
          open: true,
          selectedText: 'كتاب',
        },
      })

      await wrapper.vm.$nextTick()

      const generateButton = wrapper
        .findAll('[data-testid="base-button"]')
        .find(button => button.text().includes('Generate Examples'))

      expect(generateButton).toBeDefined()
    })

    it('hides generate examples button when anchor text is empty', () => {
      const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
        props: {
          open: true,
        },
      })

      const generateButton = wrapper
        .findAll('[data-testid="base-button"]')
        .find(button => button.text().includes('Generate Examples'))

      expect(generateButton).toBeUndefined()
    })

    it('calls example service when generate button is clicked', async () => {
      const mockResponse: ExampleGenerationResponse = {
        examples: [mockedExample],
      }
      vi.mocked(exampleService.generateExamples).mockResolvedValue(mockResponse)

      const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
        props: {
          open: true,
          selectedText: 'كتاب',
        },
      })

      await wrapper.vm.$nextTick()

      const generateButton = wrapper
        .findAll('[data-testid="base-button"]')
        .find(button => button.text().includes('Generate Examples'))

      await generateButton!.trigger('click')

      expect(vi.mocked(exampleService.generateExamples)).toHaveBeenCalledWith({
        arabic: 'كتاب',
        context: undefined,
      })
    })

    it('displays generated examples', async () => {
      const mockResponse: ExampleGenerationResponse = {
        examples: [
          mockedExample,
          {
            arabic: 'أقرأ الكتاب',
            transliteration: 'Aqra al-kitab',
            english: 'I read the book',
          },
        ],
      }
      vi.mocked(exampleService.generateExamples).mockResolvedValue(mockResponse)

      const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
        props: {
          open: true,
          selectedText: 'كتاب',
        },
      })

      await wrapper.vm.$nextTick()

      // Generate examples
      await wrapper.vm.generateExamples()
      await wrapper.vm.$nextTick()

      const exampleElements = wrapper.findAll('.p-2.bg-white.rounded.border')
      expect(exampleElements).toHaveLength(2)

      expect(wrapper.text()).toContain('هذا كتاب مفيد')
      expect(wrapper.text()).toContain('This is a useful book')
      expect(wrapper.text()).toContain('أقرأ الكتاب')
      expect(wrapper.text()).toContain('I read the book')
    })

    it('adds example to content when clicked', async () => {
      const mockResponse: ExampleGenerationResponse = {
        examples: [
          {
            arabic: 'هذا كتاب مفيد',
            transliteration: 'Hatha kitab mufid',
            english: 'This is a useful book',
          },
        ],
      }
      vi.mocked(exampleService.generateExamples).mockResolvedValue(mockResponse)

      const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
        props: {
          open: true,
          selectedText: 'كتاب',
        },
      })

      await wrapper.vm.$nextTick()

      // Generate examples
      await wrapper.vm.generateExamples()
      await wrapper.vm.$nextTick()

      // Click on first example
      const firstExample = wrapper.find('.p-2.bg-white.rounded.border')
      await firstExample.trigger('click')

      const contentTextarea = wrapper.find('#content').element as HTMLTextAreaElement
      expect(contentTextarea.value).toContain('هذا كتاب مفيد')
      expect(contentTextarea.value).toContain('This is a useful book')
    })

    it('clears examples when anchor text changes', async () => {
      const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
        props: {
          open: true,
          selectedText: 'كتاب',
        },
      })

      await wrapper.vm.$nextTick()

      // Set some generated examples
      wrapper.vm.generatedExamples = [{ arabic: 'test', english: 'test' }]
      await wrapper.vm.$nextTick()

      // Change anchor text
      await wrapper.find('#anchorText').setValue('جديد')

      expect(wrapper.vm.generatedExamples).toHaveLength(0)
    })

    it('clears examples when modal closes', async () => {
      const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
        props: {
          open: true,
          selectedText: 'كتاب',
        },
      })

      // Set some generated examples
      wrapper.vm.generatedExamples = [{ arabic: 'test', english: 'test' }]
      await wrapper.vm.$nextTick()

      // Close modal
      await wrapper.setProps({ open: false })

      expect(wrapper.vm.generatedExamples).toHaveLength(0)
    })

    it('handles example generation errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(exampleService.generateExamples).mockRejectedValue(new Error('API Error'))

      const wrapper: VueWrapper<typeof AnnotationForm, any> = mount(AnnotationForm, {
        props: {
          open: true,
          selectedText: 'كتاب',
        },
      })

      await wrapper.vm.$nextTick()

      // Generate examples
      await wrapper.vm.generateExamples()
      await wrapper.vm.$nextTick()

      expect(consoleSpy).toHaveBeenCalledWith('Failed to generate examples:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })
})
