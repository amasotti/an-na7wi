<template>
  <div class="animate-fade-in">
    <!-- Loading State -->
    <LoadingEffect v-if="loading" />

    <!-- Error State -->
    <BaseErrorState
      v-else-if="error"
      message="Text Not Found"
      :error="error"
    />

    <!-- Text Content -->
    <main v-else-if="currentText" class="page-container-detail">
      <!-- Header -->
      <header class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <router-link to="/texts" class="text-primary-600 hover:text-primary-700 font-medium flex items-center">
            <BaseIcon size="sm" class="mr-2">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </BaseIcon>
            Back to Texts
          </router-link>
          
          <div class="flex items-center gap-2">
            <!-- Edit Button (only for current version) -->
            <EditButton 
              v-if="isViewingCurrentVersion" 
              @click="editText"
            />

            <DeleteButton @click="deleteText" />

            <BaseButton variant="outline" size="sm" @click="toggleAnnotations">
              <BaseIcon size="sm" class="mr-2">
                <path fill="none"  stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </BaseIcon>
              {{ showAnnotations ? 'Hide' : 'Show' }} Annotations
            </BaseButton>

            <BaseButton variant="primary" size="sm" @click="addNewWord">
              <BaseIcon size="sm" class="mr-2">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </BaseIcon>
              Add Word
            </BaseButton>
          </div>
        </div>

        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ displayText?.title || 'Untitled' }}</h1>
        
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <BaseBadge :variant="difficultyColor" size="sm">
              {{ currentText.difficulty }}
            </BaseBadge>
            <BaseBadge variant="neutral" size="sm">
              {{ dialectLabel }}
            </BaseBadge>
          </div>
          
          <div class="flex items-center">
            <BaseIcon size="xs" class="mr-1">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </BaseIcon>
            {{ currentText.wordCount }} words
          </div>
          
          <span>Updated {{ formattedDate }}</span>
        </div>

        <!-- Tags -->
        <div v-if="currentText.tags && currentText.tags.length > 0" class="flex flex-wrap gap-2 mt-4">
          <BaseBadge
            v-for="tag in currentText.tags"
            :key="tag"
            variant="neutral"
            size="sm"
          >
            {{ tag }}
          </BaseBadge>
        </div>
      </header>

      <!-- Main Content Layout -->
      <section class="content-grid-detail-text">
        <!-- Text Content (4/6 width on 2xl screens, 3/5 width on xl screens) -->
        <section class="content-text-main">
          <!-- Annotated Text Content -->
          <AnnotatedTextContent
            ref="annotatedTextRef"
            :displayText="displayText"
            :annotations="annotations"
            :loading="loading"
            @annotation-created="handleAnnotationCreated"
            @annotation-updated="handleAnnotationUpdated"
            @annotation-deleted="handleAnnotationDeleted"
            @text-selected="handleTextSelected"
            @selection-cleared="handleSelectionCleared"
          />

          <!-- Tokenized Words (only show in view mode) -->
          <TextTokenizedWords
            v-if="isViewingCurrentVersion"
            :words="tokenizedWords"
            :loading="tokenizedWordsLoading"
            :total-count="tokenizedWordsTotalCount"
            :current-page="tokenizedWordsCurrentPage"
            :page-size="tokenizedWordsPageSize"
            @page-change="handleTokenizedWordsPageChange"
          />

          <!-- Version Manager -->
          <TextVersionManager
            v-if="textVersions.length > 0"
            :versions="textVersions"
            :selectedVersion="selectedVersion"
            :isViewingCurrentVersion="isViewingCurrentVersion"
            @select-version="selectVersion"
            @restore-version="restoreVersion"
          />
        </section>

        <!-- Annotations Panel (2/6 width on 2xl screens, 2/5 width on xl screens) -->
        <div v-if="showAnnotations" class="content-text-side">
          <AnnotationPanel
            :annotations="annotations"
            @create-annotation="createNewAnnotation"
            @edit-annotation="editAnnotation"
          />
        </div>
      </section>
    </main>

    <!-- Text Edit Modal -->
    <TextModal
      :open="showEditModal"
      :loading="loading"
      :text="currentText"
      @close="closeEditModal"
      @submit="handleEditText"
    />

    <!-- Text Delete Modal -->
    <TextDeleteModal
      :open="showDeleteModal"
      :loading="loading"
      :text="currentText"
      @close="closeDeleteModal"
      @confirm="handleDeleteText"
    />

    <!-- Annotation Modal -->
    <AnnotationForm
      :open="showAnnotationModal"
      :annotation="editingAnnotation"
      :selected-text="currentSelectedText"
      :loading="loading"
      @close="closeAnnotationModal"
      @submit="handleAnnotationSubmit"
      @delete="deleteAnnotation"
    />

    <!-- Word Form Modal -->
    <WordForm
      :open="showWordModal"
      :loading="wordLoading"
      :word="wordForForm"
      @close="closeWordModal"
      @submit="handleWordSubmit"
    />

    <!-- Selection Toolbar (outside all containers for absolute positioning) -->
    <section
      v-if="showSelectionToolbar" 
      class="fixed bg-white shadow-lg border border-gray-200 rounded-lg p-2 z-[9999] flex items-center space-x-2"
      :style="selectionToolbarStyle"
    >
      <BaseButton size="sm" @click="createAnnotationFromSelection">
        <BaseIcon size="sm" class="mr-1">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 01-2 2h-3l-4 4z" />
        </BaseIcon>
        Annotate
      </BaseButton>
      <BaseButton size="sm" @click="addWordFromSelection">
        <BaseIcon size="sm" class="mr-1">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </BaseIcon>
        Add Word
      </BaseButton>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AnnotationForm from '~/components/annotation/AnnotationForm.vue'
import AnnotationPanel from '~/components/annotation/AnnotationPanel.vue'
import BaseBadge from '~/components/common/BaseBadge.vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseErrorState from '~/components/common/BaseErrorState.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import LoadingEffect from '~/components/common/LoadingEffect.vue'
import AnnotatedTextContent from '~/components/text/AnnotatedTextContent.vue'
import TextDeleteModal from '~/components/text/TextDeleteModal.vue'
import TextModal from '~/components/text/TextModal.vue'
import TextTokenizedWords from '~/components/text/TextTokenizedWords.vue'
import TextVersionManager from '~/components/text/TextVersionManager.vue'
import WordForm from '~/components/vocabulary/WordForm.vue'
import type { CreateAnnotationRequest } from '~/composables/annotationService'
import { useTextStore } from '~/stores/textStore'
import { useWordStore } from '~/stores/wordStore'
import type { Annotation, BadgeVariant, Word } from '~/types'
import { Dialect, Difficulty } from '~/types'

const route = useRoute()
const textStore = useTextStore()
const wordStore = useWordStore()

// Local state
const showAnnotations = ref(true)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showAnnotationModal = ref(false)
const editingAnnotation = ref<Annotation | undefined>(undefined)

// Word modal state
const showWordModal = ref(false)
const wordLoading = ref(false)
const editingWord = ref<Word | null>(null)

// Selection toolbar state
const showSelectionToolbar = ref(false)
const selectionToolbarPosition = ref({ x: 0, y: 0 })
const currentSelectedText = ref('')
// biome-ignore lint/suspicious/noExplicitAny: Allow any type for this expose to access the component instance
const annotatedTextRef = ref<any>(null)

// Computed properties from store
const currentText = computed(() => textStore.currentText)
const annotations = computed(() => textStore.annotations)
const loading = computed(() => textStore.loading)
const error = computed(() => textStore.error)
const textVersions = computed(() => textStore.textVersions)
const selectedVersion = computed(() => textStore.selectedVersion)
const isViewingCurrentVersion = computed(() => textStore.isViewingCurrentVersion)
const tokenizedWords = computed(() => textStore.tokenizedWords)
const tokenizedWordsLoading = computed(() => textStore.tokenizedWordsLoading)
const tokenizedWordsTotalCount = computed(() => textStore.tokenizedWordsTotalCount)
const tokenizedWordsCurrentPage = computed(() => textStore.tokenizedWordsCurrentPage)
const tokenizedWordsPageSize = computed(() => textStore.tokenizedWordsPageSize)

// Display the current text or selected version
const displayText = computed(() => textStore.displayText)

// Computed UI properties
const difficultyColor = computed(() => {
  if (!currentText.value) return 'neutral'
  const colors = {
    [Difficulty.BEGINNER]: 'success',
    [Difficulty.INTERMEDIATE]: 'warning',
    [Difficulty.ADVANCED]: 'error',
  }
  return colors[currentText.value.difficulty] as BadgeVariant
})

const dialectLabel = computed(() => {
  if (!currentText.value) return ''
  const labels = {
    [Dialect.TUNISIAN]: 'Tunisian',
    [Dialect.MOROCCAN]: 'Moroccan',
    [Dialect.EGYPTIAN]: 'Egyptian',
    [Dialect.LEVANTINE]: 'Levantine',
    [Dialect.GULF]: 'Gulf',
    [Dialect.IRAQI]: 'Iraqi',
    [Dialect.MSA]: 'MSA',
  }
  return labels[currentText.value.dialect]
})

const formattedDate = computed(() => {
  if (!currentText.value) return ''
  return new Date(currentText.value.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
})

// Word for form - pre-fills with selected text if available and Arabic
const wordForForm = computed(() => {
  if (editingWord.value) {
    return editingWord.value
  }

  // If we have selected Arabic text, create a partial word object
  if (currentSelectedText.value && /[\u0600-\u06FF]/.test(currentSelectedText.value)) {
    return {
      arabic: currentSelectedText.value.trim(),
    } as Word
  }

  return null
})

// Computed style for selection toolbar
const selectionToolbarStyle = computed(() => {
  const toolbarHeight = 50 // Approximate toolbar height
  const toolbarWidth = 120 // Approximate toolbar width
  const padding = 10

  let { x, y } = selectionToolbarPosition.value

  // Ensure toolbar doesn't go off-screen horizontally
  const maxX = window.innerWidth - toolbarWidth - padding
  const minX = toolbarWidth / 2 + padding
  x = Math.max(minX, Math.min(maxX, x))

  // Ensure toolbar doesn't go off-screen vertically
  // If selection is too close to top, show below instead of above
  if (y - toolbarHeight - padding < 0) {
    y = y + 30 // Show below selection
    return {
      top: `${y}px`,
      left: `${x}px`,
      transform: 'translate(-50%, 0)',
    }
  }
  // Show above selection
  return {
    top: `${y}px`,
    left: `${x}px`,
    transform: 'translate(-50%, -100%)',
  }
})

// Methods
const toggleAnnotations = () => {
  showAnnotations.value = !showAnnotations.value
}

// Version methods
const selectVersion = async (versionNumber: number) => {
  if (!currentText.value) return

  await textStore.selectTextVersion(currentText.value.id, versionNumber)
}

const restoreVersion = async () => {
  if (!currentText.value || !selectedVersion.value) return

  try {
    await textStore.restoreTextVersion(currentText.value.id, selectedVersion.value.versionNumber)
  } catch (error) {
    console.error('Failed to restore version:', error)
  }
}

const editText = () => {
  showEditModal.value = true
}

const deleteText = () => {
  showDeleteModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

const handleEditText = async (formData: {
  title: string
  arabicContent: string
  transliteration?: string
  translation?: string
  comments?: string
  tags: string[]
  difficulty: Difficulty
  dialect: Dialect
}) => {
  if (!currentText.value) return

  try {
    await textStore.updateText(currentText.value.id, formData)
    closeEditModal()
    // Refresh the current text
    await textStore.fetchTextById(route.params.id as string)
  } catch (error) {
    console.error('Failed to update text:', error)
  }
}

const handleDeleteText = async () => {
  if (!currentText.value) return

  try {
    await textStore.deleteText(currentText.value.id)
    closeDeleteModal()
    // Navigate back to texts list after deletion
    window.location.href = '/texts'
  } catch (error) {
    console.error('Failed to delete text:', error)
  }
}

// Annotation methods
const createNewAnnotation = () => {
  editingAnnotation.value = undefined
  showAnnotationModal.value = true
}

const editAnnotation = (annotation: Annotation) => {
  editingAnnotation.value = annotation
  showAnnotationModal.value = true
}

const deleteAnnotation = async (id: string) => {
  try {
    await textStore.deleteAnnotation(id)
  } catch (error) {
    console.error('Failed to delete annotation:', error)
  }
}

const closeAnnotationModal = () => {
  showAnnotationModal.value = false
  editingAnnotation.value = undefined
}

const handleAnnotationSubmit = async (data: CreateAnnotationRequest) => {
  if (!currentText.value) return

  try {
    if (editingAnnotation.value) {
      // Update existing annotation
      await textStore.updateAnnotation(editingAnnotation.value.id, data)
    } else {
      // Create new annotation
      await textStore.createAnnotation(currentText.value.id, data)
    }

    // Close the form
    closeAnnotationModal()
  } catch (error) {
    console.error('Failed to save annotation:', error)
  }
}

// Selection toolbar handlers
const handleTextSelected = (data: { selectedText: string; position: { x: number; y: number } }) => {
  selectionToolbarPosition.value = data.position
  currentSelectedText.value = data.selectedText
  showSelectionToolbar.value = true
}

const handleSelectionCleared = () => {
  showSelectionToolbar.value = false
  currentSelectedText.value = ''
}

const createAnnotationFromSelection = () => {
  if (annotatedTextRef.value) {
    annotatedTextRef.value.createAnnotationFromSelection()
    showSelectionToolbar.value = false
  }
}

// Event handlers for annotation events from AnnotatedTextContent
const handleAnnotationCreated = (annotation: Annotation) => {
  // The annotation is already added to the store, so we don't need to do anything here
  console.log('Annotation created:', annotation)
}

const handleAnnotationUpdated = (annotation: Annotation) => {
  // The annotation is already updated in the store, so we don't need to do anything here
  console.log('Annotation updated:', annotation)
}

const handleAnnotationDeleted = (id: string) => {
  // The annotation is already deleted from the store, so we don't need to do anything here
  console.log('Annotation deleted:', id)
}

// Tokenized words methods
const handleTokenizedWordsPageChange = (page: number) => {
  if (currentText.value) {
    textStore.fetchTokenizedWords(currentText.value.id, page)
  }
}

// Word form methods
const addNewWord = () => {
  editingWord.value = null
  showWordModal.value = true
}

const addWordFromSelection = () => {
  editingWord.value = null
  // Pre-fill with selected text if it's Arabic
  if (currentSelectedText.value) {
    // We'll set the Arabic field in the form when the modal opens
    showWordModal.value = true
  } else {
    showWordModal.value = true
  }
  showSelectionToolbar.value = false
}

const closeWordModal = () => {
  showWordModal.value = false
  editingWord.value = null
}

const handleWordSubmit = async (formData: Partial<Word>) => {
  wordLoading.value = true
  try {
    if (editingWord.value) {
      // Update existing word
      await wordStore.updateWord(editingWord.value.id!, formData)
    } else {
      // Create new word
      await wordStore.createWord(formData)
    }
    closeWordModal()
    // Clear the selection after successful creation
    currentSelectedText.value = ''
  } catch (error) {
    console.error('Failed to save word:', error)
  } finally {
    wordLoading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  try {
    const id = route.params.id as string
    if (id) {
      await textStore.fetchTextById(id)
      // Fetch tokenized words after text is loaded
      if (currentText.value) {
        await textStore.fetchTokenizedWords(currentText.value.id)
      }
    }
  } catch (err) {
    console.error('Failed to load text:', err)
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
