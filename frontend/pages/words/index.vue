<template>
  <div class="vocabulary-view">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <VocabularyHeader
        :is-searching="wordStore.isSearching"
        :search-loading="wordStore.searchLoading"
        :search-results-count="wordStore.searchResults.length"
        @add-word="openWordForm()"
      />

      <!-- Content -->
      <VocabularyContent
        :display-words="wordStore.displayWords"
        :loading="wordStore.loading"
        :search-loading="wordStore.searchLoading"
        :is-searching="wordStore.isSearching"
        :filters="wordStore.filters"
        :pagination="wordStore.pagination"
        :difficulty-options="wordStore.difficultyOptions"
        :dialect-options="wordStore.dialectOptions"
        :mastery-level-options="wordStore.masteryLevelOptions"
        :view-mode="viewMode"
        @search-input="debouncedSearch"
        @filter-change="handleFilterChange"
        @clear-search="clearSearch"
        @add-word="openWordForm()"
        @edit-word="openWordForm"
        @delete-word="confirmDelete"
        @page-change="wordStore.changePage"
        @view-mode-change="viewMode = $event"
      />
    </div>

    <!-- Word Form Modal -->
    <WordForm
      :open="showWordModal"
      :loading="formLoading"
      :word="editingWord"
      @close="closeWordModal"
      @submit="saveWord"
      @related-word-click="handleRelatedWordClick"
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
import { onMounted, ref, watchEffect } from 'vue'
// import { useRoute } from 'vue-router' // Not needed in Nuxt
import VocabularyContent from '~/components/vocabulary/VocabularyContent.vue'
import VocabularyHeader from '~/components/vocabulary/VocabularyHeader.vue'
import WordDeleteModal from '~/components/vocabulary/WordDeleteModal.vue'
import WordForm from '~/components/vocabulary/WordForm.vue'
import { useWordStore } from '~/stores/wordStore'
import type { Word } from '~/types'

// Store and route
const wordStore = useWordStore()
const route = useRoute()

// Modal state
const showWordModal = ref(false)
const showDeleteModal = ref(false)
const formLoading = ref(false)
const deleteLoading = ref(false)
const editingWord = ref<Word | null>(null)
const wordToDelete = ref<Word | null>(null)

// View mode state
const viewMode = ref<'table' | 'grid'>('grid')

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
  if (!word) {
    editingWord.value = null
    showWordModal.value = true
    return
  }

  editingWord.value = word
  navigateTo(`/words/${word.id}`)
}

const closeWordModal = () => {
  showWordModal.value = false
  editingWord.value = null
}

const saveWord = async (formData: Partial<Word>) => {
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

// Handle clicking on related words from WordForm
const handleRelatedWordClick = async (word: Partial<Word>) => {
  try {
    // Fetch the full word details
    await wordStore.fetchWordById(word.id!)
    if (wordStore.currentWord) {
      // Open the word form in edit mode
      openWordForm(wordStore.currentWord)
    }
  } catch (error) {
    console.error('Error fetching word details:', error)
  }
}

// Track initialization to prevent duplicate calls
const isInitialized = ref(false)

// Handle query parameters
watchEffect(() => {
  if (!isInitialized.value) return // Prevent firing before onMounted
  
  const searchParam = route.query.search as string
  if (searchParam && searchParam !== wordStore.filters.search) {
    wordStore.updateFilters({ search: searchParam })
  }
})

// Lifecycle
onMounted(() => {
  const searchParam = route.query.search as string
  if (searchParam) {
    wordStore.updateFilters({ search: searchParam })
  } else {
    wordStore.fetchWords()
  }
  isInitialized.value = true
})
</script>

<style scoped>
.vocabulary-view {
  @apply animate-fade-in;
}
</style>
