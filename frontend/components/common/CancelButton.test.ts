import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { CommonCancelButton as CancelButton } from '#components'

describe('CancelButton', () => {
  it('renders with default text', () => {
    render(CancelButton)
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('renders with custom text prop', () => {
    render(CancelButton, {
      props: { text: 'Go Back' },
    })
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument()
  })

  it('renders slot content when provided', () => {
    render(CancelButton, {
      slots: {
        default: 'Close Window',
      },
    })
    expect(screen.getByRole('button', { name: /close window/i })).toBeInTheDocument()
  })

  it('emits click event when clicked', async () => {
    const onClick = vi.fn()

    render(CancelButton, {
      props: {
        onClick,
      },
    })

    await fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('can be disabled', () => {
    render(CancelButton, {
      props: { disabled: true },
    })

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('does not emit click when disabled', async () => {
    const onClick = vi.fn()

    render(CancelButton, {
      props: {
        disabled: true,
        onClick,
      },
    })

    await fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('has button type by default', () => {
    render(CancelButton)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('supports custom button type', () => {
    render(CancelButton, {
      props: { type: 'reset' },
    })
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset')
  })
})
