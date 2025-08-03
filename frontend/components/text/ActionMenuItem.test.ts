import { fireEvent, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { renderWithStore } from '~/test/test-utils'
import { TextActionMenuItem as ActionMenuItem } from '#components'

describe('ActionMenuItem', () => {
  it('renders with default props', () => {
    renderWithStore(ActionMenuItem, {
      props: { icon: 'eye' },
      slots: { default: 'View Item' },
    })

    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('View Item')).toBeInTheDocument()
  })

  it('renders with eye icon', () => {
    renderWithStore(ActionMenuItem, {
      props: { icon: 'eye' },
      slots: { default: 'View' },
    })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('renders with pencil icon', () => {
    renderWithStore(ActionMenuItem, {
      props: { icon: 'pencil' },
      slots: { default: 'Edit' },
    })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('renders with duplicate icon', () => {
    renderWithStore(ActionMenuItem, {
      props: { icon: 'duplicate' },
      slots: { default: 'Duplicate' },
    })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('renders with trash icon', () => {
    renderWithStore(ActionMenuItem, {
      props: { icon: 'trash' },
      slots: { default: 'Delete' },
    })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('applies danger styles when danger prop is true', () => {
    renderWithStore(ActionMenuItem, {
      props: { icon: 'trash', danger: true },
      slots: { default: 'Delete' },
    })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-red-600')
  })

  it('applies normal styles when danger prop is false', () => {
    renderWithStore(ActionMenuItem, {
      props: { icon: 'eye', danger: false },
      slots: { default: 'View' },
    })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-gray-700')
  })

  it('emits click event when clicked', async () => {
    const { emitted } = renderWithStore(ActionMenuItem, {
      props: { icon: 'eye' },
      slots: { default: 'View' },
    })

    const button = screen.getByRole('button')
    await fireEvent.click(button)

    expect(emitted('click')).toBeTruthy()
  })

  it('has proper accessibility attributes', () => {
    renderWithStore(ActionMenuItem, {
      props: { icon: 'eye' },
      slots: { default: 'View Item' },
    })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button.tagName).toBe('BUTTON')
  })

  it('renders slot content correctly', () => {
    renderWithStore(ActionMenuItem, {
      props: { icon: 'eye' },
      slots: { default: 'Custom Action Text' },
    })

    expect(screen.getByText('Custom Action Text')).toBeInTheDocument()
  })
})
