import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { AnalyticsOverviewSection as OverviewSection } from '#components'
import { mockedAnalyticsData } from '~/test/mocks/analytics.mock'

describe('OverviewSection', () => {
  const pinia = usePinia()

  const renderComponent = (props = {}) =>
    render(OverviewSection, {
      props,
      global: {
        plugins: [pinia],
        stubs: {
          SummaryCard: {
            props: ['title', 'count', 'iconClass', 'iconBgClass'],
            template: '<div data-testid="summary-card">{{ title }}: {{ count }}</div>',
          },
        },
      },
    })

  it('renders nothing when no overview data and not loading', () => {
    renderComponent({ overview: undefined, loading: false })

    expect(screen.queryByTestId('summary-card')).not.toBeInTheDocument()
  })
})
