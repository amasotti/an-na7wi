<template>
  <div class="word-alignment-editor">
    <!-- Header -->
    <div class="editor-header">
      <h3 class="editor-title">Word Alignment Editor</h3>
      <p class="editor-description">
        Click tokens to select them, then merge to create alignments. Click an alignment to edit or split it.
      </p>
    </div>

    <!-- Alignments Display -->
    <div v-if="alignments.length > 0" class="alignments-container" dir="rtl">
      <div
        v-for="(alignment, index) in sortedAlignments"
        :key="alignment.id || `temp-${index}`"
        class="alignment-card"
        :class="{ 'alignment-selected': selectedAlignments.includes(index) }"
        @click="toggleSelection(index, $event)"
      >
        <!-- Arabic -->
        <div class="alignment-row arabic">
          <div class="alignment-value arabic-text">{{ alignment.arabicTokens }}</div>
        </div>

        <!-- Transliteration -->
        <div class="alignment-row transliteration">
          <div class="alignment-value">{{ alignment.transliterationTokens }}</div>
        </div>

        <!-- Translation -->
        <div class="alignment-row translation">
          <div class="alignment-value">{{ alignment.translationTokens }}</div>
        </div>

        <!-- Vocabulary Link Badge -->
        <div v-if="alignment.vocabularyWordId" class="vocab-badge">
          <BaseIcon size="xs">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </BaseIcon>
          Linked
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p class="empty-text">No alignments yet. Use "Auto-tokenize" to create initial alignments.</p>
    </div>

    <!-- Actions for selected alignment(s) -->
    <div v-if="selectedAlignments.length > 0" class="alignment-actions">
      <div class="selection-info">
        <span class="selection-count">{{ selectedAlignments.length }} alignment{{ selectedAlignments.length > 1 ? 's' : '' }} selected</span>
        <BaseButton
          type="button"
          variant="ghost"
          size="xs"
          @click="clearSelection"
        >
          Clear
        </BaseButton>
      </div>

      <div class="actions-row">
        <!-- Single selection actions -->
        <template v-if="selectedAlignments.length === 1">
          <BaseButton
            type="button"
            variant="outline"
            size="sm"
            @click="editAlignment"
          >
            <BaseIcon size="xs" class="button-icon">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </BaseIcon>
            Edit
          </BaseButton>

          <BaseButton
            type="button"
            variant="outline"
            size="sm"
            @click="splitAlignment"
          >
            <BaseIcon size="xs" class="button-icon">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </BaseIcon>
            Split
          </BaseButton>

          <BaseButton
            type="button"
            variant="outline"
            size="sm"
            @click="linkToVocabulary"
          >
            <BaseIcon size="xs" class="button-icon">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </BaseIcon>
            Link to Vocabulary
          </BaseButton>

          <BaseButton
            type="button"
            variant="danger"
            size="sm"
            @click="deleteAlignment"
          >
            <BaseIcon size="xs" class="button-icon">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </BaseIcon>
            Delete
          </BaseButton>
        </template>

        <!-- Multi-selection actions -->
        <template v-else-if="selectedAlignments.length > 1">
          <BaseButton
            type="button"
            variant="primary"
            size="sm"
            @click="mergeAlignments"
          >
            <BaseIcon size="xs" class="button-icon">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </BaseIcon>
            Merge
          </BaseButton>

          <BaseButton
            type="button"
            variant="danger"
            size="sm"
            @click="deleteSelectedAlignments"
          >
            <BaseIcon size="xs" class="button-icon">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </BaseIcon>
            Delete Selected
          </BaseButton>
        </template>
      </div>
    </div>

    <!-- Edit Modal -->
    <BaseModal
      :open="showEditModal"
      title="Edit Alignment"
      @close="closeEditModal"
    >
      <form v-if="editingAlignment" @submit.prevent="saveEditedAlignment" class="edit-form">
        <div class="form-field">
          <label class="form-label">Arabic Tokens</label>
          <input
            v-model="editingAlignment.arabicTokens"
            type="text"
            dir="rtl"
            class="form-input arabic-input"
            placeholder="Arabic tokens"
          />
        </div>

        <div class="form-field">
          <label class="form-label">Transliteration Tokens</label>
          <input
            v-model="editingAlignment.transliterationTokens"
            type="text"
            class="form-input"
            placeholder="Transliteration tokens"
          />
        </div>

        <div class="form-field">
          <label class="form-label">Translation Tokens</label>
          <input
            v-model="editingAlignment.translationTokens"
            type="text"
            class="form-input"
            placeholder="Translation tokens"
          />
        </div>

        <div class="modal-actions">
          <BaseButton type="button" variant="outline" @click="closeEditModal">
            Cancel
          </BaseButton>
          <BaseButton type="submit" variant="primary">
            Save
          </BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- Vocabulary Link Modal -->
    <BaseModal
      :open="showVocabModal"
      title="Link to Vocabulary"
      @close="closeVocabModal"
    >
      <div class="vocab-modal">
        <div class="vocab-preview" v-if="linkingAlignment">
          <p class="vocab-preview-label">Linking:</p>
          <div class="vocab-preview-content">
            <div class="vocab-preview-text arabic-text" dir="rtl">{{ linkingAlignment.arabicTokens }}</div>
            <div class="vocab-preview-text">{{ linkingAlignment.transliterationTokens }}</div>
            <div class="vocab-preview-text">{{ linkingAlignment.translationTokens }}</div>
          </div>
        </div>

        <!-- Search Input -->
        <div class="form-field">
          <label class="form-label">Search Vocabulary</label>
          <input
            v-model="vocabSearchQuery"
            type="search"
            class="form-input"
            placeholder="Type at least 3 characters to search..."
            @focus="showVocabDropdown = true"
          />

          <!-- Search Results Dropdown -->
          <div
            v-if="showVocabDropdown && vocabSearchResults.length > 0"
            class="vocab-dropdown"
          >
            <button
              v-for="word in vocabSearchResults"
              :key="word.id"
              type="button"
              class="vocab-dropdown-item"
              @click="selectVocabularyWord(word)"
            >
              <div class="vocab-item-content">
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

        <!-- Currently Linked Word -->
        <div v-if="currentLinkedWord" class="linked-vocab-section">
          <p class="linked-vocab-label">Currently linked to:</p>
          <div class="linked-vocab-card">
            <div class="linked-vocab-content">
              <div class="linked-vocab-arabic arabic-text" dir="rtl">{{ currentLinkedWord.arabic }}</div>
              <div class="linked-vocab-transliteration">{{ currentLinkedWord.transliteration }}</div>
              <div class="linked-vocab-translation">{{ currentLinkedWord.translation }}</div>
            </div>
            <BaseButton
              type="button"
              variant="danger"
              size="sm"
              @click="unlinkVocabularyWord"
            >
              Unlink
            </BaseButton>
          </div>
        </div>

        <div class="modal-actions">
          <BaseButton type="button" variant="outline" @click="closeVocabModal">
            Close
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import BaseModal from '~/components/common/BaseModal.vue'
import { wordService } from '~/composables/wordService'
import type { WordAlignment, WordSearchResult } from '~/types'

interface Props {
  alignments: WordAlignment[]
  sentenceId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [alignments: WordAlignment[]]
  split: [alignmentIndex: number]
  merge: [alignmentIndices: number[]]
}>()

// State
const selectedAlignments = ref<number[]>([])
const showEditModal = ref(false)
const editingAlignment = ref<Partial<WordAlignment> | null>(null)
const editingIndex = ref<number | null>(null)

// Vocabulary linking state
const showVocabModal = ref(false)
const linkingAlignment = ref<WordAlignment | null>(null)
const linkingIndex = ref<number | null>(null)
const vocabSearchQuery = ref('')
const vocabSearchResults = ref<WordSearchResult[]>([])
const showVocabDropdown = ref(false)
const currentLinkedWord = ref<WordSearchResult | null>(null)

// Computed
const sortedAlignments = computed(() => {
  return [...props.alignments].sort((a, b) => a.tokenOrder - b.tokenOrder)
})

// Methods
const toggleSelection = (index: number, event: MouseEvent) => {
  if (event.shiftKey && selectedAlignments.value.length > 0) {
    // Shift-click: Select range
    const lastSelected = selectedAlignments.value[selectedAlignments.value.length - 1]
    if (lastSelected === undefined) return
    const start = Math.min(lastSelected, index)
    const end = Math.max(lastSelected, index)
    const range = Array.from({ length: end - start + 1 }, (_, i) => start + i)
    selectedAlignments.value = [...new Set([...selectedAlignments.value, ...range])]
  } else if (event.metaKey || event.ctrlKey) {
    // Ctrl/Cmd-click: Toggle individual selection
    const idx = selectedAlignments.value.indexOf(index)
    if (idx > -1) {
      selectedAlignments.value.splice(idx, 1)
    } else {
      selectedAlignments.value.push(index)
    }
  } else {
    // Regular click: Select only this one
    if (selectedAlignments.value.length === 1 && selectedAlignments.value[0] === index) {
      selectedAlignments.value = []
    } else {
      selectedAlignments.value = [index]
    }
  }
}

const clearSelection = () => {
  selectedAlignments.value = []
}

const editAlignment = () => {
  if (selectedAlignments.value.length !== 1) return

  const index = selectedAlignments.value[0]
  if (index === undefined) return

  const alignment = sortedAlignments.value[index]
  if (!alignment) return

  editingAlignment.value = { ...alignment }
  editingIndex.value = index
  showEditModal.value = true
}

const saveEditedAlignment = () => {
  if (!editingAlignment.value || editingIndex.value === null) return

  const sortedAlignment = sortedAlignments.value[editingIndex.value]
  if (!sortedAlignment) return

  const updatedAlignments = [...props.alignments]
  const originalIndex = props.alignments.findIndex(a => a.id === sortedAlignment.id)

  if (originalIndex !== -1) {
    const originalAlignment = updatedAlignments[originalIndex]
    if (!originalAlignment) return

    updatedAlignments[originalIndex] = {
      ...originalAlignment,
      ...editingAlignment.value,
      id: originalAlignment.id,
      arabicTokens: editingAlignment.value.arabicTokens || originalAlignment.arabicTokens,
      transliterationTokens:
        editingAlignment.value.transliterationTokens || originalAlignment.transliterationTokens,
      translationTokens:
        editingAlignment.value.translationTokens || originalAlignment.translationTokens,
      tokenOrder:
        editingAlignment.value.tokenOrder !== undefined
          ? editingAlignment.value.tokenOrder
          : originalAlignment.tokenOrder,
    }
    emit('update', updatedAlignments)
  }

  closeEditModal()
}

const closeEditModal = () => {
  showEditModal.value = false
  editingAlignment.value = null
  editingIndex.value = null
}

const splitAlignment = () => {
  if (selectedAlignments.value.length !== 1) return
  const index = selectedAlignments.value[0]
  if (index === undefined) return
  emit('split', index)
  selectedAlignments.value = []
}

const mergeAlignments = () => {
  if (selectedAlignments.value.length < 2) return

  // Sort the indices to merge in order
  const sortedIndices = [...selectedAlignments.value].sort((a, b) => a - b)
  emit('merge', sortedIndices)
  selectedAlignments.value = []
}

const linkToVocabulary = async () => {
  if (selectedAlignments.value.length !== 1) return
  const index = selectedAlignments.value[0]
  if (index === undefined) return

  const alignment = sortedAlignments.value[index]
  if (!alignment) return

  linkingAlignment.value = alignment
  linkingIndex.value = index

  // Check if there's already a linked vocabulary word
  if (alignment.vocabularyWordId) {
    try {
      const word = await wordService.getWord(alignment.vocabularyWordId)
      currentLinkedWord.value = {
        id: word.id,
        arabic: word.arabic,
        transliteration: word.transliteration,
        translation: word.translation,
      }
    } catch (error) {
      console.error('Failed to fetch linked vocabulary word:', error)
      currentLinkedWord.value = null
    }
  } else {
    currentLinkedWord.value = null
  }

  showVocabModal.value = true
}

const searchVocabularyWords = async (query: string) => {
  if (query.length < 3) {
    vocabSearchResults.value = []
    return
  }
  try {
    const results = await wordService.searchWords(query)
    vocabSearchResults.value = results
  } catch (err) {
    console.error('Failed to search vocabulary words:', err)
    vocabSearchResults.value = []
  }
}

const selectVocabularyWord = async (word: WordSearchResult) => {
  if (!linkingAlignment.value || linkingIndex.value === null) return

  const alignment = linkingAlignment.value

  // Update the alignment with the vocabulary word ID
  const updatedAlignments = [...props.alignments]
  const originalIndex = props.alignments.findIndex(a => a.id === alignment.id)

  if (originalIndex !== -1) {
    const originalAlignment = updatedAlignments[originalIndex]
    if (!originalAlignment) return

    updatedAlignments[originalIndex] = {
      ...originalAlignment,
      vocabularyWordId: word.id,
    }
    emit('update', updatedAlignments)
  }

  // Update current linked word and close search
  currentLinkedWord.value = word
  vocabSearchQuery.value = ''
  vocabSearchResults.value = []
  showVocabDropdown.value = false
}

const unlinkVocabularyWord = () => {
  if (!linkingAlignment.value || linkingIndex.value === null) return

  const alignment = linkingAlignment.value

  // Update the alignment to remove the vocabulary word ID
  const updatedAlignments = [...props.alignments]
  const originalIndex = props.alignments.findIndex(a => a.id === alignment.id)

  if (originalIndex !== -1) {
    const originalAlignment = updatedAlignments[originalIndex]
    if (!originalAlignment) return

    updatedAlignments[originalIndex] = {
      ...originalAlignment,
      vocabularyWordId: undefined,
    }
    emit('update', updatedAlignments)
  }

  currentLinkedWord.value = null
}

const closeVocabModal = () => {
  showVocabModal.value = false
  linkingAlignment.value = null
  linkingIndex.value = null
  vocabSearchQuery.value = ''
  vocabSearchResults.value = []
  showVocabDropdown.value = false
  currentLinkedWord.value = null
}

const deleteAlignment = () => {
  if (selectedAlignments.value.length !== 1) return

  if (confirm('Delete this alignment?')) {
    const index = selectedAlignments.value[0]
    const updatedAlignments = props.alignments.filter((_, i) => i !== index)
    emit('update', updatedAlignments)
    selectedAlignments.value = []
  }
}

const deleteSelectedAlignments = () => {
  if (selectedAlignments.value.length === 0) return

  if (confirm(`Delete ${selectedAlignments.value.length} alignments?`)) {
    const updatedAlignments = props.alignments.filter(
      (_, index) => !selectedAlignments.value.includes(index)
    )
    emit('update', updatedAlignments)
    selectedAlignments.value = []
  }
}

// Watchers
// Debounced search for vocabulary words
let vocabSearchTimer: ReturnType<typeof setTimeout> | null = null
watch(vocabSearchQuery, newQuery => {
  if (vocabSearchTimer) clearTimeout(vocabSearchTimer)
  if (!newQuery.trim()) {
    vocabSearchResults.value = []
    showVocabDropdown.value = false
    return
  }
  vocabSearchTimer = setTimeout(() => searchVocabularyWords(newQuery.trim()), 400)
})
</script>

<style scoped>
.word-alignment-editor {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4;
}

.editor-header {
  @apply mb-4;
}

.editor-title {
  @apply text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1;
}

.editor-description {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.alignments-container {
  @apply grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3;
}

.alignment-card {
  @apply bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50
         rounded-lg p-3 border-2 border-gray-200 dark:border-gray-700
         cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:border-primary-300 dark:hover:border-primary-700;
}

.alignment-selected {
  @apply border-primary-500 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md;
}

.alignment-row {
  @apply mb-2 last:mb-0;
}

.alignment-value {
  @apply text-sm break-words;
}

.arabic-text {
  @apply text-base font-arabic text-gray-900 dark:text-gray-100 font-semibold;
}

.alignment-row.transliteration .alignment-value {
  @apply text-gray-600 dark:text-gray-400 italic;
}

.alignment-row.translation .alignment-value {
  @apply text-gray-700 dark:text-gray-300;
}

.vocab-badge {
  @apply mt-2 pt-2 border-t border-gray-300 dark:border-gray-600 flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-medium;
}

.empty-state {
  @apply text-center py-8 px-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700;
}

.empty-text {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.alignment-actions {
  @apply mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3;
}

.selection-info {
  @apply flex items-center justify-between pb-2;
}

.selection-count {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
}

.actions-row {
  @apply flex flex-wrap gap-2;
}

.button-icon {
  @apply mr-1;
}

.edit-form {
  @apply space-y-4;
}

.form-field {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.form-input {
  @apply w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
         transition-colors;
}

.arabic-input {
  @apply font-arabic text-base;
}

.modal-actions {
  @apply flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700;
}

/* Vocabulary Modal Styles */
.vocab-modal {
  @apply space-y-4;
}

.vocab-preview {
  @apply p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg;
}

.vocab-preview-label {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300 mb-2;
}

.vocab-preview-content {
  @apply space-y-1;
}

.vocab-preview-text {
  @apply text-sm text-gray-900 dark:text-gray-100;
}

.vocab-dropdown {
  @apply absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto;
}

.vocab-dropdown-item {
  @apply w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700 focus:outline-none transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0;
}

.vocab-item-content {
  @apply space-y-1;
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
  @apply mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg;
}

.linked-vocab-label {
  @apply text-sm font-medium text-green-800 dark:text-green-200 mb-2;
}

.linked-vocab-card {
  @apply flex items-start justify-between gap-3 p-3 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-lg;
}

.linked-vocab-content {
  @apply space-y-1 flex-1;
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
