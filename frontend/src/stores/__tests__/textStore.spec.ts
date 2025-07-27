import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { textService } from '../../services/textService'
import { useTextStore } from '../textStore'

// Mock the text service
vi.mock('../../services/textService', () => ({
  textService: {
    getText: vi.fn(),
    getAnnotations: vi.fn(),
    getTextVersions: vi.fn(),
    getTextVersion: vi.fn(),
    restoreTextVersion: vi.fn(),
    updateText: vi.fn(),
  },
}))

describe('textStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('fetchTextById', () => {
    it('should fetch text, annotations, and versions', async () => {
      const store = useTextStore()
      const mockText = { id: 'text-123', title: 'Test Text' }
      const mockAnnotations = [{ id: 'anno-1', textId: 'text-123' }]
      const mockVersions = [
        { id: 'ver-1', versionNumber: 1, isCurrent: true },
        { id: 'ver-2', versionNumber: 2, isCurrent: false },
      ]

      // Mock service responses
      vi.mocked(textService.getText).mockResolvedValue(mockText)
      vi.mocked(textService.getAnnotations).mockResolvedValue(mockAnnotations)
      vi.mocked(textService.getTextVersions).mockResolvedValue(mockVersions)

      await store.fetchTextById('text-123')

      // Verify services were called
      expect(textService.getText).toHaveBeenCalledWith('text-123')
      expect(textService.getAnnotations).toHaveBeenCalledWith('text-123')
      expect(textService.getTextVersions).toHaveBeenCalledWith('text-123')

      // Verify store state
      expect(store.currentText).toEqual(mockText)
      expect(store.annotations).toEqual(mockAnnotations)
      expect(store.textVersions).toEqual(mockVersions)
      expect(store.isViewingCurrentVersion).toBe(true)
      expect(store.selectedVersion).toBeNull()
    })
  })

  describe('selectTextVersion', () => {
    it('should fetch and select a specific version', async () => {
      const store = useTextStore()
      const mockVersion = {
        id: 'ver-2',
        textId: 'text-123',
        versionNumber: 2,
        isCurrent: false,
        content: { title: 'Version 2', arabicContent: 'Content 2' },
      }

      // Set up initial state
      store.textVersions = [
        { id: 'ver-1', versionNumber: 1, isCurrent: true, updatedAt: '2023-01-01' },
        { id: 'ver-2', versionNumber: 2, isCurrent: false, updatedAt: '2023-01-02' },
      ]

      // Mock service response
      vi.mocked(textService.getTextVersion).mockResolvedValue(mockVersion)

      await store.selectTextVersion('text-123', 2)

      // Verify service was called
      expect(textService.getTextVersion).toHaveBeenCalledWith('text-123', 2)

      // Verify store state
      expect(store.selectedVersion).toEqual(mockVersion)
      expect(store.isViewingCurrentVersion).toBe(false)
    })

    it('should set isViewingCurrentVersion to true when selecting current version', async () => {
      const store = useTextStore()
      const mockVersion = {
        id: 'ver-1',
        textId: 'text-123',
        versionNumber: 1,
        isCurrent: true,
        content: { title: 'Version 1', arabicContent: 'Content 1' },
      }

      // Set up initial state
      store.textVersions = [
        { id: 'ver-1', versionNumber: 1, isCurrent: true, updatedAt: '2023-01-01' },
        { id: 'ver-2', versionNumber: 2, isCurrent: false, updatedAt: '2023-01-02' },
      ]

      // Mock service response
      vi.mocked(textService.getTextVersion).mockResolvedValue(mockVersion)

      await store.selectTextVersion('text-123', 1)

      // Verify store state
      expect(store.selectedVersion).toEqual(mockVersion)
      expect(store.isViewingCurrentVersion).toBe(true)
    })
  })

  describe('restoreTextVersion', () => {
    it('should restore a version and reset to viewing current version', async () => {
      const store = useTextStore()
      const mockRestoredText = { id: 'text-123', title: 'Restored Text' }
      const mockVersions = [
        { id: 'ver-3', versionNumber: 3, isCurrent: true, updatedAt: '2023-01-03' },
        { id: 'ver-1', versionNumber: 1, isCurrent: false, updatedAt: '2023-01-01' },
        { id: 'ver-2', versionNumber: 2, isCurrent: false, updatedAt: '2023-01-02' },
      ]

      // Set up initial state
      store.currentText = { id: 'text-123', title: 'Original Text' }
      store.selectedVersion = {
        id: 'ver-2',
        textId: 'text-123',
        versionNumber: 2,
        isCurrent: false,
        content: { title: 'Version 2', arabicContent: 'Content 2' },
        updatedAt: '2023-01-02',
        createdAt: '2023-01-02',
      }
      store.isViewingCurrentVersion = false

      // Mock service responses
      vi.mocked(textService.restoreTextVersion).mockResolvedValue(mockRestoredText)
      vi.mocked(textService.getTextVersions).mockResolvedValue(mockVersions)

      await store.restoreTextVersion('text-123', 2)

      // Verify services were called
      expect(textService.restoreTextVersion).toHaveBeenCalledWith('text-123', 2)
      expect(textService.getTextVersions).toHaveBeenCalledWith('text-123')

      // Verify store state
      expect(store.currentText).toEqual(mockRestoredText)
      expect(store.textVersions).toEqual(mockVersions)
      expect(store.isViewingCurrentVersion).toBe(true)
      expect(store.selectedVersion).toBeNull()
    })
  })

  describe('displayText', () => {
    it('should return current text when viewing current version', () => {
      const store = useTextStore()

      // Set up state
      store.currentText = {
        id: 'text-123',
        title: 'Current Text',
        arabicContent: 'Current Content',
      }
      store.selectedVersion = null
      store.isViewingCurrentVersion = true

      // Verify computed property
      expect(store.displayText).toEqual(store.currentText)
    })

    it('should return merged text with selected version content when not viewing current version', () => {
      const store = useTextStore()

      // Set up state
      store.currentText = {
        id: 'text-123',
        title: 'Current Text',
        arabicContent: 'Current Content',
        tags: ['tag1', 'tag2'],
        difficulty: 'BEGINNER',
        dialect: 'MSA',
      }
      store.selectedVersion = {
        id: 'ver-2',
        textId: 'text-123',
        versionNumber: 2,
        isCurrent: false,
        content: {
          title: 'Old Title',
          arabicContent: 'Old Content',
          transliteration: 'Old Transliteration',
          translation: 'Old Translation',
        },
        updatedAt: '2023-01-02',
        createdAt: '2023-01-02',
      }
      store.isViewingCurrentVersion = false

      // Verify computed property returns merged object with version content
      expect(store.displayText).toEqual({
        id: 'text-123',
        title: 'Old Title',
        arabicContent: 'Old Content',
        transliteration: 'Old Transliteration',
        translation: 'Old Translation',
        tags: ['tag1', 'tag2'],
        difficulty: 'BEGINNER',
        dialect: 'MSA',
      })
    })
  })
})
