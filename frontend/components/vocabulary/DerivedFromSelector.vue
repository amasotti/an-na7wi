<template>
  <div class="space-md">
    <!-- Search Input -->
    <div class="relative">
      <BaseInput
        v-model="searchQuery"
        type="search"
        placeholder="Search for parent word..."
        label="Derived From"
        hin="Select the word this word is derived from, will be used to generate derivations."
        @focus="showDropdown = true"
      />

      <!-- Search Results Dropdown -->
      <ul v-if="showDropdown && searchResults.length" class="search-dropdown" role="listbox">
        <li v-for="word in searchResults" :key="word.id" class="search-item">
          <button type="button" class="search-item-button" role="option" @click="selectWord(word)">
            <div class="search-item-content">
              <div class="search-item-text">
                <span class="arabic">{{ word.arabic }}</span>
                <span v-if="word.transliteration" class="transliteration">{{ word.transliteration }}</span>
                <span v-if="word.translation" class="gloss-translation">{{ word.translation }}</span>
              </div>
            </div>
          </button>
        </li>
      </ul>
    </div>

    <!-- Selected Word -->
    <div v-if="selectedWord" class="mt-3">
      <div class="selected-word">
        <div class="selected-word-info">
          <span class="selected-word-arabic arabic">{{ selectedWord.arabic }}</span>
          <span v-if="selectedWord.transliteration" class="selected-word-transliteration">{{ selectedWord.transliteration }}</span>
        </div>
        <button type="button" class="selected-word-remove" @click="clearSelection" aria-label="Clear selection">
          <BaseIcon class="icon-remove">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </BaseIcon>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import { wordService } from '~/composables/wordService'
import type { WordSearchResult } from '~/types'

interface Props {
  modelValue: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const searchQuery = ref('')
const searchResults = ref<WordSearchResult[]>([])
const showDropdown = ref(false)
const selectedWord = ref<WordSearchResult | null>(null)

const searchWords = async (query: string) => {
  if (query.length < 2) {
    searchResults.value = []
    return
  }
  try {
    searchResults.value = await wordService.searchWords(query, 10)
  } catch (err) {
    console.error('Failed to search words:', err)
    searchResults.value = []
  }
}

const selectWord = (word: WordSearchResult) => {
  selectedWord.value = word
  emit('update:modelValue', word.id)
  resetSearch()
}

const clearSelection = () => {
  selectedWord.value = null
  resetSearch()
  emit('update:modelValue', null)
}

const resetSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  showDropdown.value = false
}

// Load selected word when modelValue changes externally
watch(
  () => props.modelValue,
  async (newValue) => {
    if (newValue && (!selectedWord.value || selectedWord.value.id !== newValue)) {
      try {
        const word = await wordService.getWord(newValue)
        selectedWord.value = {
          id: word.id,
          arabic: word.arabic,
          transliteration: word.transliteration,
          translation: word.translation,
        }
      } catch (error) {
        console.error('Failed to load selected word:', error)
        selectedWord.value = null
      }
    } else if (!newValue) {
      selectedWord.value = null
      resetSearch()
    }
  },
  { immediate: true }
)

// Debounced search
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, (newQuery) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!newQuery.trim()) {
    resetSearch()
    return
  }
  debounceTimer = setTimeout(() => searchWords(newQuery.trim()), 400)
})
</script>

<style scoped>
.search-dropdown {
  @apply absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto;
}

.search-item-button {
  @apply w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors;
}

.search-item-content {
  @apply flex items-start justify-between;
}

.search-item-text {
  @apply flex flex-col gap-1;
}

.selected-word {
  @apply flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg;
}

.selected-word-info {
  @apply flex flex-col gap-1;
}

.selected-word-arabic {
  @apply text-gray-900 font-medium text-lg;
}

.selected-word-transliteration {
  @apply text-sm text-gray-600 italic;
}

.selected-word-remove {
  @apply p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors;
}

.icon-remove {
  @apply w-4 h-4;
}
</style>
