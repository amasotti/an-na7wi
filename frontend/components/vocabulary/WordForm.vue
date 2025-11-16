<template>
  <BaseModal
    :open="open"
    :title="isEditing ? 'Edit Word' : 'Add New Word'"
    size="xl"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="content-area" role="form" aria-label="Word form">
      <!-- Primary Information Section -->
      <section class="form-section section-primary" aria-labelledby="primary-info-heading">
        <h3 id="primary-info-heading" class="form-section-title">
          <BaseIcon size="sm" class="section-icon text-blue-600">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </BaseIcon>
          Primary Information
        </h3>
        <div class="form-section-grid">
          <!-- Arabic Word -->
          <div class="form-field-primary">
            <BaseInput
              v-model="form.arabic"
              label="Arabic Word"
              required
              class="arabic text-2xl"
              aria-describedby="arabic-help"
            />
            <div id="arabic-help" class="form-help">Enter the Arabic word or phrase</div>
          </div>

          <!-- Transliteration & Translation -->
          <div class="form-field-row">
            <BaseInput
              v-model="form.transliteration"
              label="Transliteration"
              class="italic"
              aria-describedby="transliteration-help"
            />
            <BaseInput
              v-model="form.translation"
              label="Translation/Definition"
              required
              aria-describedby="translation-help"
            />
            <div class="invisible">Placeholder to put the root on the right</div>
            <BaseInput
              v-model="form.root"
              label="Root"
              class="arabic text-xl"
              :error="rootValidationError"
              aria-describedby="root-help"
            />
          </div>
        </div>
      </section>

      <!-- Example Section -->
      <section class="form-section section-examples" aria-labelledby="example-heading">
        <div class="form-header">
          <h3 id="example-heading" class="form-section-title">
            <BaseIcon size="sm" class="section-icon text-green-600">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </BaseIcon>
            Example Usage
          </h3>
          <BaseButton
            v-if="form.arabic"
            type="button"
            variant="outline"
            size="sm"
            :loading="loadingExamples"
            @click="generateExamples"
            class="generate-examples-btn"
            aria-label="Generate example sentences"
          >
            <BaseIcon class="w-4 h-4 mr-2">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </BaseIcon>
            Generate Examples
          </BaseButton>
        </div>
        <BaseTextArea
          id="example-field"
          v-model="form.example"
          label=""
          :rows="3"
          class="rtl resize-none"
          placeholder="Enter an example sentence..."
          aria-describedby="example-help"
        />
        
        <!-- Generated Examples -->
        <div v-if="generatedExamples.length > 0" class="form-preview" role="region" aria-labelledby="generated-examples-title">
          <h4 id="generated-examples-title" class="form-preview-title">Generated Examples</h4>
          <div class="space-y-2">
            <div
              v-for="(example, index) in generatedExamples"
              :key="index"
              class="example-item"
              @click="addExampleToField(example)"
              role="button"
              :aria-label="`Add example: ${example.arabic}`"
              tabindex="0"
              @keydown.enter="addExampleToField(example)"
              @keydown.space.prevent="addExampleToField(example)"
            >
              <div class="font-medium text-gray-900 rtl mb-1">{{ example.arabic }}</div>
              <div class="font-small italic text-gray-500">{{ example.transliteration }}</div>
              <div class="text-gray-600 text-sm">{{ example.english }}</div>
            </div>
          </div>
          <p class="form-help mt-3">Click on an example to add it to the example field</p>
        </div>
      </section>

      <!-- Related Words Section -->
      <section v-if="relatedWords.length > 0" class="form-section section-related-words" aria-labelledby="rel-words-heading">
        <h3 id="rel-words-heading" class="form-section-title">
          <BaseIcon size="sm" class="section-icon text-orange-600">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </BaseIcon>
          Related Words (Same Root)
        </h3>
        <div role="region" aria-label="Related words list">
          <div class="space-y-2">
            <div
              v-for="word in relatedWords"
              :key="word.id"
              class="related-word-item"
              @click="$emit('related-word-click', word)"
              role="button"
              :aria-label="`View related word: ${word.arabic}`"
              tabindex="0"
              @keydown.enter="$emit('related-word-click', word)"
              @keydown.space.prevent="$emit('related-word-click', word)"
            >
              <div class="flex-2">
                <span class="font-medium text-gray-900 rtl block">{{ word.arabic }}</span>
                <span v-if="word.transliteration" class="text-sm text-gray-600">{{ word.transliteration }}</span>
              </div>
              <span class="text-sm text-gray-500 text-right">{{ word.translation }}</span>
            </div>
          </div>
          <p class="form-help mt-3">Click on a word to view its details</p>
        </div>
      </section>

      <!-- Classification Section -->
      <section class="form-section section-classification" aria-labelledby="classification-heading">
        <h3 id="classification-heading" class="form-section-title">
          <BaseIcon size="sm" class="section-icon text-purple-600">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </BaseIcon>
          Classification
        </h3>
        <div class="form-section-grid">
          <div class="form-field-row">
            <div class="form-group">
              <label class="form-label">Part of Speech</label>
              <BaseSelect
                v-model="form.partOfSpeech"
                :options="partsOfSpeechOptions"
                placeholder="Select Part of Speech"
                aria-describedby="pos-help"
              />
            </div>
            <div class="form-group">
              <label class="form-label">
                Difficulty
                <span class="text-red-500 ml-1">*</span>
              </label>
              <BaseSelect
                v-model="form.difficulty"
                :options="difficultyOptions"
                required
                aria-describedby="difficulty-help"
              />
            </div>
          </div>
          <div class="form-field-row">
            <div class="form-group">
              <label class="form-label">
                Dialect
                <span class="text-red-500 ml-1">*</span>
              </label>
              <BaseSelect
                v-model="form.dialect"
                :options="dialectOptions"
                required
                aria-describedby="dialect-help"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Mastery Level</label>
              <BaseSelect
                v-model="form.masteryLevel"
                :options="masteryLevelOptions"
                aria-describedby="mastery-help"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Notes Section -->
      <section class="form-section section-notes" aria-labelledby="notes-heading">
        <h3 id="notes-heading" class="form-section-title">
          <BaseIcon size="sm" class="section-icon text-gray-600">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </BaseIcon>
          Additional Notes
        </h3>
        <BaseTextArea
          id="notes-field"
          v-model="form.notes"
          label=""
          :rows="4"
          class="resize-none"
          placeholder="Add any additional notes, context, or reminders..."
          aria-describedby="notes-help"
        />
      </section>

      <!-- Resources Section -->
      <section class="form-section section-resources" aria-labelledby="resources-heading">
        <h3 id="resources-heading" class="form-section-title">
          <BaseIcon size="sm" class="section-icon text-indigo-600">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </BaseIcon>
          Resources & Links
        </h3>
        <DictionaryLinkManager 
          v-model="form.dictionaryLinks" 
          v-model:pronunciation-url="form.pronunciationLink"
          :arabic-text="form.arabic"
        />
      </section>

      <!-- Form Actions -->
      <footer class="form-actions" role="group" aria-label="Form actions">
        <CancelButton @click="handleClose" />
        <SaveButton :loading="loading"
                    :text="isEditing ? 'Update Word' : 'Add Word'"
                    :aria-label="isEditing ? 'Update word information' : 'Add new word to vocabulary'"
        />
      </footer>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { DictionaryLink, ExampleDTO, Word } from '@/types'
import { Dialect, Difficulty, MasteryLevel, PartOfSpeech } from '@/types/enums'
import BaseTextArea from '~/components/common/BaseTextArea.vue'
import CancelButton from '~/components/common/CancelButton.vue'
import SaveButton from '~/components/common/SaveButton.vue'
import { exampleService } from '~/composables/exampleService'
import { rootService } from '~/composables/rootService'
import { wordService } from '~/composables/wordService'
import { dialectOptions } from '~/constants/dialects'
import { difficultyOptions } from '~/constants/difficulty'
import { masteryLevelOptions } from '~/constants/masteryLevel'
import { partsOfSpeechOptions } from '~/constants/pos'
import { requestDeduplicator } from '~/utils/requestDeduplicator'
import BaseButton from '../common/BaseButton.vue'
import BaseIcon from '../common/BaseIcon.vue'
import BaseInput from '../common/BaseInput.vue'
import BaseModal from '../common/BaseModal.vue'
import BaseSelect from '../common/BaseSelect.vue'
import DictionaryLinkManager from './DictionaryLinkManager.vue'

interface Props {
  open: boolean
  loading?: boolean
  word?: Word | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  word: null,
})

const emit = defineEmits<{
  close: []
  submit: [formData: Partial<Word>]
  'related-word-click': [word: Partial<Word>]
}>()

const isEditing = computed(() => !!props.word)

// Root validation and related words state
const rootValidationError = ref<string>('')
const relatedWords = ref<Partial<Word>[]>([])
const loadingRelatedWords = ref(false)

// Example generation state
const loadingExamples = ref(false)
const generatedExamples = ref<ExampleDTO[]>([])

const form = ref({
  arabic: '',
  transliteration: '',
  translation: '',
  example: '',
  root: '',
  notes: '',
  partOfSpeech: PartOfSpeech.NOUN,
  difficulty: Difficulty.BEGINNER,
  dialect: Dialect.MSA,
  masteryLevel: MasteryLevel.NEW,
  dictionaryLinks: [] as DictionaryLink[],
  pronunciationLink: '',
})

// Watch for changes in the word prop to update the form
watch(
  () => props.word,
  newWord => {
    if (newWord) {
      form.value = {
        arabic: newWord.arabic,
        transliteration: newWord.transliteration || '',
        translation: newWord.translation || '',
        example: newWord.example || '',
        root: newWord.root || '',
        partOfSpeech: newWord.partOfSpeech || PartOfSpeech.NOUN,
        notes: newWord.notes || '',
        difficulty: newWord.difficulty || Difficulty.BEGINNER,
        dialect: newWord.dialect || Dialect.MSA,
        masteryLevel: newWord.masteryLevel || MasteryLevel.NEW,
        dictionaryLinks: newWord.dictionaryLinks || [],
        pronunciationLink: newWord.pronunciationLink || '',
      }
    } else {
      form.value = {
        arabic: '',
        transliteration: '',
        translation: '',
        example: '',
        root: '',
        partOfSpeech: PartOfSpeech.NOUN,
        notes: '',
        difficulty: Difficulty.BEGINNER,
        dialect: Dialect.MSA,
        masteryLevel: MasteryLevel.NEW,
        dictionaryLinks: [] as DictionaryLink[],
        pronunciationLink: '',
      }
    }
  },
  { immediate: true }
)

const handleClose = () => {
  emit('close')
}

const handleSubmit = async () => {
  // Reset validation error
  rootValidationError.value = ''

  // Validate root if provided
  if (form.value.root?.trim()) {
    try {
      const rootKey = form.value.root.trim()

      // Use global deduplication for normalize calls
      const normalization = await requestDeduplicator.dedupe(`normalize-${rootKey}`, () =>
        rootService.normalizeRoot(rootKey)
      )

      if (!normalization.isValid) {
        rootValidationError.value = 'Invalid root format'
        return // Prevent submission
      }
      // Use normalized form for saving
      form.value.root = normalization.displayForm
    } catch (error) {
      console.error('Error validating root:', error)
      rootValidationError.value = 'Error validating root'
      return // Prevent submission
    }
  }

  emit('submit', form.value)
}

// Load related words when editing a word with a root
const loadRelatedWords = async (root: string) => {
  if (!root?.trim()) {
    relatedWords.value = []
    return
  }

  const requestKey = `form-related-words-${root.trim()}-${props.word?.id || 'new'}`

  return requestDeduplicator.dedupe(requestKey, async () => {
    loadingRelatedWords.value = true
    try {
      const rootKey = root.trim()

      // Use global deduplication for normalize calls
      const normalization = await requestDeduplicator.dedupe(`normalize-${rootKey}`, () =>
        rootService.normalizeRoot(rootKey)
      )

      if (normalization.isValid) {
        const response = await wordService.findByRoot(normalization.displayForm, 1, 5)
        // Filter out the current word being edited
        relatedWords.value = response.items
          .filter(word => !props.word || word.id !== props.word.id)
          .map(word => ({
            id: word.id,
            arabic: word.arabic,
            transliteration: word.transliteration,
            translation: word.translation,
            partOfSpeech: word.partOfSpeech,
            difficulty: word.difficulty,
            dialect: word.dialect,
          }))
      }
    } catch (error) {
      console.error('Error loading related words:', error)
      relatedWords.value = []
    } finally {
      loadingRelatedWords.value = false
    }
  })
}

// Watch for word changes to load related words
watch(
  () => props.word,
  newWord => {
    if (newWord?.root) {
      loadRelatedWords(newWord.root)
    } else {
      relatedWords.value = []
      loadingRelatedWords.value = false
    }
    // Don't clear validation error here - let it persist until modal closes
  },
  { immediate: true }
)

// Clear validation error when modal opens
watch(
  () => props.open,
  isOpen => {
    if (isOpen) {
      rootValidationError.value = ''
      generatedExamples.value = []
    }
  }
)

// Example generation methods
const generateExamples = async () => {
  if (!form.value.arabic?.trim()) return

  loadingExamples.value = true
  try {
    const response = await exampleService.generateExamples({
      arabic: form.value.arabic.trim(),
      context:
        form.value.partOfSpeech !== PartOfSpeech.UNKNOWN ? form.value.partOfSpeech : undefined,
    })
    generatedExamples.value = response.examples
  } catch (error) {
    console.error('Failed to generate examples:', error)
  } finally {
    loadingExamples.value = false
  }
}

const addExampleToField = (example: ExampleDTO) => {
  const exampleText = `${example.arabic} (${example.transliteration})\n${example.english}`

  if (form.value.example) {
    form.value.example += `\n ${exampleText}`
  } else {
    form.value.example = exampleText
  }
}

// Clear examples when arabic word changes
watch(
  () => form.value.arabic,
  () => {
    generatedExamples.value = []
  }
)
</script>

<style scoped>
/* Form Structure */
.form-section {
  @apply relative;
}

.form-section:not(:last-child) {
  @apply mb-8;
}

.form-section-title {
  @apply flex items-center text-lg font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200;
}

.section-icon {
  @apply mr-3 flex-shrink-0;
}

/* Section-specific styling */
.section-primary {
  @apply bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-xl p-6 border border-blue-100/50;
}

.section-examples {
  @apply bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-xl p-6 border border-green-100/50;
}

.section-related-words {
  @apply bg-gradient-to-br from-orange-50/50 to-amber-50/50 rounded-xl p-6 border border-orange-100/50;
}

.section-classification {
  @apply bg-gradient-to-br from-purple-50/50 to-violet-50/50 rounded-xl p-6 border border-purple-100/50;
}

.section-resources {
  @apply bg-gradient-to-br from-indigo-50/50 to-blue-50/50 rounded-xl p-6 border border-indigo-100/50;
}

.section-notes {
  @apply bg-gradient-to-br from-gray-50/50 to-slate-50/50 rounded-xl p-6 border border-gray-100/50;
}

.form-section-grid {
  @apply space-y-6;
}

.form-field-primary {
  @apply space-y-3;
}

.form-field-row {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

/* RTL Support */
.rtl {
  direction: rtl;
}

/* Enhanced Interactions */
.generate-examples-btn {
  @apply transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 font-medium;
}

.example-item {
  @apply bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-green-200/60 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:bg-white hover:border-green-300;
}

.related-word-item {
  @apply p-4 border cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] flex justify-between items-center bg-white/60 backdrop-blur-sm rounded-xl border-orange-200/60 hover:bg-white hover:border-orange-300;
}

/* Form Preview Enhancements */
.form-preview {
  @apply shadow-sm;
}

.form-preview-title {
  @apply text-blue-900 font-semibold text-sm uppercase tracking-wide;
}

/* Responsive Improvements */
@media (max-width: 768px) {
  .form-section {
    @apply p-4 mb-6;
  }
  
  .form-field-row {
    @apply grid-cols-1 gap-4;
  }
  
  .form-section-title {
    @apply text-base mb-4;
  }
  
  .section-icon {
    @apply mr-2;
  }
}
</style>
