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

    <!-- Edit Form -->
    <div v-else-if="currentText" class="edit-container">
      <!-- Header -->
      <div class="page-header">
        <BaseBreadcrumb
          :parent-link="`/interlinear-texts/${route.params.id}`"
          :parent-text="currentText.title"
          item="Edit Metadata"
        />

        <h1 class="page-title">Edit Text Information</h1>
        <p class="page-description">
          Update the title, description, and dialect for this interlinear text
        </p>
      </div>

      <!-- Text Metadata Form -->
      <div class="metadata-section">
        <BaseInput
          id="title"
          v-model="textMetadata.title"
          label="Title"
          required
          placeholder="Text title"
        />

        <BaseTextArea
          id="description"
          v-model="textMetadata.description"
          label="Description"
          :rows="3"
          placeholder="Optional description"
        />

        <BaseSelect
          v-model="textMetadata.dialect"
          :options="dialectOptions"
          placeholder="Select dialect"
          required
          aria-describedby="dialect-help"
        />

        <div class="form-actions">
          <CancelButton @click="handleCancel" :disabled="saving" />
          <SaveButton @click="handleSave" :loading="saving" />
          </div>
      </div>

      <!-- Actions -->


        <!-- Error Message -->
        <div v-if="saveError" class="save-error">
          <BaseIcon size="sm" class="error-icon">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </BaseIcon>
          <span>{{ saveError }}</span>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseBreadcrumb from '~/components/common/BaseBreadcrumb.vue'
import BaseErrorState from '~/components/common/BaseErrorState.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import BaseTextArea from '~/components/common/BaseTextArea.vue'
import CancelButton from '~/components/common/CancelButton.vue'
import LoadingEffect from '~/components/common/LoadingEffect.vue'
import SaveButton from '~/components/common/SaveButton.vue'
import { dialectOptions } from '~/constants/dialects'
import { useInterlinearStore } from '~/stores/interlinearStore'
import { Dialect } from '~/types'

const route = useRoute()
const interlinearStore = useInterlinearStore()

// State
const currentText = computed(() => interlinearStore.currentText)
const loading = computed(() => interlinearStore.loading)
const error = computed(() => interlinearStore.error)

const textMetadata = ref({
  title: '',
  description: '',
  dialect: Dialect.MSA,
})

const saving = ref(false)
const saveError = ref<string | null>(null)

// Methods
const handleSave = async () => {
  saveError.value = null

  // Validate
  if (!textMetadata.value.title.trim()) {
    saveError.value = 'Title is required'
    return
  }

  if (!textMetadata.value.dialect) {
    saveError.value = 'Dialect is required'
    return
  }

  saving.value = true

  try {
    const textId = route.params.id as string
    await interlinearStore.updateText(textId, {
      title: textMetadata.value.title.trim(),
      description: textMetadata.value.description?.trim() || undefined,
      dialect: textMetadata.value.dialect,
    })

    // Navigate back to detail view
    await navigateTo(`/interlinear-texts/${textId}`)
  } catch (err) {
    console.error('Failed to save text metadata:', err)
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
    if (id) {
      await interlinearStore.fetchTextById(id)

      if (currentText.value) {
        textMetadata.value = {
          title: currentText.value.title,
          description: currentText.value.description || '',
          dialect: currentText.value.dialect,
        }
      }
    }
  } catch (err) {
    console.error('Failed to load interlinear text:', err)
  }
})
</script>

<style scoped>
.page-container {
  @apply max-w-3xl mx-auto px-4 py-8;
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

.form-field {
  @apply space-y-2;
}

.required-marker {
  @apply text-red-500;
}

.save-error {
  @apply mt-4 flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200;
}

.error-icon {
  @apply flex-shrink-0;
}
</style>
