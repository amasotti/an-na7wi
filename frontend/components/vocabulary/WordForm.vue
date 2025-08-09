<template>
  <BaseModal
    :open="open"
    :title="isEditing ? 'Edit Word' : 'Add New Word'"
    size="xl"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="content-area" role="form" aria-label="Word form">
      <!-- Primary Information Section -->
      <section class="form-section" aria-labelledby="primary-info-heading">
        <h3 id="primary-info-heading" class="form-section-title">Primary Information</h3>
        <div class="form-section-grid">
          <!-- Arabic Word -->
          <div class="form-field-primary">
            <BaseInput
              v-model="form.arabic"
              label="Arabic Word*"
              required
              class="rtl text-lg"
              aria-describedby="arabic-help"
            />
            <div id="arabic-help" class="form-help">Enter the Arabic word or phrase</div>
          </div>

          <!-- Transliteration & Translation -->
          <div class="form-field-row">
            <BaseInput
              v-model="form.transliteration"
              label="Transliteration"
              aria-describedby="transliteration-help"
            />
            <BaseInput
              v-model="form.translation"
              label="Translation/Definition*"
              required
              aria-describedby="translation-help"
            />
          </div>
          <div class="form-help-row">
            <div id="transliteration-help" class="form-help">Romanized pronunciation</div>
            <div id="translation-help" class="form-help">English meaning or definition</div>
          </div>
        </div>
      </section>

      <!-- Example Section -->
      <section class="form-section" aria-labelledby="example-heading">
        <div class="form-header">
          <h3 id="example-heading" class="form-section-title">Example Usage</h3>
          <BaseButton
            v-if="form.arabic"
            type="button"
            variant="outline"
            size="sm"
            :loading="loadingExamples"
            @click="generateExamples"
            class="action-button"
            aria-label="Generate example sentences"
          >
            <BaseIcon class="w-4 h-4 mr-1">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v2m0 16v2m8.485-8.485l-1.414-1.414M4.929 4.929L3.515 3.515M21 12h-2M5 12H3m15.364 6.364l-1.414-1.414m-12.728 0l-1.414 1.414M16 8a4 4 0 11-8 0 4 4 0 018 0z" />
            </BaseIcon>
            Generate Examples
          </BaseButton>
        </div>
        <div class="form-group">
          <label for="example-field" class="form-label">Example Sentence</label>
          <textarea 
            id="example-field"
            v-model="form.example" 
            rows="3"
            class="form-input rtl resize-none"
            placeholder="Enter an example sentence..."
            aria-describedby="example-help"
          ></textarea>
          <div id="example-help" class="form-help">Provide a sentence that demonstrates how the word is used</div>
        </div>
        
        <!-- Generated Examples -->
        <div v-if="generatedExamples.length > 0" class="form-preview" role="region" aria-labelledby="generated-examples-title">
          <h4 id="generated-examples-title" class="form-preview-title">Generated Examples</h4>
          <div class="space-y-2">
            <div
              v-for="(example, index) in generatedExamples"
              :key="index"
              class="card-base card-padding-sm card-interactive"
              @click="addExampleToField(example)"
              role="button"
              :aria-label="`Add example: ${example.arabic}`"
              tabindex="0"
              @keydown.enter="addExampleToField(example)"
              @keydown.space.prevent="addExampleToField(example)"
            >
              <div class="font-medium text-gray-900 rtl mb-1">{{ example.arabic }}</div>
              <div class="text-gray-600 text-sm">{{ example.english }}</div>
            </div>
          </div>
          <p class="form-help mt-3">Click on an example to add it to the example field</p>
        </div>
      </section>

      <!-- Root and Related Words Section -->
      <section class="form-section" aria-labelledby="root-heading">
        <h3 id="root-heading" class="form-section-title">Root Analysis</h3>
        <div class="form-group">
          <BaseInput
            v-model="form.root"
            label="Root"
            class="rtl"
            :error="rootValidationError"
            aria-describedby="root-help"
          />
          <div id="root-help" class="form-help">Arabic root letters (usually 3 consonants)</div>
          
          <!-- Loading state for related words -->
          <div v-if="loadingRelatedWords" class="form-preview" role="status" aria-live="polite">
            <div class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-600 mr-2"></div>
              <span class="text-sm text-gray-600">Loading related words...</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Classification Section -->
      <section class="form-section" aria-labelledby="classification-heading">
        <h3 id="classification-heading" class="form-section-title">Classification</h3>
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
                Difficulty*
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
                Dialect*
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
          <div class="form-help-row">
            <div id="pos-help" class="form-help">Grammatical category</div>
            <div id="difficulty-help" class="form-help">Learning difficulty</div>
          </div>
          <div class="form-help-row">
            <div id="dialect-help" class="form-help">Arabic variety</div>
            <div id="mastery-help" class="form-help">Your current level</div>
          </div>
        </div>
      </section>

      <!-- Resources Section -->
      <section class="form-section" aria-labelledby="resources-heading">
        <h3 id="resources-heading" class="form-section-title">Resources & Links</h3>
        <DictionaryLinkManager 
          v-model="form.dictionaryLinks" 
          v-model:pronunciation-url="form.pronunciationLink"
          :arabic-text="form.arabic"
        />
      </section>

      <!-- Notes Section -->
      <section class="form-section" aria-labelledby="notes-heading">
        <h3 id="notes-heading" class="form-section-title">Additional Notes</h3>
        <div class="form-group">
          <label for="notes-field" class="form-label">Notes</label>
          <textarea
            id="notes-field"
            v-model="form.notes"
            rows="4"
            class="form-input resize-none"
            placeholder="Add any additional notes, context, or reminders..."
            aria-describedby="notes-help"
          ></textarea>
          <div id="notes-help" class="form-help">Personal notes, memory aids, or additional context</div>
        </div>
      </section>

      <!-- Related Words Section -->
      <section v-if="relatedWords.length > 0" class="form-section" aria-labelledby="related-words-heading">
        <h3 id="related-words-heading" class="form-section-title">Related Words (Same Root)</h3>
        <div class="form-preview" role="region" aria-label="Related words list">
          <div class="space-y-2">
            <div
              v-for="word in relatedWords"
              :key="word.id"
              class="card-base card-padding-sm card-interactive flex justify-between items-center"
              @click="$emit('related-word-click', word)"
              role="button"
              :aria-label="`View related word: ${word.arabic}`"
              tabindex="0"
              @keydown.enter="$emit('related-word-click', word)"
              @keydown.space.prevent="$emit('related-word-click', word)"
            >
              <div class="flex-1">
                <span class="font-medium text-gray-900 rtl block">{{ word.arabic }}</span>
                <span v-if="word.transliteration" class="text-sm text-gray-600">{{ word.transliteration }}</span>
              </div>
              <span class="text-sm text-gray-500 text-right">{{ word.translation }}</span>
            </div>
          </div>
          <p class="form-help mt-3">Click on a word to view its details</p>
        </div>
      </section>

      <!-- Form Actions -->
      <footer class="form-actions" role="group" aria-label="Form actions">
        <BaseButton 
          type="button" 
          variant="outline" 
          @click="handleClose"
          aria-label="Cancel and close form"
        >
          Cancel
        </BaseButton>
        <BaseButton 
          type="submit" 
          :loading="loading"
          :aria-label="isEditing ? 'Update word information' : 'Add new word to vocabulary'"
        >
          {{ isEditing ? 'Update Word' : 'Add Word' }}
        </BaseButton>
      </footer>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import type { DictionaryLink, ExampleDTO, SelectOption, Word } from '@/types'
import { Dialect, DictionaryType, Difficulty, MasteryLevel, PartOfSpeech } from '@/types/enums'
import { computed, ref, watch } from 'vue'
import { exampleService } from '~/composables/exampleService'
import { rootService } from '~/composables/rootService'
import { wordService } from '~/composables/wordService'
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
  difficultyOptions: SelectOption<Difficulty>[]
  dialectOptions: SelectOption<Dialect>[]
  masteryLevelOptions: SelectOption<MasteryLevel>[]
  partsOfSpeechOptions: SelectOption<PartOfSpeech>[]
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
  partOfSpeech: PartOfSpeech.UNKNOWN,
  difficulty: Difficulty.BEGINNER,
  dialect: Dialect.MSA,
  masteryLevel: MasteryLevel.NEW,
  dictionaryLinks: [] as DictionaryLink[],
  pronunciationLink: '',
  isVerified: false,
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
        partOfSpeech: newWord.partOfSpeech || PartOfSpeech.UNKNOWN,
        notes: newWord.notes || '',
        difficulty: newWord.difficulty,
        dialect: newWord.dialect,
        masteryLevel: newWord.masteryLevel || MasteryLevel.NEW,
        dictionaryLinks: newWord.dictionaryLinks || [],
        pronunciationLink: newWord.pronunciationLink || '',
        isVerified: newWord.isVerified,
      }
    } else {
      form.value = {
        arabic: '',
        transliteration: '',
        translation: '',
        example: '',
        root: '',
        partOfSpeech: PartOfSpeech.UNKNOWN,
        notes: '',
        difficulty: Difficulty.BEGINNER,
        dialect: Dialect.MSA,
        masteryLevel: MasteryLevel.NEW,
        dictionaryLinks: [] as DictionaryLink[],
        pronunciationLink: '',
        isVerified: false,
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
      const normalization = await rootService.normalizeRoot(form.value.root.trim())
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

// Handle clicking on related words - emit event to parent
// const handleRelatedWordClick = (word: Partial<Word>) => {
//   emit('related-word-click', word)
// }

// Load related words when editing a word with a root
const loadRelatedWords = async (root: string) => {
  if (!root?.trim()) {
    relatedWords.value = []
    return
  }

  loadingRelatedWords.value = true
  try {
    // First normalize the root to get the proper form
    const normalization = await rootService.normalizeRoot(root.trim())
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
    // TODO: Show user-friendly error message
  } finally {
    loadingExamples.value = false
  }
}

const addExampleToField = (example: ExampleDTO) => {
  const exampleText = `${example.arabic} (${example.english})`

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
.form-section-title {
  @apply text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100;
}

.form-section-grid {
  @apply space-y-4;
}

.form-field-primary {
  @apply space-y-2;
}

.form-field-row {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.form-help-row {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

/* RTL Support */
.rtl {
  direction: rtl;
}

/* Enhanced Interactions */
.action-button {
  @apply transition-all duration-200 hover:shadow-md;
}

/* Form Preview Enhancements */
.form-preview {
  @apply bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100;
}

.form-preview-title {
  @apply text-blue-900 font-medium;
}

/* Responsive Improvements */
@media (max-width: 768px) {
  .form-field-row {
    @apply grid-cols-1;
  }
  
  .form-help-row {
    @apply grid-cols-1;
  }
  
  .form-section-title {
    @apply text-base;
  }
}
</style>
