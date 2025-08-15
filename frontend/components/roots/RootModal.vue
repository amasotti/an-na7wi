<template>
  <BaseModal
    :open="open"
    :title="isEditing ? 'Edit Root' : 'Add New Root'"
    size="xl"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="content-area" role="form" aria-label="Root form">
      <!-- Root Letters Section -->
      <section class="form-section section-primary" aria-labelledby="root-letters-heading">
        <h3 id="root-letters-heading" class="form-section-title">
          <BaseIcon size="sm" class="section-icon text-blue-600">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </BaseIcon>
          Root Letters
        </h3>
        <div class="form-field-primary">
          <label for="rootInput" class="form-label">Root Letters <span class="text-red-500 ml-1">*</span></label>
          <BaseInput
            id="rootInput"
            v-model="rootInput"
            placeholder="Enter Arabic letters (e.g., ك-ت-ب or كتب)"
            class="arabic text-2xl"
            :error="inputError"
            required
            @input="handleInput"
            aria-describedby="root-help"
          />
          <div id="root-help" class="form-help">
            Enter 2-5 Arabic consonant letters with or without dashes
          </div>
        </div>
      </section>

      <!-- Meaning Section -->
      <section class="form-section section-meaning" aria-labelledby="meaning-heading">
        <h3 id="meaning-heading" class="form-section-title">
          <BaseIcon size="sm" class="section-icon text-purple-600">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </BaseIcon>
          Semantic Meaning
        </h3>
        <div class="form-group">
          <label for="meaningInput" class="form-label">Meaning (Optional)</label>
          <BaseInput
            id="meaningInput"
            v-model="meaningInput"
            placeholder="Enter the fundamental meaning or concept"
            aria-describedby="meaning-help"
          />
          <div id="meaning-help" class="form-help">
            Describe the essential semantic meaning that underlies words from this root
          </div>
        </div>
      </section>

      <!-- Analysis Section -->
      <section class="form-section section-analysis" aria-labelledby="analysis-heading">
        <h3 id="analysis-heading" class="form-section-title">
          <BaseIcon size="sm" class="section-icon text-orange-600">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </BaseIcon>
          Linguistic Analysis
        </h3>
        <div class="form-group">
          <label for="analysisInput" class="form-label">
            Analysis (Optional)
          </label>
          <textarea
            id="analysisInput"
            v-model="analysisInput"
            placeholder="Enter linguistic analysis, cognitive metaphors, grammatical patterns, verb forms, semantic relationships..."
            class="form-input resize-none"
            rows="8"
            aria-describedby="analysis-help"
          />
          <div id="analysis-help" class="form-help">
            Include morphological patterns, semantic extensions, cultural context, and related concepts
          </div>
        </div>
      </section>

      <!-- Error Display -->
      <div v-if="error" class="error-section" role="alert" aria-live="polite">
        <BaseIcon size="sm" class="error-icon">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </BaseIcon>
        <p class="error-message">{{ error }}</p>
      </div>

      <!-- Form Actions -->
      <footer class="form-actions" role="group" aria-label="Form actions">
        <BaseButton
          type="button"
          variant="outline"
          @click="handleClose"
          :disabled="loading"
          aria-label="Cancel and close form"
        >
          Cancel
        </BaseButton>
        <BaseButton
          type="submit"
          :disabled="!canSubmit || loading"
          :loading="loading"
          :aria-label="isEditing ? 'Update root information' : 'Create new root'"
        >
          {{ isEditing ? 'Update Root' : 'Add Root' }}
        </BaseButton>
      </footer>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseButton from '@/components/common/BaseButton.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import type { Root } from '@/types'
import { computed, ref, watch } from 'vue'
import { rootService } from '~/composables/rootService'

interface Props {
  open: boolean
  root?: Root | null
}

interface Emits {
  (e: 'close'): void
  (e: 'root-created', root: Root): void
  (e: 'root-updated', root: Root): void
}

const props = withDefaults(defineProps<Props>(), {
  root: null,
})
const emit = defineEmits<Emits>()

const rootInput = ref('')
const meaningInput = ref('')
const analysisInput = ref('')
const inputError = ref('')
const error = ref('')
const loading = ref(false)

const isEditing = computed(() => !!props.root)

const canSubmit = computed(() => {
  return rootInput.value.trim() !== '' && !inputError.value && !loading.value
})

const handleInput = async () => {
  inputError.value = ''
  error.value = ''

  const input = rootInput.value.trim()
  if (!input || input.length < 3) return

  try {
    const normalized = await rootService.normalizeRoot(input)
    if (!normalized.isValid) {
      inputError.value = 'Invalid root format. Please enter 2-5 Arabic letters.'
    }
  } catch (err) {
    inputError.value = 'Failed to validate root input'
    console.error('Error normalizing root:', err)
  }
}

const handleSubmit = async () => {
  if (!canSubmit.value) return

  try {
    loading.value = true
    error.value = ''

    const inputToSend = rootInput.value.trim()

    if (isEditing.value && props.root) {
      // Update existing root
      const updatedRoot = await rootService.updateRoot(
        props.root.id,
        inputToSend,
        meaningInput.value.trim(),
        analysisInput.value.trim()
      )
      emit('root-updated', updatedRoot)
    } else {
      // Create new root
      const newRoot = await rootService.createRoot(
        inputToSend,
        meaningInput.value.trim(),
        analysisInput.value.trim()
      )
      emit('root-created', newRoot)
    }
    handleClose()
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : `Failed to ${isEditing.value ? 'update' : 'create'} root`
    console.error(`Error ${isEditing.value ? 'updating' : 'creating'} root:`, err)
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  rootInput.value = ''
  meaningInput.value = ''
  analysisInput.value = ''
  inputError.value = ''
  error.value = ''
  loading.value = false
  emit('close')
}

const initializeForm = () => {
  if (props.root) {
    rootInput.value = props.root.displayForm
    meaningInput.value = props.root.meaning || ''
    analysisInput.value = props.root.analysis || ''
  } else {
    rootInput.value = ''
    meaningInput.value = ''
    analysisInput.value = ''
    inputError.value = ''
    error.value = ''
  }
}

watch(
  () => props.open,
  newShow => {
    if (newShow) {
      initializeForm()
    } else {
      rootInput.value = ''
      meaningInput.value = ''
      analysisInput.value = ''
      inputError.value = ''
      error.value = ''
    }
  },
  { immediate: true }
)

watch(
  () => props.root,
  () => {
    if (props.open) {
      initializeForm()
    }
  },
  { immediate: true }
)

// Initialize form immediately if both conditions are met
if (props.open && props.root) {
  initializeForm()
}
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

.section-meaning {
  @apply bg-gradient-to-br from-purple-50/50 to-violet-50/50 rounded-xl p-6 border border-purple-100/50;
}

.section-analysis {
  @apply bg-gradient-to-br from-orange-50/50 to-amber-50/50 rounded-xl p-6 border border-orange-100/50;
}

.form-field-primary {
  @apply space-y-3;
}

/* Error styling */
.error-section {
  @apply flex items-start gap-3 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4;
}

.error-icon {
  @apply text-red-500 flex-shrink-0 mt-0.5;
}

.error-message {
  @apply text-red-700 text-sm font-medium;
}

/* Responsive Improvements */
@media (max-width: 768px) {
  .form-section {
    @apply p-4 mb-6;
  }
  
  .form-section-title {
    @apply text-base mb-4;
  }
  
  .section-icon {
    @apply mr-2;
  }
}
</style>
