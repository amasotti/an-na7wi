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
    <div class="alignments-container" dir="rtl">
      <InteractiveGlossa
        v-for="(alignment, index) in sortedAlignments"
        :alignment="alignment"
        :index="index"
        :is-selected="selectedAlignments.includes(index)"
        @toggle-selection="toggleSelection"
      />
    </div>

    <!-- Actions for selected alignment(s) -->
    <div v-if="selectedAlignments.length > 0" class="alignment-actions">

      <div class="actions-row">
        <!-- Single selection actions -->
          <BaseButton
            type="button"
            variant="outline"
            size="sm"
          @click="store.clearAlignmentSelection()"
          >
          Clear Selection
          </BaseButton>


          <EditButton
            @click="editAlignment"
          />

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
            class="form-input-na7wi arabic-input"
            placeholder="Arabic tokens"
          />
        </div>

        <div class="form-field">
          <label class="form-label">Transliteration Tokens</label>
          <input
            v-model="editingAlignment.transliterationTokens"
            type="text"
            class="form-input-na7wi"
            placeholder="Transliteration tokens"
          />
        </div>

        <div class="form-field">
          <label class="form-label">Translation Tokens</label>
          <input
            v-model="editingAlignment.translationTokens"
            type="text"
            class="form-input-na7wi"
            placeholder="Translation tokens"
          />
        </div>

        <div class="form-actions">
          <CancelButton type="button" @click="closeEditModal" />
          <SaveButton type="submit" text="Save" />
        </div>
      </form>
    </BaseModal>

    <!-- Vocabulary Link Modal -->
    <BaseModal
      :open="showVocabLinkModal"
      title="Link to Vocabulary"
      @close="store.closeVocabLinkModal()"
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
            class="form-input-na7wi"
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
              @click="store.linkAlignmentToVocab(word.id); showVocabDropdown = false"
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
              @click="store.unlinkAlignmentFromVocab()"
            >
              Unlink
            </BaseButton>
          </div>
        </div>

        <div class="modal-actions">
          <BaseButton type="button" variant="outline" @click="store.closeVocabLinkModal()">
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
import CancelButton from '~/components/common/CancelButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import SaveButton from '~/components/common/SaveButton.vue'
import InteractiveGlossa from '~/components/interlinear/alignment/InteractiveGlossa.vue'

const store = useInterlinearStore()
const {
  sortedAlignments,
  selectedAlignments,
  showVocabLinkModal,
  vocabSearchQuery,
  vocabSearchResults,
  currentLinkedWord,
  linkingAlignment,
} = storeToRefs(store)

// Local UI state for edit modal
const showEditModal = ref(false)
const editingAlignment = ref<{
  id: string
  arabicTokens: string
  transliterationTokens: string
  translationTokens: string
} | null>(null)
const showVocabDropdown = ref(false)

// Methods - delegated to store
const toggleSelection = (index: number, event: MouseEvent) => {
  store.toggleAlignmentSelection(index, event)
}

const editAlignment = () => {
  if (selectedAlignments.value.length !== 1) return
  const index = selectedAlignments.value[0]
  if (index === undefined) return
  const alignment = sortedAlignments.value[index]
  if (!alignment) return

  editingAlignment.value = {
    id: alignment.id!,
    arabicTokens: alignment.arabicTokens,
    transliterationTokens: alignment.transliterationTokens,
    translationTokens: alignment.translationTokens,
  }
  showEditModal.value = true
}

const saveEditedAlignment = async () => {
  if (!editingAlignment.value) return

  await store.updateAlignmentTokens(editingAlignment.value.id, {
    arabicTokens: editingAlignment.value.arabicTokens,
    transliterationTokens: editingAlignment.value.transliterationTokens,
    translationTokens: editingAlignment.value.translationTokens,
  })

  closeEditModal()
}

const closeEditModal = () => {
  showEditModal.value = false
  editingAlignment.value = null
}

const linkToVocabulary = async () => {
  if (selectedAlignments.value.length !== 1) return
  const index = selectedAlignments.value[0]
  if (index === undefined) return

  await store.openVocabLinkModal(index)
}

// Watchers
// Debounced search for vocabulary words
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


.arabic-text {
  @apply text-base font-arabic text-gray-900 dark:text-gray-100 font-semibold;
}

.alignment-actions {
  @apply mt-4 pt-4 border-t border-gray-200;
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
