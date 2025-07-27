<template>
  <BaseModal
    :open="open"
    :title="isEditing ? 'Edit Annotation' : 'New Annotation'"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Anchor Text -->
      <div>
        <label for="anchorText" class="block text-sm font-medium text-gray-700 mb-1">
          Anchor Text <span class="text-red-500">*</span>
        </label>
        <input
          id="anchorText"
          v-model="form.anchorText"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          :disabled="isEditing && !canEditAnchorText"
          :class="{ 'bg-gray-100': isEditing && !canEditAnchorText }"
        />
        <p v-if="isEditing && !canEditAnchorText" class="mt-1 text-xs text-gray-500">
          Anchor text cannot be changed for existing annotations
        </p>
      </div>

      <!-- Content -->
      <div>
        <label for="content" class="block text-sm font-medium text-gray-700 mb-1">
          Content <span class="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          v-model="form.content"
          rows="4"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        ></textarea>
      </div>

      <!-- Type -->
      <div>
        <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
          Type <span class="text-red-500">*</span>
        </label>
        <select
          id="type"
          v-model="form.type"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option v-for="type in annotationTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>

      <!-- Mastery Level -->
      <div>
        <label for="masteryLevel" class="block text-sm font-medium text-gray-700 mb-1">
          Mastery Level
        </label>
        <select
          id="masteryLevel"
          v-model="form.masteryLevel"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option v-for="level in masteryLevels" :key="level" :value="level">
            {{ level }}
          </option>
        </select>
      </div>

      <!-- Needs Review -->
      <div class="flex items-center">
        <input
          id="needsReview"
          v-model="form.needsReview"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label for="needsReview" class="ml-2 block text-sm text-gray-700">
          Needs Review
        </label>
      </div>

      <!-- Color (optional) -->
      <div>
        <label for="color" class="block text-sm font-medium text-gray-700 mb-1">
          Color (optional)
        </label>
        <input
          id="color"
          v-model="form.color"
          type="text"
          placeholder="#RRGGBB"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <!-- Buttons -->
      <div class="flex justify-between items-center pt-6">
        <!-- Delete button (only in edit mode) -->
        <BaseButton 
          v-if="isEditing" 
          type="button" 
          variant="danger"
          @click="handleDelete"
        >
          Delete
        </BaseButton>
        
        <!-- Empty div to maintain layout when no delete button -->
        <div v-else></div>
        
        <!-- Submit button -->
        <BaseButton 
          type="submit"
          :loading="loading"
        >
          {{ isEditing ? 'Update' : 'Create' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseIcon from '@/components/common/BaseIcon.vue'
import type { Annotation, AnnotationType, MasteryLevel } from '@/types'
import { AnnotationType as AnnotationTypeEnum, MasteryLevel as MasteryLevelEnum } from '@/types'
import { computed, ref, watch } from 'vue'
import BaseButton from '../common/BaseButton.vue'
import BaseModal from '../common/BaseModal.vue'

interface Props {
  open: boolean
  annotation?: Annotation
  loading?: boolean
  canEditAnchorText?: boolean
  selectedText?: string
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  annotation: undefined,
  loading: false,
  canEditAnchorText: false,
  selectedText: '',
})

const emit = defineEmits<{
  (e: 'close'): void
  (
    e: 'submit',
    data: {
      anchorText: string
      content: string
      type: AnnotationType
      masteryLevel: MasteryLevel
      needsReview: boolean
      color?: string
    }
  ): void
  (e: 'delete', id: string): void
}>()

// Form state
const form = ref({
  anchorText: '',
  content: '',
  type: AnnotationTypeEnum.VOCABULARY as AnnotationType,
  masteryLevel: MasteryLevelEnum.NEW as MasteryLevel,
  needsReview: false,
  color: '#32a7cf',
})

// Computed properties
const isEditing = computed(() => !!props.annotation)

// Available options
const annotationTypes = Object.values(AnnotationTypeEnum)
const masteryLevels = Object.values(MasteryLevelEnum)

// Watch for changes in the annotation prop
watch(
  () => props.annotation,
  newAnnotation => {
    if (newAnnotation) {
      form.value = {
        anchorText: newAnnotation.anchorText,
        content: newAnnotation.content,
        type: newAnnotation.type,
        masteryLevel: newAnnotation.masteryLevel,
        needsReview: newAnnotation.needsReview,
        color: newAnnotation.color || '',
      }
    } else {
      // Reset form for new annotation
      form.value = {
        anchorText: props.selectedText || '',
        content: '',
        type: AnnotationTypeEnum.VOCABULARY,
        masteryLevel: MasteryLevelEnum.NEW,
        needsReview: false,
        color: '#32a7cf',
      }
    }
  },
  { immediate: true }
)

// Watch for changes in selectedText prop
watch(
  () => props.selectedText,
  newSelectedText => {
    // Only update if we're not editing an existing annotation
    if (!props.annotation) {
      form.value.anchorText = newSelectedText || ''
    }
  }
)

// Watch for open state changes
watch(
  () => props.open,
  isOpen => {
    if (!isOpen) {
      // Reset form when modal is closed
      if (!props.annotation) {
        form.value = {
          anchorText: props.selectedText || '',
          content: '',
          type: AnnotationTypeEnum.VOCABULARY,
          masteryLevel: MasteryLevelEnum.NEW,
          needsReview: false,
          color: '#32a7cf',
        }
      }
    }
  }
)

// Methods
const handleSubmit = () => {
  emit('submit', {
    anchorText: form.value.anchorText,
    content: form.value.content,
    type: form.value.type,
    masteryLevel: form.value.masteryLevel,
    needsReview: form.value.needsReview,
    color: form.value.color || undefined,
  })
}

const handleClose = () => {
  emit('close')
}

const handleDelete = () => {
  if (props.annotation?.id) {
    if (confirm('Are you sure you want to delete this annotation?')) {
      emit('delete', props.annotation.id)
      // Close the modal immediately after confirming deletion
      emit('close')
    }
  }
}
</script>
