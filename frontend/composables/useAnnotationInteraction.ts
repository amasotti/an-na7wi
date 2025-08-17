import { onMounted, onUnmounted, ref, watch } from 'vue'
import type { Annotation } from '@/types'
import { clearSelection, getTextSelection } from '@/utils/textSelection'

export interface AnnotationInteractionEmits {
  (e: 'annotationCreated', annotation: Annotation): void
  (e: 'annotationUpdated', annotation: Annotation): void
  (e: 'annotationDeleted', id: string): void
  (e: 'textSelected', data: { selectedText: string; position: { x: number; y: number } }): void
  (e: 'selectionCleared'): void
}

/**
 * Composable for handling annotation interactions (selection, clicking, etc.)
 */
export const useAnnotationInteraction = (
  annotations: Ref<Annotation[]>,
  sectionRefs: {
    arabic: Ref<HTMLElement | null>
    transliteration: Ref<HTMLElement | null>
    translation: Ref<HTMLElement | null>
  },
  emit: AnnotationInteractionEmits
) => {
  const selectedText = ref('')
  const selectedSection = ref<'arabic' | 'transliteration' | 'translation' | null>(null)

  // Handle text selection
  const handleTextSelection = (event: MouseEvent) => {
    const selectionInfo = getTextSelection(event, {
      arabic: sectionRefs.arabic.value,
      transliteration: sectionRefs.transliteration.value,
      translation: sectionRefs.translation.value,
    })

    if (selectionInfo) {
      selectedText.value = selectionInfo.text
      selectedSection.value = selectionInfo.section
      emit('textSelected', {
        selectedText: selectionInfo.text,
        position: selectionInfo.position,
      })
    } else {
      clearSelectionState()
    }
  }

  // Clear selection state
  const clearSelectionState = () => {
    selectedText.value = ''
    selectedSection.value = null
    emit('selectionCleared')
  }

  // Handle clicks outside text areas
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    const isClickInside =
      sectionRefs.arabic.value?.contains(target) ||
      sectionRefs.transliteration.value?.contains(target) ||
      sectionRefs.translation.value?.contains(target)

    if (!isClickInside) {
      clearSelection()
      clearSelectionState()
    }
  }

  // Set up annotation click listeners
  const setupAnnotationClickListeners = () => {
    setTimeout(() => {
      const highlights = document.querySelectorAll('.annotation-highlight')

      for (const highlight of highlights) {
        highlight.addEventListener('click', (event: Event) => {
          const annotationId = (event.currentTarget as HTMLElement).dataset.annotationId
          if (annotationId) {
            const annotation = annotations.value.find(a => a.id === annotationId)
            if (annotation) {
              // Emit custom event that parent can handle
              const customEvent = new CustomEvent('annotation-clicked', {
                detail: { annotation },
              })
              highlight.dispatchEvent(customEvent)
            }
          }
        })
      }
    }, 100)
  }

  // Watch for annotation changes to update click listeners
  watch(annotations, setupAnnotationClickListeners, { immediate: true })

  // Create annotation from current selection
  const createAnnotationFromSelection = () => {
    if (selectedText.value && selectedSection.value) {
      // Return selection data for parent to handle
      return {
        selectedText: selectedText.value,
        selectedSection: selectedSection.value,
      }
    }
    return null
  }

  // Lifecycle
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })

  return {
    selectedText,
    selectedSection,
    handleTextSelection,
    clearSelectionState,
    createAnnotationFromSelection,
  }
}
