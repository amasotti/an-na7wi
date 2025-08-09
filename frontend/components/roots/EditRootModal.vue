<template>
  <BaseModal
    :open="show"
    title="Edit Root"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Root Input -->
      <div>
        <label for="rootInput" class="block text-sm font-medium text-gray-700 mb-1">
          Root Letters
        </label>
        <BaseInput
          id="rootInput"
          v-model="rootInput"
          placeholder="Enter Arabic letters (e.g., ك-ت-ب or كتب)"
          class="arabic text-lg"
          :error="inputError"
          required
          @input="handleInput"
        />
        <p class="text-xs text-gray-500 mt-1">
          Enter 2-5 Arabic letters with or without dashes
        </p>
      </div>

      <!-- Meaning Input -->
      <div>
        <label for="meaningInput" class="block text-sm font-medium text-gray-700 mb-1">
          Meaning (Optional)
        </label>
        <BaseInput
          id="meaningInput"
          v-model="meaningInput"
          placeholder="Enter root meaning or definition"
          class="text-sm"
        />
      </div>

      <!-- Preview -->
      <div v-if="preview" class="bg-gray-50 rounded-lg p-4">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
        <div class="space-y-2">
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Display Form:</span>
            <span class="text-xl font-bold arabic text-gray-900">{{ preview.displayForm }}</span>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Letters:</span>
            <div class="flex space-x-1">
              <span
                v-for="(letter, index) in preview.letters"
                :key="index"
                class="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 text-sm font-medium rounded arabic"
              >
                {{ letter }}
              </span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Letter Count:</span>
            <span class="text-sm font-medium">{{ preview.letterCount }}</span>
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
        <p class="text-red-700 text-sm">{{ error }}</p>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3 pt-4 border-t">
        <BaseButton
          type="button"
          variant="outline"
          @click="handleClose"
          :disabled="loading"
        >
          Cancel
        </BaseButton>
        <BaseButton
          type="submit"
          :disabled="!canSubmit || loading"
          :loading="loading"
        >
          Update Root
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import type { Root, RootNormalization } from '@/types'
import { computed, ref, watch } from 'vue'
import { rootService } from '~/composables/rootService'

interface Props {
  show: boolean
  root: Root | null
}

interface Emits {
  (e: 'close'): void
  (e: 'root-updated', root: Root): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const rootInput = ref('')
const meaningInput = ref('')
const preview = ref<RootNormalization | null>(null)
const inputError = ref('')
const error = ref('')
const loading = ref(false)

const canSubmit = computed(() => {
  return rootInput.value.trim() !== '' && preview.value?.isValid && !inputError.value
})

const handleInput = async () => {
  inputError.value = ''
  error.value = ''
  preview.value = null

  const input = rootInput.value.trim()
  if (!input || input.length < 3) return

  try {
    preview.value = await rootService.normalizeRoot(input)
    if (!preview.value.isValid) {
      inputError.value = 'Invalid root format. Please enter 2-5 Arabic letters.'
    }
  } catch (err) {
    inputError.value = 'Failed to validate root input'
    console.error('Error normalizing root:', err)
  }
}

const handleSubmit = async () => {
  if (!canSubmit.value || !props.root) return

  try {
    loading.value = true
    error.value = ''

    const updatedRoot = await rootService.updateRoot(
      props.root.id,
      rootInput.value.trim(),
      meaningInput.value.trim()
    )
    emit('root-updated', updatedRoot)
    handleClose()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to update root'
    console.error('Error updating root:', err)
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  rootInput.value = ''
  meaningInput.value = ''
  preview.value = null
  inputError.value = ''
  error.value = ''
  loading.value = false
  emit('close')
}

const initializeForm = () => {
  if (props.root) {
    rootInput.value = props.root.displayForm
    meaningInput.value = props.root.meaning || ''

    preview.value = {
      input: props.root.displayForm,
      letters: props.root.letters,
      normalizedForm: props.root.normalizedForm,
      displayForm: props.root.displayForm,
      letterCount: props.root.letterCount,
      isValid: true,
    }
  }
}

watch(
  () => props.show,
  newShow => {
    if (newShow) {
      initializeForm()
    } else {
      rootInput.value = ''
      meaningInput.value = ''
      preview.value = null
      inputError.value = ''
      error.value = ''
    }
  },
  { immediate: true }
)

watch(
  () => props.root,
  () => {
    if (props.show) {
      initializeForm()
    }
  },
  { immediate: true }
)

// Initialize form immediately if both conditions are met
if (props.show && props.root) {
  initializeForm()
}
</script>