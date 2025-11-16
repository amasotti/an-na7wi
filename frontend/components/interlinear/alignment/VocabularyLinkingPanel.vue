<template>
  <div class="space-md">
    <!-- Alignment Preview -->
    <div v-if="linkingAlignment" class="vocab-preview">
      <p class="vocab-preview-label">Linking alignment:</p>
      <div class="vocab-preview-content space-xs">
        <div class="arabic-text" dir="rtl">{{ linkingAlignment.arabicTokens }}</div>
        <div class="text-gray-700 dark:text-gray-300">{{ linkingAlignment.transliterationTokens }}</div>
        <div class="text-gray-600 dark:text-gray-400">{{ linkingAlignment.translationTokens }}</div>
      </div>
    </div>

    <!-- Search Input -->
    <div class="form-field">
      <label class="form-label">Search Vocabulary</label>
      <div class="relative">
        <input
          v-model="vocabSearchQuery"
          type="search"
          class="form-input-na7wi"
          placeholder="Type at least 3 characters to search..."
          @focus="showDropdown = true"
        />

        <!-- Search Results Dropdown -->
        <div
          v-if="showDropdown && vocabSearchResults.length > 0"
          class="vocab-dropdown"
        >
          <button
            v-for="word in vocabSearchResults"
            :key="word.id"
            type="button"
            class="vocab-dropdown-item"
            @click="handleSelectWord(word.id)"
          >
            <div class="vocab-item-content space-xs">
              <div class="vocab-item-arabic arabic-text" dir="rtl">{{ word.arabic }}</div>
              <div class="vocab-item-transliteration">{{ word.transliteration }}</div>
              <div class="vocab-item-translation">{{ word.translation }}</div>
            </div>
          </button>
        </div>

        <p v-if="vocabSearchQuery.length > 0 && vocabSearchQuery.length < 3" class="vocab-hint">
          Type at least 3 characters to search
        </p>
      </div>
    </div>

    <!-- Currently Linked Word -->
    <div v-if="currentLinkedWord" class="linked-vocab-section">
      <p class="linked-vocab-label">Currently linked to:</p>
      <div class="linked-vocab-card">
        <div class="linked-vocab-content space-xs">
          <div class="linked-vocab-arabic arabic-text" dir="rtl">{{ currentLinkedWord.arabic }}</div>
          <div class="linked-vocab-transliteration">{{ currentLinkedWord.transliteration }}</div>
          <div class="linked-vocab-translation">{{ currentLinkedWord.translation }}</div>
        </div>
        <BaseButton
          type="button"
          variant="danger"
          size="sm"
          @click="store.unlinkAlignmentFromVocab()"
        >
          Unlink
        </BaseButton>
      </div>
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <BaseButton type="button" variant="outline" @click="store.closeVocabLinkModal()">
        Close
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseButton from '~/components/common/BaseButton.vue'
import { useInterlinearStore } from '~/stores/interlinearStore'

const store = useInterlinearStore()
const { vocabSearchQuery, vocabSearchResults, currentLinkedWord, linkingAlignment } =
  storeToRefs(store)

const showDropdown = ref(false)

const handleSelectWord = async (wordId: string) => {
  await store.linkAlignmentToVocab(wordId)
  showDropdown.value = false
}

// Watch for vocabulary search query changes
let vocabSearchTimer: ReturnType<typeof setTimeout> | null = null
watch(vocabSearchQuery, newQuery => {
  if (vocabSearchTimer) clearTimeout(vocabSearchTimer)
  if (!newQuery.trim()) {
    return
  }
  vocabSearchTimer = setTimeout(() => store.searchVocabulary(newQuery.trim()), 400)
})
</script>

<style scoped>
.vocab-preview {
  @apply p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg;
}

.vocab-preview-label {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300 mb-2;
}

.vocab-preview-content {
  @apply text-sm;
}

.arabic-text {
  @apply text-base font-arabic text-gray-900 dark:text-gray-100 font-semibold;
}

.vocab-dropdown {
  @apply absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto;
}

.vocab-dropdown-item {
  @apply w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700 focus:outline-none transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0;
}

.vocab-item-content {
  @apply text-sm;
}

.vocab-item-arabic {
  @apply text-base font-semibold text-gray-900 dark:text-gray-100;
}

.vocab-item-transliteration {
  @apply text-sm text-gray-600 dark:text-gray-400 italic;
}

.vocab-item-translation {
  @apply text-sm text-gray-700 dark:text-gray-300;
}

.vocab-hint {
  @apply mt-2 text-xs text-gray-500 dark:text-gray-400;
}

.linked-vocab-section {
  @apply p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg;
}

.linked-vocab-label {
  @apply text-sm font-medium text-green-800 dark:text-green-200 mb-2;
}

.linked-vocab-card {
  @apply flex items-start justify-between gap-3 p-3 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-lg;
}

.linked-vocab-content {
  @apply flex-1;
}

.linked-vocab-arabic {
  @apply text-base font-semibold text-gray-900 dark:text-gray-100;
}

.linked-vocab-transliteration {
  @apply text-sm text-gray-600 dark:text-gray-400 italic;
}

.linked-vocab-translation {
  @apply text-sm text-gray-700 dark:text-gray-300;
}
</style>
