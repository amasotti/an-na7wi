import { screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithStore } from '~/test/test-utils'
import { LayoutNavLink as NavLink } from '#components'

// Mock useRoute composable
const mockRoute = { path: '/texts' }
vi.mock('#app', () => ({
  useRoute: () => mockRoute,
}))

describe('NavLink', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with text content', () => {
    renderWithStore(NavLink, {
      props: { to: '/texts' },
      slots: { default: 'Texts' },
    })

    expect(screen.getByText('Texts')).toBeInTheDocument()
  })

  it('renders with icon', () => {
    renderWithStore(NavLink, {
      props: {
        to: '/texts',
        icon: 'DocumentTextIcon',
      },
      slots: { default: 'Texts' },
    })

    expect(screen.getByText('Texts')).toBeInTheDocument()
    // Icon is rendered as SVG path
    const svgElement = screen.getByText('Texts').parentElement?.querySelector('svg')
    expect(svgElement).toBeInTheDocument()
  })

  it('renders links with correct styling', () => {
    renderWithStore(NavLink, {
      props: { to: '/texts' },
      slots: { default: 'Texts' },
    })

    const link = screen.getByText('Texts').closest('a')
    expect(link).toHaveClass('group', 'relative', 'flex', 'items-center')
  })

  it('applies mobile styles when mobile prop is true', () => {
    renderWithStore(NavLink, {
      props: {
        to: '/texts',
        mobile: true,
      },
      slots: { default: 'Texts' },
    })

    const link = screen.getByText('Texts').closest('a')
    expect(link).toHaveClass('px-4', 'py-3', 'w-full')
  })

  it('applies desktop styles when mobile prop is false', () => {
    renderWithStore(NavLink, {
      props: {
        to: '/texts',
        mobile: false,
      },
      slots: { default: 'Texts' },
    })

    const link = screen.getByText('Texts').closest('a')
    expect(link).toHaveClass('px-4', 'py-2')
  })

  it('shows different icons correctly', () => {
    renderWithStore(NavLink, {
      props: {
        to: '/texts',
        icon: 'HomeIcon',
      },
      slots: { default: 'Home' },
    })

    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
