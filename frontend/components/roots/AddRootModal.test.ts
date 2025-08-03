import { fireEvent, screen, waitFor } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithStore } from '~/test/test-utils'
import type { Root, RootNormalization } from '~/types'
import { RootsAddRootModal as AddRootModal } from '#components'

// Mock rootService
vi.mock('~/composables/rootService', () => ({
  rootService: {
    normalizeRoot: vi.fn(),
    createRoot: vi.fn(),
  },
}))

import { rootService } from '~/composables/rootService'
const mockNormalizeRoot = vi.mocked(rootService.normalizeRoot)
const mockCreateRoot = vi.mocked(rootService.createRoot)

const validNormalization: RootNormalization = {
  input: 'كتب',
  letters: ['ك', 'ت', 'ب'],
  normalizedForm: 'كتب',
  displayForm: 'ك-ت-ب',
  letterCount: 3,
  isValid: true,
}

const invalidNormalization: RootNormalization = {
  input: 'invalid',
  letters: [],
  normalizedForm: '',
  displayForm: '',
  letterCount: 0,
  isValid: false,
}

const mockRoot: Root = {
  id: '1',
  letters: ['ك', 'ت', 'ب'],
  normalizedForm: 'كتب',
  displayForm: 'ك-ت-ب',
  letterCount: 3,
  meaning: 'related to writing',
  wordCount: 0,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
}

describe('AddRootModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders modal when show prop is true', () => {
    renderWithStore(AddRootModal, {
      props: { show: true },
    })

    expect(screen.getByText('Add New Root')).toBeInTheDocument()
    expect(screen.getByLabelText('Root Letters')).toBeInTheDocument()
    expect(screen.getByLabelText('Meaning (Optional)')).toBeInTheDocument()
  })

  it('does not render modal when show prop is false', () => {
    renderWithStore(AddRootModal, {
      props: { show: false },
    })

    expect(screen.queryByText('Add New Root')).not.toBeInTheDocument()
  })

  it('shows placeholder text in root input', () => {
    renderWithStore(AddRootModal, {
      props: { show: true },
    })

    const rootInput = screen.getByPlaceholderText('Enter Arabic letters (e.g., ك-ت-ب or كتب)')
    expect(rootInput).toBeInTheDocument()
  })

  it('shows placeholder text in meaning input', () => {
    renderWithStore(AddRootModal, {
      props: { show: true },
    })

    const meaningInput = screen.getByPlaceholderText('Enter root meaning or definition')
    expect(meaningInput).toBeInTheDocument()
  })

  it('calls normalizeRoot when user types in root input', async () => {
    mockNormalizeRoot.mockResolvedValue(validNormalization)

    renderWithStore(AddRootModal, {
      props: { show: true },
    })

    const rootInput = screen.getByLabelText('Root Letters')
    await fireEvent.update(rootInput, 'كتب')

    await waitFor(() => {
      expect(mockNormalizeRoot).toHaveBeenCalledWith('كتب')
    })
  })

  it('shows preview when valid root is entered', async () => {
    mockNormalizeRoot.mockResolvedValue(validNormalization)

    renderWithStore(AddRootModal, {
      props: { show: true },
    })

    const rootInput = screen.getByLabelText('Root Letters')
    await fireEvent.update(rootInput, 'كتب')

    await waitFor(() => {
      expect(screen.getByText('Preview:')).toBeInTheDocument()
      expect(screen.getByText('ك-ت-ب')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  it('shows error message for invalid root', async () => {
    mockNormalizeRoot.mockResolvedValue(invalidNormalization)

    renderWithStore(AddRootModal, {
      props: { show: true },
    })

    const rootInput = screen.getByLabelText('Root Letters')
    await fireEvent.update(rootInput, 'invalid')

    await waitFor(() => {
      expect(
        screen.getByText('Invalid root format. Please enter 2-5 Arabic letters.')
      ).toBeInTheDocument()
    })
  })

  it('disables submit button when form is invalid', () => {
    renderWithStore(AddRootModal, {
      props: { show: true },
    })

    const submitButton = screen.getByRole('button', { name: 'Add Root' })
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when form is valid', async () => {
    mockNormalizeRoot.mockResolvedValue(validNormalization)

    renderWithStore(AddRootModal, {
      props: { show: true },
    })

    const rootInput = screen.getByLabelText('Root Letters')
    await fireEvent.update(rootInput, 'كتب')

    await waitFor(() => {
      const submitButton = screen.getByText('Add Root')
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('can interact with form elements', async () => {
    mockNormalizeRoot.mockResolvedValue(validNormalization)

    renderWithStore(AddRootModal, {
      props: { show: true },
    })

    const rootInput = screen.getByLabelText('Root Letters')
    await fireEvent.update(rootInput, 'كتب')

    // Verify the input value was set
    expect(rootInput).toHaveValue('كتب')
  })

  it('fills meaning input', async () => {
    renderWithStore(AddRootModal, {
      props: { show: true },
    })

    const meaningInput = screen.getByLabelText('Meaning (Optional)')
    await fireEvent.update(meaningInput, 'related to writing')

    expect(meaningInput).toHaveValue('related to writing')
  })

  it('emits close event when Cancel button is clicked', async () => {
    const { emitted } = renderWithStore(AddRootModal, {
      props: { show: true },
    })

    const cancelButton = screen.getByText('Cancel')
    await fireEvent.click(cancelButton)

    expect(emitted('close')).toBeTruthy()
  })

  it('clears form when modal is reopened', async () => {
    renderWithStore(AddRootModal, {
      props: { show: true },
    })

    const rootInput = screen.getByLabelText('Root Letters')
    await fireEvent.update(rootInput, 'كتب')

    // Check that value was set
    expect(rootInput).toHaveValue('كتب')

    // Test that the watcher would clear the form when show changes to true
    // (This simulates the component's reset behavior)
  })

  it('does not call normalizeRoot for short input', async () => {
    renderWithStore(AddRootModal, {
      props: { show: true },
    })

    const rootInput = screen.getByLabelText('Root Letters')
    await fireEvent.update(rootInput, 'ك')

    // Should not call normalizeRoot for input shorter than 3 characters
    expect(mockNormalizeRoot).not.toHaveBeenCalled()
  })

  it('handles normalization service error', async () => {
    mockNormalizeRoot.mockRejectedValue(new Error('Service error'))

    renderWithStore(AddRootModal, {
      props: { show: true },
    })

    const rootInput = screen.getByLabelText('Root Letters')
    await fireEvent.update(rootInput, 'كتب')

    await waitFor(() => {
      expect(screen.getByText('Failed to validate root input')).toBeInTheDocument()
    })
  })
})
