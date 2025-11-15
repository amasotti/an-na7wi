<template>
  <div class="page-container">
    <div class="page-header">
      <NuxtLink to="/interlinear-texts" class="back-link">
        <BaseIcon size="sm" class="back-icon">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </BaseIcon>
        Back to Interlinear Texts
      </NuxtLink>

      <h1 class="page-title">Create New Interlinear Text</h1>
      <p class="page-description">
        Create a new interlinear text. You'll be able to add sentences and word alignments after creation.
      </p>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="interlinear-form">
        <!-- Title -->
        <div class="form-field">
          <label for="title" class="form-label">
            Title <span class="required-marker">*</span>
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            maxlength="200"
            class="form-input-na7wi"
            placeholder="Enter the title of the text"
            :disabled="loading"
          />
          <p v-if="errors.title" class="form-error">
            {{ errors.title }}
          </p>
        </div>

        <!-- Description -->
        <div class="form-field">
          <label for="description" class="form-label">
            Description
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            maxlength="500"
            class="form-textarea-2"
            placeholder="Optional description or context for this text"
            :disabled="loading"
          ></textarea>
          <p class="form-hint">
            {{ form.description?.length || 0 }}/500 characters
          </p>
        </div>

        <!-- Dialect -->
        <div class="form-field">
          <label for="dialect" class="form-label">
            Dialect <span class="required-marker">*</span>
          </label>
          <select
            id="dialect"
            v-model="form.dialect"
            required
            class="form-select"
            :disabled="loading"
          >
            <option value="" disabled>Select a dialect</option>
            <option v-for="dialect in dialects" :key="dialect.value" :value="dialect.value">
              {{ dialect.label }}
            </option>
          </select>
          <p v-if="errors.dialect" class="form-error">
            {{ errors.dialect }}
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="submitError" class="form-submit-error">
          <BaseIcon size="sm" class="error-icon">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </BaseIcon>
          <span>{{ submitError }}</span>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <BaseButton
            type="button"
            variant="outline"
            @click="handleCancel"
            :disabled="loading"
          >
            Cancel
          </BaseButton>

          <BaseButton
            type="submit"
            :loading="loading"
          >
            Create Text
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import { useInterlinearStore } from '~/stores/interlinearStore'
import { Dialect } from '~/types'

// Store
const interlinearStore = useInterlinearStore()

// Form state
const form = ref({
  title: '',
  description: '',
  dialect: '' as Dialect | '',
})

// UI state
const loading = ref(false)
const errors = ref<Record<string, string>>({})
const submitError = ref<string | null>(null)

// Dialect options
const dialects = [
  { value: Dialect.MSA, label: 'Modern Standard Arabic (MSA)' },
  { value: Dialect.TUNISIAN, label: 'Tunisian' },
  { value: Dialect.MOROCCAN, label: 'Moroccan' },
  { value: Dialect.EGYPTIAN, label: 'Egyptian' },
  { value: Dialect.LEVANTINE, label: 'Levantine' },
  { value: Dialect.GULF, label: 'Gulf' },
  { value: Dialect.IRAQI, label: 'Iraqi' },
]

// Validation
const validateForm = (): boolean => {
  errors.value = {}

  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required'
  } else if (form.value.title.length > 200) {
    errors.value.title = 'Title must be 200 characters or less'
  }

  if (!form.value.dialect) {
    errors.value.dialect = 'Dialect is required'
  }

  return Object.keys(errors.value).length === 0
}

// Handlers
const handleSubmit = async () => {
  submitError.value = null

  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const newText = await interlinearStore.createText({
      title: form.value.title.trim(),
      description: form.value.description?.trim() || undefined,
      dialect: form.value.dialect as Dialect,
    })

    // Navigate to the detail page where user can add sentences
    await navigateTo(`/interlinear-texts/${newText.id}`)
  } catch (error) {
    console.error('Failed to create interlinear text:', error)
    submitError.value = 'Failed to create text. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  navigateTo('/interlinear-texts')
}
</script>

<style scoped>
.page-container {
  @apply max-w-3xl mx-auto px-4 py-8;
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

.form-container {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8;
}

.interlinear-form {
  @apply space-y-6;
}

.form-field {
  @apply space-y-2;
}

.form-select {
  @apply w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
         disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
         transition-colors;
}

.form-hint {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.form-error {
  @apply text-sm text-red-600 dark:text-red-400;
}

.form-submit-error {
  @apply flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200;
}

.error-icon {
  @apply flex-shrink-0;
}

.form-actions {
  @apply flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700;
}
</style>
