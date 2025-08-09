import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import ViewToggle from './ViewToggle.vue'

describe('ViewToggle', () => {
  const createComponent = (props = {}) => {
    const defaultProps = {
      modelValue: 'table' as 'table' | 'grid',
    }

    return render(ViewToggle, {
      props: { ...defaultProps, ...props },
    })
  }

  describe('Initial render', () => {
    it('renders both toggle buttons', () => {
      createComponent()

      expect(screen.getByTitle('Table view')).toBeInTheDocument()
      expect(screen.getByTitle('Card view')).toBeInTheDocument()
    })

    it('marks table button as active when modelValue is table', () => {
      createComponent({ modelValue: 'table' })

      const tableButton = screen.getByTitle('Table view')
      expect(tableButton).toHaveClass('toggle-button-active')
    })

    it('marks grid button as active when modelValue is grid', () => {
      createComponent({ modelValue: 'grid' })

      const gridButton = screen.getByTitle('Card view')
      expect(gridButton).toHaveClass('toggle-button-active')
    })
  })

  describe('Button states', () => {
    it('applies correct classes to active button', () => {
      createComponent({ modelValue: 'table' })

      const tableButton = screen.getByTitle('Table view')
      const gridButton = screen.getByTitle('Card view')

      expect(tableButton).toHaveClass('toggle-button-active')
      expect(tableButton).not.toHaveClass('toggle-button-inactive')
      expect(gridButton).toHaveClass('toggle-button-inactive')
      expect(gridButton).not.toHaveClass('toggle-button-active')
    })

    it('applies correct classes when switching to grid', () => {
      createComponent({ modelValue: 'grid' })

      const tableButton = screen.getByTitle('Table view')
      const gridButton = screen.getByTitle('Card view')

      expect(gridButton).toHaveClass('toggle-button-active')
      expect(gridButton).not.toHaveClass('toggle-button-inactive')
      expect(tableButton).toHaveClass('toggle-button-inactive')
      expect(tableButton).not.toHaveClass('toggle-button-active')
    })
  })

  describe('User interaction', () => {
    it('emits update:modelValue with table when table button is clicked', async () => {
      const { emitted } = createComponent({ modelValue: 'grid' })

      const tableButton = screen.getByTitle('Table view')
      await fireEvent.click(tableButton)

      expect(emitted()['update:modelValue']).toHaveLength(1)
      expect(emitted()['update:modelValue'][0]).toEqual(['table'])
    })

    it('emits update:modelValue with grid when grid button is clicked', async () => {
      const { emitted } = createComponent({ modelValue: 'table' })

      const gridButton = screen.getByTitle('Card view')
      await fireEvent.click(gridButton)

      expect(emitted()['update:modelValue']).toHaveLength(1)
      expect(emitted()['update:modelValue'][0]).toEqual(['grid'])
    })

    it('does not emit when clicking already active button', async () => {
      const { emitted } = createComponent({ modelValue: 'table' })

      const tableButton = screen.getByTitle('Table view')
      await fireEvent.click(tableButton)

      expect(emitted()['update:modelValue']).toHaveLength(1)
      expect(emitted()['update:modelValue'][0]).toEqual(['table'])
    })
  })

  describe('Accessibility', () => {
    it('has proper titles for screen readers', () => {
      createComponent()

      expect(screen.getByTitle('Table view')).toBeInTheDocument()
      expect(screen.getByTitle('Card view')).toBeInTheDocument()
    })

    it('buttons are keyboard accessible', () => {
      createComponent()

      const tableButton = screen.getByTitle('Table view')
      const gridButton = screen.getByTitle('Card view')

      expect(tableButton.tagName).toBe('BUTTON')
      expect(gridButton.tagName).toBe('BUTTON')
    })
  })

  describe('Icons', () => {
    it('renders table icon SVG path', () => {
      createComponent()

      const tableButton = screen.getByTitle('Table view')
      const svg = tableButton.querySelector('svg')
      const path = svg?.querySelector('path')

      expect(path).toHaveAttribute('d', 'M3 3h18v18H3zM3 9h18M9 21V9')
    })

    it('renders grid icon SVG path', () => {
      createComponent()

      const gridButton = screen.getByTitle('Card view')
      const svg = gridButton.querySelector('svg')
      const path = svg?.querySelector('path')

      expect(path).toHaveAttribute('d', 'M3 3h7v5H3zM14 3h7v5h-7zM14 12h7v5h-7zM3 12h7v5H3z')
    })
  })

  describe('CSS classes', () => {
    it('applies base toggle classes correctly', () => {
      createComponent()

      const container = screen.getByTitle('Table view').closest('.view-toggle')
      expect(container).toHaveClass('view-toggle')

      const toggleGroup = screen.getByTitle('Table view').closest('.toggle-group')
      expect(toggleGroup).toHaveClass('toggle-group')
    })

    it('applies button base classes correctly', () => {
      createComponent()

      const tableButton = screen.getByTitle('Table view')
      const gridButton = screen.getByTitle('Card view')

      expect(tableButton).toHaveClass('toggle-button')
      expect(gridButton).toHaveClass('toggle-button')
    })
  })
})
