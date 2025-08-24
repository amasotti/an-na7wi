<template>
  <BaseCard class="lg:col-span-3">
    <!-- Study Layout: Side-by-side text versions -->
    <div class="study-layout">
      <!-- Arabic Content -->
      <section class="study-panel arabic-panel">
        <h3 class="study-panel-title">
          <span class="title-text">Arabic</span>
          <span class="title-accent">العربية</span>
        </h3>
        <div 
          class="study-text-content arabic-text-display"
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
      <section v-if="displayText?.transliteration" class="study-panel transliteration-panel">
        <h3 class="study-panel-title">
          <span class="title-text">Transliteration</span>
        </h3>
        <div 
          class="study-text-content text-section transliteration-section"
          ref="transliterationRef"
          @mouseup="handleTextSelection"
          @annotation-clicked="handleAnnotationClick"
        >
          <div v-html="highlightedTransliteration"></div>
        </div>
      </section>

      <!-- Translation -->
      <section v-if="displayText?.translation" class="study-panel translation-panel">
        <h3 class="study-panel-title">
          <span class="title-text">Translation</span>
        </h3>
        <div 
          class="study-text-content text-section translation-section"
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
import type { Annotation, Text } from '@/types'
import { highlightAnnotations } from '@/utils/textHighlighting'
import AnnotationForm from '~/components/annotation/AnnotationForm.vue'
import type { CreateAnnotationRequest } from '~/composables/annotationService'
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
const { selectedText, handleTextSelection, createAnnotationFromSelection } =
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
  return highlightAnnotations(props.displayText?.transliteration || '', props.annotations).replace(
    /\n/g,
    '<br>'
  )
})

const highlightedTranslation = computed(() => {
  return highlightAnnotations(props.displayText?.translation || '', props.annotations).replace(
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
const handleAnnotationSubmit = async (data: CreateAnnotationRequest) => {
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
.study-layout {
  @apply grid grid-cols-1 lg:grid-cols-7 gap-4 min-h-[500px];
}

.arabic-panel {
  @apply lg:col-span-3;
}

.transliteration-panel {
  @apply lg:col-span-2;
}

.translation-panel {
  @apply lg:col-span-2;
}

.study-panel {
  @apply flex flex-col h-full;
}

.study-panel-title {
  @apply flex items-center justify-between text-sm font-medium text-gray-600 uppercase tracking-wide mb-3 pb-2 border-b border-gray-200;
}

.title-text {
  @apply text-gray-700 font-semibold;
}

.title-accent {
  @apply text-xs text-gray-500 font-normal;
}

.study-text-content {
  @apply flex-1 text-base leading-relaxed p-4 rounded-lg border min-h-[400px] overflow-y-auto;
}

.arabic-panel {
  @apply lg:col-span-3 border-l-2 border-l-amber-300;
}

.transliteration-panel {
  @apply lg:col-span-2 border-l-2 border-l-blue-300;
}

.translation-panel {
  @apply lg:col-span-2 border-l-2 border-l-green-300;
}

.text-section {
  @apply border-gray-200;
}

.transliteration-section {
  @apply text-gray-700 italic bg-blue-50/70 border-blue-200;
}

.translation-section {
  @apply text-gray-800 bg-green-50/70 border-green-200;
}

/* Enhanced Arabic Text Display */
.arabic-text-display {
  @apply text-xl font-arabic text-right bg-amber-50/70 border-amber-200;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.8;
  word-spacing: 0.1em;
  
  /* Selection styling */
  &::selection {
    @apply bg-yellow-200/60;
  }
  
  /* Focus and interaction states */
  &:hover {
    @apply bg-amber-50 border-amber-300;
    transition: all 0.3s ease;
  }
}

</style>
