<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <RootsHeader 
        :total-count="rootStore.pagination.totalCount"
        :statistics="rootStore.statistics"
        @search="handleSearch"
        @filter-changed="handleFilterChange"
      />
      
      <div class="mt-8">
        <RootsContent 
          :roots="rootStore.roots"
          :loading="rootStore.loading"
          :error="rootStore.error"
          :pagination="rootStore.pagination"
          @page-changed="handlePageChange"
          @root-clicked="handleRootClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RootsContent from '@/components/roots/RootsContent.vue'
import RootsHeader from '@/components/roots/RootsHeader.vue'
import { useRootStore } from '@/stores/rootStore'
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const rootStore = useRootStore()
const router = useRouter()

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
  startingLetter: string
  sort: string
}) => {
  rootStore.updateFilters(filters)

  if (filters.letterCount) {
    await rootStore.fetchRootsByLetterCount(filters.letterCount)
  } else if (filters.startingLetter) {
    await rootStore.fetchRootsStartingWith(filters.startingLetter)
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
  router.push(`/roots/${rootId}`)
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