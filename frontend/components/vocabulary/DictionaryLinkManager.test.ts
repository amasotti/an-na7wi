import { fireEvent, render, screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VocabularyDictionaryLinkManager as DictionaryLinkManager } from '#components'
import type { DictionaryLink } from '@/types'
import { DictionaryType } from '@/types/enums'

// Mock crypto.randomUUID for consistent test results
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-123',
  },
})

describe('DictionaryLinkManager', () => {
  const createComponent = (props = {}) => {
    const defaultProps = {
      modelValue: [] as DictionaryLink[],
    }

    return render(DictionaryLinkManager, {
      props: { ...defaultProps, ...props },
      global: {
        stubs: {
          BaseSelect: {
            template:
              '<select :placeholder="placeholder" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"><option value=""></option></select>',
            props: ['modelValue', 'options', 'placeholder'],
            emits: ['update:modelValue'],
          },
          BaseInput: {
            template: `
              <div>
                <input 
                  :placeholder="placeholder" 
                  :class="error ? 'error' : ''" 
                  :value="modelValue" 
                  @input="$emit('update:modelValue', $event.target.value)" 
                />
                <div v-if="error" class="error-text">{{ error }}</div>
              </div>
            `,
            props: ['modelValue', 'placeholder', 'error'],
            emits: ['update:modelValue'],
          },
          BaseButton: {
            template: '<button :class="variant" :size="size"><slot /></button>',
            props: ['variant', 'size'],
          },
          BaseIcon: {
            template: '<span title="Remove"><slot /></span>',
            props: ['name', 'size'],
          },
        },
      },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial render', () => {
    it('renders with empty state message when no links', () => {
      createComponent()
      expect(
        screen.getByText('No dictionary links added yet. Click "Add Dictionary" to get started.')
      ).toBeInTheDocument()
    })

    it('renders add dictionary button', () => {
      createComponent()
      expect(screen.getByText('Add Dictionary')).toBeInTheDocument()
    })
  })

  describe('Adding dictionary links', () => {
    it('adds a new dictionary link when add button is clicked', async () => {
      const { emitted } = createComponent()

      const addButton = screen.getByText('Add Dictionary')
      await fireEvent.click(addButton)

      const emittedArray = emitted()['update:modelValue'] as DictionaryLink[][]

      expect(emittedArray).toHaveLength(1)
      expect(emittedArray[0]![0]).toEqual([
        {
          id: 'test-uuid-123',
          type: DictionaryType.CUSTOM,
          url: '',
          displayName: '',
        },
      ])
    })

    it('shows form fields when dictionary link is added', async () => {
      const dictionaryLink: DictionaryLink = {
        id: 'test-id',
        type: DictionaryType.CUSTOM,
        url: '',
        displayName: '',
      }

      createComponent({ modelValue: [dictionaryLink] })

      expect(screen.getByPlaceholderText('Select dictionary')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Dictionary URL')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Display name')).toBeInTheDocument()
    })
  })

  describe('Removing dictionary links', () => {
    it('shows delete button for dictionary links', async () => {
      const dictionaryLinks: DictionaryLink[] = [
        {
          id: 'test-id-1',
          type: DictionaryType.ALMANY,
          url: 'https://www.almaany.com/test',
          displayName: 'AlMaany',
        },
      ]

      createComponent({ modelValue: dictionaryLinks })

      // Should have both add button and delete button
      const allButtons = screen.getAllByRole('button')
      expect(allButtons.length).toBeGreaterThan(1) // Add button + at least one delete button

      // Should have a button with danger styling (delete button)
      const hasDeleteButton = allButtons.some(btn => btn.className.includes('action-button-danger'))
      expect(hasDeleteButton).toBe(true)
    })
  })

  describe('Validation', () => {
    it('shows validation error for invalid URL', async () => {
      const dictionaryLink: DictionaryLink = {
        id: 'test-id',
        type: DictionaryType.CUSTOM,
        url: 'invalid-url',
        displayName: 'Test',
      }

      createComponent({ modelValue: [dictionaryLink] })

      expect(screen.getByText('Please enter a valid URL')).toBeInTheDocument()
    })

    it('does not show validation error for valid URL', async () => {
      const dictionaryLink: DictionaryLink = {
        id: 'test-id',
        type: DictionaryType.CUSTOM,
        url: 'https://example.com',
        displayName: 'Test',
      }

      createComponent({ modelValue: [dictionaryLink] })

      expect(screen.queryByText('Please enter a valid URL')).not.toBeInTheDocument()
    })

    it('does not show validation error for empty URL', async () => {
      const dictionaryLink: DictionaryLink = {
        id: 'test-id',
        type: DictionaryType.CUSTOM,
        url: '',
        displayName: 'Test',
      }

      createComponent({ modelValue: [dictionaryLink] })

      expect(screen.queryByText('Please enter a valid URL')).not.toBeInTheDocument()
    })
  })

  describe('Display name handling', () => {
    it('shows display name field only for custom dictionary type', async () => {
      const customLink: DictionaryLink = {
        id: 'test-id',
        type: DictionaryType.CUSTOM,
        url: 'https://example.com',
        displayName: '',
      }

      createComponent({ modelValue: [customLink] })

      expect(screen.getByPlaceholderText('Display name')).toBeInTheDocument()
    })

    it('does not show display name field for non-custom dictionary type', async () => {
      const almanyLink: DictionaryLink = {
        id: 'test-id',
        type: DictionaryType.ALMANY,
        url: 'https://www.almaany.com',
        displayName: 'AlMaany',
      }

      createComponent({ modelValue: [almanyLink] })

      expect(screen.queryByPlaceholderText('Display name')).not.toBeInTheDocument()
    })
  })

  describe('Preview section', () => {
    it('shows preview section when valid links exist', async () => {
      const dictionaryLinks: DictionaryLink[] = [
        {
          id: 'test-id',
          type: DictionaryType.ALMANY,
          url: 'https://www.almaany.com/test',
          displayName: 'AlMaany',
        },
      ]

      createComponent({ modelValue: dictionaryLinks })

      expect(screen.getByText('Preview:')).toBeInTheDocument()
      expect(screen.getByText('AlMaany')).toBeInTheDocument()
    })

    it('shows preview section even when no valid links exist if links are present', async () => {
      const dictionaryLinks: DictionaryLink[] = [
        {
          id: 'test-id',
          type: DictionaryType.CUSTOM,
          url: '', // invalid URL
          displayName: 'Test',
        },
      ]

      createComponent({ modelValue: dictionaryLinks })

      expect(screen.getByText('Preview:')).toBeInTheDocument()
    })
  })

  describe('Component behavior', () => {
    it('renders input fields with correct values', async () => {
      const dictionaryLink: DictionaryLink = {
        id: 'test-id',
        type: DictionaryType.CUSTOM,
        url: 'https://example.com',
        displayName: 'Test',
      }

      createComponent({ modelValue: [dictionaryLink] })

      const urlInput = screen.getByPlaceholderText('Dictionary URL')
      const displayNameInput = screen.getByPlaceholderText('Display name')

      expect(urlInput).toHaveAttribute('value', 'https://example.com')
      expect(displayNameInput).toHaveAttribute('value', 'Test')
    })

    it('has proper form structure', async () => {
      const dictionaryLink: DictionaryLink = {
        id: 'test-id',
        type: DictionaryType.ALMANY,
        url: 'https://www.almaany.com/test',
        displayName: 'AlMaany',
      }

      createComponent({ modelValue: [dictionaryLink] })

      expect(screen.getByPlaceholderText('Select dictionary')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Dictionary URL')).toBeInTheDocument()
      // Display name should not be shown for non-custom dictionaries
      expect(screen.queryByPlaceholderText('Display name')).not.toBeInTheDocument()
    })
  })

  describe('Configuration integration', () => {
    it('works with different dictionary types', async () => {
      const almanyLink: DictionaryLink = {
        id: 'test-id-1',
        type: DictionaryType.ALMANY,
        url: 'https://www.almaany.com/test',
        displayName: 'AlMaany',
      }

      const customLink: DictionaryLink = {
        id: 'test-id-2',
        type: DictionaryType.CUSTOM,
        url: 'https://example.com',
        displayName: 'Custom Dict',
      }

      createComponent({ modelValue: [almanyLink, customLink] })

      // Should show both links
      expect(screen.getAllByPlaceholderText('Dictionary URL')).toHaveLength(2)
      expect(screen.getByPlaceholderText('Display name')).toBeInTheDocument() // Only for custom
    })
  })
})
