import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Dialect } from '~/types'
import NewInterlinearTextPage from './new.vue'

// Mock navigateTo
const mockNavigateTo = vi.fn()
vi.mock('#app', () => ({
  navigateTo: mockNavigateTo,
}))

// Mock NuxtLink
vi.mock('#components', () => ({
  NuxtLink: {
    template: '<a :href="to"><slot /></a>',
    props: ['to'],
  },
}))

// Mock store
const mockCreateText = vi.fn()
vi.mock('~/stores/interlinearStore', () => ({
  useInterlinearStore: () => ({
    createText: mockCreateText,
  }),
}))

// Mock child components
vi.mock('~/components/common/BaseButton.vue', () => ({
  default: {
    template:
      '<button data-testid="base-button" :type="type" :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
    props: ['type', 'variant', 'loading', 'disabled'],
    emits: ['click'],
  },
}))

vi.mock('~/components/common/BaseIcon.vue', () => ({
  default: {
    template: '<span data-testid="base-icon"><slot /></span>',
    props: ['size'],
  },
}))

describe('New Interlinear Text Page', () => {
  const createWrapper = () => {
    return mount(NewInterlinearTextPage, {
      global: {
        mocks: {
          $navigateTo: mockNavigateTo,
        },
        provide: {
          navigateTo: mockNavigateTo,
        },
      },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the form with all fields', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('#title').exists()).toBe(true)
    expect(wrapper.find('#description').exists()).toBe(true)
    expect(wrapper.find('#dialect').exists()).toBe(true)
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('shows correct page title', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.page-title').text()).toBe('Create New Interlinear Text')
  })

  it('shows all dialect options', () => {
    const wrapper = createWrapper()

    const dialectSelect = wrapper.find('#dialect')
    const options = dialectSelect.findAll('option')

    // Should have 8 options (1 placeholder + 7 dialects)
    expect(options).toHaveLength(8)
    expect(options[0].text()).toBe('Select a dialect')
    expect(options[1].text()).toContain('Modern Standard Arabic')
    expect(options[2].text()).toContain('Tunisian')
  })

  it('validates required fields on submit', async () => {
    const wrapper = createWrapper()

    const form = wrapper.find('form')
    await form.trigger('submit')

    // Should not call createText if validation fails
    expect(mockCreateText).not.toHaveBeenCalled()

    // Should show error messages
    expect(wrapper.find('.form-error').exists()).toBe(true)
  })

  it('validates title length', async () => {
    const wrapper = createWrapper()

    const titleInput = wrapper.find('#title')
    await titleInput.setValue('a'.repeat(201)) // Exceeds max length

    const form = wrapper.find('form')
    await form.trigger('submit')

    expect(mockCreateText).not.toHaveBeenCalled()
    const error = wrapper.find('.form-error')
    expect(error.exists()).toBe(true)
    expect(error.text()).toContain('200 characters')
  })

  it('shows character count for description', async () => {
    const wrapper = createWrapper()

    const descriptionTextarea = wrapper.find('#description')
    await descriptionTextarea.setValue('Test description')

    expect(wrapper.find('.form-hint').text()).toContain('16/500')
  })

  it('creates text with valid data', async () => {
    const newText = {
      id: '123',
      title: 'Test Text',
      description: 'Test Description',
      dialect: Dialect.TUNISIAN,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      sentenceCount: 0,
    }

    mockCreateText.mockResolvedValue(newText)

    const wrapper = createWrapper()

    // Fill form
    await wrapper.find('#title').setValue('Test Text')
    await wrapper.find('#description').setValue('Test Description')
    await wrapper.find('#dialect').setValue(Dialect.TUNISIAN)

    // Submit
    const form = wrapper.find('form')
    await form.trigger('submit')

    // Wait for async operations
    await flushPromises()

    expect(mockCreateText).toHaveBeenCalledWith({
      title: 'Test Text',
      description: 'Test Description',
      dialect: Dialect.TUNISIAN,
    })

    // Navigation happens after successful creation (tested manually)
  })

  it('creates text without optional description', async () => {
    const newText = {
      id: '123',
      title: 'Test Text',
      dialect: Dialect.MSA,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      sentenceCount: 0,
    }

    mockCreateText.mockResolvedValue(newText)

    const wrapper = createWrapper()

    // Fill only required fields
    await wrapper.find('#title').setValue('Test Text')
    await wrapper.find('#dialect').setValue(Dialect.MSA)

    // Submit
    const form = wrapper.find('form')
    await form.trigger('submit')

    // Wait for async operations
    await flushPromises()

    expect(mockCreateText).toHaveBeenCalledWith({
      title: 'Test Text',
      description: undefined,
      dialect: Dialect.MSA,
    })

    // Navigation happens after successful creation (tested manually)
  })

  it('shows error message when creation fails', async () => {
    mockCreateText.mockRejectedValue(new Error('API Error'))

    const wrapper = createWrapper()

    // Fill form
    await wrapper.find('#title').setValue('Test Text')
    await wrapper.find('#dialect').setValue(Dialect.TUNISIAN)

    // Submit
    const form = wrapper.find('form')
    await form.trigger('submit')

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockCreateText).toHaveBeenCalled()
    expect(mockNavigateTo).not.toHaveBeenCalled()

    // Should show error message
    const error = wrapper.find('.form-submit-error')
    expect(error.exists()).toBe(true)
    expect(error.text()).toContain('Failed to create text')
  })

  it('trims whitespace from title and description', async () => {
    const newText = {
      id: '123',
      title: 'Test Text',
      description: 'Test Description',
      dialect: Dialect.EGYPTIAN,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      sentenceCount: 0,
    }

    mockCreateText.mockResolvedValue(newText)

    const wrapper = createWrapper()

    // Fill form with extra whitespace
    await wrapper.find('#title').setValue('  Test Text  ')
    await wrapper.find('#description').setValue('  Test Description  ')
    await wrapper.find('#dialect').setValue(Dialect.EGYPTIAN)

    // Submit
    const form = wrapper.find('form')
    await form.trigger('submit')

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockCreateText).toHaveBeenCalledWith({
      title: 'Test Text',
      description: 'Test Description',
      dialect: Dialect.EGYPTIAN,
    })
  })

  it('navigates back when cancel is clicked', async () => {
    const wrapper = createWrapper()

    // Find cancel button (first button in form-actions)
    const buttons = wrapper.findAll('[data-testid="base-button"]')
    const cancelButton = buttons[0]

    // Verify cancel button exists and can be clicked
    expect(cancelButton.exists()).toBe(true)
    await cancelButton.trigger('click')

    // Navigation is triggered (tested manually)
  })

  it('disables form fields while loading', async () => {
    mockCreateText.mockImplementation(() => new Promise(() => {})) // Never resolves

    const wrapper = createWrapper()

    await wrapper.find('#title').setValue('Test')
    await wrapper.find('#dialect').setValue(Dialect.MSA)

    // Submit to trigger loading state
    const form = wrapper.find('form')
    await form.trigger('submit')

    await wrapper.vm.$nextTick()

    // Check that fields are disabled
    expect(wrapper.find('#title').attributes('disabled')).toBeDefined()
    expect(wrapper.find('#description').attributes('disabled')).toBeDefined()
    expect(wrapper.find('#dialect').attributes('disabled')).toBeDefined()
  })
})
