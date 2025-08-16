import { render, screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { RootsContent } from '#components'
import { useRootStore } from '#imports'
import { mockedRoots } from '~/test/mocks/roots.mock'

describe('RootContent', () => {
  const pinia = usePinia()
  let rootStore: ReturnType<typeof useRootStore>

  const renderComponent = () =>
    render(RootsContent, {
      global: {
        // provide the testing pinia instance as a plugin
        plugins: [pinia],
        stubs: {
          // useful visible stubs that preserve props/emits so tests assert behavior
          LoadingEffect: {
            template: '<div>LoadingEffect</div>',
          },
          BaseErrorState: {
            props: ['message', 'error'],
            template: '<div>{{ message }}</div>',
          },
          BaseEmptyState: {
            props: ['message', 'link', 'linkText'],
            template: '<div>{{ message }}</div>',
          },

          // Child components should emit the same events the real ones do.
          RootCard: {
            props: ['root'],
            template:
              '<button data-testid="root-card" @click="$emit(\'click\')">root-card</button>',
          },
          RootListItem: {
            props: ['root'],
            template:
              '<button data-testid="root-list-item" @click="$emit(\'click\')">root-list-item</button>',
          },
          ViewToggle: {
            emits: ['update:modelValue'],
            template:
              '<button data-testid="toggle" @click="$emit(\'update:modelValue\', \'TABLE\')">toggle</button>',
          },
          Pagination: {
            props: ['currentPage', 'totalPages', 'totalCount', 'pageSize'],
            emits: ['page-change'],
            template: '<div data-testid="pagination">pagination</div>',
          },
        },
      },
    })

  beforeEach(() => {
    // now get the store instance (do NOT import the store module directly in Nuxt tests)
    rootStore = useRootStore()

    // ensure a predictable initial shape
    rootStore.loading = false
    rootStore.error = null
    rootStore.roots = []
    rootStore.pagination = { page: 1, totalPages: 1, totalCount: 0, size: 10 }
  })

  it('renders loading state', () => {
    rootStore.loading = true
    renderComponent()
    expect(screen.getByText('LoadingEffect')).toBeInTheDocument()
  })

  it('renders error state', () => {
    rootStore.error = 'some-error'
    renderComponent()
    expect(screen.getByText('Failed to load roots')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    rootStore.loading = false
    rootStore.roots = []
    renderComponent()
    expect(screen.getByText(/no roots found/i)).toBeInTheDocument()
  })

  it('renders grid view when roots exist', () => {
    rootStore.roots = mockedRoots
    renderComponent()
    expect(screen.getAllByTestId('root-card')).toHaveLength(mockedRoots.length)
  })

  it('shows pagination when multiple pages exist', () => {
    rootStore.roots = mockedRoots
    rootStore.pagination = { page: 1, totalPages: 2, totalCount: 10, size: 5 }
    renderComponent()
    expect(screen.getByTestId('pagination')).toBeInTheDocument()
  })
})
