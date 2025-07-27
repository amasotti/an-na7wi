import { beforeEach, describe, expect, it, vi } from 'vitest'
import apiClient from '../api'
import { textService } from '../textService'

// Mock the API client
vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('textService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getTextVersions', () => {
    it('should fetch text versions', async () => {
      const mockVersions = [
        {
          id: '123',
          versionNumber: 1,
          updatedAt: '2023-01-01T00:00:00Z',
          isCurrent: true,
        },
        {
          id: '456',
          versionNumber: 2,
          updatedAt: '2023-01-02T00:00:00Z',
          isCurrent: false,
        },
      ]

      // Mock the API response
      vi.mocked(apiClient.get).mockResolvedValue({
        data: mockVersions,
      })

      const result = await textService.getTextVersions('text-123')

      // Verify the API was called correctly
      expect(apiClient.get).toHaveBeenCalledWith('/texts/text-123/versions')

      // Verify the result is mapped correctly
      expect(result).toEqual([
        {
          id: '123',
          versionNumber: 1,
          updatedAt: '2023-01-01T00:00:00Z',
          isCurrent: true,
        },
        {
          id: '456',
          versionNumber: 2,
          updatedAt: '2023-01-02T00:00:00Z',
          isCurrent: false,
        },
      ])
    })
  })

  describe('getTextVersion', () => {
    it('should fetch a specific text version', async () => {
      const mockVersion = {
        id: '123',
        textId: 'text-123',
        versionNumber: 1,
        updatedAt: '2023-01-01T00:00:00Z',
        createdAt: '2023-01-01T00:00:00Z',
        isCurrent: true,
        content: {
          title: 'Test Title',
          arabicContent: 'Arabic content',
          transliteration: 'Transliteration',
          translation: 'Translation',
        },
      }

      // Mock the API response
      vi.mocked(apiClient.get).mockResolvedValue({
        data: mockVersion,
      })

      const result = await textService.getTextVersion('text-123', 1)

      // Verify the API was called correctly
      expect(apiClient.get).toHaveBeenCalledWith('/texts/text-123/versions/1')

      // Verify the result is mapped correctly
      expect(result).toEqual({
        id: '123',
        textId: 'text-123',
        versionNumber: 1,
        updatedAt: '2023-01-01T00:00:00Z',
        createdAt: '2023-01-01T00:00:00Z',
        isCurrent: true,
        content: {
          title: 'Test Title',
          arabicContent: 'Arabic content',
          transliteration: 'Transliteration',
          translation: 'Translation',
        },
      })
    })
  })

  describe('restoreTextVersion', () => {
    it('should restore a text version', async () => {
      const mockRestoredText = {
        id: 'text-123',
        title: 'Restored Title',
        arabicContent: 'Restored Arabic content',
        transliteration: 'Restored Transliteration',
        translation: 'Restored Translation',
        comments: '',
        tags: [],
        difficulty: 'BEGINNER',
        dialect: 'MSA',
        wordCount: 10,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-03T00:00:00Z',
      }

      // Mock the API response
      vi.mocked(apiClient.post).mockResolvedValue({
        data: mockRestoredText,
      })

      const result = await textService.restoreTextVersion('text-123', 1)

      // Verify the API was called correctly
      expect(apiClient.post).toHaveBeenCalledWith('/texts/text-123/restore/1')

      // Verify the result is returned correctly
      expect(result).toEqual(mockRestoredText)
    })
  })
})
