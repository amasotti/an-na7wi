<template>
  <BaseModal
    :open="open"
    :title="isEditing ? 'Edit Annotation' : 'New Annotation'"
    size="xl"
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
        <BaseButton
          v-if="form.anchorText"
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

      <!-- Content -->
      <div>
        <BaseTextArea
          id="content"
          v-model="form.content"
          :rows="5"
          required
          label="Annotation"
        />
        <div v-if="generatedExamples.length > 0" class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h4 class="text-sm font-medium text-blue-900 mb-2">Generated Examples:</h4>
          <div class="space-y-2">
            <div
              v-for="(example, index) in generatedExamples"
              :key="index"
              class="p-2 bg-white rounded border cursor-pointer hover:bg-blue-50 transition-colors"
              @click="addExampleToContent(example)"
            >
              <div class="text-sm">
                <div class="font-medium text-blue-900 rtl mb-1">{{ example.arabic }}</div>
                <div class="font-small italic text-gray-600">{{ example.transliteration }}</div>
                <div class="text-gray-600">{{ example.english }}</div>
              </div>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Click on an example to add it to the content field</p>
        </div>
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

      <!-- Color (optional) -->
      <ColorPicker 
        v-model="form.color" 
        label="Color (optional)" 
      />

      <!-- Word Selector -->
      <WordSelector
        v-model="form.linkedWords"
        label="Linked Words (optional)"
        :annotation-id="annotation?.id"
        :real-time-mode="isEditing"
        @word-added="handleWordAdded"
        @word-removed="handleWordRemoved"
        @error="handleWordLinkError"
      />

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
import { computed, ref, watch } from 'vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import type {
  Annotation,
  AnnotationType,
  ExampleDTO,
  MasteryLevel,
  WordSearchResult,
} from '@/types'
import { AnnotationType as AnnotationTypeEnum, MasteryLevel as MasteryLevelEnum } from '@/types'
import WordSelector from '~/components/annotation/WordSelector.vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseCheckBox from '~/components/common/BaseCheckBox.vue'
import BaseModal from '~/components/common/BaseModal.vue'
import BaseTextArea from '~/components/common/BaseTextArea.vue'
import ColorPicker from '~/components/common/ColorPicker.vue'
import type { CreateAnnotationRequest } from '~/composables/annotationService'
import { exampleService } from '~/composables/exampleService'

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
  (e: 'submit', data: CreateAnnotationRequest): void
  (e: 'delete', id: string): void
  (e: 'word-linked', word: WordSearchResult): void
  (e: 'word-unlinked', word: WordSearchResult): void
  (e: 'word-link-error', error: Error): void
}>()

// Form state
const form = ref({
  anchorText: '',
  content: '',
  type: AnnotationTypeEnum.VOCABULARY as AnnotationType,
  masteryLevel: MasteryLevelEnum.NEW as MasteryLevel,
  needsReview: false,
  color: '#32a7cf',
  linkedWords: [] as WordSearchResult[],
})

// Example generation state
const loadingExamples = ref(false)
const generatedExamples = ref<ExampleDTO[]>([])

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
        linkedWords:
          newAnnotation.linkedWords?.map(word => ({
            id: word.id,
            arabic: word.arabic,
            transliteration: word.transliteration,
            translation: word.translation,
          })) || [],
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
        linkedWords: [],
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
          linkedWords: [],
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
    linkedWordIds: form.value.linkedWords.map(word => word.id),
  } as CreateAnnotationRequest)
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

// Example generation methods
const generateExamples = async () => {
  if (!form.value.anchorText?.trim()) return

  loadingExamples.value = true
  try {
    const response = await exampleService.generateExamples({
      arabic: form.value.anchorText.trim(),
      context: undefined,
    })
    generatedExamples.value = response.examples
  } catch (error) {
    console.error('Failed to generate examples:', error)
  } finally {
    loadingExamples.value = false
  }
}

const addExampleToContent = (example: ExampleDTO) => {
  const exampleText = `E.g.: ${example.arabic}\n${example.transliteration}\n${example.english}\n\n`

  if (form.value.content) {
    form.value.content += `\n\n${exampleText}`
  } else {
    form.value.content = exampleText
  }
}

// Clear examples when modal closes or anchor text changes
watch(
  () => props.open,
  isOpen => {
    if (!isOpen) {
      generatedExamples.value = []
    }
  }
)

watch(
  () => form.value.anchorText,
  () => {
    generatedExamples.value = []
  }
)

// Word linking handlers
const handleWordAdded = (word: WordSearchResult) => {
  emit('word-linked', word)
}

const handleWordRemoved = (word: WordSearchResult) => {
  emit('word-unlinked', word)
}

const handleWordLinkError = (error: Error) => {
  emit('word-link-error', error)
}
</script>
