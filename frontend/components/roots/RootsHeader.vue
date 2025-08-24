<template>
  <!-- Clean Header -->
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3 bg-gray-50">
    <div>
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Arabic Roots</h1>
      <p class="text-gray-600">Explore {{ totalCount }} Arabic roots and their derived words</p>
    </div>
    
    <div class="flex gap-3">
      <div v-if="statistics" class="hidden md:block">
        <RootStatisticsCard :statistics="statistics" />
      </div>
      <AddButton @click="handleAddRoot">
        Add Root
      </AddButton>
    </div>
  </div>

  <!-- Integrated Search and Filters -->
  <div class="bg-gray-50/50 border border-gray-100 rounded-xl p-4 mb-8 shadow-md">
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <!-- Search -->
      <div class="md:col-span-2">
        <BaseInput
          v-model="searchQuery"
          placeholder="Search by letters, form, or meaning..."
          clearable
          icon-left="search"
          @input="debouncedSearch"
          @keyup.enter="handleSearch"
        />
      </div>

      <!-- Letter Count Filter -->
      <BaseSelect
        v-model="filters.letterCount"
        :options="letterCountOptions"
        placeholder="All Lengths"
        @update:model-value="handleFilterChange"
      />

      <!-- Sort -->
      <BaseSelect
        v-model="filters.sort"
        :options="sortOptions"
        placeholder="Sort by"
        @update:model-value="handleFilterChange"
      />

      <!-- Clear Filters -->
      <div class="flex items-center">
        <BaseButton
          v-if="hasActiveFilters"
          variant="outline"
          size="sm"
          @click="clearFilters"
          class="w-full"
        >
          Clear Filters
        </BaseButton>
      </div>
    </div>

    <!-- Mobile Statistics -->
    <div v-if="statistics" class="md:hidden mt-4 pt-4 border-t border-gray-200">
      <RootStatisticsCard :statistics="statistics" mobile />
    </div>
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es'
import { computed, ref } from 'vue'
import AddButton from '@/components/common/AddButton.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import type { RootStatistics } from '@/types'
import RootStatisticsCard from './RootStatisticsCard.vue'

const route = useRoute()

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

watch(() => route.query.search, async (newSearch) => {
  if (newSearch) {
    searchQuery.value = newSearch as string
    await nextTick()
    handleFilterChange()
  }
})

onMounted(async () => {
  if (route.query.search) {
    searchQuery.value = route.query.search as string
    await nextTick()
    handleFilterChange()
  }

  if (searchQuery.value !== '') {
    await nextTick()
    handleFilterChange()
  }
})

</script>
