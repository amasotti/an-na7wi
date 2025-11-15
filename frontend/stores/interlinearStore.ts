import { computed, ref } from 'vue'
import { interlinearService } from '~/composables/interlinearService'
import type {
  InterlinearSentence,
  InterlinearText,
  InterlinearTextDetail,
  WordAlignment,
} from '~/types'

export const useInterlinearStore = defineStore('interlinear', () => {
  // State
  const texts = ref<InterlinearText[]>([])
  const currentText = ref<InterlinearTextDetail | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)

  // Cache management
  const lastFetchParams = ref<string>('')
  const isCurrentlyFetching = ref(false)

  // Getters
  const hasMorePages = computed(() => {
    return totalCount.value > currentPage.value * pageSize.value
  })

  // Actions - Text Operations
  async function fetchTexts() {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      sort: 'title',
    }

    const cacheKey = JSON.stringify(params)

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

      const response = await interlinearService.getTexts(params)
      texts.value = response.items
      totalCount.value = response.totalCount

      lastFetchParams.value = cacheKey
    } catch (err) {
      error.value = 'Failed to fetch interlinear texts'
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
      currentText.value = await interlinearService.getText(id)
    } catch (err) {
      error.value = 'Failed to fetch interlinear text'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createText(textData: Partial<InterlinearText>) {
    loading.value = true
    error.value = null

    try {
      const newText = await interlinearService.createText(textData)
      texts.value.unshift(newText)
      totalCount.value++
      return newText
    } catch (err) {
      error.value = 'Failed to create interlinear text'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateText(id: string, textData: Partial<InterlinearText>) {
    loading.value = true
    error.value = null

    try {
      const updatedText = await interlinearService.updateText(id, textData)

      const index = texts.value.findIndex(t => t.id === id)
      if (index !== -1) {
        texts.value[index] = updatedText
      }

      if (currentText.value?.id === id) {
        currentText.value = { ...currentText.value, ...updatedText }
      }

      return updatedText
    } catch (err) {
      error.value = 'Failed to update interlinear text'
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
      await interlinearService.deleteText(id)

      texts.value = texts.value.filter(t => t.id !== id)
      totalCount.value--

      if (currentText.value?.id === id) {
        currentText.value = null
      }
    } catch (err) {
      error.value = 'Failed to delete interlinear text'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Sentence Operations
  async function addSentence(textId: string, sentenceData: Partial<InterlinearSentence>) {
    loading.value = true
    error.value = null

    try {
      const newSentence = await interlinearService.addSentence(textId, sentenceData)

      if (currentText.value?.id === textId) {
        currentText.value.sentences.push(newSentence)
      }

      return newSentence
    } catch (err) {
      error.value = 'Failed to add sentence'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateSentence(
    textId: string,
    sentenceId: string,
    sentenceData: Partial<InterlinearSentence>
  ) {
    loading.value = true
    error.value = null

    try {
      const updatedSentence = await interlinearService.updateSentence(
        textId,
        sentenceId,
        sentenceData
      )

      if (currentText.value?.id === textId) {
        const index = currentText.value.sentences.findIndex(s => s.id === sentenceId)
        if (index !== -1) {
          currentText.value.sentences[index] = updatedSentence
        }
      }

      return updatedSentence
    } catch (err) {
      error.value = 'Failed to update sentence'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteSentence(textId: string, sentenceId: string) {
    loading.value = true
    error.value = null

    try {
      await interlinearService.deleteSentence(textId, sentenceId)

      if (currentText.value?.id === textId) {
        currentText.value.sentences = currentText.value.sentences.filter(s => s.id !== sentenceId)
      }
    } catch (err) {
      error.value = 'Failed to delete sentence'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function reorderSentences(textId: string, sentenceIds: string[]) {
    loading.value = true
    error.value = null

    try {
      await interlinearService.reorderSentences(textId, sentenceIds)

      if (currentText.value?.id === textId) {
        const orderedSentences = sentenceIds
          .map((id, index) => {
            const sentence = currentText.value?.sentences.find(s => s.id === id)
            if (sentence) {
              return { ...sentence, sentenceOrder: index }
            }
            return null
          })
          .filter((s): s is InterlinearSentence => s !== null)

        currentText.value.sentences = orderedSentences
      }
    } catch (err) {
      error.value = 'Failed to reorder sentences'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Alignment Operations
  async function addAlignment(
    textId: string,
    sentenceId: string,
    alignmentData: Partial<WordAlignment>
  ) {
    loading.value = true
    error.value = null

    try {
      const newAlignment = await interlinearService.addAlignment(textId, sentenceId, alignmentData)

      if (currentText.value?.id === textId) {
        const sentence = currentText.value.sentences.find(s => s.id === sentenceId)
        if (sentence) {
          sentence.alignments.push(newAlignment)
        }
      }

      return newAlignment
    } catch (err) {
      error.value = 'Failed to add alignment'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateAlignment(
    textId: string,
    sentenceId: string,
    alignmentId: string,
    alignmentData: Partial<WordAlignment>
  ) {
    loading.value = true
    error.value = null

    try {
      const updatedAlignment = await interlinearService.updateAlignment(
        textId,
        sentenceId,
        alignmentId,
        alignmentData
      )

      if (currentText.value?.id === textId) {
        const sentence = currentText.value.sentences.find(s => s.id === sentenceId)
        if (sentence) {
          const index = sentence.alignments.findIndex(a => a.id === alignmentId)
          if (index !== -1) {
            sentence.alignments[index] = updatedAlignment
          }
        }
      }

      return updatedAlignment
    } catch (err) {
      error.value = 'Failed to update alignment'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteAlignment(textId: string, sentenceId: string, alignmentId: string) {
    loading.value = true
    error.value = null

    try {
      await interlinearService.deleteAlignment(textId, sentenceId, alignmentId)

      if (currentText.value?.id === textId) {
        const sentence = currentText.value.sentences.find(s => s.id === sentenceId)
        if (sentence) {
          sentence.alignments = sentence.alignments.filter(a => a.id !== alignmentId)
        }
      }
    } catch (err) {
      error.value = 'Failed to delete alignment'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function reorderAlignments(textId: string, sentenceId: string, alignmentIds: string[]) {
    loading.value = true
    error.value = null

    try {
      await interlinearService.reorderAlignments(textId, sentenceId, alignmentIds)

      if (currentText.value?.id === textId) {
        const sentence = currentText.value.sentences.find(s => s.id === sentenceId)
        if (sentence) {
          const orderedAlignments = alignmentIds
            .map((id, index) => {
              const alignment = sentence.alignments.find(a => a.id === id)
              if (alignment) {
                return { ...alignment, tokenOrder: index }
              }
              return null
            })
            .filter((a): a is WordAlignment => a !== null)

          sentence.alignments = orderedAlignments
        }
      }
    } catch (err) {
      error.value = 'Failed to reorder alignments'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Utility actions
  function setPage(page: number) {
    currentPage.value = page
    lastFetchParams.value = ''
  }

  function clearCache() {
    lastFetchParams.value = ''
  }

  function resetState() {
    texts.value = []
    currentText.value = null
    loading.value = false
    error.value = null
    totalCount.value = 0
    currentPage.value = 1
    lastFetchParams.value = ''
  }

  return {
    // State
    texts,
    currentText,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,

    // Getters
    hasMorePages,

    // Actions - Text
    fetchTexts,
    fetchTextById,
    createText,
    updateText,
    deleteText,

    // Actions - Sentence
    addSentence,
    updateSentence,
    deleteSentence,
    reorderSentences,

    // Actions - Alignment
    addAlignment,
    updateAlignment,
    deleteAlignment,
    reorderAlignments,

    // Utilities
    setPage,
    clearCache,
    resetState,
  }
})
