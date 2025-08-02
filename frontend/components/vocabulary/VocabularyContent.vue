<template>
  <div class="vocabulary-content">
    <!-- Filters -->
    <WordFilters
      v-model:search="filters.search"
      v-model:difficulty="filters.difficulty"
      v-model:dialect="filters.dialect"
      v-model:masteryLevel="filters.masteryLevel"
      :difficulty-options="difficultyOptions"
      :dialect-options="dialectOptions"
      :mastery-level-options="masteryLevelOptions"
      @search-input="$emit('search-input')"
      @filter-change="$emit('filter-change')"
    />

    <!-- Loading state -->
    <div v-if="loading || searchLoading" class="loading-indicator">
      <div class="loading-spinner"></div>
      <p class="text-sm text-gray-500 mt-2">
        {{ searchLoading ? 'Searching words...' : 'Loading words...' }}
      </p>
    </div>

    <!-- Empty state -->
    <div v-else-if="!displayWords || displayWords.length === 0" class="empty-state">
      <div class="empty-state-icon">
        <BaseIcon size="lg" class="text-gray-400">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </BaseIcon>
      </div>
      <h3 class="empty-state-title">
        {{ isSearching ? 'No results found' : 'No words found' }}
      </h3>
      <p class="empty-state-message">
        {{ isSearching 
          ? 'Try adjusting your search terms or filters.' 
          : 'Start building your vocabulary by adding new words.' 
        }}
      </p>
      <div class="flex gap-2 justify-center">
        <BaseButton v-if="isSearching" @click="$emit('clear-search')" variant="outline">
          Clear Search
        </BaseButton>
        <BaseButton @click="$emit('add-word')" class="flex items-center">
          <BaseIcon size="sm" class="mr-2">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </BaseIcon>
          Add {{ isSearching ? '' : 'Your First ' }}Word
        </BaseButton>
      </div>
    </div>

    <!-- Word list -->
    <template v-else>
      <WordTable 
        :words="displayWords" 
        @edit="$emit('edit-word', $event)" 
        @delete="$emit('delete-word', $event)"
        @word-click="$emit('edit-word', $event)"
      />

      <!-- Pagination (only show for non-search results) -->
      <div v-if="!isSearching" class="pagination-container">
        <div class="pagination-info">
          <p class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ (pagination.page - 1) * pagination.pageSize + 1 }}</span> to 
            <span class="font-medium">{{ Math.min(pagination.page * pagination.pageSize, pagination.totalCount) }}</span> of 
            <span class="font-medium">{{ pagination.totalCount }}</span> results
          </p>
        </div>
        <Pagination
          :current-page="pagination.page"
          :total-pages="Math.ceil(pagination.totalCount / pagination.pageSize)"
          @page-change="$emit('page-change', $event)"
        />
      </div>

      <!-- Search results info -->
      <div v-else class="search-results-info">
        <p class="text-sm text-gray-600">
          Showing {{ displayWords.length }} search result{{ displayWords.length !== 1 ? 's' : '' }}
          for "{{ filters.search }}"
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { SelectOption, Word } from '@/types'
import type { Dialect, Difficulty, MasteryLevel } from '@/types/enums'
import BaseButton from '../common/BaseButton.vue'
import BaseIcon from '../common/BaseIcon.vue'
import Pagination from '../common/Pagination.vue'
import WordFilters from './WordFilters.vue'
import WordTable from './WordTable.vue'

interface VocabularyFilters {
  search: string
  difficulty: string
  dialect: string
  masteryLevel: string
}

interface VocabularyPagination {
  page: number
  pageSize: number
  totalCount: number
}

interface Props {
  displayWords: Word[]
  loading: boolean
  searchLoading: boolean
  isSearching: boolean
  filters: VocabularyFilters
  pagination: VocabularyPagination
  difficultyOptions: SelectOption<Difficulty>[]
  dialectOptions: SelectOption<Dialect>[]
  masteryLevelOptions: SelectOption<MasteryLevel>[]
}

defineProps<Props>()

defineEmits<{
  'search-input': []
  'filter-change': []
  'clear-search': []
  'add-word': []
  'edit-word': [word: Word]
  'delete-word': [word: Word]
  'page-change': [page: number]
}>()
</script>

<style scoped>
.vocabulary-content {
  @apply animate-fade-in;
}

.loading-indicator {
  @apply flex flex-col justify-center items-center py-12;
}

.loading-spinner {
  @apply animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600;
}

.empty-state {
  @apply bg-white rounded-xl shadow-sm p-12 text-center;
}

.empty-state-icon {
  @apply w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center;
}

.empty-state-title {
  @apply text-lg font-medium text-gray-900 mb-2;
}

.empty-state-message {
  @apply text-gray-500 mb-6;
}

.pagination-container {
  @apply px-6 py-4 flex items-center justify-between border-t border-gray-200;
}

.pagination-info {
  @apply flex-1;
}

.search-results-info {
  @apply px-6 py-4 text-center border-t border-gray-200;
}
</style>