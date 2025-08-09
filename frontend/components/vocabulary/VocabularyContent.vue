<template>
  <main class="content-main" aria-label="Vocabulary management">
    <!-- Filters and Controls -->
    <header class="content-filters">
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
      
      <div class="content-controls">
        <ViewToggle
          :model-value="viewMode"
          @update:model-value="handleViewModeChange"
          aria-label="Switch between table and grid view"
        />
      </div>
    </header>

    <!-- Loading State -->
    <section v-if="loading || searchLoading" class="loading-container" aria-live="polite">
      <div class="loading-spinner" role="status" aria-label="Loading content"></div>
      <p class="loading-text">
        {{ searchLoading ? 'Searching words...' : 'Loading words...' }}
      </p>
    </section>

    <!-- Empty State -->
    <section v-else-if="!displayWords || displayWords.length === 0" class="empty-state-card" aria-live="polite">
      <div class="empty-state-icon" role="img" aria-label="No content">
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
      <div class="empty-state-actions">
        <BaseButton 
          v-if="isSearching" 
          @click="$emit('clear-search')" 
          variant="outline"
          aria-label="Clear current search and filters"
        >
          Clear Search
        </BaseButton>
        <BaseButton 
          @click="$emit('add-word')" 
          class="flex items-center"
          aria-label="Add a new word to vocabulary"
        >
          <BaseIcon size="sm" class="mr-2">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </BaseIcon>
          Add {{ isSearching ? '' : 'Your First ' }}Word
        </BaseButton>
      </div>
    </section>

    <!-- Word Content -->
    <section v-else aria-label="Word list">
      <!-- Table View -->
      <WordTable 
        v-if="viewMode === 'table'"
        :words="displayWords" 
        @edit="$emit('edit-word', $event)" 
        @delete="$emit('delete-word', $event)"
        @word-click="$emit('edit-word', $event)"
        role="table"
        aria-label="Words in table format"
      />
      
      <!-- Grid View -->
      <div v-else class="grid-responsive-3" role="grid" aria-label="Words in card format">
        <WordCard
          v-for="word in displayWords"
          :key="word.id"
          :word="word"
          @edit="$emit('edit-word', $event)"
          @delete="$emit('delete-word', $event)"
          @click="$emit('edit-word', $event)"
          role="gridcell"
        />
      </div>

      <!-- Pagination Footer (only show for non-search results) -->
      <footer v-if="!isSearching" class="pagination-container">
        <div class="pagination-info">
          <p class="pagination-text">
            Showing <span class="font-medium">{{ (pagination.page - 1) * pagination.pageSize + 1 }}</span> to 
            <span class="font-medium">{{ Math.min(pagination.page * pagination.pageSize, pagination.totalCount) }}</span> of 
            <span class="font-medium">{{ pagination.totalCount }}</span> results
          </p>
        </div>
        <Pagination
          :current-page="pagination.page"
          :total-pages="Math.ceil(pagination.totalCount / pagination.pageSize)"
          @page-change="$emit('page-change', $event)"
          aria-label="Navigate between pages"
        />
      </footer>

      <!-- Search Results Info -->
      <footer v-else class="results-info">
        <p class="results-text">
          Showing {{ displayWords.length }} search result{{ displayWords.length !== 1 ? 's' : '' }}
          for "<strong>{{ filters.search }}</strong>"
        </p>
      </footer>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { SelectOption, Word } from '@/types'
import type { Dialect, Difficulty, MasteryLevel } from '@/types/enums'
import { computed } from 'vue'
import BaseButton from '../common/BaseButton.vue'
import BaseIcon from '../common/BaseIcon.vue'
import Pagination from '../common/Pagination.vue'
import ViewToggle from '../common/ViewToggle.vue'
import WordCard from './WordCard.vue'
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
  viewMode?: 'table' | 'grid'
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'table',
})

const emit = defineEmits<{
  'search-input': []
  'filter-change': []
  'clear-search': []
  'add-word': []
  'edit-word': [word: Word]
  'delete-word': [word: Word]
  'page-change': [page: number]
  'view-mode-change': [mode: 'table' | 'grid']
}>()

const handleViewModeChange = (mode: 'table' | 'grid') => {
  emit('view-mode-change', mode)
}
</script>

