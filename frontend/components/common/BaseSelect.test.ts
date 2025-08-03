import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { CommonBaseSelect as BaseSelect } from '#components'

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

describe('BaseSelect', () => {
  it('renders options correctly', () => {
    render(BaseSelect, {
      props: { options: mockOptions },
    })

    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('renders placeholder when provided', () => {
    render(BaseSelect, {
      props: {
        options: mockOptions,
        placeholder: 'Select an option',
      },
    })

    expect(screen.getByText('Select an option')).toBeInTheDocument()
  })

  it('shows selected value', () => {
    render(BaseSelect, {
      props: {
        options: mockOptions,
        modelValue: 'option2',
      },
    })

    const select = screen.getByDisplayValue('Option 2')
    expect(select).toBeInTheDocument()
  })

  it('emits update:modelValue on change', async () => {
    const { emitted } = render(BaseSelect, {
      props: {
        options: mockOptions,
        modelValue: '',
      },
    })

    const select = screen.getByRole('combobox')
    await fireEvent.update(select, 'option2')

    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue']![0]).toEqual(['option2'])
  })

  it('emits null when empty value selected', async () => {
    const { emitted } = render(BaseSelect, {
      props: {
        options: mockOptions,
        modelValue: 'option1',
        placeholder: 'Select option',
      },
    })

    const select = screen.getByRole('combobox')
    await fireEvent.update(select, '')

    expect(emitted()['update:modelValue']![0]).toEqual([null])
  })

  it('applies size classes correctly', () => {
    // Test small size
    const { unmount } = render(BaseSelect, {
      props: {
        options: mockOptions,
        size: 'sm',
      },
    })

    let select = screen.getByRole('combobox')
    expect(select).toHaveClass('px-3', 'py-2', 'text-sm')

    unmount()

    // Test large size
    render(BaseSelect, {
      props: {
        options: mockOptions,
        size: 'lg',
      },
    })

    select = screen.getByRole('combobox')
    expect(select).toHaveClass('px-5', 'py-4', 'text-lg')
  })

  it('applies disabled styles when disabled', () => {
    render(BaseSelect, {
      props: {
        options: mockOptions,
        disabled: true,
      },
    })

    const select = screen.getByRole('combobox')
    expect(select).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('handles numeric option values', async () => {
    const numericOptions = [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two' },
    ]

    const { emitted } = render(BaseSelect, {
      props: {
        options: numericOptions,
        modelValue: null,
      },
    })

    const select = screen.getByRole('combobox')
    await fireEvent.update(select, '2')

    expect(emitted()['update:modelValue']![0]).toEqual(['2'])
  })

  it('renders dropdown arrow icon', () => {
    render(BaseSelect, {
      props: { options: mockOptions },
    })

    const arrow = document.querySelector('.pointer-events-none')
    expect(arrow).toBeInTheDocument()
  })
})
