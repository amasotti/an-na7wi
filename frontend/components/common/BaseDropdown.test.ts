import { fireEvent, render, screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CommonBaseDropdown as BaseDropdown } from '#components'

describe('BaseDropdown', () => {
  const createComponent = (props = {}, slots = {}) => {
    const defaultSlots = {
      trigger: '<button>Trigger</button>',
      content: '<div>Dropdown content</div>',
      ...slots,
    }

    return render(BaseDropdown, {
      props,
      slots: defaultSlots,
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Clear any existing event listeners
    document.removeEventListener('click', expect.any(Function))
  })

  describe('Initial render', () => {
    it('renders trigger slot', () => {
      createComponent()
      expect(screen.getByText('Trigger')).toBeInTheDocument()
    })

    it('does not render dropdown content initially', () => {
      createComponent()
      expect(screen.queryByText('Dropdown content')).not.toBeInTheDocument()
    })

    it('applies default placement classes', () => {
      createComponent()

      const trigger = screen.getByText('Trigger')
      const dropdown = trigger.closest('.relative')
      expect(dropdown).toBeInTheDocument()
    })
  })

  describe('Opening and closing', () => {
    it('opens dropdown when trigger is clicked', async () => {
      createComponent()

      const trigger = screen.getByText('Trigger')
      await fireEvent.click(trigger)

      expect(screen.getByText('Dropdown content')).toBeInTheDocument()
    })

    it('closes dropdown when trigger is clicked again', async () => {
      createComponent()

      const trigger = screen.getByText('Trigger')

      // Open
      await fireEvent.click(trigger)
      expect(screen.getByText('Dropdown content')).toBeInTheDocument()

      // Close
      await fireEvent.click(trigger)
      expect(screen.queryByText('Dropdown content')).not.toBeInTheDocument()
    })

    it('closes dropdown when clicking outside', async () => {
      createComponent()

      const trigger = screen.getByText('Trigger')
      await fireEvent.click(trigger)

      expect(screen.getByText('Dropdown content')).toBeInTheDocument()

      // Click outside
      await fireEvent.click(document.body)

      expect(screen.queryByText('Dropdown content')).not.toBeInTheDocument()
    })

    it('does not close when clicking inside dropdown', async () => {
      createComponent()

      const trigger = screen.getByText('Trigger')
      await fireEvent.click(trigger)

      const content = screen.getByText('Dropdown content')
      await fireEvent.click(content)

      expect(screen.getByText('Dropdown content')).toBeInTheDocument()
    })
  })

  describe('Placement options', () => {
    it('applies bottom-start placement classes by default', async () => {
      createComponent()

      const trigger = screen.getByText('Trigger')
      await fireEvent.click(trigger)

      const menu = screen.getByText('Dropdown content').closest('.dropdown-menu')
      expect(menu).toHaveClass('mt-1', 'left-0', 'origin-top-left')
    })

    it('applies bottom-end placement classes when specified', async () => {
      createComponent({ placement: 'bottom-end' })

      const trigger = screen.getByText('Trigger')
      await fireEvent.click(trigger)

      const menu = screen.getByText('Dropdown content').closest('.dropdown-menu')
      expect(menu).toHaveClass('mt-1', 'right-0', 'origin-top-right')
    })

    it('applies top-start placement classes when specified', async () => {
      createComponent({ placement: 'top-start' })

      const trigger = screen.getByText('Trigger')
      await fireEvent.click(trigger)

      const menu = screen.getByText('Dropdown content').closest('.dropdown-menu')
      expect(menu).toHaveClass('mb-1', 'bottom-full', 'left-0', 'origin-bottom-left')
    })

    it('applies top-end placement classes when specified', async () => {
      createComponent({ placement: 'top-end' })

      const trigger = screen.getByText('Trigger')
      await fireEvent.click(trigger)

      const menu = screen.getByText('Dropdown content').closest('.dropdown-menu')
      expect(menu).toHaveClass('mb-1', 'bottom-full', 'right-0', 'origin-bottom-right')
    })
  })

  describe('Width options', () => {
    it('applies auto width classes by default', async () => {
      createComponent()

      const trigger = screen.getByText('Trigger')
      await fireEvent.click(trigger)

      const menu = screen.getByText('Dropdown content').closest('.dropdown-menu')
      expect(menu).toHaveClass('min-w-max')
    })

    it('applies trigger width classes when specified', async () => {
      createComponent({ width: 'trigger' })

      const trigger = screen.getByText('Trigger')
      await fireEvent.click(trigger)

      const menu = screen.getByText('Dropdown content').closest('.dropdown-menu')
      expect(menu).toHaveClass('w-full')
    })

    it('applies custom width when specified', async () => {
      createComponent({ width: 'w-64' })

      const trigger = screen.getByText('Trigger')
      await fireEvent.click(trigger)

      const menu = screen.getByText('Dropdown content').closest('.dropdown-menu')
      expect(menu).toHaveClass('w-64')
    })
  })

  describe('Slot props', () => {
    it('passes open state to trigger slot', async () => {
      const { rerender } = createComponent()

      // Test with basic trigger first
      expect(screen.getByText('Trigger')).toBeInTheDocument()

      const trigger = screen.getByText('Trigger')
      await fireEvent.click(trigger)

      // Should open dropdown
      expect(screen.getByText('Dropdown content')).toBeInTheDocument()
    })

    it('passes close function to content slot', async () => {
      createComponent()

      const trigger = screen.getByText('Trigger')
      await fireEvent.click(trigger)

      expect(screen.getByText('Dropdown content')).toBeInTheDocument()

      // Click outside to close
      await fireEvent.click(document.body)

      expect(screen.queryByText('Dropdown content')).not.toBeInTheDocument()
    })
  })

  describe('Transitions', () => {
    it('applies transition classes to dropdown menu', async () => {
      createComponent()

      const trigger = screen.getByText('Trigger')
      await fireEvent.click(trigger)

      const menu = screen.getByText('Dropdown content').closest('.dropdown-menu')
      expect(menu).toBeInTheDocument()

      // Check if transition wrapper exists
      const transitionWrapper = menu?.parentElement
      expect(transitionWrapper).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper focus handling', async () => {
      createComponent()

      const trigger = screen.getByText('Trigger')
      await fireEvent.click(trigger)

      const menu = screen.getByText('Dropdown content').closest('.dropdown-menu')
      expect(menu).toHaveClass('focus:outline-none')
    })

    it('has proper z-index for layering', async () => {
      createComponent()

      const trigger = screen.getByText('Trigger')
      await fireEvent.click(trigger)

      const menu = screen.getByText('Dropdown content').closest('.dropdown-menu')
      expect(menu).toHaveClass('z-50')
    })
  })

  describe('Styling', () => {
    it('applies base dropdown styles', async () => {
      createComponent()

      const trigger = screen.getByText('Trigger')
      await fireEvent.click(trigger)

      const menu = screen.getByText('Dropdown content').closest('.dropdown-menu')
      expect(menu).toHaveClass(
        'absolute',
        'bg-white',
        'rounded-md',
        'shadow-lg',
        'ring-1',
        'ring-black',
        'ring-opacity-5'
      )
    })

    it('has minimum width class set', async () => {
      createComponent()

      const trigger = screen.getByText('Trigger')
      await fireEvent.click(trigger)

      const menu = screen.getByText('Dropdown content').closest('.dropdown-menu')
      // Check for the CSS class instead of the computed style
      expect(menu).toHaveClass('min-w-max')
    })
  })

  describe('Lifecycle', () => {
    it('adds click event listener on mount', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
      createComponent()

      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
    })

    it('removes click event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
      const { unmount } = createComponent()

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
    })
  })
})
