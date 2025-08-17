import { computed, ref } from 'vue'
import { wordService } from '~/composables/wordService'
import type {PaginatedResponse, SelectOption, TextReference, TextsFromLinkedWordRequest, Word} from '~/types'
import { Dialect, Difficulty, MasteryLevel, PartOfSpeech } from '~/types/enums'
import { requestDeduplicator } from '~/utils/requestDeduplicator'
import { isArabicText } from '~/utils/stringUtils'

interface WordFilters {
  search: string
  difficulty: string
  dialect: string
  masteryLevel: string
  partOfSpeech: string
}

interface WordPagination {
  page: number
  pageSize: number
  totalCount: number
}

export const useWordStore = defineStore('word', () => {
  // State
  const words = ref<Word[]>([])
  const currentWord = ref<Word | null>(null)
  const loading = ref(false)
  const searchLoading = ref(false)
  const searchResults = ref<Word[]>([])
  const linkedTextsToCurrentWord = ref<TextReference[]>()

  // Pagination
  const pagination = ref<WordPagination>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
  })

  // Filters
  const filters = ref<WordFilters>({
    search: '',
    difficulty: '',
    dialect: '',
    masteryLevel: '',
    partOfSpeech: '',
  })

  // Computed
  const hasWords = computed(() => words.value.length > 0)
  const hasSearchResults = computed(() => searchResults.value.length > 0)
  const isSearching = computed(() => filters.value.search.trim().length > 0)
  const displayWords = computed(() => (isSearching.value ? searchResults.value : words.value))
  const dictionaryLinks = computed(() => currentWord.value?.dictionaryLinks)
  // Option arrays for select components
  const difficultyOptions = computed<SelectOption<Difficulty>[]>(() =>
    Object.values(Difficulty).map(d => ({ value: d, label: d }))
  )

  const dialectOptions = computed<SelectOption<Dialect>[]>(() =>
    Object.values(Dialect).map(d => ({ value: d, label: d }))
  )

  const masteryLevelOptions = computed<SelectOption<MasteryLevel>[]>(() =>
    Object.values(MasteryLevel).map(m => ({ value: m, label: m }))
  )

  const partsOfSpeechOptions = computed<SelectOption<PartOfSpeech>[]>(() =>
    Object.values(PartOfSpeech).map(p => ({ value: p, label: p }))
  )

  // Actions
  const fetchWords = async (resetPage = false, force = false) => {
    if (resetPage) {
      pagination.value.page = 1
    }

    const params = {
      page: pagination.value.page,
      size: pagination.value.pageSize,
      sort: 'arabic',
      ...(filters.value.difficulty && { difficulty: filters.value.difficulty }),
      ...(filters.value.dialect && { dialect: filters.value.dialect }),
      ...(filters.value.partOfSpeech && { partOfSpeech: filters.value.partOfSpeech }),
      ...(filters.value.masteryLevel && { masteryLevel: filters.value.masteryLevel }),
    }

    const cacheKey = JSON.stringify(params)

    // Skip if we already have data with same parameters and not forcing a refresh
    if (!force && words.value.length > 0 && pagination.value.totalCount > 0) {
      return
    }

    const requestKey = `words-${cacheKey}`

    return requestDeduplicator.dedupe(requestKey, async () => {
      loading.value = true
      try {
        const response = await wordService.getWords(params)
        words.value = response.items
        pagination.value.totalCount = response.totalCount
        pagination.value.page = response.page
        pagination.value.pageSize = response.pageSize
      } catch (error) {
        console.error('Error fetching words:', error)
        words.value = []
        pagination.value.totalCount = 0
      } finally {
        loading.value = false
      }
    })
  }

  const searchWords = async (query: string) => {
    if (!query.trim()) {
      searchResults.value = []
      return
    }

    searchLoading.value = true
    try {
      const cleanQuery = query.trim()
      let results: PaginatedResponse<Word>

      if (isArabicText(cleanQuery)) {
        // Search by Arabic text
        results = await wordService.searchByArabic(cleanQuery, 1, 50)
      } else {
        // Search by translation
        results = await wordService.searchByTranslation(cleanQuery, 1, 50)
      }

      searchResults.value = results.items
    } catch (error) {
      console.error('Error searching words:', error)
      searchResults.value = []
    } finally {
      searchLoading.value = false
    }
  }

  const fetchWordById = async (id: string) => {
    return requestDeduplicator.dedupe(`word-${id}`, async () => {
      loading.value = true
      try {
        currentWord.value = await wordService.getWord(id)
      } catch (error) {
        console.error('Error fetching word:', error)
        currentWord.value = null
      } finally {
        loading.value = false
      }
    })
  }

  const createWord = async (wordData: Partial<Word>) => {
    try {
      const newWord = await wordService.createWord(wordData)
      // Add to current list if it matches filters
      if (!isSearching.value) {
        words.value.unshift(newWord)
        pagination.value.totalCount++
      }
      return newWord
    } catch (error) {
      console.error('Error creating word:', error)
      throw error
    }
  }

  const updateWord = async (id: string, wordData: Partial<Word>) => {
    try {
      const updatedWord = await wordService.updateWord(id, wordData)

      // Update in current list
      const index = words.value.findIndex(w => w.id === id)
      if (index !== -1) {
        words.value[index] = updatedWord
      }

      // Update in search results if present
      const searchIndex = searchResults.value.findIndex(w => w.id === id)
      if (searchIndex !== -1) {
        searchResults.value[searchIndex] = updatedWord
      }

      // Update current word if it's the same
      if (currentWord.value?.id === id) {
        currentWord.value = updatedWord
      }

      return updatedWord
    } catch (error) {
      console.error('Error updating word:', error)
      throw error
    }
  }

  const deleteWord = async (id: string) => {
    try {
      await wordService.deleteWord(id)

      // Remove from current list
      words.value = words.value.filter(w => w.id !== id)
      pagination.value.totalCount = Math.max(0, pagination.value.totalCount - 1)

      // Remove from search results
      searchResults.value = searchResults.value.filter(w => w.id !== id)

      // Clear current word if it's the deleted one
      if (currentWord.value?.id === id) {
        currentWord.value = null
      }
    } catch (error) {
      console.error('Error deleting word:', error)
      throw error
    }
  }

  const changePage = (page: number) => {
    pagination.value.page = page
    fetchWords()
  }

  const updateFilters = (newFilters: Partial<WordFilters>) => {
    Object.assign(filters.value, newFilters)

    // If search is being updated, trigger search
    if ('search' in newFilters) {
      if (newFilters.search?.trim()) {
        searchWords(newFilters.search)
      } else {
        searchResults.value = []
      }
    } else {
      // For other filters, refetch words
      fetchWords(true)
    }
  }

  const clearSearch = () => {
    filters.value.search = ''
    searchResults.value = []
  }

  const clearFilters = () => {
    filters.value = {
      search: '',
      difficulty: '',
      dialect: '',
      masteryLevel: '',
      partOfSpeech: '',
    }
    searchResults.value = []
    fetchWords(true)
  }

  const fetchAllUnmasteredWords = async () => {
    loading.value = true
    try {
      const allWords: Word[] = []
      let currentPage = 1
      let hasMorePages = true

      while (hasMorePages) {
        const params = {
          page: currentPage,
          size: 50, // Larger page size for efficiency
          sort: 'arabic',
        }

        const response = await wordService.getWords(params)
        allWords.push(...response.items.filter(word => word.masteryLevel !== MasteryLevel.MASTERED))

        // Check if there are more pages
        hasMorePages = currentPage < Math.ceil(response.totalCount / response.pageSize)
        currentPage++
      }

      return allWords
    } catch (error) {
      console.error('Error fetching all unmastered words:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    words.value = []
    currentWord.value = null
    searchResults.value = []
    loading.value = false
    searchLoading.value = false
    pagination.value = {
      page: 1,
      pageSize: 10,
      totalCount: 0,
    }
    filters.value = {
      search: '',
      difficulty: '',
      dialect: '',
      masteryLevel: '',
      partOfSpeech: '',
    }
    linkedTextsToCurrentWord.value = []
  }

  const getLinkedTexts = async (page: number = 1, size: number = 10) => {

    if (!currentWord.value) {
      console.warn('No current word set, cannot fetch linked texts')
      linkedTextsToCurrentWord.value = []
      return
    }

    try {
      const reqParams : TextsFromLinkedWordRequest = {
        wordId: currentWord.value.id,
        page,
        size
      }
      const texts = await wordService.getTextsFromLinkedWord(reqParams)
      linkedTextsToCurrentWord.value = texts.items.map(text => ({
        id: text.id,
        title: text.title,
        difficulty: text.difficulty,
        dialect: text.dialect,
        createdAt: text.createdAt,
        tags: text.tags,
      }))
  } catch (error) {
      console.error('Error fetching linked texts:', error)
      linkedTextsToCurrentWord.value = []
    }
  }

  return {
    // State
    words,
    currentWord,
    loading,
    searchLoading,
    searchResults,
    pagination,
    filters,
    linkedTextsToCurrentWord,

    // Computed
    hasWords,
    hasSearchResults,
    isSearching,
    displayWords,
    difficultyOptions,
    dialectOptions,
    masteryLevelOptions,
    partsOfSpeechOptions,
    dictionaryLinks,

    // Actions
    fetchWords,
    searchWords,
    fetchWordById,
    createWord,
    updateWord,
    deleteWord,
    changePage,
    updateFilters,
    clearSearch,
    clearFilters,
    fetchAllUnmasteredWords,
    getLinkedTexts,
    reset,
  }
})
