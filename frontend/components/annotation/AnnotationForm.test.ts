import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { Annotation } from '~/types'
import { AnnotationType, Dialect, Difficulty, MasteryLevel } from '~/types'
import { AnnotationForm } from '#components'

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
    props: ['type', 'variant', 'loading'],
    emits: ['click'],
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

  it('renders correctly when closed', () => {
    const wrapper = mount(AnnotationForm, {
      props: {
        open: false,
      },
    })

    expect(wrapper.find('[data-testid="base-modal"]').exists()).toBe(true)
  })

  it('renders form fields when open', () => {
    const wrapper = mount(AnnotationForm, {
      props: {
        open: true,
      },
    })

    expect(wrapper.find('#anchorText').exists()).toBe(true)
    expect(wrapper.find('#content').exists()).toBe(true)
    expect(wrapper.find('#type').exists()).toBe(true)
    expect(wrapper.find('#masteryLevel').exists()).toBe(true)
    expect(wrapper.find('#needsReview').exists()).toBe(true)
    expect(wrapper.find('#color').exists()).toBe(true)
  })

  it('shows correct title for new annotation', () => {
    const wrapper = mount(AnnotationForm, {
      props: {
        open: true,
      },
    })

    const modal = wrapper.findComponent({ name: 'BaseModal' })
    expect(modal.props('title')).toBe('New Annotation')
  })

  it('shows correct title for editing annotation', () => {
    const wrapper = mount(AnnotationForm, {
      props: {
        open: true,
        annotation: mockAnnotation,
      },
    })

    const modal = wrapper.findComponent({ name: 'BaseModal' })
    expect(modal.props('title')).toBe('Edit Annotation')
  })

  it('populates form with annotation data when editing', async () => {
    const wrapper = mount(AnnotationForm, {
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
    const colorInput = wrapper.find('#color').element as unknown as HTMLInputElement

    expect(anchorTextInput.value).toBe(mockAnnotation.anchorText)
    expect(contentInput.value).toBe(mockAnnotation.content)
    expect(typeSelect.value).toBe(mockAnnotation.type)
    expect(masteryLevelSelect.value).toBe(mockAnnotation.masteryLevel)
    expect(needsReviewCheckbox.value).toBe("on")
    expect(colorInput.value).toBe("")
  })

  it('uses selectedText for new annotation', async () => {
    const selectedText = 'selected text'
    const wrapper = mount(AnnotationForm, {
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
    const wrapper = mount(AnnotationForm, {
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
    const wrapper = mount(AnnotationForm, {
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
    const wrapper = mount(AnnotationForm, {
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
    const wrapper = mount(AnnotationForm, {
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
    const wrapper = mount(AnnotationForm, {
      props: {
        open: true,
      },
    })

    await wrapper.find('#anchorText').setValue('test anchor')
    await wrapper.find('#content').setValue('test content')
    await wrapper.find('#type').setValue(AnnotationType.GRAMMAR)
    await wrapper.find('#masteryLevel').setValue(MasteryLevel.MASTERED)
    await wrapper.find('#needsReview').setValue(true)
    await wrapper.find('#color').setValue('#ff0000')

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')![0]).toEqual([
      {
        anchorText: 'test anchor',
        content: 'test content',
        type: AnnotationType.GRAMMAR,
        masteryLevel: MasteryLevel.MASTERED,
        needsReview: true,
        color: '#ff0000',
      },
    ])
  })

  it('emits close event when modal is closed', () => {
    const wrapper = mount(AnnotationForm, {
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

    const wrapper = mount(AnnotationForm, {
      props: {
        open: true,
        annotation: mockAnnotation,
      },
    })

    // Call the handleDelete method directly
    // @ts-ignore
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

    const wrapper = mount(AnnotationForm, {
      props: {
        open: true,
        annotation: mockAnnotation,
      },
    })

    // Call the handleDelete method directly
    // @ts-ignore
    await wrapper.vm.handleDelete()

    expect(confirmSpy).toHaveBeenCalled()
    expect(wrapper.emitted('delete')).toBeFalsy()

    confirmSpy.mockRestore()
  })

  it('resets form when modal is closed', async () => {
    const wrapper = mount(AnnotationForm, {
      props: {
        open: true,
        selectedText: 'initial text',
      },
    })

    // Fill form with data
    await wrapper.find('#content').setValue('some content')

    // Close modal
    // @ts-ignore
    await wrapper.setProps({ open: false })

    // Reopen modal
    // @ts-ignore
    await wrapper.setProps({ open: true })

    const anchorTextInput = wrapper.find('#anchorText').element as unknown as HTMLInputElement
    const contentInput = wrapper.find('#content').element as unknown as HTMLInputElement

    expect(anchorTextInput.value).toBe('initial text')
    expect(contentInput.value).toBe('')
  })

  it('handles all annotation types and mastery levels', () => {
    const wrapper = mount(AnnotationForm, {
      props: {
        open: true,
      },
    })

    const typeOptions = wrapper.find('#type').findAll('option')
    const masteryOptions = wrapper.find('#masteryLevel').findAll('option')

    expect(typeOptions.length).toBe(Object.values(AnnotationType).length)
    expect(masteryOptions.length).toBe(Object.values(MasteryLevel).length)
  })
})
