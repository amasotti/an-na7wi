<template>
  <div class="vocabulary-view">
    <div class="container mx-auto px-4 py-8">
      <div class="vocabulary-header">
        <div>
          <h1 class="vocabulary-title">Vocabulary Manager</h1>
          <p class="vocabulary-subtitle">
            Build and manage your Arabic vocabulary with root analysis, frequency tracking, and contextual learning.
          </p>
        </div>
        <BaseButton @click="openWordForm()" class="flex items-center">
          <BaseIcon size="sm" class="mr-2">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </BaseIcon>
          Add New Word
        </BaseButton>
      </div>

      <!-- Filters -->
      <WordFilters
        v-model:search="filters.search"
        v-model:difficulty="filters.difficulty"
        v-model:dialect="filters.dialect"
        v-model:masteryLevel="filters.masteryLevel"
        :difficulty-options="difficultyOptions"
        :dialect-options="dialectOptions"
        :mastery-level-options="masteryLevelOptions"
        @search-input="debouncedFetchWords"
        @filter-change="fetchWords"
      />

      <!-- Loading state -->
      <div v-if="loading" class="loading-indicator">
        <div class="loading-spinner"></div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!words || words.length === 0" class="empty-state">
        <div class="empty-state-icon">
          <BaseIcon size="lg" class="text-gray-400">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </BaseIcon>
        </div>
        <h3 class="empty-state-title">No words found</h3>
        <p class="empty-state-message">Start building your vocabulary by adding new words.</p>
        <BaseButton @click="openWordForm()" class="flex items-center">
          <BaseIcon size="sm" class="mr-2">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </BaseIcon>
          Add Your First Word
        </BaseButton>
      </div>

      <!-- Word list -->
      <template v-else>
        <WordTable 
          :words="words" 
          @edit="openWordForm" 
          @delete="confirmDelete"
        />

        <!-- Pagination -->
        <div class="pagination-container">
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
            @page-change="changePage"
          />
        </div>
      </template>
    </div>

    <!-- Word Form Modal -->
    <WordForm
      :open="showWordModal"
      :loading="formLoading"
      :word="editingWord"
      :difficulty-options="difficultyOptions"
      :dialect-options="dialectOptions"
      :mastery-level-options="masteryLevelOptions"
      :parts-of-speech-options="partsOfSpeechOptions"
      @close="closeWordModal"
      @submit="saveWord"
    />

    <!-- Delete Confirmation Modal -->
    <WordDeleteModal
      :open="showDeleteModal"
      :loading="deleteLoading"
      :word="wordToDelete"
      @close="closeDeleteModal"
      @confirm="deleteWord"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import BaseIcon from '../components/common/BaseIcon.vue'
import BaseButton from '../components/common/BaseButton.vue'
import Pagination from '../components/common/Pagination.vue'
import WordFilters from '../components/vocabulary/WordFilters.vue'
import WordTable from '../components/vocabulary/WordTable.vue'
import WordForm from '../components/vocabulary/WordForm.vue'
import WordDeleteModal from '../components/vocabulary/WordDeleteModal.vue'
import { wordService } from '../services/wordService'
import type { Word, SelectOption } from '@/types'
import { Difficulty, Dialect, MasteryLevel, PartOfSpeech } from '@/types/enums'

// Enums and options for select fields
const difficulties = Object.values(Difficulty)
const dialects = Object.values(Dialect)
const masteryLevels = Object.values(MasteryLevel)
const partsOfSpeech = Object.values(PartOfSpeech)

// Create options arrays for select components
const difficultyOptions = computed<SelectOption<Difficulty>[]>(() => 
  difficulties.map(d => ({ value: d, label: d }))
)

const dialectOptions = computed<SelectOption<Dialect>[]>(() => 
  dialects.map(d => ({ value: d, label: d }))
)

const masteryLevelOptions = computed<SelectOption<MasteryLevel>[]>(() => 
  masteryLevels.map(m => ({ value: m, label: m }))
)

const partsOfSpeechOptions = computed<SelectOption<PartOfSpeech>[]>(() => 
  partsOfSpeech.map(p => ({ value: p, label: p }))
)

// State
const words = ref<Word[]>([])
const loading = ref(false)
const showWordModal = ref(false)
const showDeleteModal = ref(false)
const formLoading = ref(false)
const deleteLoading = ref(false)
const editingWord = ref<Word | null>(null)
const wordToDelete = ref<Word | null>(null)

// Pagination
const pagination = reactive({
  page: 1,
  pageSize: 10,
  totalCount: 0
})

// Filters
const filters = reactive({
  search: '',
  difficulty: '',
  dialect: '',
  masteryLevel: ''
})

// Fetch words with pagination and filters
const fetchWords = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      size: pagination.pageSize,
      sort: 'arabic',
      ...filters
    }

    const response = await wordService.getWords(params)
    pagination.totalCount = response.items.length
    words.value = response.items
  } catch (error) {
    console.error('Error fetching words:', error)
  } finally {
    loading.value = false
  }
}

// Debounced search
let searchTimeout: number | null = null
const debouncedFetchWords = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    fetchWords()
  }, 300) as unknown as number
}

// Pagination methods
const changePage = (page: number) => {
  pagination.page = page
  fetchWords()
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
      await wordService.updateWord(editingWord.value.id, formData)
    } else {
      await wordService.createWord(formData)
    }
    closeWordModal()
    fetchWords()
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

const deleteWord = async () => {
  if (!wordToDelete.value) return
  
  deleteLoading.value = true
  try {
    await wordService.deleteWord(wordToDelete.value.id)
    closeDeleteModal()
    fetchWords()
  } catch (error) {
    console.error('Error deleting word:', error)
  } finally {
    deleteLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchWords()
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

.rtl {
  direction: rtl;
}
</style>
