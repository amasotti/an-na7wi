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
