import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { CommonBaseIcon as BaseIcon } from '#components'

describe('BaseIcon', () => {
  it('renders SVG element', () => {
    render(BaseIcon, {
      slots: {
        default: '<path d="M6 18L18 6M6 6l12 12" stroke="currentColor" />',
      },
    })

    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('applies default size styles', () => {
    render(BaseIcon, {
      slots: {
        default: '<path d="M6 18L18 6M6 6l12 12" stroke="currentColor" />',
      },
    })

    const svg = document.querySelector('svg')
    expect(svg).toHaveStyle({
      width: '20px',
      height: '20px',
      minWidth: '20px',
      minHeight: '20px',
    })
  })

  it('applies size styles correctly', () => {
    const { unmount } = render(BaseIcon, {
      props: { size: 'xs' },
      slots: {
        default: '<path d="M6 18L18 6M6 6l12 12" stroke="currentColor" />',
      },
    })

    let svg = document.querySelector('svg')
    expect(svg).toHaveStyle({
      width: '12px',
      height: '12px',
      minWidth: '12px',
      minHeight: '12px',
    })

    unmount()

    render(BaseIcon, {
      props: { size: 'xl' },
      slots: {
        default: '<path d="M6 18L18 6M6 6l12 12" stroke="currentColor" />',
      },
    })
    svg = document.querySelector('svg')
    expect(svg).toHaveStyle({
      width: '32px',
      height: '32px',
      minWidth: '32px',
      minHeight: '32px',
    })
  })

  it('applies flex styles correctly', () => {
    render(BaseIcon, {
      slots: {
        default: '<path d="M6 18L18 6M6 6l12 12" stroke="currentColor" />',
      },
    })

    const svg = document.querySelector('svg')
    expect(svg).toHaveStyle({
      flexShrink: '0',
      display: 'inline-block',
    })
  })

  it('uses default viewBox', () => {
    render(BaseIcon, {
      slots: {
        default: '<path d="M6 18L18 6M6 6l12 12" stroke="currentColor" />',
      },
    })

    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
  })

  it('uses custom viewBox when provided', () => {
    render(BaseIcon, {
      props: { viewBox: '0 0 16 16' },
      slots: {
        default: '<path d="M6 18L18 6M6 6l12 12" stroke="currentColor" />',
      },
    })

    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('viewBox', '0 0 16 16')
  })

  it('renders slot content as SVG children', () => {
    render(BaseIcon, {
      slots: {
        default:
          '<path d="M6 18L18 6M6 6l12 12" stroke="currentColor" /><circle cx="12" cy="12" r="3" />',
      },
    })

    const path = document.querySelector('path')
    const circle = document.querySelector('circle')

    expect(path).toBeInTheDocument()
    expect(circle).toBeInTheDocument()
  })

  it('forwards attributes to SVG element', () => {
    render(BaseIcon, {
      attrs: {
        'data-testid': 'custom-icon',
        'aria-label': 'Close icon',
      },
      slots: {
        default: '<path d="M6 18L18 6M6 6l12 12" stroke="currentColor" />',
      },
    })

    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('data-testid', 'custom-icon')
    expect(svg).toHaveAttribute('aria-label', 'Close icon')
  })

  it('has correct xmlns attribute', () => {
    render(BaseIcon, {
      slots: {
        default: '<path d="M6 18L18 6M6 6l12 12" stroke="currentColor" />',
      },
    })

    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg')
  })
})
