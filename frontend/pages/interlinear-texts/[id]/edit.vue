<template>
  <div class="page-container">
    <!-- Loading State -->
    <LoadingEffect v-if="loading" />

    <!-- Error State -->
    <BaseErrorState
      v-else-if="error"
      message="Failed to Load Text"
      :error="error"
    />

    <!-- Debug: Show current state -->
    <div v-else-if="!currentText && !loading && !error" class="debug-state">
      <p>Debug: currentText is null but not loading/error</p>
      <p>Route ID: {{ route.params.id }}</p>
    </div>

    <!-- Edit Form -->
    <div v-else-if="currentText" class="edit-container">
      <!-- Header -->
      <div class="page-header">
        <NuxtLink :to="`/interlinear-texts/${route.params.id}`" class="back-link">
          <BaseIcon size="sm" class="back-icon">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </BaseIcon>
          Back to Text
        </NuxtLink>

        <h1 class="page-title">Edit: {{ currentText.title }}</h1>
        <p class="page-description">
          Manage sentences and content for this interlinear text
        </p>
      </div>

      <!-- Text Metadata (Optional: can edit title/description here too) -->
      <div class="metadata-section">
        <h2 class="section-title">Text Information</h2>

        <div class="form-field">
          <label for="title" class="form-label">
            Title <span class="required-marker">*</span>
          </label>
          <input
            id="title"
            v-model="textMetadata.title"
            type="text"
            required
            class="form-input"
            placeholder="Text title"
          />
        </div>

        <div class="form-field">
          <label for="description" class="form-label">
            Description
          </label>
          <textarea
            id="description"
            v-model="textMetadata.description"
            rows="2"
            class="form-textarea"
            placeholder="Optional description"
          ></textarea>
        </div>
      </div>

      <!-- Sentences Section -->
      <div class="sentences-section">
        <div class="section-header">
          <h2 class="section-title">Sentences</h2>
        </div>

        <!-- Empty State -->
        <div v-if="sentences.length === 0" class="empty-state">
          <BaseIcon size="lg" class="empty-icon">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </BaseIcon>
          <h3 class="empty-title">No sentences yet</h3>
          <p class="empty-description">
            Click "Add Sentence" below to start adding content to your interlinear text
          </p>
        </div>

        <!-- Sentence Editors -->
        <div v-else class="sentences-list">
          <InterlinearSentenceEditor
            v-for="(sentence, index) in sentences"
            :key="sentence.tempId || sentence.id"
            :sentence="sentence"
            :sentence-id="sentence.tempId || sentence.id || `temp-${index}`"
            :sentence-order="index + 1"
            @update="updateSentence(index, $event)"
            @delete="deleteSentence(index)"
          />
        </div>

        <!-- Add Sentence Button (after all sentences) -->
        <div class="add-sentence-container">
          <BaseButton
            type="button"
            variant="primary"
            size="md"
            @click="addNewSentence"
          >
            <BaseIcon size="xs" class="button-icon">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </BaseIcon>
            Add Sentence
          </BaseButton>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions-section">
        <div class="actions-container">
          <BaseButton
            type="button"
            variant="outline"
            @click="handleCancel"
            :disabled="saving"
          >
            Cancel
          </BaseButton>

          <BaseButton
            type="button"
            variant="primary"
            :loading="saving"
            @click="handleSave"
          >
            Save Changes
          </BaseButton>
        </div>

        <!-- Error Message -->
        <div v-if="saveError" class="save-error">
          <BaseIcon size="sm" class="error-icon">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </BaseIcon>
          <span>{{ saveError }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseErrorState from '~/components/common/BaseErrorState.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import LoadingEffect from '~/components/common/LoadingEffect.vue'
import InterlinearSentenceEditor from '~/components/interlinear/InterlinearSentenceEditor.vue'
import { useInterlinearStore } from '~/stores/interlinearStore'
import type { InterlinearSentence } from '~/types'

const route = useRoute()
const interlinearStore = useInterlinearStore()

// State
const currentText = computed(() => interlinearStore.currentText)
const loading = computed(() => interlinearStore.loading)
const error = computed(() => interlinearStore.error)

const textMetadata = ref({
  title: '',
  description: '',
  dialect: null as any,
})

const sentences = ref<Array<Partial<InterlinearSentence> & { tempId?: string }>>([])
const saving = ref(false)
const saveError = ref<string | null>(null)

// Methods
const addNewSentence = () => {
  sentences.value.push({
    tempId: `temp-${Date.now()}`,
    arabicText: '',
    transliteration: '',
    translation: '',
    annotations: '',
    sentenceOrder: sentences.value.length,
  })
}

const updateSentence = (index: number, updatedSentence: Partial<InterlinearSentence>) => {
  sentences.value[index] = {
    ...sentences.value[index],
    ...updatedSentence,
  }
}

const deleteSentence = (index: number) => {
  if (confirm('Are you sure you want to delete this sentence?')) {
    sentences.value.splice(index, 1)
  }
}

const handleSave = async () => {
  saveError.value = null

  // Validate
  if (!textMetadata.value.title.trim()) {
    saveError.value = 'Title is required'
    return
  }

  // Validate sentences
  for (let i = 0; i < sentences.value.length; i++) {
    const sentence = sentences.value[i]
    if (
      !sentence.arabicText?.trim() ||
      !sentence.transliteration?.trim() ||
      !sentence.translation?.trim()
    ) {
      saveError.value = `Sentence #${i + 1}: All fields (Arabic, Transliteration, Translation) are required`
      return
    }
  }

  saving.value = true

  try {
    const textId = route.params.id as string

    // Step 1: Update text metadata
    await interlinearStore.updateText(textId, {
      title: textMetadata.value.title.trim(),
      description: textMetadata.value.description?.trim() || undefined,
      dialect: textMetadata.value.dialect,
    })

    // Step 2: Handle sentences - delete removed ones, update existing, add new
    const currentSentenceIds = currentText.value?.sentences.map(s => s.id) || []
    const newSentenceIds = sentences.value.filter(s => s.id).map(s => s.id!)

    // Delete sentences that were removed
    for (const oldId of currentSentenceIds) {
      if (!newSentenceIds.includes(oldId)) {
        await interlinearStore.deleteSentence(textId, oldId)
      }
    }

    // Update or create sentences
    for (let i = 0; i < sentences.value.length; i++) {
      const sentence = sentences.value[i]
      const sentenceData = {
        arabicText: sentence.arabicText!.trim(),
        transliteration: sentence.transliteration!.trim(),
        translation: sentence.translation!.trim(),
        annotations: sentence.annotations?.trim() || undefined,
        sentenceOrder: i,
      }

      if (sentence.id) {
        // Update existing sentence
        await interlinearStore.updateSentence(textId, sentence.id, sentenceData)
      } else {
        // Create new sentence
        await interlinearStore.addSentence(textId, sentenceData)
      }
    }

    // Navigate back to detail view
    await navigateTo(`/interlinear-texts/${textId}`)
  } catch (err) {
    console.error('Failed to save interlinear text:', err)
    saveError.value = 'Failed to save changes. Please try again.'
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  if (confirm('Discard unsaved changes?')) {
    navigateTo(`/interlinear-texts/${route.params.id}`)
  }
}

// Lifecycle
onMounted(async () => {
  try {
    const id = route.params.id as string
    console.log('[Edit Page] Loading text with ID:', id)

    if (id) {
      await interlinearStore.fetchTextById(id)
      console.log('[Edit Page] Text loaded:', currentText.value)

      if (currentText.value) {
        // Load metadata
        textMetadata.value = {
          title: currentText.value.title,
          description: currentText.value.description || '',
          dialect: currentText.value.dialect,
        }

        // Load sentences
        sentences.value = currentText.value.sentences.map(s => ({ ...s }))
        console.log('[Edit Page] Loaded', sentences.value.length, 'sentences')
      } else {
        console.warn('[Edit Page] currentText is null after fetch')
      }
    }
  } catch (err) {
    console.error('Failed to load interlinear text:', err)
  }
})
</script>

<style scoped>
.page-container {
  @apply max-w-5xl mx-auto px-4 py-8;
}

.edit-container {
  @apply space-y-8;
}

.page-header {
  @apply mb-8;
}

.back-link {
  @apply text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center mb-6 transition-colors;
}

.back-icon {
  @apply mr-2;
}

.page-title {
  @apply text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2;
}

.page-description {
  @apply text-gray-600 dark:text-gray-400;
}

.metadata-section {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4;
}

.section-title {
  @apply text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4;
}

.form-field {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.required-marker {
  @apply text-red-500;
}

.form-input {
  @apply w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
         transition-colors;
}

.form-textarea {
  @apply w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
         resize-y transition-colors;
}

.sentences-section {
  @apply space-y-4;
}

.section-header {
  @apply flex items-center justify-between mb-4;
}

.button-icon {
  @apply mr-1.5;
}

.empty-state {
  @apply text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700;
}

.empty-icon {
  @apply mx-auto mb-4 text-gray-400 dark:text-gray-600;
}

.empty-title {
  @apply text-lg font-medium text-gray-900 dark:text-gray-100 mb-2;
}

.empty-description {
  @apply text-gray-600 dark:text-gray-400;
}

.sentences-list {
  @apply space-y-4;
}

.add-sentence-container {
  @apply mt-4 flex justify-center;
}

.actions-section {
  @apply sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 pt-6 pb-4 -mx-4 px-4;
}

.actions-container {
  @apply flex justify-end gap-3 max-w-5xl mx-auto;
}

.save-error {
  @apply mt-4 flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 max-w-5xl mx-auto;
}

.error-icon {
  @apply flex-shrink-0;
}
</style>
