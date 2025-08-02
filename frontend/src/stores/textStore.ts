import type {
  Annotation,
  AnnotationType,
  Dialect,
  Difficulty,
  MasteryLevel,
  PaginatedResponse,
  Text,
  TextVersion,
  TextVersionSummary,
  TextsRequest,
  Word,
} from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { annotationService } from '../services/annotationService'
import { textService } from '../services/textService'

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

  // Tokenized words state
  const tokenizedWords = ref<Word[]>([])
  const tokenizedWordsLoading = ref(false)
  const tokenizedWordsTotalCount = ref(0)
  const tokenizedWordsCurrentPage = ref(1)
  const tokenizedWordsPageSize = ref(10)

  // Getters
  const filteredTexts = computed(() => {
    return texts.value
  })

  const hasMorePages = computed(() => {
    return totalCount.value > currentPage.value * pageSize.value
  })

  // Display text is either the selected version or the current text
  const displayText = computed(() => {
    if (selectedVersion.value && !isViewingCurrentVersion.value) {
      return {
        ...currentText.value,
        ...selectedVersion.value.content,
      }
    }
    return currentText.value
  })

  // Actions
  async function fetchTexts() {
    loading.value = true
    error.value = null

    try {
      const params: TextsRequest = {
        page: currentPage.value,
        pageSize: pageSize.value,
      }

      if (searchQuery.value) {
        params.search = searchQuery.value
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

      const response = await textService.getTexts(params)
      texts.value = response.items
      totalCount.value = response.totalCount
    } catch (err) {
      error.value = 'Failed to fetch texts'
      console.error(err)
    } finally {
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

  async function createAnnotation(
    textId: string,
    annotationData: {
      anchorText: string
      content: string
      type: AnnotationType
      masteryLevel?: MasteryLevel
      needsReview?: boolean
      color?: string
    }
  ) {
    try {
      const newAnnotation = await annotationService.createAnnotation(textId, annotationData)
      annotations.value.push(newAnnotation)
      return newAnnotation
    } catch (err) {
      console.error('Failed to create annotation', err)
      throw err
    }
  }

  async function updateAnnotation(
    id: string,
    annotationData: {
      anchorText?: string
      content?: string
      type?: AnnotationType
      masteryLevel?: MasteryLevel
      needsReview?: boolean
      color?: string
    }
  ) {
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

  async function updateAnnotationMastery(id: string, masteryLevel: MasteryLevel) {
    try {
      const updatedAnnotation = await annotationService.updateMasteryLevel(id, masteryLevel)

      // Update in the list
      const index = annotations.value.findIndex(a => a.id === id)
      if (index !== -1) {
        annotations.value[index] = updatedAnnotation
      }

      return updatedAnnotation
    } catch (err) {
      console.error('Failed to update annotation mastery', err)
      throw err
    }
  }

  async function updateAnnotationReview(id: string, needsReview: boolean, nextReviewDate?: string) {
    try {
      const updatedAnnotation = await annotationService.updateReviewSettings(
        id,
        needsReview,
        nextReviewDate
      )

      // Update in the list
      const index = annotations.value.findIndex(a => a.id === id)
      if (index !== -1) {
        annotations.value[index] = updatedAnnotation
      }

      return updatedAnnotation
    } catch (err) {
      console.error('Failed to update annotation review settings', err)
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

  async function analyzeText(id: string) {
    loading.value = true
    error.value = null

    try {
      await textService.analyzeText(id)
      // Optionally refresh the current text to get updated data
      if (currentText.value && currentText.value.id === id) {
        await fetchTextById(id)
      }
    } catch (err) {
      error.value = 'Failed to analyze text'
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
    if (filters.search !== undefined) {
      searchQuery.value = filters.search
    }

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
    fetchTexts()
  }

  // Tokenized words actions
  async function fetchTokenizedWords(textId: string, page = 1) {
    tokenizedWordsLoading.value = true
    error.value = null

    try {
      const response = await textService.tokenizeText(textId, page, tokenizedWordsPageSize.value)
      tokenizedWords.value = response.items
      tokenizedWordsTotalCount.value = response.totalCount
      tokenizedWordsCurrentPage.value = page
    } catch (err) {
      error.value = 'Failed to fetch tokenized words'
      console.error(err)
    } finally {
      tokenizedWordsLoading.value = false
    }
  }

  function resetTokenizedWords() {
    tokenizedWords.value = []
    tokenizedWordsTotalCount.value = 0
    tokenizedWordsCurrentPage.value = 1
    tokenizedWordsLoading.value = false
  }

  function resetFilters() {
    searchQuery.value = ''
    selectedDialect.value = null
    selectedDifficulty.value = null
    selectedTags.value = []
    currentPage.value = 1
    fetchTexts()
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
    tokenizedWords,
    tokenizedWordsLoading,
    tokenizedWordsTotalCount,
    tokenizedWordsCurrentPage,
    tokenizedWordsPageSize,

    // Getters
    filteredTexts,
    hasMorePages,
    displayText,

    // Text Actions
    fetchTexts,
    fetchTextById,
    fetchTextVersions,
    selectTextVersion,
    restoreTextVersion,
    createText,
    updateText,
    deleteText,
    analyzeText,
    setFilters,
    resetFilters,

    // Tokenized Words Actions
    fetchTokenizedWords,
    resetTokenizedWords,

    // Annotation Actions
    fetchAnnotations,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation,
    updateAnnotationMastery,
    updateAnnotationReview,
  }
})
