<template>
  <div class="page-container-narrow">
    <div class="mb-8">
      <BaseBreadcrumb
        parent-link="/interlinear-texts"
        parent-text="Interlinear Texts"
        item="New Text"
      />

      <h1 class="page-title">Create New Interlinear Text</h1>
      <p class="page-description">
        Create a new interlinear text. You'll be able to add sentences and word alignments after creation.
      </p>
    </div>

    <div class="base-form-element">
      <form @submit.prevent="handleSubmit" class="content-area">
        <!-- Title -->
        <BaseInput
          id="title"
          v-model="form.title"
          label="Title"
          type="text"
          required
          maxlength="200"
          placeholder="Enter the title of the text"
          :disabled="loading"
          :error="errors.title"
        />

        <!-- Description -->
        <BaseTextArea
          id="description"
          v-model="form.description"
          label="Description"
          :rows="4"
          placeholder="Optional description or context for this text"
          :disabled="loading"
          :hint="`${form.description?.length || 0}/250 characters`"
        />

        <!-- Dialect -->
        <BaseSelect
          id="dialect"
          v-model="form.dialect"
          :options="dialects"
          placeholder="Select a dialect"
          label="Dialect"
          required
          :disabled="loading"
          :error="errors.dialect"
        />

        <!-- Error Message -->
        <BaseErrorState
          v-if="submitError"
          :message="submitError"
        />

        <!-- Actions -->
        <div class="form-actions">
          <CancelButton @click="handleCancel" :disabled="loading" />
          <SaveButton @click="handleSubmit" :loading="loading" text="Create Text" :disabled="loading" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '~/components/common/BaseBreadcrumb.vue'
import BaseErrorState from '~/components/common/BaseErrorState.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import BaseTextArea from '~/components/common/BaseTextArea.vue'
import CancelButton from '~/components/common/CancelButton.vue'
import SaveButton from '~/components/common/SaveButton.vue'
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
