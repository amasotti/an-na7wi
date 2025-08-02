<template>
  <div class="vocabulary animate-fade-in">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Vocabulary Manager</h1>
          <p class="text-gray-600 mt-1">
            Build and manage your Arabic vocabulary with root analysis, frequency tracking, and contextual learning.
          </p>
        </div>
        <button 
          @click="openWordModal()" 
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center"
        >
          <BaseIcon size="sm" class="mr-2">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </BaseIcon>
          Add New Word
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input 
              v-model="filters.search" 
              type="text" 
              placeholder="Search words..." 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              @input="debouncedFetchWords"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select 
              v-model="filters.difficulty" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              @change="fetchWords"
            >
              <option value="">All Difficulties</option>
              <option v-for="difficulty in difficulties" :key="difficulty" :value="difficulty">
                {{ difficulty }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dialect</label>
            <select 
              v-model="filters.dialect" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              @change="fetchWords"
            >
              <option value="">All Dialects</option>
              <option v-for="dialect in dialects" :key="dialect" :value="dialect">
                {{ dialect }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mastery Level</label>
            <select 
              v-model="filters.masteryLevel" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              @change="fetchWords"
            >
              <option value="">All Levels</option>
              <option v-for="level in masteryLevels" :key="level" :value="level">
                {{ level }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!words || words.length === 0" class="bg-white rounded-xl shadow-sm p-12 text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <BaseIcon size="lg" class="text-gray-400">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </BaseIcon>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No words found</h3>
        <p class="text-gray-500 mb-6">Start building your vocabulary by adding new words.</p>
        <button 
          @click="openWordModal()" 
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 inline-flex items-center"
        >
          <BaseIcon size="sm" class="mr-2">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </BaseIcon>
          Add Your First Word
        </button>
      </div>

      <!-- Word list -->
      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Word
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Translation
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mastery
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dialect
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="word in words" :key="word.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div>
                      <div class="text-lg font-medium text-gray-900 rtl">{{ word.arabic }}</div>
                      <div class="text-sm text-gray-500">{{ word.transliteration }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ word.translation }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getDifficultyBadgeClass(word.difficulty)">
                    {{ word.difficulty }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getMasteryBadgeClass(word.masteryLevel)">
                    {{ word.masteryLevel || 'NEW' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ word.dialect }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="openWordModal(word)" 
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    @click="confirmDelete(word)" 
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div class="flex-1 flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ (pagination.page - 1) * pagination.pageSize + 1 }}</span> to 
                <span class="font-medium">{{ Math.min(pagination.page * pagination.pageSize, pagination.totalCount) }}</span> of 
                <span class="font-medium">{{ pagination.totalCount }}</span> results
              </p>
            </div>
            <div>
              <button 
                @click="prevPage" 
                :disabled="pagination.page === 1" 
                :class="pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : ''"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-3"
              >
                Previous
              </button>
              <button 
                @click="nextPage" 
                :disabled="pagination.page * pagination.pageSize >= pagination.totalCount" 
                :class="pagination.page * pagination.pageSize >= pagination.totalCount ? 'opacity-50 cursor-not-allowed' : ''"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Word Modal -->
    <div v-if="showWordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editingWord ? 'Edit Word' : 'Add New Word' }}
          </h3>
          <button @click="closeWordModal" class="text-gray-400 hover:text-gray-500">
            <BaseIcon size="md">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </BaseIcon>
          </button>
        </div>
        <div class="px-6 py-4">
          <form @submit.prevent="saveWord">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Arabic Word -->
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Arabic Word*</label>
                <input 
                  v-model="wordForm.arabic" 
                  type="text" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 rtl"
                >
              </div>

              <!-- Transliteration -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Transliteration</label>
                <input 
                  v-model="wordForm.transliteration" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>

              <!-- Translation -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Translation/Definition*</label>
                <input 
                  v-model="wordForm.translation" 
                  type="text" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>

              <!-- Example -->
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Example Sentence</label>
                <textarea 
                  v-model="wordForm.example" 
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 rtl"
                ></textarea>
              </div>

              <!-- Root -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Root</label>
                <input 
                  v-model="wordForm.root" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 rtl"
                >
              </div>

              <!-- Part of Speech -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Part of Speech</label>
                <select 
                  v-model="wordForm.partOfSpeech" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Part of Speech</option>
                  <option v-for="pos in partsOfSpeech" :key="pos" :value="pos">
                    {{ pos }}
                  </option>
                </select>
              </div>

              <!-- Difficulty -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Difficulty*</label>
                <select 
                  v-model="wordForm.difficulty" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option v-for="difficulty in difficulties" :key="difficulty" :value="difficulty">
                    {{ difficulty }}
                  </option>
                </select>
              </div>

              <!-- Dialect -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Dialect*</label>
                <select 
                  v-model="wordForm.dialect" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option v-for="dialect in dialects" :key="dialect" :value="dialect">
                    {{ dialect }}
                  </option>
                </select>
              </div>

              <!-- Mastery Level -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mastery Level</label>
                <select 
                  v-model="wordForm.masteryLevel" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option v-for="level in masteryLevels" :key="level" :value="level">
                    {{ level }}
                  </option>
                </select>
              </div>

              <!-- Dictionary Links -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Dictionary Links</label>
                <input 
                  v-model="wordForm.dictionaryLinks" 
                  type="text" 
                  placeholder="Comma-separated URLs"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>

              <!-- Pronunciation Link -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Pronunciation Link</label>
                <input 
                  v-model="wordForm.pronunciationLink" 
                  type="text" 
                  placeholder="URL to audio pronunciation"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>

              <!-- Related Words -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Related Words</label>
                <input 
                  v-model="wordForm.relatedWords" 
                  type="text" 
                  placeholder="Comma-separated related words"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>

              <!-- Notes -->
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea 
                  v-model="wordForm.notes" 
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <button 
                type="button" 
                @click="closeWordModal" 
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-3 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                {{ editingWord ? 'Update Word' : 'Add Word' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Confirm Delete</h3>
        </div>
        <div class="px-6 py-4">
          <p class="text-gray-700">
            Are you sure you want to delete the word <span class="font-bold rtl">{{ wordToDelete?.arabic }}</span>?
            This action cannot be undone.
          </p>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button 
            @click="closeDeleteModal" 
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-3 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            @click="deleteWord" 
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import BaseIcon from '../components/common/BaseIcon.vue'
import { wordService } from '../services/wordService'
import type { Word } from '@/types'
import { Difficulty, Dialect, MasteryLevel, PartOfSpeech } from '@/types/enums'

// Enums
const difficulties = Object.values(Difficulty)
const dialects = Object.values(Dialect)
const masteryLevels = Object.values(MasteryLevel)
const partsOfSpeech = Object.values(PartOfSpeech)

// State
const words = ref<Word[]>([])
const loading = ref(false)
const showWordModal = ref(false)
const showDeleteModal = ref(false)
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

// Form
const wordForm = reactive({
  arabic: '',
  transliteration: '',
  translation: '',
  example: '',
  root: '',
  notes: '',
  partOfSpeech: PartOfSpeech.UNKNOWN,
  difficulty: Difficulty.BEGINNER,
  dialect: Dialect.MSA,
  masteryLevel: MasteryLevel.NEW,
  dictionaryLinks: '',
  pronunciationLink: '',
  relatedWords: '',
  isVerified: false
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
const nextPage = () => {
  if (pagination.page * pagination.pageSize < pagination.totalCount) {
    pagination.page++
    fetchWords()
  }
}

const prevPage = () => {
  if (pagination.page > 1) {
    pagination.page--
    fetchWords()
  }
}

// Word modal methods
const openWordModal = (word?: Word) => {
  if (word) {
    editingWord.value = word
    Object.assign(wordForm, {
      arabic: word.arabic,
      transliteration: word.transliteration || '',
      translation: word.translation || '',
      example: word.example || '',
      root: word.root || '',
      partOfSpeech: word.partOfSpeech || '',
      notes: word.notes || '',
      difficulty: word.difficulty,
      dialect: word.dialect,
      masteryLevel: word.masteryLevel || MasteryLevel.NEW,
      dictionaryLinks: word.dictionaryLinks || '',
      pronunciationLink: word.pronunciationLink || '',
      relatedWords: word.relatedWords || '',
      isVerified: word.isVerified
    })
  } else {
    editingWord.value = null
    Object.assign(wordForm, {
      arabic: '',
      transliteration: '',
      translation: '',
      example: '',
      root: '',
      partOfSpeech: '',
      notes: '',
      difficulty: Difficulty.BEGINNER,
      dialect: Dialect.MSA,
      masteryLevel: MasteryLevel.NEW,
      dictionaryLinks: '',
      pronunciationLink: '',
      relatedWords: '',
      isVerified: false
    })
  }
  showWordModal.value = true
}

const closeWordModal = () => {
  showWordModal.value = false
}

const saveWord = async () => {
  try {
    if (editingWord.value) {
      await wordService.updateWord(editingWord.value.id, wordForm)
    } else {
      await wordService.createWord(wordForm)
    }
    closeWordModal()
    fetchWords()
  } catch (error) {
    console.error('Error saving word:', error)
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
  
  try {
    await wordService.deleteWord(wordToDelete.value.id)
    closeDeleteModal()
    fetchWords()
  } catch (error) {
    console.error('Error deleting word:', error)
  }
}

// Utility methods for styling
const getDifficultyBadgeClass = (difficulty: Difficulty) => {
  const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
  switch (difficulty) {
    case Difficulty.BEGINNER:
      return `${baseClasses} bg-green-100 text-green-800`
    case Difficulty.INTERMEDIATE:
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    case Difficulty.ADVANCED:
      return `${baseClasses} bg-red-100 text-red-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

const getMasteryBadgeClass = (masteryLevel?: MasteryLevel) => {
  const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
  switch (masteryLevel) {
    case MasteryLevel.NEW:
      return `${baseClasses} bg-blue-100 text-blue-800`
    case MasteryLevel.LEARNING:
      return `${baseClasses} bg-purple-100 text-purple-800`
    case MasteryLevel.KNOWN:
      return `${baseClasses} bg-indigo-100 text-indigo-800`
    case MasteryLevel.MASTERED:
      return `${baseClasses} bg-green-100 text-green-800`
    default:
      return `${baseClasses} bg-blue-100 text-blue-800`
  }
}

// Lifecycle
onMounted(() => {
  fetchWords()
})
</script>

<style scoped>
.rtl {
  direction: rtl;
}
</style>
