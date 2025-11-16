<template>
  <BaseModal
    :open="open"
    :title="isEditing ? 'Edit Text' : 'Create New Text'"
    size="xxl"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="content-area" role="form" aria-label="Text form">
      <!-- Primary Information Section -->
      <section class="form-section section-primary" aria-labelledby="primary-info-heading">
        <h3 id="primary-info-heading" class="form-section-title">
          <BaseIcon size="sm" class="section-icon text-blue-600">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </BaseIcon>
          Basic Information
        </h3>
        <div class="form-section-grid">
          <div class="form-field-primary">
            <BaseInput
              v-model="form.title"
              label="Text Title"
              placeholder="Enter a descriptive title..."
              required
              :error="errors.title"
              aria-describedby="title-help"
            />
            <div id="title-help" class="form-help">Choose a clear, descriptive title for this text</div>
          </div>

          <div class="form-field-row">
            <div class="form-group">
              <label class="form-label">
                Difficulty Level
                <span class="text-red-500 ml-1">*</span>
              </label>
              <BaseSelect
                v-model="form.difficulty"
                :options="difficultyOptions"
                placeholder="Select difficulty"
                required
                aria-describedby="difficulty-help"
              />
            </div>
            <div class="form-group">
              <label class="form-label">
                Dialect
                <span class="text-red-500 ml-1">*</span>
              </label>
              <BaseSelect
                v-model="form.dialect"
                :options="dialectOptions"
                placeholder="Select dialect"
                required
                aria-describedby="dialect-help"
              />
            </div>
          </div>
          <div class="form-help-row">
            <div id="difficulty-help" class="form-help">Learning difficulty level</div>
            <div id="dialect-help" class="form-help">Arabic dialect or variety</div>
          </div>
        </div>
      </section>

      <!-- Arabic Content Section -->
      <section class="form-section section-arabic" aria-labelledby="arabic-content-heading">
        <h3 id="arabic-content-heading" class="form-section-title">
          <BaseIcon size="sm" class="section-icon text-green-600">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </BaseIcon>
          Arabic Content
        </h3>

        <BaseTextArea
          v-model="form.arabicContent"
          label="Arabic Text"
          placeholder="أدخل النص العربي هنا..."
          :rows="12"
          arabic
          required
          :error="errors.arabicContent"
          aria-describedby="arabic-content-help"
          hint="Use proper punctuation and formatting for Arabic text."
        />
      </section>

      <!-- Language Support Section -->
      <section class="form-section section-language" aria-labelledby="language-support-heading">
        <h3 id="language-support-heading" class="form-section-title">
          <BaseIcon size="sm" class="section-icon text-purple-600">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
          </BaseIcon>
          Language Support
        </h3>
        <div class="form-section-grid">
          <!-- Transliteration -->
          <div class="form-group">
            <div class="form-header">
              <BaseButton
                v-if="form.arabicContent.trim()"
                type="button"
                variant="outline"
                size="sm"
                :loading="transliterationLoading"
                @click="handleTransliterate"
                class="auto-transliterate-btn"
                aria-label="Generate transliteration automatically"
              >
                <BaseIcon class="w-4 h-4 mr-2">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                </BaseIcon>
                Auto-generate
              </BaseButton>
            </div>
            <BaseTextArea
              v-model="form.transliteration"
              label="Transliteration"
              placeholder="Enter romanized pronunciation..."
              :rows="8"
              class="italic"
            />
          </div>

          <!-- Translation -->
          <BaseTextArea
            v-model="form.translation"
            label="Translation"
            placeholder="Enter English translation..."
            :rows="8"
            aria-describedby="translation-help"
            hint="English translation of the Arabic text (optional)"
          />
        </div>
      </section>

      <!-- Categorization Section -->
      <section class="form-section section-tags" aria-labelledby="categorization-heading">
        <h3 id="categorization-heading" class="form-section-title">
          <BaseIcon size="sm" class="section-icon text-orange-600">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
          </BaseIcon>
          Categories & Tags
        </h3>
        <div class="form-group">
          <label for="tags-input" class="form-label">Tags</label>
          <BaseInput
            id="tags-input"
            v-model="tagInput"
            placeholder="Add tags (comma separated)..."
            @keydown.enter.prevent="addTag"
            @keydown.comma.prevent="addTag"
            @blur="addTag"
            aria-describedby="tags-help"
          />
          <div id="tags-help" class="form-help">
            Add descriptive tags to help organize and find this text. Press Enter or comma to add.
          </div>

          <!-- Tag Display -->
          <div v-if="form.tags.length > 0" class="tag-display" role="region" aria-label="Current tags">
            <BaseBadge
              v-for="tag in form.tags"
              :key="tag"
              closable
              @close="removeTag(tag)"
              class="tag-item"
              :aria-label="`Remove tag: ${tag}`"
            >
              {{ tag }}
            </BaseBadge>
          </div>
        </div>
      </section>

      <!-- Additional Notes Section -->
      <section class="form-section section-notes" aria-labelledby="notes-heading">
        <h3 id="notes-heading" class="form-section-title">
          <BaseIcon size="sm" class="section-icon text-gray-600">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </BaseIcon>
          Additional Notes
        </h3>
        <BaseTextArea
          v-model="form.comments"
          label="Comments & Notes"
          :rows="4"
          placeholder="Add contextual notes, cultural insights, teaching tips, or other comments..."
          aria-describedby="comments-help"
        />
      </section>
    </form>

    <template #footer>
      <div class="form-actions" role="group" aria-label="Form actions">
        <CancelButton @click="handleClose" />
        <SaveButton
          :is-editing="isEditing"
          :disabled="!isValid || loading"
          :loading="loading"
          @click="handleSubmit"
        />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { SelectOption, Text } from '@/types'
import { Dialect, Difficulty } from '@/types'
import BaseTextArea from '~/components/common/BaseTextArea.vue'
import CancelButton from '~/components/common/CancelButton.vue'
import SaveButton from '~/components/common/SaveButton.vue'
import { textService } from '~/composables/textService'
import BaseBadge from '../common/BaseBadge.vue'
import BaseButton from '../common/BaseButton.vue'
import BaseIcon from '../common/BaseIcon.vue'
import BaseInput from '../common/BaseInput.vue'
import BaseModal from '../common/BaseModal.vue'
import BaseSelect from '../common/BaseSelect.vue'

interface Props {
  open: boolean
  loading?: boolean
  text?: Text | null
}

interface TextForm {
  title: string
  arabicContent: string
  transliteration?: string
  translation?: string
  comments?: string
  tags: string[]
  difficulty: Difficulty | ''
  dialect: Dialect | ''
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  text: null,
})

const emit = defineEmits<{
  close: []
  submit: [
    form: Omit<TextForm, 'difficulty' | 'dialect'> & { difficulty: Difficulty; dialect: Dialect },
  ]
}>()

// Form state
const form = ref<TextForm>({
  title: '',
  arabicContent: '',
  transliteration: undefined,
  translation: undefined,
  comments: undefined,
  tags: [],
  difficulty: '',
  dialect: '',
})

const tagInput = ref('')
const errors = ref<Record<string, string>>({})
const transliterationLoading = ref(false)

// Options
const difficultyOptions: SelectOption<Difficulty>[] = [
  { value: Difficulty.BEGINNER, label: 'Beginner' },
  { value: Difficulty.INTERMEDIATE, label: 'Intermediate' },
  { value: Difficulty.ADVANCED, label: 'Advanced' },
]

const dialectOptions: SelectOption<Dialect>[] = [
  { value: Dialect.TUNISIAN, label: 'Tunisian' },
  { value: Dialect.MOROCCAN, label: 'Moroccan' },
  { value: Dialect.EGYPTIAN, label: 'Egyptian' },
  { value: Dialect.MSA, label: 'Modern Standard Arabic' },
]

// Computed
const isEditing = computed(() => !!props.text)

const isValid = computed(() => {
  return !!(
    form.value.title.trim() &&
    form.value.arabicContent.trim() &&
    form.value.difficulty &&
    form.value.dialect
  )
})

// Methods
const resetForm = () => {
  form.value = {
    title: '',
    arabicContent: '',
    transliteration: '',
    translation: '',
    comments: '',
    tags: [],
    difficulty: '',
    dialect: '',
  }
  tagInput.value = ''
  errors.value = {}
}

const populateForm = (text: Text) => {
  form.value = {
    title: text.title,
    arabicContent: text.arabicContent,
    transliteration: text.transliteration || '',
    translation: text.translation || '',
    comments: text.comments || '',
    tags: [...text.tags],
    difficulty: text.difficulty,
    dialect: text.dialect,
  }
}

const addTag = () => {
  const input = tagInput.value.trim()
  if (!input) return

  // Split by comma and process each tag
  const newTags = input
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag && !form.value.tags.includes(tag))

  if (newTags.length > 0) {
    form.value.tags.push(...newTags)
    tagInput.value = ''
  }
}

const removeTag = (tagToRemove: string) => {
  form.value.tags = form.value.tags.filter(tag => tag !== tagToRemove)
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required'
  }

  if (!form.value.arabicContent.trim()) {
    errors.value.arabicContent = 'Arabic content is required'
  }

  if (!form.value.difficulty) {
    errors.value.difficulty = 'Difficulty is required'
  }

  if (!form.value.dialect) {
    errors.value.dialect = 'Dialect is required'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return

  // Process any remaining tag input before submitting
  addTag()

  if (form.value.difficulty && form.value.dialect) {
    emit('submit', {
      title: form.value.title.trim(),
      arabicContent: form.value.arabicContent.trim(),
      transliteration: form.value.transliteration?.trim() || undefined,
      translation: form.value.translation?.trim() || undefined,
      comments: form.value.comments?.trim() || undefined,
      tags: form.value.tags,
      difficulty: form.value.difficulty,
      dialect: form.value.dialect,
    })
  }
}

const handleClose = () => {
  emit('close')
}

const handleTransliterate = async () => {
  if (!form.value.arabicContent.trim()) return

  try {
    transliterationLoading.value = true
    const response = await textService.transliterateText(form.value.arabicContent)
    form.value.transliteration = response.transliteratedText
  } catch (error) {
    console.error('Failed to transliterate text:', error)
  } finally {
    transliterationLoading.value = false
  }
}

// Watch for text changes to populate form
watch(
  () => props.text,
  newText => {
    if (newText) {
      populateForm(newText)
    }
  },
  { immediate: true }
)

// Reset form when modal closes
watch(
  () => props.open,
  isOpen => {
    if (!isOpen) {
      resetForm()
    }
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

.section-arabic {
  @apply bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-xl p-6 border border-green-100/50;
}

.section-language {
  @apply bg-gradient-to-br from-purple-50/50 to-violet-50/50 rounded-xl p-6 border border-purple-100/50;
}

.section-tags {
  @apply bg-gradient-to-br from-orange-50/50 to-amber-50/50 rounded-xl p-6 border border-orange-100/50;
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

.form-help-row {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6 mt-2;
}

.form-header {
  @apply flex items-center justify-between mb-3;
}

/* Enhanced Interactions */
.auto-transliterate-btn {
  @apply transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white border-0 font-medium;
}

/* Tag styling */
.tag-display {
  @apply flex flex-wrap gap-2 mt-3 p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-orange-200/60;
}

.tag-item {
  @apply transition-all duration-200 hover:scale-[1.02] bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border border-orange-300/50;
}

/* Responsive Improvements */
@media (max-width: 768px) {
  .form-section {
    @apply p-4 mb-6;
  }

  .form-field-row {
    @apply grid-cols-1 gap-4;
  }

  .form-help-row {
    @apply grid-cols-1 gap-4;
  }

  .form-section-title {
    @apply text-base mb-4;
  }

  .section-icon {
    @apply mr-2;
  }

  .form-section-grid {
    @apply space-y-4;
  }

  .form-header {
    @apply flex-col items-start gap-3;
  }
}
</style>
