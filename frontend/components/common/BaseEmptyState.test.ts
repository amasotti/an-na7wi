import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { CommonBaseEmptyState as BaseEmptyState } from '#components'

// Mock NuxtLink for testing
const MockNuxtLink = {
  template: '<a :href="to" v-bind="$attrs"><slot /></a>',
  props: ['to'],
}

describe('BaseEmptyState', () => {
  const createComponent = (props = {}) => {
    return render(BaseEmptyState, {
      props,
      global: {
        components: {
          NuxtLink: MockNuxtLink,
        },
        stubs: {
          NuxtLink: MockNuxtLink,
        },
      },
    })
  }

  describe('rendering', () => {
    it('renders with default props', () => {
      createComponent({
        message: 'No data available',
        linkText: 'Go Back',
        link: '/',
      })

      expect(screen.getByText('No data available')).toBeInTheDocument()
      expect(screen.getByText('Go Back')).toBeInTheDocument()
    })

    it('renders with custom props', () => {
      createComponent({
        message: 'No words found',
        linkText: 'Add New Word',
        link: '/vocabulary/new',
      })

      expect(screen.getByText('No words found')).toBeInTheDocument()
      expect(screen.getByText('Add New Word')).toBeInTheDocument()
    })

    it('renders custom message correctly', () => {
      createComponent({
        message: 'Your vocabulary list is empty. Start adding some words!',
        linkText: 'Go Back',
        link: '/',
      })

      expect(
        screen.getByText('Your vocabulary list is empty. Start adding some words!')
      ).toBeInTheDocument()
    })

    it('renders custom link text', () => {
      createComponent({
        message: 'No data available',
        linkText: 'Create First Text',
        link: '/',
      })

      expect(screen.getByText('Create First Text')).toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('creates link with correct href', () => {
      createComponent({
        link: '/texts/new',
        linkText: 'Create New Text',
      })

      const link = screen.getByText('Create New Text').closest('a')
      expect(link).toHaveAttribute('href', '/texts/new')
    })

    it('uses default link when not provided', () => {
      createComponent({
        message: 'No data available',
        linkText: 'Go Home',
      })

      const link = screen.getByText('Go Home').closest('a')
      expect(link).toHaveAttribute('href', '/')
    })

    it('falls back to default link for empty link prop', () => {
      createComponent({
        link: '',
        linkText: 'Go Back',
      })

      const link = screen.getByText('Go Back').closest('a')
      expect(link).toHaveAttribute('href', '/')
    })

    it('uses computed goBackLink correctly', () => {
      createComponent({
        link: '/dashboard',
        linkText: 'Back to Dashboard',
      })

      const link = screen.getByText('Back to Dashboard').closest('a')
      expect(link).toHaveAttribute('href', '/dashboard')
    })
  })

  describe('layout and structure', () => {
    it('uses nav element for semantic structure', () => {
      createComponent()

      const nav = document.querySelector('nav')
      expect(nav).toBeInTheDocument()
    })

    it('centers content appropriately', () => {
      createComponent()

      const nav = document.querySelector('nav')
      expect(nav).toHaveClass('text-center')
    })

    it('maintains proper spacing', () => {
      createComponent()

      const nav = document.querySelector('nav')
      expect(nav).toHaveClass('py-12')
    })
  })

  describe('edge cases', () => {
    it('handles undefined props gracefully', () => {
      createComponent({
        message: undefined,
        linkText: undefined,
        link: undefined,
      })

      // Should use defaults
      expect(screen.getByText('No data available')).toBeInTheDocument()
      expect(screen.getByText('Go Back')).toBeInTheDocument()

      const link = screen.getByText('Go Back').closest('a')
      expect(link).toHaveAttribute('href', '/')
    })

    it('handles empty strings', () => {
      createComponent({
        message: '',
        linkText: '',
        link: '',
      })

      // Empty message should still render (even if empty)
      const messageDiv = document.querySelector('.text-gray-400')
      expect(messageDiv).toBeInTheDocument()

      // Empty link text should render but might be invisible
      const link = document.querySelector('a')
      expect(link).toHaveAttribute('href', '/')
    })

    it('handles long messages', () => {
      const longMessage =
        'This is a very long message that might wrap to multiple lines and should still be displayed correctly in the empty state component'
      createComponent({
        message: longMessage,
      })

      expect(screen.getByText(longMessage)).toBeInTheDocument()
    })

    it('handles special characters in props', () => {
      createComponent({
        message: 'No results found for "advanced search"',
        linkText: 'Try Again →',
        link: '/search?reset=true',
      })

      expect(screen.getByText('No results found for "advanced search"')).toBeInTheDocument()
      expect(screen.getByText('Try Again →')).toBeInTheDocument()

      const link = screen.getByText('Try Again →').closest('a')
      expect(link).toHaveAttribute('href', '/search?reset=true')
    })
  })

  describe('accessibility', () => {
    it('provides meaningful link text', () => {
      createComponent({
        linkText: 'Add your first vocabulary word',
        link: '/vocabulary/new',
      })

      const link = screen.getByText('Add your first vocabulary word')
      expect(link).toBeInTheDocument()
      expect(link.closest('a')).toHaveAttribute('href', '/vocabulary/new')
    })

    it('maintains proper text color contrast', () => {
      createComponent()

      const message = document.querySelector('.text-gray-400')
      expect(message).toBeInTheDocument()
    })
  })

  describe('use cases', () => {
    it('renders empty vocabulary state', () => {
      createComponent({
        message: 'No vocabulary words yet',
        linkText: 'Add First Word',
        link: '/vocabulary/new',
      })

      expect(screen.getByText('No vocabulary words yet')).toBeInTheDocument()
      expect(screen.getByText('Add First Word')).toBeInTheDocument()
    })

    it('renders empty texts state', () => {
      createComponent({
        message: 'No texts available',
        linkText: 'Create New Text',
        link: '/texts/new',
      })

      expect(screen.getByText('No texts available')).toBeInTheDocument()
      expect(screen.getByText('Create New Text')).toBeInTheDocument()
    })

    it('renders search results empty state', () => {
      createComponent({
        message: 'No results found for your search',
        linkText: 'Clear Search',
        link: '/search',
      })

      expect(screen.getByText('No results found for your search')).toBeInTheDocument()
      expect(screen.getByText('Clear Search')).toBeInTheDocument()
    })
  })
})
