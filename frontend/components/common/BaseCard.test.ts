import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { CommonBaseCard as BaseCard } from '#components'

describe('BaseCard', () => {
  it('renders default slot content', () => {
    render(BaseCard, {
      slots: { default: 'Card content' },
    })

    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders header slot when provided', () => {
    render(BaseCard, {
      slots: {
        header: 'Card Header',
        default: 'Card content',
      },
    })

    expect(screen.getByText('Card Header')).toBeInTheDocument()
    expect(document.querySelector('.card-header')).toBeInTheDocument()
  })

  it('renders footer slot when provided', () => {
    render(BaseCard, {
      slots: {
        footer: 'Card Footer',
        default: 'Card content',
      },
    })

    expect(screen.getByText('Card Footer')).toBeInTheDocument()
    expect(document.querySelector('.card-footer')).toBeInTheDocument()
  })

  it('applies default variant classes', () => {
    render(BaseCard, {
      slots: { default: 'Content' },
    })

    const card = document.querySelector('.card')
    expect(card).toHaveClass('hover:shadow-xl', 'transition-all', 'duration-300')
  })

  it('applies variant classes correctly', () => {
    // Test elevated variant
    const { unmount } = render(BaseCard, {
      props: { variant: 'elevated' },
      slots: { default: 'Content' },
    })

    let card = document.querySelector('.card')
    expect(card).toHaveClass('card-elevated')

    unmount()

    // Test glass variant
    render(BaseCard, {
      props: { variant: 'glass' },
      slots: { default: 'Content' },
    })

    card = document.querySelector('.card')
    expect(card).toHaveClass('glass')
  })

  it('applies padding classes correctly', () => {
    // Test small padding
    const { unmount } = render(BaseCard, {
      props: { padding: 'sm' },
      slots: { default: 'Content' },
    })

    let cardBody = document.querySelector('.card')?.children[0]
    expect(cardBody).toHaveClass('p-4')

    unmount()

    // Test large padding
    render(BaseCard, {
      props: { padding: 'lg' },
      slots: { default: 'Content' },
    })

    cardBody = document.querySelector('.card')?.children[0]
    expect(cardBody).toHaveClass('p-8')

    unmount()

    // Test no padding
    render(BaseCard, {
      props: { padding: 'none' },
      slots: { default: 'Content' },
    })

    cardBody = document.querySelector('.card')?.children[0]
    expect(cardBody).not.toHaveClass('p-4', 'p-6', 'p-8')
  })

  it('removes hover effect when hover is false', () => {
    render(BaseCard, {
      props: { hover: false },
      slots: { default: 'Content' },
    })

    const card = document.querySelector('.card')
    expect(card).not.toHaveClass('hover:shadow-xl')
  })

  it('renders complex content structure', () => {
    render(BaseCard, {
      props: { variant: 'elevated', padding: 'lg' },
      slots: {
        header: '<h2>Title</h2>',
        default: '<p>Description</p><button>Action</button>',
        footer: '<small>Footer note</small>',
      },
    })

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Footer note')).toBeInTheDocument()
  })
})
