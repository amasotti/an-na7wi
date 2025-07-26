import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { textService } from '../services/textService'
import type { Annotation, Dialect, Difficulty, Text } from '../types'
import type { TextsRequest } from '../types/api'

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

  // Filter state
  const searchQuery = ref('')
  const selectedDialect = ref<Dialect | null>(null)
  const selectedDifficulty = ref<Difficulty | null>(null)
  const selectedTags = ref<string[]>([])

  // Getters
  const filteredTexts = computed(() => {
    return texts.value
  })

  const hasMorePages = computed(() => {
    return totalCount.value > currentPage.value * pageSize.value
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

  function nextPage() {
    if (hasMorePages.value) {
      currentPage.value++
      fetchTexts()
    }
  }

  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--
      fetchTexts()
    }
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

    // Getters
    filteredTexts,
    hasMorePages,

    // Actions
    fetchTexts,
    fetchTextById,
    fetchAnnotations,
    createText,
    updateText,
    deleteText,
    analyzeText,
    setFilters,
    nextPage,
    prevPage,
    resetFilters,
  }
})
