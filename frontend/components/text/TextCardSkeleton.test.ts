import { describe, expect, it } from 'vitest'
import { TextCardSkeleton } from '#components'
import { renderWithStore } from '~/test/test-utils'

describe('TextCardSkeleton', () => {
  it('renders skeleton loading animation', () => {
    renderWithStore(TextCardSkeleton)

    const skeletonContainer = document.querySelector('.animate-pulse')
    expect(skeletonContainer).toBeInTheDocument()
  })

  it('applies correct base styling', () => {
    renderWithStore(TextCardSkeleton)

    const container = document.querySelector('.bg-white\\/80')
    expect(container).toBeInTheDocument()
    expect(container).toHaveClass('backdrop-blur-sm', 'rounded-2xl', 'shadow-lg', 'border', 'p-6')
  })

  it('renders header skeleton elements', () => {
    renderWithStore(TextCardSkeleton)

    // Check for title placeholder
    const titleSkeleton = document.querySelector('.h-5.bg-gray-200.rounded-lg.w-3\\/4')
    expect(titleSkeleton).toBeInTheDocument()

    // Check for badge placeholders
    const badgePlaceholders = document.querySelectorAll('.h-4.bg-gray-200.rounded-full')
    expect(badgePlaceholders.length).toBeGreaterThanOrEqual(2)

    // Check for action button placeholder
    const actionButtonSkeleton = document.querySelector('.w-8.h-8.bg-gray-200.rounded-lg')
    expect(actionButtonSkeleton).toBeInTheDocument()
  })

  it('renders content skeleton lines', () => {
    renderWithStore(TextCardSkeleton)

    // Check for content lines
    const contentLines = document.querySelectorAll('.h-4.bg-gray-200.rounded')
    expect(contentLines.length).toBeGreaterThanOrEqual(3)

    // Check different widths for content lines
    const fullWidthLine = document.querySelector('.w-full')
    const mediumWidthLine = document.querySelector('.w-5\\/6')
    const smallWidthLine = document.querySelector('.w-4\\/6')

    expect(fullWidthLine).toBeInTheDocument()
    expect(mediumWidthLine).toBeInTheDocument()
    expect(smallWidthLine).toBeInTheDocument()
  })

  it('renders tag skeleton placeholders', () => {
    renderWithStore(TextCardSkeleton)

    // Check for tag placeholders
    const tagPlaceholders = document.querySelectorAll('.h-6.bg-gray-200.rounded-full')
    expect(tagPlaceholders.length).toBeGreaterThanOrEqual(3)

    // Check for different tag widths
    const tag1 = document.querySelector('.w-16')
    const tag2 = document.querySelector('.w-12')
    const tag3 = document.querySelector('.w-14')

    expect(tag1).toBeInTheDocument()
    expect(tag2).toBeInTheDocument()
    expect(tag3).toBeInTheDocument()
  })

  it('renders footer skeleton elements', () => {
    renderWithStore(TextCardSkeleton)

    // Check for footer elements
    const footerElements = document.querySelectorAll(
      '.flex.justify-between.items-center .h-4.bg-gray-200.rounded'
    )
    expect(footerElements.length).toBeGreaterThanOrEqual(3)

    // Check for specific footer widths
    const footerElement1 = document.querySelector('.w-16')
    const footerElement2 = document.querySelector('.w-20')

    expect(footerElement1).toBeInTheDocument()
    expect(footerElement2).toBeInTheDocument()
  })

  it('has proper layout structure', () => {
    renderWithStore(TextCardSkeleton)

    // Check for main sections
    const headerSection = document.querySelector('.flex.justify-between.items-start.mb-4')
    const contentSection = document.querySelector('.mb-4.space-y-2')
    const tagsSection = document.querySelector('.mb-4.flex.space-x-2')
    const footerSection = document.querySelector('.flex.justify-between.items-center')

    expect(headerSection).toBeInTheDocument()
    expect(contentSection).toBeInTheDocument()
    expect(tagsSection).toBeInTheDocument()
    expect(footerSection).toBeInTheDocument()
  })

  it('uses consistent gray color for skeleton elements', () => {
    renderWithStore(TextCardSkeleton)

    // All skeleton elements should use bg-gray-200
    const skeletonElements = document.querySelectorAll('.bg-gray-200')
    expect(skeletonElements.length).toBeGreaterThan(10)
  })

  it('has appropriate spacing between elements', () => {
    renderWithStore(TextCardSkeleton)

    // Check for proper spacing classes
    const spacedElements = document.querySelectorAll('.space-x-2, .space-y-2, .space-x-4')
    expect(spacedElements.length).toBeGreaterThan(0)

    // Check for margin bottom classes
    const marginElements = document.querySelectorAll('.mb-2, .mb-4')
    expect(marginElements.length).toBeGreaterThan(0)
  })

  it('renders without any props or data', () => {
    // Should render successfully without any props
    expect(() => renderWithStore(TextCardSkeleton)).not.toThrow()
  })

  it('has skeleton elements with appropriate border radius', () => {
    renderWithStore(TextCardSkeleton)

    // Check for rounded elements
    const roundedElements = document.querySelectorAll('.rounded, .rounded-lg, .rounded-full')
    expect(roundedElements.length).toBeGreaterThan(5)
  })
})
