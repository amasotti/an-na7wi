import { fireEvent, screen, waitFor } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithStore } from '~/test/test-utils'
import type { Root, RootNormalization } from '~/types'
import { RootsRootModal as RootModal } from '#components'

// Mock rootService
vi.mock('~/composables/rootService', () => ({
  rootService: {
    normalizeRoot: vi.fn(),
    updateRoot: vi.fn(),
    createRoot: vi.fn(),
  },
}))

import { rootService } from '~/composables/rootService'
const mockNormalizeRoot = vi.mocked(rootService.normalizeRoot)
const mockUpdateRoot = vi.mocked(rootService.updateRoot)
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
  analysis: '',
  wordCount: 0,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
}

const updatedMockRoot: Root = {
  ...mockRoot,
  meaning: 'updated meaning',
}

const newMockRoot: Root = {
  id: '2',
  letters: ['ق', 'ر', 'أ'],
  normalizedForm: 'قرأ',
  displayForm: 'ق-ر-أ',
  letterCount: 3,
  meaning: 'related to reading',
  analysis: '',
  wordCount: 0,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
}

describe('RootModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Add Mode', () => {
    it('renders modal with add title when no root is provided', () => {
      renderWithStore(RootModal, {
        props: { open: true },
      })

      expect(screen.getByText('Add New Root')).toBeInTheDocument()
      expect(screen.getByLabelText('Root Letters *')).toBeInTheDocument()
      expect(screen.getByLabelText('Meaning (Optional)')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Create new root' })).toBeInTheDocument()
    })

    it('emits root-created event when creation is successful', async () => {
      mockNormalizeRoot.mockResolvedValue(validNormalization)
      mockCreateRoot.mockResolvedValue(newMockRoot)

      const { emitted } = renderWithStore(RootModal, {
        props: { open: true },
      })

      // Fill the form with valid data first
      const rootInput = screen.getByLabelText('Root Letters *')
      await fireEvent.update(rootInput, 'قرأ')

      // Wait for normalization to complete
      await waitFor(() => {
        expect(mockNormalizeRoot).toHaveBeenCalledWith('قرأ')
      })

      // Now submit the form
      const submitButton = screen.getByRole('button', { name: 'Create new root' })
      await fireEvent.click(submitButton)

      await waitFor(() => {
        expect(emitted('root-created')).toBeTruthy()
        expect(emitted('root-created')[0]).toEqual([newMockRoot])
      })
    })
  })

  describe('Edit Mode', () => {
    it('renders modal with edit title when root is provided', () => {
      renderWithStore(RootModal, {
        props: { open: true, root: mockRoot },
      })

      expect(screen.getByText('Edit Root')).toBeInTheDocument()
      expect(screen.getByLabelText('Root Letters *')).toBeInTheDocument()
      expect(screen.getByLabelText('Meaning (Optional)')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Update root information' })).toBeInTheDocument()
    })

    it('initializes form with root data when modal opens', () => {
      renderWithStore(RootModal, {
        props: { open: true, root: mockRoot },
      })

      const rootInput = screen.getByDisplayValue('ك-ت-ب')
      const meaningInput = screen.getByDisplayValue('related to writing')

      expect(rootInput).toBeInTheDocument()
      expect(meaningInput).toBeInTheDocument()
    })

    it('emits root-updated event when update is successful', async () => {
      mockUpdateRoot.mockResolvedValue(updatedMockRoot)

      const { emitted } = renderWithStore(RootModal, {
        props: { open: true, root: mockRoot },
      })

      const submitButton = screen.getByRole('button', { name: 'Update root information' })
      await fireEvent.click(submitButton)

      await waitFor(() => {
        expect(emitted('root-updated')).toBeTruthy()
        expect(emitted('root-updated')[0]).toEqual([updatedMockRoot])
      })
    })

    it('calls updateRoot service when form is submitted', async () => {
      mockUpdateRoot.mockResolvedValue(updatedMockRoot)

      renderWithStore(RootModal, {
        props: { open: true, root: mockRoot },
      })

      const meaningInput = screen.getByLabelText('Meaning (Optional)')
      await fireEvent.update(meaningInput, 'updated meaning')

      const submitButton = screen.getByRole('button', { name: 'Update root information' })
      await fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockUpdateRoot).toHaveBeenCalledWith('1', 'ك-ت-ب', 'updated meaning', '')
      })
    })
  })

  describe('Common Functionality', () => {
    it('does not render modal when open prop is false', () => {
      renderWithStore(RootModal, {
        props: { open: false, root: mockRoot },
      })

      expect(screen.queryByText('Edit Root')).not.toBeInTheDocument()
    })

    it('calls normalizeRoot when user changes root input', async () => {
      mockNormalizeRoot.mockResolvedValue(validNormalization)

      renderWithStore(RootModal, {
        props: { open: true, root: mockRoot },
      })

      const rootInput = screen.getByLabelText('Root Letters *')
      await fireEvent.update(rootInput, 'قرأ')

      await waitFor(() => {
        expect(mockNormalizeRoot).toHaveBeenCalledWith('قرأ')
      })
    })

    it('enables submit button when form is valid', () => {
      renderWithStore(RootModal, {
        props: { open: true, root: mockRoot },
      })

      const submitButton = screen.getByRole('button', { name: 'Update root information' })
      expect(submitButton).not.toBeDisabled()
    })

    it('disables submit button when form is invalid', async () => {
      mockNormalizeRoot.mockResolvedValue(invalidNormalization)

      renderWithStore(RootModal, {
        props: { open: true, root: mockRoot },
      })

      const rootInput = screen.getByLabelText('Root Letters *')
      await fireEvent.update(rootInput, 'invalid')

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: 'Update root information' })
        expect(submitButton).toBeDisabled()
      })
    })

    it('emits close event when form action is successful', async () => {
      mockUpdateRoot.mockResolvedValue(updatedMockRoot)

      const { emitted } = renderWithStore(RootModal, {
        props: { open: true, root: mockRoot },
      })

      const submitButton = screen.getByRole('button', { name: 'Update root information' })
      await fireEvent.click(submitButton)

      await waitFor(() => {
        expect(emitted('close')).toBeTruthy()
      })
    })

    it('shows error message when operation fails', async () => {
      mockUpdateRoot.mockRejectedValue(new Error('Update failed'))

      renderWithStore(RootModal, {
        props: { open: true, root: mockRoot },
      })

      const submitButton = screen.getByRole('button', { name: 'Update root information' })
      await fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Update failed')).toBeInTheDocument()
      })
    })

    it('emits close event when Cancel button is clicked', async () => {
      const { emitted } = renderWithStore(RootModal, {
        props: { open: true, root: mockRoot },
      })

      const cancelButton = screen.getByText('Cancel')
      await fireEvent.click(cancelButton)

      expect(emitted('close')).toBeTruthy()
    })

    it('clears form when modal is closed and reopened', async () => {
      const { rerender } = renderWithStore(RootModal, {
        props: { open: true, root: mockRoot },
      })

      const meaningInput = screen.getByLabelText('Meaning (Optional)')
      await fireEvent.update(meaningInput, 'changed meaning')

      // Close modal
      await rerender({ open: false, root: mockRoot })

      // Reopen modal
      await rerender({ open: true, root: mockRoot })

      // Form should be reset to original values
      const resetMeaningInput = screen.getByDisplayValue('related to writing')
      expect(resetMeaningInput).toBeInTheDocument()
    })

    it('handles normalization service error', async () => {
      mockNormalizeRoot.mockRejectedValue(new Error('Service error'))

      renderWithStore(RootModal, {
        props: { open: true, root: mockRoot },
      })

      const rootInput = screen.getByLabelText('Root Letters *')
      await fireEvent.update(rootInput, 'newroot')

      await waitFor(() => {
        expect(screen.getByText('Failed to validate root input')).toBeInTheDocument()
      })
    })

    it('does not call normalizeRoot for short input', () => {
      renderWithStore(RootModal, {
        props: { open: true, root: mockRoot },
      })

      const rootInput = screen.getByLabelText('Root Letters *')
      fireEvent.update(rootInput, 'ك')

      // Should not call normalizeRoot for input shorter than 3 characters
      expect(mockNormalizeRoot).not.toHaveBeenCalled()
    })

    it('handles null root prop gracefully', () => {
      renderWithStore(RootModal, {
        props: { open: true, root: null },
      })

      // Should render without errors
      expect(screen.getByText('Add New Root')).toBeInTheDocument()
    })
  })
})
