import { rootService } from '~/composables/rootService'
import type { PaginatedResponse, Root, RootStatistics, RootWithWords } from '~/types'

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
      sort: 'displayForm',
    }
  }

  const setPage = (page: number) => {
    pagination.value.page = page
  }

  const createRoot = async (input: string, meaning?: string) => {
    try {
      setLoading(true)
      clearError()
      const newRoot = await rootService.createRoot(input, meaning)
      roots.value.unshift(newRoot)
      pagination.value.totalCount += 1
      return newRoot
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create root'
      console.error('Error creating root:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateRoot = async (id: string, input: string, meaning?: string) => {
    try {
      setLoading(true)
      clearError()
      const updatedRoot = await rootService.updateRoot(id, input, meaning)
      
      const index = roots.value.findIndex(root => root.id === id)
      if (index !== -1) {
        roots.value[index] = updatedRoot
      }
      
      if (currentRoot.value?.id === id) {
        currentRoot.value = updatedRoot
      }
      
      if (currentRootWithWords.value?.root.id === id) {
        currentRootWithWords.value.root = updatedRoot
      }
      
      return updatedRoot
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update root'
      console.error('Error updating root:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteRoot = async (id: string) => {
    try {
      setLoading(true)
      clearError()
      await rootService.deleteRoot(id)
      roots.value = roots.value.filter(root => root.id !== id)
      pagination.value.totalCount -= 1
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete root'
      console.error('Error deleting root:', err)
      throw err
    } finally {
      setLoading(false)
    }
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
    fetchStatistics,
    updateFilters,
    resetFilters,
    setPage,
    createRoot,
    updateRoot,
    deleteRoot,
  }
})
