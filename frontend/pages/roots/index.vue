<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <RootsHeader 
        :total-count="rootStore.pagination.totalCount"
        :statistics="rootStore.statistics"
        @search="handleSearch"
        @filter-changed="handleFilterChange"
        @add-root="showAddModal = true"
      />
      
      <div class="mt-8">
        <RootsContent
          @page-changed="handlePageChange"
          @root-clicked="handleRootClick"
          @root-deleted="handleRootDelete"
        />
      </div>
    </div>

    <!-- Add Root Modal -->
    <RootModal
      :open="showAddModal"
      @close="showAddModal = false"
      @root-created="handleRootCreated"
    />

    <!-- Delete Confirmation Modal -->
    <RootDeleteModal
      :open="showDeleteModal"
      :loading="deleteLoading"
      :root="rootToDelete"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import RootDeleteModal from '~/components/roots/RootDeleteModal.vue'
import RootModal from '~/components/roots/RootModal.vue'
import RootsContent from '~/components/roots/RootsContent.vue'
import RootsHeader from '~/components/roots/RootsHeader.vue'
import { useRootStore } from '~/stores/rootStore'
import type { Root } from '~/types'

const rootStore = useRootStore()

const showAddModal = ref(false)
const showDeleteModal = ref(false)
const rootToDelete = ref<Root | null>(null)
const deleteLoading = ref(false)
const createLoading = ref(false)

const handleSearch = async (query: string) => {
  if (!query.trim() || query.length < 3) {
    await rootStore.fetchRoots()
  } else {
    await rootStore.searchRoots(query.trim())
  }
}

const handleFilterChange = async (filters: {
  search: string
  letterCount: number | null
  sort: string
}) => {
  // Skip if not mounted yet to prevent duplicate calls during initialization
  if (!isMounted.value) return

  rootStore.updateFilters(filters)

  if (filters.letterCount) {
    await rootStore.fetchRootsByLetterCount(filters.letterCount)
  } else if (filters.search) {
    await rootStore.searchRoots(filters.search)
  } else {
    await rootStore.fetchRoots()
  }
}

const handlePageChange = async (page: number) => {
  rootStore.setPage(page)
  await rootStore.fetchRoots({ page })
}

const handleRootClick = (rootId: string) => {
  navigateTo(`/roots/${rootId}`)
}

const handleRootCreated = async (root: Root) => {
  try {
    createLoading.value = true
    // Root is already created by the modal, just add it to the store
    rootStore.roots.unshift(root)
    rootStore.pagination.totalCount += 1
    // Update statistics locally
    if (rootStore.statistics) {
      rootStore.statistics.totalRoots += 1
    }
    showAddModal.value = false
  } catch (error) {
    console.error('Error handling root creation:', error)
    showAddModal.value = false
  } finally {
    createLoading.value = false
  }
}

const handleRootDelete = (rootId: string) => {
  const root = rootStore.roots.find(r => r.id === rootId)
  if (root) {
    rootToDelete.value = root
    showDeleteModal.value = true
  }
}

const confirmDelete = async () => {
  if (!rootToDelete.value) return

  try {
    deleteLoading.value = true
    await rootStore.deleteRoot(rootToDelete.value.id)
    showDeleteModal.value = false
    rootToDelete.value = null
  } catch (error) {
    console.error('Error deleting root:', error)
  } finally {
    deleteLoading.value = false
  }
}

const isMounted = ref(false)

onMounted(async () => {
  // Initial data loading
  const promises = []
  promises.push(rootStore.fetchRoots())
  if (!rootStore.statistics) {
    promises.push(rootStore.fetchStatistics())
  }

  await Promise.all(promises)
  isMounted.value = true
})

// Only react to sort changes after initial mount
watch(
  () => rootStore.filters.sort,
  async (newSort, oldSort) => {
    if (!isMounted.value || newSort === oldSort || !newSort) return
    await rootStore.fetchRoots({ sort: newSort })
  }
)
</script>
