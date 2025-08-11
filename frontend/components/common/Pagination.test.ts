import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { CommonPagination as Pagination } from '#components'

describe('Pagination', () => {
  it('renders current page correctly', () => {
    render(Pagination, {
      props: { currentPage: 2, totalPages: 5 },
    })

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('disables previous button on first page', () => {
    render(Pagination, {
      props: { currentPage: 1, totalPages: 5 },
    })

    const prevButton = screen.getAllByRole('button')[0]
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(Pagination, {
      props: { currentPage: 5, totalPages: 5 },
    })

    const buttons = screen.getAllByRole('button')
    const nextButton = buttons[buttons.length - 1]
    expect(nextButton).toBeDisabled()
  })

  it('emits page-change event when clicking page number', async () => {
    const { emitted } = render(Pagination, {
      props: { currentPage: 2, totalPages: 5 },
    })

    const pageButton = screen.getByText('3')
    await fireEvent.click(pageButton)

    expect(emitted()['page-change']).toBeTruthy()
    expect(emitted()['page-change']![0]).toEqual([3])
  })

  it('shows ellipsis for large page ranges', () => {
    render(Pagination, {
      props: { currentPage: 5, totalPages: 20 },
    })

    expect(screen.getAllByText('...').length).toBeGreaterThan(0)
  })
})
