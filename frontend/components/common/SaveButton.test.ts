import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { CommonSaveButton as SaveButton } from '#components'

describe('SaveButton', () => {
  it('renders with default text', () => {
    render(SaveButton)
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('renders with custom text prop', () => {
    render(SaveButton, {
      props: { text: 'Save Changes' },
    })
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
  })

  it('renders slot content when provided', () => {
    render(SaveButton, {
      slots: {
        default: 'Submit Form',
      },
    })
    expect(screen.getByRole('button', { name: /submit form/i })).toBeInTheDocument()
  })

  it('emits click event when clicked', async () => {
    const onClick = vi.fn()

    render(SaveButton, {
      props: {
        onClick,
      },
    })

    await fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('can be disabled', () => {
    render(SaveButton, {
      props: { disabled: true },
    })

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('does not emit click when disabled', async () => {
    const onClick = vi.fn()

    render(SaveButton, {
      props: {
        disabled: true,
        onClick,
      },
    })

    await fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('shows loading state', () => {
    render(SaveButton, {
      props: { loading: true },
    })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('is disabled when loading', () => {
    render(SaveButton, {
      props: { loading: true },
    })

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('does not emit click when loading', async () => {
    const onClick = vi.fn()

    render(SaveButton, {
      props: {
        loading: true,
        onClick,
      },
    })

    await fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('has submit type by default', () => {
    render(SaveButton)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('supports custom button type', () => {
    render(SaveButton, {
      props: { type: 'button' },
    })
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })
})
