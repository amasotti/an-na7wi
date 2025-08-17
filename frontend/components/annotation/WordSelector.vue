<template>
  <article class="form-group">
    <label v-if="label" class="form-label">{{ label }}</label>

    <!-- Search Input -->
    <div class="relative">
      <BaseInput
        v-model="searchQuery"
        type="search"
        placeholder="Search for words to link..."
        :clearable="true"
        @focus="showDropdown = true"
      />

      <!-- Search Results Dropdown -->
      <ul
        v-if="showDropdown && searchResults.length"
        class="search-dropdown"
        role="listbox"
      >
        <li v-for="word in searchResults" :key="word.id" class="search-item">
          <button
            type="button"
            class="search-item-button"
            role="option"
            @click="selectWord(word)"
          >
            <div class="search-item-content">
              <div class="search-item-text">
                <span class="word-arabic arabic">{{ word.arabic }}</span>
                <span
                  v-if="word.transliteration"
                  class="word-transliteration"
                >
                  {{ word.transliteration }}
                </span>
                <span v-if="word.translation" class="word-translation">
                  {{ word.translation }}
                </span>
              </div>
              <BaseIcon class="icon-add">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </BaseIcon>
            </div>
          </button>
        </li>
      </ul>
    </div>

    <!-- Selected Words -->
    <section v-if="selectedWords.length" class="form-preview">
      <header class="form-preview-title">
        Linked Words ({{ selectedWords.length }})
      </header>
      <div class="form-preview-content">
        <div
          v-for="word in selectedWords"
          :key="word.id"
          class="linked-word"
        >
          <span class="linked-word-arabic arabic">{{ word.arabic }}</span>
          <span
            v-if="word.transliteration"
            class="linked-word-transliteration"
          >
            {{ word.transliteration }}
          </span>
          <button
            type="button"
            class="linked-word-remove"
            @click="removeWord(word.id)"
            aria-label="Remove linked word"
          >
            <BaseIcon class="icon-remove">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </BaseIcon>
          </button>
        </div>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { WordSearchResult } from '~/types'
import { wordService } from '~/composables/wordService'
import { annotationService } from '~/composables/annotationService'
import BaseIcon from '~/components/common/BaseIcon.vue'
import BaseInput from '~/components/common/BaseInput.vue'

// --- Props / Emits ---
interface Props {
  modelValue: WordSearchResult[]
  label?: string
  annotationId?: string
  realTimeMode?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  label: 'Linked Words (optional)',
  annotationId: '',
  realTimeMode: false,
})
const emit = defineEmits<{
  'update:modelValue': [value: WordSearchResult[]]
  'word-added': [word: WordSearchResult]
  'word-removed': [word: WordSearchResult]
  'error': [error: Error]
}>()

// --- State ---
const searchQuery = ref('')
const searchResults = ref<WordSearchResult[]>([])
const showDropdown = ref(false)

// --- Computed ---
const selectedWords = computed(() => props.modelValue ?? [])

// --- Methods ---
const searchWords = async (query: string) => {
  if (query.length < 3) {
    searchResults.value = []
    return
  }
  try {
    const results = await wordService.searchWords(query)
    searchResults.value = results.filter(
      (word) => !selectedWords.value.some((s) => s.id === word.id),
    )
  } catch (err) {
    console.error('Failed to search words:', err)
    searchResults.value = []
  }
}

const selectWord = async (word: WordSearchResult) => {
  if (props.realTimeMode && props.annotationId) {
    // Real-time mode: immediately link to annotation via API
    try {
      await annotationService.linkWordToAnnotation(props.annotationId, word.id)
      emit('word-added', word)
      emit('update:modelValue', [...selectedWords.value, word])
    } catch (error) {
      console.error('Failed to link word to annotation:', error)
      emit('error', error as Error)
      return
    }
  } else {
    // Traditional mode: just update the model
    emit('update:modelValue', [...selectedWords.value, word])
  }
  resetSearch()
}

const removeWord = async (id: string) => {
  const wordToRemove = selectedWords.value.find(w => w.id === id)
  if (!wordToRemove) return

  if (props.realTimeMode && props.annotationId) {
    // Real-time mode: immediately unlink from annotation via API
    try {
      await annotationService.unlinkWordFromAnnotation(props.annotationId, id)
      emit('word-removed', wordToRemove)
      emit('update:modelValue', selectedWords.value.filter((w) => w.id !== id))
    } catch (error) {
      console.error('Failed to unlink word from annotation:', error)
      emit('error', error as Error)
      return
    }
  } else {
    // Traditional mode: just update the model
    emit('update:modelValue', selectedWords.value.filter((w) => w.id !== id))
  }
}

const resetSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  showDropdown.value = false
}

// --- Watchers (debounced search) ---
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
  @apply z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto;
}

.search-item-button {
  @apply w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors;
}

.search-item-content {
  @apply flex items-start justify-between;
}

.word-arabic {
  @apply text-gray-900;
}

.word-transliteration {
  @apply block text-sm text-gray-600 italic;
}

.word-translation {
  @apply block text-sm text-gray-600;
}

.icon-add {
  @apply w-4 h-4 text-gray-400 mt-1;
}

.linked-word {
  @apply inline-flex items-center gap-2 px-3 py-2 bg-primary-100 text-primary-800 rounded-lg text-sm;
}

.linked-word-arabic {
  @apply font-medium;
}

.linked-word-transliteration {
  @apply text-primary-600 italic;
}

.linked-word-remove {
  @apply ml-1 p-0.5 text-primary-600 hover:text-primary-800 hover:bg-primary-200 rounded-sm transition-colors;
}

.icon-remove {
  @apply w-3 h-3;
}
</style>
