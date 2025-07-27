<template>
  <BaseModal
    :open="open"
    title="Create New Text"
    size="lg"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="text-create-form">
      <div class="form-grid">
        <!-- Title -->
        <div class="form-field">
          <BaseInput
            v-model="form.title"
            label="Title"
            placeholder="Enter text title..."
            required
            :error="errors.title"
          />
        </div>

        <!-- Difficulty and Dialect -->
        <div class="form-row">
          <div class="form-field">
            <label class="form-label">
              Difficulty <span class="text-red-500">*</span>
            </label>
            <BaseSelect
              v-model="form.difficulty"
              :options="difficultyOptions"
              placeholder="Select difficulty"
              required
            />
          </div>

          <div class="form-field">
            <label class="form-label">
              Dialect <span class="text-red-500">*</span>
            </label>
            <BaseSelect
              v-model="form.dialect"
              :options="dialectOptions"
              placeholder="Select dialect"
              required
            />
          </div>
        </div>

        <!-- Arabic Content -->
        <div class="form-field">
          <label class="form-label">
            Arabic Content <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.arabicContent"
            class="text-input rtl-text"
            rows="6"
            placeholder="أدخل النص العربي هنا..."
            dir="rtl"
            required
          />
        </div>

        <!-- Transliteration -->
        <div class="form-field">
          <label class="form-label">Transliteration</label>
          <textarea
            v-model="form.transliteration"
            class="text-input"
            rows="4"
            placeholder="Enter transliteration..."
          />
        </div>

        <!-- Translation -->
        <div class="form-field">
          <label class="form-label">Translation</label>
          <textarea
            v-model="form.translation"
            class="text-input"
            rows="4"
            placeholder="Enter translation..."
          />
        </div>

        <!-- Tags -->
        <div class="form-field">
          <label class="form-label">Tags</label>
          <BaseInput
            v-model="tagInput"
            placeholder="Add tags (comma separated)..."
            @keydown.enter.prevent="addTag"
            @keydown.comma.prevent="addTag"
            @blur="addTag"
          />
          <div v-if="form.tags.length > 0" class="tag-list">
            <BaseBadge
              v-for="tag in form.tags"
              :key="tag"
              closable
              @close="removeTag(tag)"
            >
              {{ tag }}
            </BaseBadge>
          </div>
        </div>

        <!-- Comments -->
        <div class="form-field">
          <label class="form-label">Comments</label>
          <textarea
            v-model="form.comments"
            class="text-input"
            rows="3"
            placeholder="Add any notes or comments..."
          />
        </div>
      </div>
    </form>

    <template #footer>
      <div class="modal-actions">
        <BaseButton variant="outline" @click="handleClose">
          Cancel
        </BaseButton>
        <BaseButton 
          @click="handleSubmit" 
          :disabled="!isValid || loading"
          :loading="loading"
        >
          Create Text
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Dialect, Difficulty } from '../../types/enums'
import type { SelectOption } from '../../types/ui'
import BaseBadge from '../common/BaseBadge.vue'
import BaseButton from '../common/BaseButton.vue'
import BaseInput from '../common/BaseInput.vue'
import BaseModal from '../common/BaseModal.vue'
import BaseSelect from '../common/BaseSelect.vue'

interface Props {
  open: boolean
  loading?: boolean
}

interface TextForm {
  title: string
  arabicContent: string
  transliteration: string
  translation: string
  comments: string
  tags: string[]
  difficulty: Difficulty | ''
  dialect: Dialect | ''
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
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
  transliteration: '',
  translation: '',
  comments: '',
  tags: [],
  difficulty: '',
  dialect: '',
})

const tagInput = ref('')
const errors = ref<Record<string, string>>({})

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
      transliteration: form.value.transliteration.trim() || undefined,
      translation: form.value.translation.trim() || undefined,
      comments: form.value.comments.trim() || undefined,
      tags: form.value.tags,
      difficulty: form.value.difficulty,
      dialect: form.value.dialect,
    })
  }
}

const handleClose = () => {
  emit('close')
}

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
.text-create-form {
  @apply space-y-6;
}

.form-grid {
  @apply space-y-6;
}

.form-row {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.form-field {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.text-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  resize: vertical;
}

.rtl-text {
  @apply text-right;
  font-family: 'Noto Sans Arabic', 'Arial Unicode MS', sans-serif;
}

.tag-list {
  @apply flex flex-wrap gap-2 mt-2;
}

.modal-actions {
  @apply flex gap-3 justify-end;
}
</style>