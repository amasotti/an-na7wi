import { isNil } from 'lodash-es'
import { computed, ref } from 'vue'
import { interlinearService } from '~/composables/interlinearService'
import { wordService } from '~/composables/wordService'
import type {
  InterlinearSentence,
  InterlinearText,
  InterlinearTextDetail,
  WordAlignment,
  WordSearchResult,
} from '~/types'

export const useInterlinearStore = defineStore('interlinear', () => {
  // State - Data
  const texts = ref<InterlinearText[]>([])
  const currentText = ref<InterlinearTextDetail | null>(null)
  const currentSentence = ref<InterlinearSentence | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)

  // Cache management
  const lastFetchParams = ref<string>('')
  const isCurrentlyFetching = ref(false)

  // State - Sentence Editing Modal
  const showSentenceEditModal = ref(false)
  const editingSentence = ref<Partial<InterlinearSentence> | null>(null)
  const editingSentenceOrder = ref(0)
  const sentenceSaving = ref(false)

  // State - Alignment Editing
  const selectedAlignments = ref<number[]>([])

  // State - Vocabulary Linking Modal
  const showVocabLinkModal = ref(false)
  const linkingAlignmentIndex = ref<number | null>(null)
  const vocabSearchQuery = ref('')
  const vocabSearchResults = ref<WordSearchResult[]>([])
  const currentLinkedWord = ref<WordSearchResult | null>(null)
  const vocabSearching = ref(false)

  // State - Metadata Editing
  const editingMetadata = ref<Partial<InterlinearText> | null>(null)
  const metadataSaving = ref(false)
  const metadataSaveError = ref<string | null>(null)

  // Getters
  const hasMorePages = computed(() => {
    return totalCount.value > currentPage.value * pageSize.value
  })

  const sortedAlignments = computed(() => {
    if (!editingSentence.value?.alignments) return []
    return [...editingSentence.value.alignments].sort((a, b) => a.tokenOrder - b.tokenOrder)
  })

  const linkingAlignment = computed(() => {
    if (linkingAlignmentIndex.value === null || !sortedAlignments.value) return null
    return sortedAlignments.value[linkingAlignmentIndex.value]
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
        currentSentence.value = newSentence
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
        currentSentence.value = updatedSentence
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
      currentSentence.value = null

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

  // Actions - Alignment Operations

  async function autoAlign(askForConfirmation = true) {
    loading.value = true
    error.value = null

    if (askForConfirmation) {
      const ok = confirm(
        'The tokenize function will remove already available tokens and ' +
          'try to create tokens based on empty spaces and the convention that dashed words belong together'
      )

      if (!ok) {
        loading.value = false
        return
      }
    }

    if (isNil(currentText.value) || isNil(editingSentence.value?.id)) {
      loading.value = false
      return
    }

    try {
      await interlinearService.autocreateAlignments(currentText.value.id, editingSentence.value.id)
      await fetchTextById(currentText.value.id)

      // Update editing sentence with fresh data including alignments
      if (currentText.value) {
        const updatedSentence = currentText.value.sentences.find(
          s => s.id === editingSentence.value?.id
        )
        if (updatedSentence) {
          editingSentence.value = { ...updatedSentence }
        }
      }
    } catch (err) {
      error.value = 'Failed to autoalign the sentence'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

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
          sentence.alignments = alignmentIds
            .map((id, index) => {
              const alignment = sentence.alignments.find(a => a.id === id)
              if (alignment) {
                return { ...alignment, tokenOrder: index }
              }
              return null
            })
            .filter((a): a is WordAlignment => a !== null)
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

  // Actions - Sentence Editing Modal
  function openSentenceEditModal(sentence?: InterlinearSentence) {
    if (sentence) {
      // Editing existing sentence
      editingSentence.value = { ...sentence }
      const index = currentText.value?.sentences.findIndex(s => s.id === sentence.id)
      editingSentenceOrder.value = index !== undefined && index !== -1 ? index + 1 : 0
    } else {
      // Adding new sentence
      const newSentenceOrder = (currentText.value?.sentences?.length || 0) + 1
      editingSentence.value = {
        arabicText: '',
        transliteration: '',
        translation: '',
        annotations: '',
        sentenceOrder: newSentenceOrder - 1,
        alignments: [],
      }
      editingSentenceOrder.value = newSentenceOrder
    }
    showSentenceEditModal.value = true
  }

  function closeSentenceEditModal() {
    showSentenceEditModal.value = false
    editingSentence.value = null
    editingSentenceOrder.value = 0
    selectedAlignments.value = []
  }

  function updateSentenceField(field: keyof InterlinearSentence, value: string | undefined) {
    if (!editingSentence.value) return
    editingSentence.value = {
      ...editingSentence.value,
      [field]: value,
    }
  }

  async function saveSentence() {
    if (!editingSentence.value || !currentText.value) return

    sentenceSaving.value = true
    error.value = null

    try {
      if (editingSentence.value.id) {
        // Update existing sentence
        await interlinearService.updateSentence(currentText.value.id, editingSentence.value.id, {
          arabicText: editingSentence.value.arabicText!,
          transliteration: editingSentence.value.transliteration!,
          translation: editingSentence.value.translation!,
          annotations: editingSentence.value.annotations,
          sentenceOrder: editingSentence.value.sentenceOrder || 0,
        })
      } else {
        // Create new sentence
        await interlinearService.addSentence(currentText.value.id, {
          arabicText: editingSentence.value.arabicText!,
          transliteration: editingSentence.value.transliteration!,
          translation: editingSentence.value.translation!,
          annotations: editingSentence.value.annotations,
          sentenceOrder: editingSentence.value.sentenceOrder || 0,
        })
      }

      // Refresh the text to get updated data
      await fetchTextById(currentText.value.id)
      closeSentenceEditModal()
    } catch (err) {
      error.value = 'Failed to save sentence'
      console.error(err)
      throw err
    } finally {
      sentenceSaving.value = false
    }
  }

  async function clearSentenceAlignments() {
    if (!editingSentence.value?.id || !currentText.value) {
      console.warn('No sentence is being edited or no current text available')
      return
    }

    loading.value = true
    error.value = null

    try {
      await interlinearService.clearAlignments(currentText.value.id, editingSentence.value.id)
      await fetchTextById(currentText.value.id)

      // Update editing sentence with fresh data including alignments
      if (currentText.value) {
        const updatedSentence = currentText.value.sentences.find(
          s => s.id === editingSentence.value?.id
        )
        if (updatedSentence) {
          editingSentence.value = { ...updatedSentence }
        }
      }
    } catch (err) {
      error.value = 'Failed to clear alignments'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteSentenceFromModal() {
    if (!editingSentence.value?.id || !currentText.value) return

    loading.value = true
    error.value = null

    try {
      await interlinearService.deleteSentence(currentText.value.id, editingSentence.value.id)
      await fetchTextById(currentText.value.id)
      closeSentenceEditModal()
    } catch (err) {
      error.value = 'Failed to delete sentence'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Alignment Editing
  function toggleAlignmentSelection(index: number, event?: MouseEvent) {
    if (!event) {
      // Simple toggle
      const idx = selectedAlignments.value.indexOf(index)
      if (idx > -1) {
        selectedAlignments.value.splice(idx, 1)
      } else {
        selectedAlignments.value = [index]
      }
      return
    }

    if (event.shiftKey && selectedAlignments.value.length > 0) {
      // Shift-click: Select range
      const lastSelected = selectedAlignments.value[selectedAlignments.value.length - 1]
      if (lastSelected === undefined) return
      const start = Math.min(lastSelected, index)
      const end = Math.max(lastSelected, index)
      const range = Array.from({ length: end - start + 1 }, (_, i) => start + i)
      selectedAlignments.value = [...new Set([...selectedAlignments.value, ...range])]
    } else if (event.metaKey || event.ctrlKey) {
      // Ctrl/Cmd-click: Toggle individual selection
      const idx = selectedAlignments.value.indexOf(index)
      if (idx > -1) {
        selectedAlignments.value.splice(idx, 1)
      } else {
        selectedAlignments.value.push(index)
      }
    } else {
      // Regular click: Select only this one
      if (selectedAlignments.value.length === 1 && selectedAlignments.value[0] === index) {
        selectedAlignments.value = []
      } else {
        selectedAlignments.value = [index]
      }
    }
  }

  function clearAlignmentSelection() {
    selectedAlignments.value = []
  }

  async function updateAlignmentTokens(alignmentId: string, updates: Partial<WordAlignment>) {
    if (!editingSentence.value?.alignments) return

    const alignments = editingSentence.value.alignments
    const index = alignments.findIndex(a => a.id === alignmentId)
    if (index === -1) return

    const currentAlignment = alignments[index]
    if (!currentAlignment) return

    // Merge updates with current alignment
    const mergedAlignment = {
      ...currentAlignment,
      ...updates,
      // Ensure required fields are never undefined
      id: currentAlignment.id,
      arabicTokens: updates.arabicTokens ?? currentAlignment.arabicTokens,
      transliterationTokens:
        updates.transliterationTokens ?? currentAlignment.transliterationTokens,
      translationTokens: updates.translationTokens ?? currentAlignment.translationTokens,
      tokenOrder: updates.tokenOrder ?? currentAlignment.tokenOrder,
      createdAt: currentAlignment.createdAt,
      updatedAt: currentAlignment.updatedAt,
    }

    // Update local state
    alignments[index] = mergedAlignment

    // Update on server if sentence is saved
    if (editingSentence.value.id && currentText.value) {
      try {
        await interlinearService.updateAlignment(
          currentText.value.id,
          editingSentence.value.id,
          alignmentId,
          {
            arabicTokens: mergedAlignment.arabicTokens,
            transliterationTokens: mergedAlignment.transliterationTokens,
            translationTokens: mergedAlignment.translationTokens,
            vocabularyWordId: mergedAlignment.vocabularyWordId,
          }
        )
      } catch (err) {
        error.value = 'Failed to update alignment'
        console.error(err)
        throw err
      }
    }
  }

  // Actions - Vocabulary Linking Modal
  async function openVocabLinkModal(alignmentIndex: number) {
    if (!sortedAlignments.value[alignmentIndex]) return

    linkingAlignmentIndex.value = alignmentIndex
    const alignment = sortedAlignments.value[alignmentIndex]

    // Check if there's already a linked vocabulary word
    if (alignment.vocabularyWordId) {
      try {
        const word = await wordService.getWord(alignment.vocabularyWordId)
        currentLinkedWord.value = {
          id: word.id,
          arabic: word.arabic,
          transliteration: word.transliteration,
          translation: word.translation,
        }
      } catch (err) {
        console.error('Failed to fetch linked vocabulary word:', err)
        currentLinkedWord.value = null
      }
    } else {
      currentLinkedWord.value = null
    }

    showVocabLinkModal.value = true
  }

  function closeVocabLinkModal() {
    showVocabLinkModal.value = false
    linkingAlignmentIndex.value = null
    vocabSearchQuery.value = ''
    vocabSearchResults.value = []
    currentLinkedWord.value = null
  }

  async function searchVocabulary(query: string) {
    if (query.length < 3) {
      vocabSearchResults.value = []
      return
    }

    vocabSearching.value = true
    try {
      vocabSearchResults.value = await wordService.searchWords(query)
    } catch (err) {
      console.error('Failed to search vocabulary words:', err)
      vocabSearchResults.value = []
    } finally {
      vocabSearching.value = false
    }
  }

  async function linkAlignmentToVocab(wordId: string) {
    const alignment = linkingAlignment.value
    if (!alignment || !editingSentence.value) return

    await updateAlignmentTokens(alignment.id!, { vocabularyWordId: wordId })

    // Update current linked word for display
    const word = vocabSearchResults.value.find(w => w.id === wordId)
    if (word) {
      currentLinkedWord.value = word
    }

    // Clear search
    vocabSearchQuery.value = ''
    vocabSearchResults.value = []
  }

  async function unlinkAlignmentFromVocab() {
    const alignment = linkingAlignment.value
    if (!alignment || !editingSentence.value) return

    await updateAlignmentTokens(alignment.id!, { vocabularyWordId: undefined })
    currentLinkedWord.value = null
  }

  // Actions - Metadata Editing
  function openMetadataEditor() {
    const text = currentText.value
    if (!text) return

    editingMetadata.value = {
      title: text.title,
      description: text.description,
      dialect: text.dialect,
    }
    metadataSaveError.value = null
  }

  function updateMetadataField(field: keyof InterlinearText, value: string | undefined) {
    if (!editingMetadata.value) return
    editingMetadata.value = {
      ...editingMetadata.value,
      [field]: value,
    }
  }

  async function saveMetadata(textId: string): Promise<boolean> {
    if (!editingMetadata.value) return false

    // Validation
    if (!editingMetadata.value.title?.trim()) {
      metadataSaveError.value = 'Title is required'
      return false
    }
    if (!editingMetadata.value.dialect) {
      metadataSaveError.value = 'Dialect is required'
      return false
    }

    metadataSaving.value = true
    metadataSaveError.value = null

    try {
      await updateText(textId, {
        title: editingMetadata.value.title.trim(),
        description: editingMetadata.value.description?.trim() || undefined,
        dialect: editingMetadata.value.dialect,
      })
      editingMetadata.value = null
      return true
    } catch (err) {
      metadataSaveError.value = 'Failed to save changes. Please try again.'
      console.error(err)
      return false
    } finally {
      metadataSaving.value = false
    }
  }

  function cancelMetadataEdit() {
    editingMetadata.value = null
    metadataSaveError.value = null
  }

  // Actions - Alignment Editor Lifecycle
  function openAlignmentEditor(sentenceId: string) {
    if (!currentText.value) return

    const sentence = currentText.value.sentences.find(s => s.id === sentenceId)
    if (!sentence) return

    // Reuse sentence editing state for alignment editor
    editingSentence.value = { ...sentence }
    selectedAlignments.value = []
  }

  function closeAlignmentEditor() {
    editingSentence.value = null
    selectedAlignments.value = []
    closeVocabLinkModal()
  }

  // Utility actions
  function setPage(page: number) {
    currentPage.value = page
    lastFetchParams.value = ''
  }

  function openNewTextPage() {
    navigateTo('/interlinear-texts/new')
  }

  async function openTextDetailPage(textId: string) {
    await fetchTextById(textId)
    navigateTo(`/interlinear-texts/${textId}`)
  }

  return {
    // State - Data
    texts,
    currentText,
    loading,
    error,
    totalCount,
    currentPage,
    currentSentence,
    pageSize,

    // State - Sentence Editing Modal
    showSentenceEditModal,
    editingSentence,
    editingSentenceOrder,
    sentenceSaving,

    // State - Alignment Editing
    selectedAlignments,

    // State - Vocabulary Linking Modal
    showVocabLinkModal,
    linkingAlignmentIndex,
    vocabSearchQuery,
    vocabSearchResults,
    currentLinkedWord,
    vocabSearching,

    // State - Metadata Editing
    editingMetadata,
    metadataSaving,
    metadataSaveError,

    // Getters
    hasMorePages,
    sortedAlignments,
    linkingAlignment,

    // Actions - Text
    fetchTexts,
    fetchTextById,
    createText,
    updateText,
    deleteText,

    // Actions - Sentence (original CRUD - kept for backward compatibility)
    addSentence,
    updateSentence,
    deleteSentence,

    // Actions - Sentence Editing Modal
    openSentenceEditModal,
    closeSentenceEditModal,
    updateSentenceField,
    saveSentence,
    deleteSentenceFromModal,

    // Actions - Alignment
    autoAlign,
    addAlignment,
    updateAlignment,
    deleteAlignment,
    reorderAlignments,

    // Actions - Alignment Editing
    toggleAlignmentSelection,
    clearAlignmentSelection,
    updateAlignmentTokens,
    clearSentenceAlignments,

    // Actions - Vocabulary Linking
    openVocabLinkModal,
    closeVocabLinkModal,
    searchVocabulary,
    linkAlignmentToVocab,
    unlinkAlignmentFromVocab,

    // Actions - Metadata Editing
    openMetadataEditor,
    updateMetadataField,
    saveMetadata,
    cancelMetadataEdit,

    // Actions - Alignment Editor Lifecycle
    openAlignmentEditor,
    closeAlignmentEditor,

    // Utilities
    setPage,
    openNewTextPage,
    openTextDetailPage,
  }
})
