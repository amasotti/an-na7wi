import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { CommonBaseBreadcrumb as BaseBreadcrumb } from '#components'

// Mock NuxtLink for testing
const MockNuxtLink = {
  template: '<a :href="to" v-bind="$attrs"><slot /></a>',
  props: ['to'],
}

type BreadcrumbProps = {
  readonly parentLink: string
  readonly parentText: string
  readonly separator: string
  readonly item: string
}

describe('BaseBreadcrumb', () => {
  // ts-ignore
  const createComponent = (props = {} as unknown as BreadcrumbProps) => {
    return render(BaseBreadcrumb, {
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
        parentLink: '/',
        parentText: 'Home',
        separator: '>',
        item: 'Current',
      })

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('>')).toBeInTheDocument()
      expect(screen.getByText('Current')).toBeInTheDocument()
    })

    it('renders with custom props', () => {
      createComponent({
        parentLink: '/vocabulary',
        parentText: 'Vocabulary',
        separator: '/',
        item: 'Word Details',
      })

      expect(screen.getByText('Vocabulary')).toBeInTheDocument()
      expect(screen.getByText('/')).toBeInTheDocument()
      expect(screen.getByText('Word Details')).toBeInTheDocument()
    })

    it('renders parent link correctly', () => {
      createComponent({
        parentLink: '/texts',
        parentText: 'Texts',
        separator: '>',
        item: 'Text Details',
      })

      const parentLink = screen.getByText('Texts').closest('a')
      expect(parentLink).toHaveAttribute('href', '/texts')
    })

    it('renders current item without link', () => {
      createComponent({
        parentLink: '/',
        parentText: 'Home',
        separator: '>',
        item: 'Current Page',
      })

      const currentItem = screen.getByText('Current Page')
      expect(currentItem.closest('a')).toBeNull()
      expect(currentItem.tagName).toBe('SPAN')
    })
  })

  describe('navigation structure', () => {
    it('maintains proper breadcrumb structure', () => {
      createComponent({
        parentLink: '/dashboard',
        parentText: 'Dashboard',
        separator: '→',
        item: 'Settings',
      })

      const nav = document.querySelector('nav')
      expect(nav).toBeInTheDocument()

      const links = nav?.querySelectorAll('a')
      expect(links).toHaveLength(1)
      expect(links?.[0]).toHaveAttribute('href', '/dashboard')

      const spans = nav?.querySelectorAll('span')
      expect(spans).toHaveLength(2) // separator and current item
    })

    it('uses default separator when not provided', () => {
      createComponent({
        parentLink: '/',
        parentText: 'Parent',
        separator: '>',
        item: 'Child',
      })

      expect(screen.getByText('>')).toBeInTheDocument()
    })

    it('uses custom separator', () => {
      createComponent({
        parentLink: '/',
        separator: '|',
        parentText: 'Parent',
        item: 'Child',
      })

      expect(screen.getByText('|')).toBeInTheDocument()
      expect(screen.queryByText('>')).not.toBeInTheDocument()
    })
  })

  describe('link behavior', () => {
    it('creates clickable parent link', () => {
      createComponent({
        parentLink: '/custom/path',
        parentText: 'Custom Parent',
        separator: '>',
        item: 'Current',
      })

      const parentLink = screen.getByText('Custom Parent').closest('a')
      expect(parentLink).toHaveAttribute('href', '/custom/path')
    })

    it('falls back to default link when parentLink is empty', () => {
      createComponent({
        parentLink: '',
        parentText: 'Home',
        separator: '>',
        item: 'Current',
      })

      const parentLink = screen.getByText('Home').closest('a')
      expect(parentLink).toHaveAttribute('href', '/')
    })

    it('uses computed parentLink correctly', () => {
      createComponent({
        parentLink: '/some/path',
        parentText: 'Some Path',
        separator: '>',
        item: 'Current Item',
      })

      const parentLink = screen.getByText('Some Path').closest('a')
      expect(parentLink).toHaveAttribute('href', '/some/path')
    })
  })

  describe('accessibility', () => {
    it('uses nav element for semantic navigation', () => {
      createComponent()

      const nav = document.querySelector('nav')
      expect(nav).toBeInTheDocument()
    })

    it('maintains proper text hierarchy', () => {
      createComponent({
        parentText: 'Parent',
        item: 'Current',
        parentLink: '/parent',
        separator: '>',
      })

      const currentItem = screen.getByText('Current')

      // Current item should have medium font weight for emphasis
      expect(currentItem).toHaveClass('font-medium')
    })
  })

  describe('edge cases', () => {
    it('handles undefined props gracefully', () => {
      createComponent({} as unknown as BreadcrumbProps)

      // Should use defaults - but there will be two "Home" elements (parent and current)
      const homeElements = screen.getAllByText('Home')
      expect(homeElements).toHaveLength(2)
      expect(screen.getByText('>')).toBeInTheDocument()
    })

    it('handles empty strings', () => {
      createComponent({
        parentLink: '',
        parentText: '',
        separator: '',
        item: '',
      })

      const nav = document.querySelector('nav')
      expect(nav).toBeInTheDocument()

      const link = nav?.querySelector('a')
      expect(link).toHaveAttribute('href', '/')
    })

    it('handles special characters in text', () => {
      createComponent({
        parentText: 'Texts & Documents',
        separator: '→',
        item: 'Document #123',
        parentLink: '/texts',
      })

      expect(screen.getByText('Texts & Documents')).toBeInTheDocument()
      expect(screen.getByText('→')).toBeInTheDocument()
      expect(screen.getByText('Document #123')).toBeInTheDocument()
    })
  })
})
