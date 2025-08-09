<template>
  <BaseModal
    :open="open"
    :title="isEditing ? 'Edit Word' : 'Add New Word'"
    size="xl"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="word-form">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Arabic Word -->
        <div class="col-span-2">
          <BaseInput
            v-model="form.arabic"
            label="Arabic Word*"
            required
            class="rtl"
          />
        </div>

        <!-- Transliteration -->
        <div>
          <BaseInput
            v-model="form.transliteration"
            label="Transliteration"
          />
        </div>

        <!-- Translation -->
        <div>
          <BaseInput
            v-model="form.translation"
            label="Translation/Definition*"
            required
          />
        </div>

        <!-- Example -->
        <div class="col-span-2">
          <div class="flex justify-between items-center mb-1">
            <label class="form-label">Example Sentence</label>
            <BaseButton
              v-if="form.arabic"
              type="button"
              variant="outline"
              size="sm"
              :loading="loadingExamples"
              @click="generateExamples"
              class="whitespace-nowrap"
            >
              <BaseIcon class="w-4 h-4 mr-1">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v2m0 16v2m8.485-8.485l-1.414-1.414M4.929 4.929L3.515 3.515M21 12h-2M5 12H3m15.364 6.364l-1.414-1.414m-12.728 0l-1.414 1.414M16 8a4 4 0 11-8 0 4 4 0 018 0z" />
              </BaseIcon>
              Generate Examples
            </BaseButton>
          </div>
          <textarea 
            v-model="form.example" 
            rows="2"
            class="form-textarea rtl"
          ></textarea>
          <div v-if="generatedExamples.length > 0" class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
            <h4 class="text-sm font-medium text-blue-900 mb-2">Generated Examples:</h4>
            <div class="space-y-2">
              <div
                v-for="(example, index) in generatedExamples"
                :key="index"
                class="p-2 bg-white rounded border cursor-pointer hover:bg-blue-50 transition-colors"
                @click="addExampleToField(example)"
              >
                <div class="text-sm">
                  <div class="font-medium text-blue-900 rtl mb-1">{{ example.arabic }}</div>
                  <div class="text-gray-600">{{ example.english }}</div>
                </div>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">Click on an example to add it to the example field</p>
          </div>
        </div>

        <!-- Root -->
        <div class="col-span-2">
          <BaseInput
            v-model="form.root"
            label="Root"
            class="rtl"
            :error="rootValidationError"
          />
          
          <!-- Loading state for related words -->
          <div v-if="loadingRelatedWords" class="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
            <div class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600 mr-2"></div>
              <span class="text-sm text-gray-600">Loading related words...</span>
            </div>
          </div>
        </div>

        <!-- Part of Speech -->
        <div>
          <BaseSelect
            v-model="form.partOfSpeech"
            label="Part of Speech"
            :options="partsOfSpeechOptions"
            placeholder="Select Part of Speech"
          />
        </div>

        <!-- Difficulty -->
        <div>
          <BaseSelect
            v-model="form.difficulty"
            label="Difficulty*"
            :options="difficultyOptions"
            required
          />
        </div>

        <!-- Dialect -->
        <div>
          <BaseSelect
            v-model="form.dialect"
            label="Dialect*"
            :options="dialectOptions"
            required
          />
        </div>

        <!-- Mastery Level -->
        <div>
          <BaseSelect
            v-model="form.masteryLevel"
            label="Mastery Level"
            :options="masteryLevelOptions"
          />
        </div>

        <!-- Dictionary Links -->
        <div class="col-span-2">
          <DictionaryLinkManager 
            v-model="form.dictionaryLinks" 
            :arabic-text="form.arabic"
          />
        </div>

        <!-- Pronunciation Link -->
        <div>
          <BaseInput
            v-model="form.pronunciationLink"
            label="Pronunciation Link"
            placeholder="URL to audio pronunciation"
          />
        </div>

        <!-- Notes -->
        <div class="col-span-2">
          <label class="form-label">Notes</label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="form-textarea"
          ></textarea>
        </div>

        <!-- Loading state for related words -->
        <div v-if="loadingRelatedWords" class="col-span-2">
          <label class="form-label">Related Words with Same Root</label>
          <div class="mt-2 p-3 bg-gray-50 border border-gray-200 rounded">
            <div class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600 mr-2"></div>
              <span class="text-sm text-gray-600">Loading related words...</span>
            </div>
          </div>
        </div>

        <!-- Related words section -->
        <div v-if="relatedWords.length > 0" class="col-span-2 p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 class="text-sm font-medium text-blue-900 mb-2">Related Words with Same Root:</h4>
          <div class="space-y-2">
            <div
                v-for="word in relatedWords"
                :key="word.id"
                class="flex justify-between items-center p-2 bg-white rounded border cursor-pointer hover:bg-blue-50 transition-colors"
                @click="$emit('related-word-click', word)"
            >
              <div>
                <span class="font-medium text-blue-900 rtl">{{ word.arabic }}</span>
                <span v-if="word.transliteration" class="text-sm text-gray-600 ml-2">{{ word.transliteration }}</span>
              </div>
              <span class="text-sm text-gray-500">{{ word.translation }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <BaseButton 
          type="button" 
          variant="outline" 
          @click="handleClose"
        >
          Cancel
        </BaseButton>
        <BaseButton 
          type="submit" 
          :loading="loading"
        >
          {{ isEditing ? 'Update Word' : 'Add Word' }}
        </BaseButton>
      </div>
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
.word-form {
  @apply space-y-6;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-textarea {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500;
}

.form-actions {
  @apply mt-6 flex justify-end gap-3;
}

.rtl {
  direction: rtl;
}
</style>
