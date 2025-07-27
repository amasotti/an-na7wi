<template>
  <BaseCard class="lg:col-span-3">
    <div class="space-y-8">
      <!-- Arabic Content -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Arabic Text</h2>
        <div 
          class="text-2xl leading-relaxed text-gray-900 font-arabic text-right bg-gray-50 p-6 rounded-lg relative"
          dir="rtl"
          lang="ar"
          ref="arabicContentRef"
          @mouseup="handleTextSelection"
        >
          <span v-if="!displayText?.arabicContent">No content</span>
          <div v-else v-html="highlightedArabicContent"></div>
        </div>
      </div>

      <!-- Transliteration -->
      <div v-if="displayText?.transliteration">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Transliteration</h2>
        <div 
          class="text-lg leading-relaxed text-gray-700 italic bg-blue-50 p-6 rounded-lg relative"
          ref="transliterationRef"
          @mouseup="handleTextSelection"
        >
          <div v-html="highlightedTransliteration"></div>
        </div>
      </div>

      <!-- Translation -->
      <div v-if="displayText?.translation">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Translation</h2>
        <div 
          class="text-lg leading-relaxed text-gray-800 bg-green-50 p-6 rounded-lg relative"
          ref="translationRef"
          @mouseup="handleTextSelection"
        >
          <div v-html="highlightedTranslation"></div>
        </div>
      </div>
    </div>

    <!-- Annotation Form Modal -->
    <AnnotationForm
      :open="showAnnotationForm"
      :annotation="editingAnnotation"
      :loading="loading"
      @close="closeAnnotationForm"
      @submit="handleAnnotationSubmit"
    />

    <!-- Selection Toolbar -->
    <div 
      v-if="showSelectionToolbar" 
      class="fixed bg-white shadow-lg rounded-lg p-2 z-50 flex items-center space-x-2"
      :style="selectionToolbarStyle"
    >
      <BaseButton size="sm" @click="createAnnotationFromSelection">
        <BaseIcon size="sm" class="mr-1">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </BaseIcon>
        Annotate
      </BaseButton>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Annotation, AnnotationType, MasteryLevel, Text } from '@/types'
import BaseCard from '../common/BaseCard.vue'
import BaseButton from '../common/BaseButton.vue'
import BaseIcon from '../common/BaseIcon.vue'
import AnnotationForm from '../annotation/AnnotationForm.vue'
import { useTextStore } from '@/stores/textStore'

interface Props {
  displayText: Text | null
  annotations: Annotation[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  (e: 'annotationCreated', annotation: Annotation): void
  (e: 'annotationUpdated', annotation: Annotation): void
  (e: 'annotationDeleted', id: string): void
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
const selectedText = ref('')
const selectedSection = ref<'arabic' | 'transliteration' | 'translation' | null>(null)

// State for selection toolbar
const showSelectionToolbar = ref(false)
const selectionToolbarPosition = ref({ x: 0, y: 0 })

// Computed style for selection toolbar
const selectionToolbarStyle = computed(() => {
  return {
    top: `${selectionToolbarPosition.value.y}px`,
    left: `${selectionToolbarPosition.value.x}px`,
    transform: 'translate(-50%, -100%)'
  }
})

// Highlight annotations in text
const highlightText = (text: string, annotations: Annotation[]) => {
  if (!text || !annotations.length) return text
  
  let result = text
  
  // Sort annotations by length of anchor text (longest first)
  // This helps prevent nested highlights from breaking
  const sortedAnnotations = [...annotations].sort((a, b) => 
    b.anchorText.length - a.anchorText.length
  )
  
  for (const annotation of sortedAnnotations) {
    const { anchorText, id, type, color } = annotation
    
    // Skip if anchor text is not in the content
    if (!result.includes(anchorText)) continue
    
    // Determine highlight color based on type
    let highlightColor = ''
    switch (type) {
      case 'GRAMMAR':
        highlightColor = color || 'rgba(59, 130, 246, 0.2)' // blue
        break
      case 'VOCABULARY':
        highlightColor = color || 'rgba(16, 185, 129, 0.2)' // green
        break
      case 'CULTURAL':
        highlightColor = color || 'rgba(245, 158, 11, 0.2)' // amber
        break
      default:
        highlightColor = color || 'rgba(156, 163, 175, 0.2)' // gray
    }
    
    // Create underlined span instead of highlighted
    const highlightedSpan = `<span 
      class="annotation-highlight cursor-pointer" 
      style="text-decoration: underline; text-decoration-color: ${highlightColor}; text-decoration-thickness: 2px; position: relative;"
      data-annotation-id="${id}"
      title="${annotation.content}"
    >${anchorText}</span>`
    
    // Replace all occurrences
    // Using a simple replace might cause issues with nested highlights
    // A more robust solution would use a proper HTML parser
    result = result.split(anchorText).join(highlightedSpan)
  }
  
  return result
}

// Computed highlighted content
const highlightedArabicContent = computed(() => {
  return highlightText(props.displayText?.arabicContent || '', props.annotations)
})

const highlightedTransliteration = computed(() => {
  return highlightText(props.displayText?.transliteration || '', props.annotations)
})

const highlightedTranslation = computed(() => {
  return highlightText(props.displayText?.translation || '', props.annotations)
})

// Handle text selection
const handleTextSelection = (event: MouseEvent) => {
  const selection = window.getSelection()
  
  if (!selection || selection.isCollapsed) {
    // No text selected, hide toolbar
    showSelectionToolbar.value = false
    return
  }
  
  const selectedStr = selection.toString().trim()
  
  if (selectedStr) {
    // Determine which section was selected
    const target = event.target as HTMLElement
    let section: 'arabic' | 'transliteration' | 'translation' | null = null
    
    if (arabicContentRef.value?.contains(target)) {
      section = 'arabic'
    } else if (transliterationRef.value?.contains(target)) {
      section = 'transliteration'
    } else if (translationRef.value?.contains(target)) {
      section = 'translation'
    }
    
    if (section) {
      selectedText.value = selectedStr
      selectedSection.value = section
      
      // Position the toolbar near the selection
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      
      selectionToolbarPosition.value = {
        x: rect.left + rect.width / 2,
        y: rect.top
      }
      
      showSelectionToolbar.value = true
    }
  } else {
    showSelectionToolbar.value = false
  }
}

// Create annotation from selection
const createAnnotationFromSelection = () => {
  if (selectedText.value && selectedSection.value) {
    // Open annotation form with selected text
    editingAnnotation.value = undefined
    showAnnotationForm.value = true
    
    // Hide selection toolbar
    showSelectionToolbar.value = false
  }
}

// Close annotation form
const closeAnnotationForm = () => {
  showAnnotationForm.value = false
  editingAnnotation.value = undefined
  selectedText.value = ''
  selectedSection.value = null
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
      const updatedAnnotation = await textStore.updateAnnotation(
        editingAnnotation.value.id,
        data
      )
      emit('annotationUpdated', updatedAnnotation)
    } else {
      // Create new annotation
      // If we're creating from selection, use the selected text
      const annotationData = {
        ...data,
        anchorText: selectedText.value || data.anchorText
      }
      
      const newAnnotation = await textStore.createAnnotation(
        props.displayText.id,
        annotationData
      )
      emit('annotationCreated', newAnnotation)
    }
    
    // Close the form
    closeAnnotationForm()
  } catch (error) {
    console.error('Failed to save annotation:', error)
  }
}

// Watch for clicks on annotation highlights
watch(() => props.annotations, () => {
  // Use nextTick to ensure DOM is updated
  setTimeout(() => {
    const highlights = document.querySelectorAll('.annotation-highlight')
    
    highlights.forEach(highlight => {
      highlight.addEventListener('click', (event) => {
        const annotationId = (event.currentTarget as HTMLElement).dataset.annotationId
        if (annotationId) {
          const annotation = props.annotations.find(a => a.id === annotationId)
          if (annotation) {
            editingAnnotation.value = annotation
            showAnnotationForm.value = true
          }
        }
      })
    })
  }, 100)
}, { immediate: true })
</script>

<style scoped>
.font-arabic {
  font-family: 'Noto Naskh Arabic', 'Arabic Typesetting', 'Times New Roman', serif;
}

:deep(.annotation-highlight) {
  border-radius: 2px;
  transition: all 0.2s ease;
}

:deep(.annotation-highlight:hover) {
  opacity: 0.8;
}
</style>
