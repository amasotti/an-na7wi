<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Arabic Roots</h1>
          <p class="text-gray-600">
            Explore {{ totalCount }} Arabic roots and their derived words
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <BaseButton
            @click="handleAddRoot"
            class="flex items-center space-x-2"
          >
            <BaseIcon size="sm">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </BaseIcon>
            <span class="hidden sm:inline">Add Root</span>
          </BaseButton>
          <div v-if="statistics" class="hidden md:block">
            <RootStatisticsCard :statistics="statistics" />
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="space-y-4">
      <!-- Search Bar -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <BaseIcon size="sm" class="text-gray-400">
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </BaseIcon>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search roots by letters, form, or meaning..."
          class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          @input="debouncedSearch"
          @keyup.enter="handleSearch"
        />
      </div>

      <!-- Filters Row -->
      <div class="flex flex-wrap gap-4 items-center">
        <!-- Letter Count Filter -->
        <BaseSelect
          v-model="filters.letterCount"
          :options="letterCountOptions"
          placeholder="Letter Count"
          class="min-w-32"
          aria-label="Letter Count Filter"
          @update:model-value="handleFilterChange"
        />


        <!-- Sort -->
        <BaseSelect
          v-model="filters.sort"
          :options="sortOptions"
          label="Sort by"
          class="min-w-32"
          @update:model-value="handleFilterChange"
        />

        <!-- Clear Filters -->
        <BaseButton
          v-if="hasActiveFilters"
          variant="outline"
          size="sm"
          @click="clearFilters"
        >
          Clear Filters
        </BaseButton>
      </div>

      <!-- Mobile Statistics -->
      <div v-if="statistics" class="md:hidden">
        <RootStatisticsCard :statistics="statistics" mobile />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/common/BaseButton.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import type { RootStatistics } from '@/types'
import { debounce } from 'lodash-es'
import { computed, onMounted, ref } from 'vue'
import RootStatisticsCard from './RootStatisticsCard.vue'

interface Props {
  totalCount: number
  statistics?: RootStatistics | null
}

interface FilterData {
  search: string
  letterCount: number | null
  sort: string
}

interface Emits {
  (e: 'search', query: string): void
  (e: 'filter-changed', filters: FilterData): void
  (e: 'add-root'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = ref('')
const filters = ref({
  letterCount: null as number | null,
  sort: 'displayForm',
})

const letterCountOptions = [
  { value: null, label: 'All' },
  { value: 2, label: '2 Letters' },
  { value: 3, label: '3 Letters' },
  { value: 4, label: '4 Letters' },
  { value: 5, label: '5 Letters' },
]

const sortOptions = [
  { value: 'displayForm', label: 'Alphabetical' },
  { value: 'letterCount', label: 'Letter Count' },
  { value: 'wordCount', label: 'Word Count' },
  { value: 'createdAt', label: 'Date Added' },
]

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value.trim() !== '' ||
    filters.value.letterCount !== null ||
    filters.value.sort !== 'displayForm'
  )
})

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const debouncedSearch = debounce(() => {
  handleSearch()
}, 300)

const handleFilterChange = () => {
  emit('filter-changed', {
    search: searchQuery.value,
    ...filters.value,
  })
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.value = {
    letterCount: null,
    sort: 'displayForm',
  }
  handleFilterChange()
}

const handleAddRoot = () => {
  emit('add-root')
}

onMounted(() => {
  handleFilterChange()
})
</script>
