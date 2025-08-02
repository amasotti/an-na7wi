<template>
  <div class="vocabulary-view">
    <div class="container mx-auto px-4 py-8">
      <div class="vocabulary-header">
        <div>
          <h1 class="vocabulary-title">Vocabulary Manager</h1>
          <p v-if="wordStore.isSearching" class="vocabulary-subtitle">
            {{ wordStore.searchLoading ? 'Searching...' : `Found ${wordStore.searchResults.length} result${wordStore.searchResults.length !== 1 ? 's' : ''}` }}
          </p>
        </div>
        <BaseButton @click="openWordForm()">Add New Word</BaseButton>
      </div>

      <!-- Filters -->
      <WordFilters
        v-model:search="wordStore.filters.search"
        v-model:difficulty="wordStore.filters.difficulty"
        v-model:dialect="wordStore.filters.dialect"
        v-model:masteryLevel="wordStore.filters.masteryLevel"
        :difficulty-options="wordStore.difficultyOptions"
        :dialect-options="wordStore.dialectOptions"
        :mastery-level-options="wordStore.masteryLevelOptions"
        @search-input="debouncedSearch"
        @filter-change="handleFilterChange"
      />

      <!-- Loading state -->
      <div v-if="wordStore.loading || wordStore.searchLoading" class="loading-indicator">
        <div class="loading-spinner"></div>
        <p class="text-sm text-gray-500 mt-2">
          {{ wordStore.searchLoading ? 'Searching words...' : 'Loading words...' }}
        </p>
      </div>

      <!-- Empty state -->
      <div v-else-if="!wordStore.displayWords || wordStore.displayWords.length === 0" class="empty-state">
        <div class="empty-state-icon">
          <BaseIcon size="lg" class="text-gray-400">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </BaseIcon>
        </div>
        <h3 class="empty-state-title">
          {{ wordStore.isSearching ? 'No results found' : 'No words found' }}
        </h3>
        <p class="empty-state-message">
          {{ wordStore.isSearching 
            ? 'Try adjusting your search terms or filters.' 
            : 'Start building your vocabulary by adding new words.' 
          }}
        </p>
        <div class="flex gap-2 justify-center">
          <BaseButton v-if="wordStore.isSearching" @click="clearSearch" variant="outline">
            Clear Search
          </BaseButton>
          <BaseButton @click="openWordForm()" class="flex items-center">
            <BaseIcon size="sm" class="mr-2">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </BaseIcon>
            Add {{ wordStore.isSearching ? '' : 'Your First ' }}Word
          </BaseButton>
        </div>
      </div>

      <!-- Word list -->
      <template v-else>
        <WordTable 
          :words="wordStore.displayWords" 
          @edit="openWordForm" 
          @delete="confirmDelete"
        />

        <!-- Pagination (only show for non-search results) -->
        <div v-if="!wordStore.isSearching" class="pagination-container">
          <div class="pagination-info">
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ (wordStore.pagination.page - 1) * wordStore.pagination.pageSize + 1 }}</span> to 
              <span class="font-medium">{{ Math.min(wordStore.pagination.page * wordStore.pagination.pageSize, wordStore.pagination.totalCount) }}</span> of 
              <span class="font-medium">{{ wordStore.pagination.totalCount }}</span> results
            </p>
          </div>
          <Pagination
            :current-page="wordStore.pagination.page"
            :total-pages="Math.ceil(wordStore.pagination.totalCount / wordStore.pagination.pageSize)"
            @page-change="wordStore.changePage"
          />
        </div>

        <!-- Search results info -->
        <div v-else class="search-results-info">
          <p class="text-sm text-gray-600">
            Showing {{ wordStore.searchResults.length }} search result{{ wordStore.searchResults.length !== 1 ? 's' : '' }}
            for "{{ wordStore.filters.search }}"
          </p>
        </div>
      </template>
    </div>

    <!-- Word Form Modal -->
    <WordForm
      :open="showWordModal"
      :loading="formLoading"
      :word="editingWord"
      :difficulty-options="wordStore.difficultyOptions"
      :dialect-options="wordStore.dialectOptions"
      :mastery-level-options="wordStore.masteryLevelOptions"
      :parts-of-speech-options="wordStore.partsOfSpeechOptions"
      @close="closeWordModal"
      @submit="saveWord"
    />

    <!-- Delete Confirmation Modal -->
    <WordDeleteModal
      :open="showDeleteModal"
      :loading="deleteLoading"
      :word="wordToDelete"
      @close="closeDeleteModal"
      @confirm="handleDeleteWord"
    />
  </div>
</template>

<script setup lang="ts">
import type { Word } from '@/types'
import { onMounted, ref } from 'vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseIcon from '../components/common/BaseIcon.vue'
import Pagination from '../components/common/Pagination.vue'
import WordDeleteModal from '../components/vocabulary/WordDeleteModal.vue'
import WordFilters from '../components/vocabulary/WordFilters.vue'
import WordForm from '../components/vocabulary/WordForm.vue'
import WordTable from '../components/vocabulary/WordTable.vue'
import { useWordStore } from '../stores/wordStore'

// Store
const wordStore = useWordStore()

// Modal state
const showWordModal = ref(false)
const showDeleteModal = ref(false)
const formLoading = ref(false)
const deleteLoading = ref(false)
const editingWord = ref<Word | null>(null)
const wordToDelete = ref<Word | null>(null)

// Search debouncing
let searchTimeout: number | null = null
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    wordStore.searchWords(wordStore.filters.search)
  }, 300) as unknown as number
}

// Filter change handler (for non-search filters)
const handleFilterChange = () => {
  // Reset to first page when filters change
  wordStore.fetchWords(true)
}

// Clear search
const clearSearch = () => {
  wordStore.clearSearch()
}

// Word form methods
const openWordForm = (word?: Word) => {
  editingWord.value = word || null
  showWordModal.value = true
}

const closeWordModal = () => {
  showWordModal.value = false
  editingWord.value = null
}

const saveWord = async (formData: any) => {
  formLoading.value = true
  try {
    if (editingWord.value) {
      await wordStore.updateWord(editingWord.value.id, formData)
    } else {
      await wordStore.createWord(formData)
    }
    closeWordModal()
  } catch (error) {
    console.error('Error saving word:', error)
  } finally {
    formLoading.value = false
  }
}

// Delete modal methods
const confirmDelete = (word: Word) => {
  wordToDelete.value = word
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  wordToDelete.value = null
}

const handleDeleteWord = async () => {
  if (!wordToDelete.value) return

  deleteLoading.value = true
  try {
    await wordStore.deleteWord(wordToDelete.value.id)
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting word:', error)
  } finally {
    deleteLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  wordStore.fetchWords()
})
</script>

<style scoped>
.vocabulary-view {
  @apply animate-fade-in;
}

.vocabulary-header {
  @apply flex justify-between items-center mb-8;
}

.vocabulary-title {
  @apply text-3xl font-bold text-gray-900;
}

.vocabulary-subtitle {
  @apply text-gray-600 mt-1;
}

.loading-indicator {
  @apply flex justify-center items-center py-12;
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

.rtl {
  direction: rtl;
}
</style>
