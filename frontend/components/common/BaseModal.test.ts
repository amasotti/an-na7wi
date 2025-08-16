import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { CommonBaseModal as BaseModal } from '#components'

describe('BaseModal', () => {
  it('renders nothing when closed', () => {
    render(BaseModal, {
      props: { open: false, title: 'Test Modal' },
    })

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
  })

  it('renders modal when open', () => {
    render(BaseModal, {
      props: { open: true, title: 'Test Modal' },
      slots: { default: 'Modal content' },
    })

    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('emits close event when close button clicked', async () => {
    const { emitted } = render(BaseModal, {
      props: { open: true, title: 'Test Modal' },
    })

    const closeButton = screen.getByRole('button')
    await fireEvent.click(closeButton)

    expect(emitted().close).toBeTruthy()
  })

  it('emits close event when overlay clicked', async () => {
    const { emitted } = render(BaseModal, {
      props: { open: true, title: 'Test Modal' },
    })

    const overlay = document.querySelector('.modal-overlay')
    await fireEvent.click(overlay!)

    expect(emitted().close).toBeTruthy()
  })

  it('does not emit close when overlay clicked and persistent', async () => {
    const { emitted } = render(BaseModal, {
      props: { open: true, title: 'Test Modal', persistent: true },
    })

    const overlay = document.querySelector('.modal-overlay')
    await fireEvent.click(overlay!)

    expect(emitted().close).toBeFalsy()
  })

  it('does not show close button when persistent', () => {
    render(BaseModal, {
      props: { open: true, title: 'Test Modal', persistent: true },
    })

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('applies correct size classes', () => {
    const { unmount } = render(BaseModal, {
      props: { open: true, title: 'Test Modal', size: 'sm' },
    })

    expect(document.querySelector('.modal-sm')).toBeInTheDocument()

    unmount()

    render(BaseModal, {
      props: { open: true, title: 'Test Modal', size: 'xl' },
    })
    expect(document.querySelector('.modal-xl')).toBeInTheDocument()
  })

  it('renders header slot content', () => {
    render(BaseModal, {
      props: { open: true },
      slots: {
        header: '<h2>Custom Header</h2>',
        default: 'Content',
      },
    })

    expect(screen.getByText('Custom Header')).toBeInTheDocument()
  })

  it('renders footer slot content', () => {
    render(BaseModal, {
      props: { open: true, title: 'Test Modal' },
      slots: {
        footer: '<button>Custom Footer</button>',
        default: 'Content',
      },
    })

    expect(screen.getByText('Custom Footer')).toBeInTheDocument()
  })

  it('handles escape key press', async () => {
    const { emitted } = render(BaseModal, {
      props: { open: true, title: 'Test Modal' },
    })

    await fireEvent.keyDown(document, { key: 'Escape' })

    expect(emitted().close).toBeTruthy()
  })

  it('does not close on escape when persistent', async () => {
    const { emitted } = render(BaseModal, {
      props: { open: true, title: 'Test Modal', persistent: true },
    })

    await fireEvent.keyDown(document, { key: 'Escape' })

    expect(emitted().close).toBeFalsy()
  })
})
