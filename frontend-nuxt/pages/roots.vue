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
          :roots="rootStore.roots"
          :loading="rootStore.loading"
          :error="rootStore.error"
          :pagination="rootStore.pagination"
          :show-delete-buttons="true"
          @page-changed="handlePageChange"
          @root-clicked="handleRootClick"
          @root-deleted="handleRootDelete"
        />
      </div>
    </div>

    <!-- Add Root Modal -->
    <AddRootModal
      :show="showAddModal"
      @close="showAddModal = false"
      @root-created="handleRootCreated"
    />

    <!-- Delete Confirmation Modal -->
    <BaseModal
      :open="showDeleteModal"
      title="Delete Root"
      @close="showDeleteModal = false"
    >
      <div v-if="rootToDelete" class="space-y-4">
        <p class="text-gray-700">
          Are you sure you want to delete the root 
          <span class="font-bold arabic text-lg">{{ rootToDelete.displayForm }}</span>?
        </p>
        <p class="text-sm text-gray-600">
          This action cannot be undone.
        </p>
        
        <div class="flex justify-end space-x-3 pt-4 border-t">
          <BaseButton
            variant="outline"
            @click="showDeleteModal = false"
            :disabled="deleteLoading"
          >
            Cancel
          </BaseButton>
          <BaseButton
            variant="danger"
            @click="confirmDelete"
            :loading="deleteLoading"
          >
            Delete Root
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseModal from '~/components/common/BaseModal.vue'
import AddRootModal from '~/components/roots/AddRootModal.vue'
import RootsContent from '~/components/roots/RootsContent.vue'
import RootsHeader from '~/components/roots/RootsHeader.vue'
import { useRootStore } from '~/stores/rootStore'
import type { Root } from '~/types'

const rootStore = useRootStore()

const showAddModal = ref(false)
const showDeleteModal = ref(false)
const rootToDelete = ref<Root | null>(null)
const deleteLoading = ref(false)

const handleSearch = async (query: string) => {
  if (query.trim()) {
    await rootStore.searchRoots(query.trim())
  } else {
    await rootStore.fetchRoots()
  }
}

const handleFilterChange = async (filters: {
  search: string
  letterCount: number | null
  sort: string
}) => {
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

const handleRootClick = async (rootId: string) => {
  await navigateTo(`/roots/${rootId}`)
}

const handleRootCreated = async (root: Root) => {
  try {
    await rootStore.createRoot(root.displayForm)
    await rootStore.fetchStatistics()
  } catch (error) {
    console.error('Error handling root creation:', error)
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
    await rootStore.fetchStatistics()
    showDeleteModal.value = false
    rootToDelete.value = null
  } catch (error) {
    console.error('Error deleting root:', error)
  } finally {
    deleteLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([rootStore.fetchRoots(), rootStore.fetchStatistics()])
})

watch(
  () => rootStore.filters.sort,
  async newSort => {
    await rootStore.fetchRoots({ sort: newSort })
  }
)
</script>
