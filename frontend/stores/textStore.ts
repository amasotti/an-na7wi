import { computed, ref } from 'vue'
import {
  annotationService,
  type CreateAnnotationRequest,
  type UpdateAnnotationRequest,
} from '~/composables/annotationService'
import { textService } from '~/composables/textService'
import type {
  Annotation,
  Dialect,
  Difficulty,
  SearchRequest,
  Text,
  TextsRequest,
  TextVersion,
  TextVersionSummary,
  WordSummary,
} from '~/types'

export const useTextStore = defineStore('text', () => {
  // State
  const texts = ref<Text[]>([])
  const currentText = ref<Text | null>(null)
  const annotations = ref<Annotation[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)

  // Version state
  const textVersions = ref<TextVersionSummary[]>([])
  const selectedVersion = ref<TextVersion | null>(null)
  const isViewingCurrentVersion = ref(true)

  // Filter state
  const searchQuery = ref('')
  const selectedDialect = ref<Dialect | null>(null)
  const selectedDifficulty = ref<Difficulty | null>(null)
  const selectedTags = ref<string[]>([])

  // Text words state
  const textWords = ref<WordSummary[]>([])
  const textWordsLoading = ref(false)

  // Cache management
  const lastFetchParams = ref<string>('')
  const isCurrentlyFetching = ref(false)

  // Getters
  const filteredTexts = computed(() => {
    return texts.value
  })

  const hasMorePages = computed(() => {
    return totalCount.value > currentPage.value * pageSize.value
  })

  // Display text is either the selected version or the current text
  const displayText = computed((): Text | null => {
    if (!currentText.value?.id) return null

    if (selectedVersion.value && !isViewingCurrentVersion.value) {
      return {
        ...currentText.value,
        ...selectedVersion.value.content,
      }
    }
    return currentText.value
  })

  async function searchTexts(query: string) {
    if (isCurrentlyFetching.value) return

    try {
      isCurrentlyFetching.value = true
      loading.value = true
      error.value = null

      const params: SearchRequest = {
        page: currentPage.value,
        pageSize: pageSize.value,
        query: query,
      }

      console.log('Searching texts with params:', params)

      const response = await textService.searchTexts(params)
      texts.value = response.items
      totalCount.value = response.totalCount

      // Clear cache key as search results are different
      lastFetchParams.value = ''
    } catch (err) {
      error.value = 'Failed to search texts'
      console.error(err)
    } finally {
      isCurrentlyFetching.value = false
      loading.value = false
    }
  }

  // Actions
  async function fetchTexts() {
    const params: TextsRequest = {
      page: currentPage.value,
      pageSize: pageSize.value,
    }

    if (selectedDialect.value) {
      params.dialect = selectedDialect.value
    }

    if (selectedDifficulty.value) {
      params.difficulty = selectedDifficulty.value
    }

    if (selectedTags.value.length > 0) {
      params.tags = selectedTags.value
    }

    // Create cache key from parameters
    const cacheKey = JSON.stringify(params)

    // Skip if we have data and parameters haven't changed, or if already fetching
    if (
      isCurrentlyFetching.value ||
      (texts.value.length > 0 && lastFetchParams.value === cacheKey)
    ) {
      return
    }

    try {
      isCurrentlyFetching.value = true
      loading.value = true
      error.value = null

      const response = await textService.getTexts(params)
      texts.value = response.items
      totalCount.value = response.totalCount

      // Update cache key
      lastFetchParams.value = cacheKey
    } catch (err) {
      error.value = 'Failed to fetch texts'
      console.error(err)
    } finally {
      isCurrentlyFetching.value = false
      loading.value = false
    }
  }

  async function fetchTextById(id: string) {
    loading.value = true
    error.value = null

    try {
      currentText.value = await textService.getText(id)
      await fetchAnnotations(id)
      await fetchTextVersions(id)

      // Reset to viewing current version
      isViewingCurrentVersion.value = true
      selectedVersion.value = null
    } catch (err) {
      error.value = 'Failed to fetch text'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchAnnotations(textId: string) {
    try {
      annotations.value = await textService.getAnnotations(textId)
    } catch (err) {
      console.error('Failed to fetch annotations', err)
      // Set empty annotations array if API call fails
      annotations.value = []
    }
  }

  async function createAnnotation(textId: string, annotationData: CreateAnnotationRequest) {
    try {
      const newAnnotation = await annotationService.createAnnotation(textId, annotationData)
      annotations.value.push(newAnnotation)
      return newAnnotation
    } catch (err) {
      console.error('Failed to create annotation', err)
      throw err
    }
  }

  async function updateAnnotation(id: string, annotationData: UpdateAnnotationRequest) {
    try {
      const updatedAnnotation = await annotationService.updateAnnotation(id, annotationData)

      // Update in the list
      const index = annotations.value.findIndex(a => a.id === id)
      if (index !== -1) {
        annotations.value[index] = updatedAnnotation
      }

      return updatedAnnotation
    } catch (err) {
      console.error('Failed to update annotation', err)
      throw err
    }
  }

  async function deleteAnnotation(id: string) {
    try {
      await annotationService.deleteAnnotation(id)

      // Remove from the list
      annotations.value = annotations.value.filter(a => a.id !== id)
    } catch (err) {
      console.error('Failed to delete annotation', err)
      throw err
    }
  }

  async function fetchTextVersions(textId: string) {
    try {
      textVersions.value = await textService.getTextVersions(textId)
    } catch (err) {
      console.error('Failed to fetch text versions', err)
      // Set empty versions array if API call fails
      textVersions.value = []
    }
  }

  async function selectTextVersion(textId: string, versionNumber: number) {
    loading.value = true
    error.value = null

    try {
      selectedVersion.value = await textService.getTextVersion(textId, versionNumber)

      // Check if this is the current version
      const currentVersion = textVersions.value.find(v => v.isCurrent)
      isViewingCurrentVersion.value = currentVersion?.versionNumber === versionNumber
    } catch (err) {
      error.value = 'Failed to fetch text version'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function restoreTextVersion(textId: string, versionNumber: number) {
    loading.value = true
    error.value = null

    try {
      const restoredText = await textService.restoreTextVersion(textId, versionNumber)

      // Update current text
      currentText.value = restoredText

      // Refresh versions
      await fetchTextVersions(textId)

      // Reset to viewing current version
      isViewingCurrentVersion.value = true
      selectedVersion.value = null

      return restoredText
    } catch (err) {
      error.value = 'Failed to restore text version'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createText(text: Partial<Text>) {
    loading.value = true
    error.value = null

    try {
      const newText = await textService.createText(text)
      texts.value.unshift(newText)
      totalCount.value += 1
      return newText
    } catch (err) {
      error.value = 'Failed to create text'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateText(id: string, text: Partial<Text>) {
    loading.value = true
    error.value = null

    try {
      const updatedText = await textService.updateText(id, text)

      // Update in the list
      const index = texts.value.findIndex(t => t.id === id)
      if (index !== -1) {
        texts.value[index] = updatedText
      }

      // Update current text if it's the same
      if (currentText.value && currentText.value.id === id) {
        currentText.value = updatedText
      }

      // Refresh versions
      await fetchTextVersions(id)

      // Reset to viewing current version
      isViewingCurrentVersion.value = true
      selectedVersion.value = null

      return updatedText
    } catch (err) {
      error.value = 'Failed to update text'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteText(id: string) {
    loading.value = true
    error.value = null

    try {
      await textService.deleteText(id)

      // Remove from the list
      texts.value = texts.value.filter(t => t.id !== id)
      totalCount.value = Math.max(0, totalCount.value - 1)

      // Clear current text if it's the same
      if (currentText.value && currentText.value.id === id) {
        currentText.value = null
        textVersions.value = []
        selectedVersion.value = null
      }
    } catch (err) {
      error.value = 'Failed to delete text'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function setFilters(filters: {
    search?: string
    dialect?: Dialect | null
    difficulty?: Difficulty | null
    tags?: string[]
  }) {
    if (filters.dialect !== undefined) {
      selectedDialect.value = filters.dialect
    }

    if (filters.difficulty !== undefined) {
      selectedDifficulty.value = filters.difficulty
    }

    if (filters.tags !== undefined) {
      selectedTags.value = filters.tags
    }

    // Reset to first page when filters change
    currentPage.value = 1

    // Fetch with new filters
    fetchTexts().then(r => console.log('Fetched texts with new filters:', r))
  }

  // Text words actions
  async function fetchTextWords(textId: string) {
    textWordsLoading.value = true
    error.value = null

    try {
      textWords.value = await textService.getTextWords(textId)
    } catch (err) {
      error.value = 'Failed to fetch text words'
      console.error(err)
      textWords.value = []
    } finally {
      textWordsLoading.value = false
    }
  }

  function resetFilters() {
    selectedDialect.value = null
    selectedDifficulty.value = null
    selectedTags.value = []
    currentPage.value = 1
    fetchTexts().then(r => console.log('Fetched texts with reset filters:', r))
  }

  // --- Word Linking Methods ---

  async function linkWordToAnnotation(annotationId: string, wordId: string) {
    try {
      const updatedAnnotation = await annotationService.linkWordToAnnotation(annotationId, wordId)
      // Update in the list
      const index = annotations.value.findIndex(a => a.id === annotationId)
      if (index !== -1) {
        annotations.value[index] = updatedAnnotation
      }
      return updatedAnnotation
    } catch (err) {
      console.error('Failed to link word to annotation', err)
      throw err
    }
  }

  async function unlinkWordFromAnnotation(annotationId: string, wordId: string) {
    try {
      const updatedAnnotation = await annotationService.unlinkWordFromAnnotation(
        annotationId,
        wordId
      )
      // Update in the list
      const index = annotations.value.findIndex(a => a.id === annotationId)
      if (index !== -1) {
        annotations.value[index] = updatedAnnotation
      }
      return updatedAnnotation
    } catch (err) {
      console.error('Failed to unlink word from annotation', err)
      throw err
    }
  }

  async function getLinkedWords(annotationId: string) {
    try {
      return await annotationService.getLinkedWords(annotationId)
    } catch (err) {
      console.error('Failed to get linked words', err)
      throw err
    }
  }

  async function replaceLinkedWords(annotationId: string, wordIds: string[]) {
    try {
      const updatedAnnotation = await annotationService.replaceLinkedWords(annotationId, wordIds)
      // Update in the list
      const index = annotations.value.findIndex(a => a.id === annotationId)
      if (index !== -1) {
        annotations.value[index] = updatedAnnotation
      }
      return updatedAnnotation
    } catch (err) {
      console.error('Failed to replace linked words', err)
      throw err
    }
  }

  return {
    // State
    texts,
    currentText,
    annotations,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
    searchQuery,
    selectedDialect,
    selectedDifficulty,
    selectedTags,
    textVersions,
    selectedVersion,
    isViewingCurrentVersion,
    textWords,
    textWordsLoading,

    // Getters
    filteredTexts,
    hasMorePages,
    displayText,

    // Text Actions
    fetchTexts,
    searchTexts,
    fetchTextById,
    fetchTextVersions,
    selectTextVersion,
    restoreTextVersion,
    createText,
    updateText,
    deleteText,
    setFilters,
    resetFilters,

    // Text Words Actions
    fetchTextWords,

    // Annotation Actions
    fetchAnnotations,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation,
    linkWordToAnnotation,
    unlinkWordFromAnnotation,
    getLinkedWords,
    replaceLinkedWords,
  }
})
