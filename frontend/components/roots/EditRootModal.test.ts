import { fireEvent, screen, waitFor } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithStore } from '~/test/test-utils'
import type { Root, RootNormalization } from '~/types'
import { RootsEditRootModal as EditRootModal } from '#components'

// Mock rootService
vi.mock('~/composables/rootService', () => ({
  rootService: {
    normalizeRoot: vi.fn(),
    updateRoot: vi.fn(),
  },
}))

import { rootService } from '~/composables/rootService'
const mockNormalizeRoot = vi.mocked(rootService.normalizeRoot)
const mockUpdateRoot = vi.mocked(rootService.updateRoot)

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

const updatedMockRoot: Root = {
  ...mockRoot,
  meaning: 'updated meaning',
}

describe('EditRootModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders modal when show prop is true', () => {
    renderWithStore(EditRootModal, {
      props: { show: true, root: mockRoot },
    })

    expect(screen.getByText('Edit Root')).toBeInTheDocument()
    expect(screen.getByLabelText('Root Letters')).toBeInTheDocument()
    expect(screen.getByLabelText('Meaning (Optional)')).toBeInTheDocument()
  })

  it('does not render modal when show prop is false', () => {
    renderWithStore(EditRootModal, {
      props: { show: false, root: mockRoot },
    })

    expect(screen.queryByText('Edit Root')).not.toBeInTheDocument()
  })

  it('initializes form with root data when modal opens', () => {
    renderWithStore(EditRootModal, {
      props: { show: true, root: mockRoot },
    })

    const rootInput = screen.getByDisplayValue('ك-ت-ب')
    const meaningInput = screen.getByDisplayValue('related to writing')
    
    expect(rootInput).toBeInTheDocument()
    expect(meaningInput).toBeInTheDocument()
  })

  it('shows preview with initial root data', () => {
    renderWithStore(EditRootModal, {
      props: { show: true, root: mockRoot },
    })

    expect(screen.getByText('Preview:')).toBeInTheDocument()
    expect(screen.getByText('ك-ت-ب')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('calls normalizeRoot when user changes root input', async () => {
    mockNormalizeRoot.mockResolvedValue(validNormalization)

    renderWithStore(EditRootModal, {
      props: { show: true, root: mockRoot },
    })

    const rootInput = screen.getByLabelText('Root Letters')
    await fireEvent.update(rootInput, 'قرأ')

    await waitFor(() => {
      expect(mockNormalizeRoot).toHaveBeenCalledWith('قرأ')
    })
  })

  it('shows updated preview when valid root is entered', async () => {
    const newNormalization: RootNormalization = {
      input: 'قرأ',
      letters: ['ق', 'ر', 'أ'],
      normalizedForm: 'قرأ',
      displayForm: 'ق-ر-أ',
      letterCount: 3,
      isValid: true,
    }
    mockNormalizeRoot.mockResolvedValue(newNormalization)

    renderWithStore(EditRootModal, {
      props: { show: true, root: mockRoot },
    })

    const rootInput = screen.getByLabelText('Root Letters')
    await fireEvent.update(rootInput, 'قرأ')

    await waitFor(() => {
      expect(screen.getByText('ق-ر-أ')).toBeInTheDocument()
    })
  })

  it('shows error message for invalid root', async () => {
    mockNormalizeRoot.mockResolvedValue(invalidNormalization)

    renderWithStore(EditRootModal, {
      props: { show: true, root: mockRoot },
    })

    const rootInput = screen.getByLabelText('Root Letters')
    await fireEvent.update(rootInput, 'invalid')

    await waitFor(() => {
      expect(
        screen.getByText('Invalid root format. Please enter 2-5 Arabic letters.')
      ).toBeInTheDocument()
    })
  })

  it('enables submit button when form is valid', async () => {
    renderWithStore(EditRootModal, {
      props: { show: true, root: mockRoot },
    })

    const submitButton = screen.getByRole('button', { name: 'Update Root' })
    expect(submitButton).not.toBeDisabled()
  })

  it('disables submit button when form is invalid', async () => {
    mockNormalizeRoot.mockResolvedValue(invalidNormalization)

    renderWithStore(EditRootModal, {
      props: { show: true, root: mockRoot },
    })

    const rootInput = screen.getByLabelText('Root Letters')
    await fireEvent.update(rootInput, 'invalid')

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: 'Update Root' })
      expect(submitButton).toBeDisabled()
    })
  })

  it('calls updateRoot service when form is submitted', async () => {
    mockUpdateRoot.mockResolvedValue(updatedMockRoot)

    renderWithStore(EditRootModal, {
      props: { show: true, root: mockRoot },
    })

    const meaningInput = screen.getByLabelText('Meaning (Optional)')
    await fireEvent.update(meaningInput, 'updated meaning')

    const submitButton = screen.getByRole('button', { name: 'Update Root' })
    await fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockUpdateRoot).toHaveBeenCalledWith('1', 'ك-ت-ب', 'updated meaning')
    })
  })

  it('emits root-updated event when update is successful', async () => {
    mockUpdateRoot.mockResolvedValue(updatedMockRoot)

    const { emitted } = renderWithStore(EditRootModal, {
      props: { show: true, root: mockRoot },
    })

    const submitButton = screen.getByRole('button', { name: 'Update Root' })
    await fireEvent.click(submitButton)

    await waitFor(() => {
      expect(emitted('root-updated')).toBeTruthy()
      expect(emitted('root-updated')[0]).toEqual([updatedMockRoot])
    })
  })

  it('emits close event when update is successful', async () => {
    mockUpdateRoot.mockResolvedValue(updatedMockRoot)

    const { emitted } = renderWithStore(EditRootModal, {
      props: { show: true, root: mockRoot },
    })

    const submitButton = screen.getByRole('button', { name: 'Update Root' })
    await fireEvent.click(submitButton)

    await waitFor(() => {
      expect(emitted('close')).toBeTruthy()
    })
  })

  it('shows error message when update fails', async () => {
    mockUpdateRoot.mockRejectedValue(new Error('Update failed'))

    renderWithStore(EditRootModal, {
      props: { show: true, root: mockRoot },
    })

    const submitButton = screen.getByRole('button', { name: 'Update Root' })
    await fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeInTheDocument()
    })
  })

  it('emits close event when Cancel button is clicked', async () => {
    const { emitted } = renderWithStore(EditRootModal, {
      props: { show: true, root: mockRoot },
    })

    const cancelButton = screen.getByText('Cancel')
    await fireEvent.click(cancelButton)

    expect(emitted('close')).toBeTruthy()
  })

  it('clears form when modal is closed and reopened', async () => {
    const { rerender } = renderWithStore(EditRootModal, {
      props: { show: true, root: mockRoot },
    })

    const meaningInput = screen.getByLabelText('Meaning (Optional)')
    await fireEvent.update(meaningInput, 'changed meaning')

    // Close modal
    await rerender({ show: false, root: mockRoot })

    // Reopen modal
    await rerender({ show: true, root: mockRoot })

    // Form should be reset to original values
    const resetMeaningInput = screen.getByDisplayValue('related to writing')
    expect(resetMeaningInput).toBeInTheDocument()
  })

  it('handles normalization service error', async () => {
    mockNormalizeRoot.mockRejectedValue(new Error('Service error'))

    renderWithStore(EditRootModal, {
      props: { show: true, root: mockRoot },
    })

    const rootInput = screen.getByLabelText('Root Letters')
    await fireEvent.update(rootInput, 'newroot')

    await waitFor(() => {
      expect(screen.getByText('Failed to validate root input')).toBeInTheDocument()
    })
  })

  it('does not call normalizeRoot for short input', async () => {
    renderWithStore(EditRootModal, {
      props: { show: true, root: mockRoot },
    })

    const rootInput = screen.getByLabelText('Root Letters')
    await fireEvent.update(rootInput, 'ك')

    // Should not call normalizeRoot for input shorter than 3 characters
    expect(mockNormalizeRoot).not.toHaveBeenCalled()
  })

  it('handles null root prop gracefully', () => {
    renderWithStore(EditRootModal, {
      props: { show: true, root: null },
    })

    // Should render without errors
    expect(screen.getByText('Edit Root')).toBeInTheDocument()
  })
})
