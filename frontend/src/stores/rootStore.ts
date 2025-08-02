import { rootService } from '@/services/rootService'
import type { PaginatedResponse, Root, RootStatistics, RootWithWords } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useRootStore = defineStore('root', () => {
  const roots = ref<Root[]>([])
  const currentRoot = ref<Root | null>(null)
  const currentRootWithWords = ref<RootWithWords | null>(null)
  const statistics = ref<RootStatistics | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const pagination = ref({
    page: 1,
    size: 20,
    totalCount: 0,
    totalPages: 0,
  })

  const filters = ref({
    search: '',
    letterCount: null as number | null,
    startingLetter: '',
    sort: 'displayForm',
  })

  const filteredRoots = computed(() => {
    let filtered = [...roots.value]

    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase()
      filtered = filtered.filter(
        root =>
          root.displayForm.includes(filters.value.search) ||
          root.normalizedForm.includes(filters.value.search) ||
          root.meaning?.toLowerCase().includes(searchLower)
      )
    }

    if (filters.value.letterCount) {
      filtered = filtered.filter(root => root.letterCount === filters.value.letterCount)
    }

    if (filters.value.startingLetter) {
      filtered = filtered.filter(root => root.letters[0] === filters.value.startingLetter)
    }

    return filtered
  })

  const clearError = () => {
    error.value = null
  }

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const fetchRoots = async (
    params: {
      page?: number
      size?: number
      sort?: string
    } = {}
  ) => {
    try {
      setLoading(true)
      clearError()

      const response: PaginatedResponse<Root> = await rootService.getRoots({
        page: params.page || pagination.value.page,
        size: params.size || pagination.value.size,
        sort: params.sort || filters.value.sort,
      })

      roots.value = response.items
      pagination.value = {
        page: response.page,
        size: response.pageSize,
        totalCount: response.totalCount,
        totalPages: Math.ceil(response.totalCount / response.pageSize),
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch roots'
      console.error('Error fetching roots:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoot = async (id: string) => {
    try {
      setLoading(true)
      clearError()
      currentRoot.value = await rootService.getRoot(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch root'
      console.error('Error fetching root:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchRootWithWords = async (id: string) => {
    try {
      setLoading(true)
      clearError()
      currentRootWithWords.value = await rootService.getRootWithWords(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch root with words'
      console.error('Error fetching root with words:', err)
    } finally {
      setLoading(false)
    }
  }

  const searchRoots = async (
    query: string,
    params: {
      page?: number
      size?: number
      sort?: string
    } = {}
  ) => {
    try {
      setLoading(true)
      clearError()

      const response: PaginatedResponse<Root> = await rootService.searchRoots(query, {
        page: params.page || 1,
        size: params.size || pagination.value.size,
        sort: params.sort || filters.value.sort,
      })

      roots.value = response.items
      pagination.value = {
        page: response.page,
        size: response.pageSize,
        totalCount: response.totalCount,
        totalPages: Math.ceil(response.totalCount / response.pageSize),
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to search roots'
      console.error('Error searching roots:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchRootsByLetterCount = async (
    letterCount: number,
    params: {
      page?: number
      size?: number
      sort?: string
    } = {}
  ) => {
    try {
      setLoading(true)
      clearError()

      const response: PaginatedResponse<Root> = await rootService.getRootsByLetterCount(
        letterCount,
        {
          page: params.page || 1,
          size: params.size || pagination.value.size,
          sort: params.sort || filters.value.sort,
        }
      )

      roots.value = response.items
      pagination.value = {
        page: response.page,
        size: response.pageSize,
        totalCount: response.totalCount,
        totalPages: Math.ceil(response.totalCount / response.pageSize),
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch roots by letter count'
      console.error('Error fetching roots by letter count:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchRootsStartingWith = async (
    letter: string,
    params: {
      page?: number
      size?: number
      sort?: string
    } = {}
  ) => {
    try {
      setLoading(true)
      clearError()

      const response: PaginatedResponse<Root> = await rootService.getRootsStartingWith(letter, {
        page: params.page || 1,
        size: params.size || pagination.value.size,
        sort: params.sort || filters.value.sort,
      })

      roots.value = response.items
      pagination.value = {
        page: response.page,
        size: response.pageSize,
        totalCount: response.totalCount,
        totalPages: Math.ceil(response.totalCount / response.pageSize),
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Failed to fetch roots starting with letter'
      console.error('Error fetching roots starting with letter:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      statistics.value = await rootService.getStatistics()
    } catch (err) {
      console.error('Error fetching root statistics:', err)
    }
  }

  const updateFilters = (newFilters: Partial<typeof filters.value>) => {
    Object.assign(filters.value, newFilters)
  }

  const resetFilters = () => {
    filters.value = {
      search: '',
      letterCount: null,
      startingLetter: '',
      sort: 'displayForm',
    }
  }

  const setPage = (page: number) => {
    pagination.value.page = page
  }

  return {
    roots,
    currentRoot,
    currentRootWithWords,
    statistics,
    loading,
    error,
    pagination,
    filters,
    filteredRoots,
    clearError,
    fetchRoots,
    fetchRoot,
    fetchRootWithWords,
    searchRoots,
    fetchRootsByLetterCount,
    fetchRootsStartingWith,
    fetchStatistics,
    updateFilters,
    resetFilters,
    setPage,
  }
})
