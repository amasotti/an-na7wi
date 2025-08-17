import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { AnnotationPanel } from '#components'
import type { Annotation } from '~/types'
import { AnnotationType, MasteryLevel } from '~/types'

// Mock child components
vi.mock('../common/BaseCard.vue', () => ({
  default: {
    template: '<div data-testid="base-card"><slot /></div>',
  },
}))

vi.mock('../common/BaseIcon.vue', () => ({
  default: {
    template: '<svg data-testid="base-icon"><slot /></svg>',
    props: ['size'],
  },
}))

vi.mock('../common/BaseButton.vue', () => ({
  default: {
    template: '<button data-testid="base-button" @click="$emit(\'click\')"><slot /></button>',
    props: ['variant', 'size'],
  },
}))

vi.mock('../common/BaseBadge.vue', () => ({
  default: {
    template: '<span data-testid="base-badge"><slot /></span>',
    props: ['variant', 'size'],
  },
}))

describe('AnnotationPanel', () => {
  const mockAnnotations: Annotation[] = [
    {
      id: '1',
      textId: '1',
      type: AnnotationType.VOCABULARY,
      content: 'هذا',
      anchorText: 'هذا نص تجريبي',
      needsReview: false,
      masteryLevel: MasteryLevel.MASTERED,
      createdAt: '2024-01-01T00:00:00Z',
      linkedWords: [],
    },
    {
      id: '2',
      textId: '1',
      type: AnnotationType.GRAMMAR,
      content: 'هذا مثال آخر',
      anchorText: 'هذا مثال',
      needsReview: true,
      masteryLevel: MasteryLevel.MASTERED,
      createdAt: '2024-01-02T00:00:00Z',
      linkedWords: [],
    },
  ]

  it('renders correctly with annotations', () => {
    const wrapper = mount(AnnotationPanel, {
      props: {
        annotations: mockAnnotations,
      },
    })

    expect(wrapper.find('[data-testid="base-card"]').exists()).toBe(true)
    expect(wrapper.find('h2').text()).toBe('Annotations')
  })

  it('shows empty state when no annotations', () => {
    const wrapper = mount(AnnotationPanel, {
      props: {
        annotations: [],
      },
    })

    expect(wrapper.text()).toContain('No annotations yet')
    expect(wrapper.text()).toContain('Select text and click "Annotate"')
    expect(wrapper.find('[data-testid="base-button"]').exists()).toBe(true)
  })

  it('shows new annotation button when annotations exist', () => {
    const wrapper = mount(AnnotationPanel, {
      props: {
        annotations: mockAnnotations,
      },
    })

    const buttons = wrapper.findAll('[data-testid="base-button"]')
    expect(buttons.some(button => button.text().includes('New'))).toBe(true)
  })

  it('displays all annotations', () => {
    const wrapper = mount(AnnotationPanel, {
      props: {
        annotations: mockAnnotations,
      },
    })

    expect(wrapper.text()).toContain(mockAnnotations[0]!.anchorText)
    expect(wrapper.text()).toContain(mockAnnotations[0]!.content)
    expect(wrapper.text()).toContain(mockAnnotations[1]!.anchorText)
    expect(wrapper.text()).toContain(mockAnnotations[1]!.content)
  })

  it('shows annotation types with badges', () => {
    const wrapper = mount(AnnotationPanel, {
      props: {
        annotations: mockAnnotations,
      },
    })

    const badges = wrapper.findAll('[data-testid="base-badge"]')
    expect(badges.length).toBe(mockAnnotations.length)
    expect(wrapper.text()).toContain('VOCABULARY')
    expect(wrapper.text()).toContain('GRAMMAR')
  })

  it('shows needs review indicator', () => {
    const wrapper = mount(AnnotationPanel, {
      props: {
        annotations: mockAnnotations,
      },
    })

    expect(wrapper.text()).toContain('Needs Review')
  })

  it('emits create-annotation event when create button clicked', async () => {
    const wrapper = mount(AnnotationPanel, {
      props: {
        annotations: [],
      },
    })

    await wrapper.find('[data-testid="base-button"]').trigger('click')

    expect(wrapper.emitted('create-annotation')).toBeTruthy()
  })

  it('emits create-annotation event when new button clicked', async () => {
    const wrapper = mount(AnnotationPanel, {
      props: {
        annotations: mockAnnotations,
      },
    })

    const newButton = wrapper
      .findAll('[data-testid="base-button"]')
      .find(button => button.text().includes('New'))

    await newButton?.trigger('click')

    expect(wrapper.emitted('create-annotation')).toBeTruthy()
  })

  it('emits edit-annotation event when annotation clicked', async () => {
    const wrapper = mount(AnnotationPanel, {
      props: {
        annotations: mockAnnotations,
      },
    })

    const annotationItems = wrapper.findAll('.group.p-5')
    await annotationItems[0]!.trigger('click')

    expect(wrapper.emitted('edit-annotation')).toBeTruthy()
    expect(wrapper.emitted('edit-annotation')![0]).toEqual([mockAnnotations[0]])
  })

  it('formats annotation dates correctly', () => {
    const wrapper = mount(AnnotationPanel, {
      props: {
        annotations: [mockAnnotations[0]!],
      },
    })

    // The date should be formatted as "Jan 1" for 2024-01-01
    expect(wrapper.text()).toContain('Jan 1')
  })

  it('returns correct badge variants for annotation types', () => {
    const wrapper = mount(AnnotationPanel, {
      props: {
        annotations: [
          { ...mockAnnotations[0]!, type: AnnotationType.GRAMMAR },
          { ...mockAnnotations[0]!, type: AnnotationType.VOCABULARY },
          { ...mockAnnotations[0]!, type: AnnotationType.CULTURAL },
          { ...mockAnnotations[0]!, type: AnnotationType.OTHER },
        ],
      },
    })

    const badges = wrapper.findAll('[data-testid="base-badge"]')
    expect(badges.length).toBe(4)
  })

  it('handles unknown annotation types gracefully', () => {
    const annotationWithUnknownType = {
      ...mockAnnotations[0]!,
      type: 'UNKNOWN' as unknown as AnnotationType,
    }

    const wrapper = mount(AnnotationPanel, {
      props: {
        annotations: [annotationWithUnknownType],
      },
    })

    expect(wrapper.find('[data-testid="base-badge"]').exists()).toBe(true)
  })

  it('shows hover effects on annotation items', () => {
    const wrapper = mount(AnnotationPanel, {
      props: {
        annotations: mockAnnotations,
      },
    })

    const annotationItems = wrapper.findAll('.group.p-5')
    expect(annotationItems[0]!.classes()).toContain('hover:border-gray-300')
    expect(annotationItems[0]!.classes()).toContain('hover:bg-gray-50')
  })

  it('does not show needs review indicator for annotations that do not need review', () => {
    const annotationWithoutReview = {
      ...mockAnnotations[0]!,
      needsReview: false,
    }

    const wrapper = mount(AnnotationPanel, {
      props: {
        annotations: [annotationWithoutReview],
      },
    })

    expect(wrapper.text()).not.toContain('Needs Review')
  })
})
