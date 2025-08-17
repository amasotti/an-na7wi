<template>
  <BaseCard class="lg:col-span-3">
    <div class="space-y-6">
      <!-- Arabic Content -->
      <section>
        <h2 class="section-title">Arabic Text</h2>
        <div 
          class="arabic-text-display"
          dir="rtl"
          lang="ar"
          ref="arabicContentRef"
          @mouseup="handleTextSelection"
          @annotation-clicked="handleAnnotationClick"
        >
          <span v-if="!displayText?.arabicContent">No content</span>
          <div v-else v-html="highlightedArabicContent"></div>
        </div>
      </section>

      <!-- Transliteration -->
      <section v-if="displayText?.transliteration">
        <h2 class="section-title">Transliteration</h2>
        <div 
          class="text-section transliteration-section"
          ref="transliterationRef"
          @mouseup="handleTextSelection"
          @annotation-clicked="handleAnnotationClick"
        >
          <div v-html="highlightedTransliteration"></div>
        </div>
      </section>

      <!-- Translation -->
      <section v-if="displayText?.translation">
        <h2 class="section-title">Translation</h2>
        <div 
          class="text-section translation-section"
          ref="translationRef"
          @mouseup="handleTextSelection"
          @annotation-clicked="handleAnnotationClick"
        >
          <div v-html="highlightedTranslation"></div>
        </div>
      </section>
    </div>

    <!-- Annotation Form Modal -->
    <AnnotationForm
      :open="showAnnotationForm"
      :annotation="editingAnnotation"
      :selected-text="selectedText"
      :loading="loading"
      @close="closeAnnotationForm"
      @submit="handleAnnotationSubmit"
    />
  </BaseCard>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { useAnnotationInteraction } from '@/composables/useAnnotationInteraction'
import { useTextStore } from '@/stores/textStore'
import type { Annotation, AnnotationType, MasteryLevel, Text } from '@/types'
import { highlightAnnotations } from '@/utils/textHighlighting'
import AnnotationForm from '~/components/annotation/AnnotationForm.vue'
import BaseCard from '../common/BaseCard.vue'

interface Props {
  displayText: Text | null
  annotations: Annotation[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'annotationCreated', annotation: Annotation): void
  (e: 'annotationUpdated', annotation: Annotation): void
  (e: 'annotationDeleted', id: string): void
  (e: 'textSelected', data: { selectedText: string; position: { x: number; y: number } }): void
  (e: 'selectionCleared'): void
}>()

// Store
const textStore = useTextStore()

// Refs for text containers
const arabicContentRef = ref<HTMLElement | null>(null)
const transliterationRef = ref<HTMLElement | null>(null)
const translationRef = ref<HTMLElement | null>(null)

// State for annotation form
const showAnnotationForm = ref(false)
const editingAnnotation = ref<Annotation | undefined>(undefined)

// Use annotation interaction composable
const { selectedText, selectedSection, handleTextSelection, createAnnotationFromSelection } =
  useAnnotationInteraction(
    toRef(props, 'annotations'),
    {
      arabic: arabicContentRef,
      transliteration: transliterationRef,
      translation: translationRef,
    },
    emit
  )

// Computed highlighted content
const highlightedArabicContent = computed(() => {
  return highlightAnnotations(props.displayText?.arabicContent || '', props.annotations).replace(
    /\n/g,
    '<br>'
  ) // Replace newlines with <br> for HTML display
})

const highlightedTransliteration = computed(() => {
  return highlightAnnotations(props.displayText?.transliteration || '', props.annotations)
    .replace(
      /\n/g,
      '<br>'
    )
})

const highlightedTranslation = computed(() => {
  return highlightAnnotations(props.displayText?.translation || '', props.annotations)
    .replace(
      /\n/g,
      '<br>'
    )
})

// Handle annotation clicks
const handleAnnotationClick = (event: CustomEvent) => {
  const { annotation } = event.detail
  editingAnnotation.value = annotation
  showAnnotationForm.value = true
}

// Create annotation from selection (exposed method)
const createAnnotationFromSelectionWrapper = () => {
  const selectionData = createAnnotationFromSelection()
  if (selectionData) {
    editingAnnotation.value = undefined
    showAnnotationForm.value = true
    emit('selectionCleared')
  }
}

// Expose method to parent
defineExpose({
  createAnnotationFromSelection: createAnnotationFromSelectionWrapper,
})

// Close annotation form
const closeAnnotationForm = () => {
  showAnnotationForm.value = false
  editingAnnotation.value = undefined
}

// Handle annotation form submission
const handleAnnotationSubmit = async (data: {
  anchorText: string
  content: string
  type: AnnotationType
  masteryLevel: MasteryLevel
  needsReview: boolean
  color?: string
}) => {
  if (!props.displayText) return

  try {
    if (editingAnnotation.value) {
      // Update existing annotation
      const updatedAnnotation = await textStore.updateAnnotation(editingAnnotation.value.id, data)
      emit('annotationUpdated', updatedAnnotation)
    } else {
      // Create new annotation
      const annotationData = {
        ...data,
        anchorText: selectedText.value || data.anchorText,
      }

      const newAnnotation = await textStore.createAnnotation(props.displayText.id, annotationData)
      emit('annotationCreated', newAnnotation)
    }

    // Close the form
    closeAnnotationForm()
  } catch (error) {
    console.error('Failed to save annotation:', error)
  }
}
</script>

<style scoped>
.section-title {
  @apply text-lg font-semibold text-gray-900 mb-4;
}

.text-section {
  @apply text-lg leading-relaxed p-6 rounded-lg relative;
}

.transliteration-section {
  @apply text-gray-700 italic bg-blue-50;
}

.translation-section {
  @apply text-gray-800 bg-green-50;
}

/* Enhanced Arabic Text Display */
.arabic-text-display {
  @apply text-2xl leading-relaxed text-gray-900 font-arabic text-right bg-gradient-to-br from-emerald-50/50 to-green-50/50 p-8 rounded-xl relative border border-emerald-100/30 shadow-sm;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 2;
  word-spacing: 0.1em;
  min-height: 150px;
  
  /* Selection styling */
  &::selection {
    @apply bg-yellow-200/60;
  }
  
  /* Focus and interaction states */
  &:hover {
    @apply bg-gradient-to-br from-emerald-50/70 to-green-50/70 shadow-md;
    transition: all 0.3s ease;
  }
}

:deep(.annotation-highlight) {
  border-radius: 2px;
  transition: all 0.2s ease;
}

:deep(.annotation-highlight:hover) {
  opacity: 0.8;
}
</style>
