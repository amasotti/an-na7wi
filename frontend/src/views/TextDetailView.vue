<template>
  <div class="text-detail animate-fade-in">
    <!-- Loading State -->
    <div v-if="loading" class="max-w-6xl mx-auto px-4 py-8">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div class="h-4 bg-gray-300 rounded w-1/4 mb-8"></div>
        <div class="bg-white rounded-xl shadow-sm p-8">
          <div class="h-6 bg-gray-300 rounded w-full mb-4"></div>
          <div class="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div class="h-6 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-2xl mx-auto px-4 py-16 text-center">
      <BaseIcon size="xl" class="mx-auto mb-4 text-red-500">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </BaseIcon>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Text Not Found</h1>
      <p class="text-gray-600 mb-6">{{ error }}</p>
      <router-link to="/texts" class="text-primary-600 hover:text-primary-700 font-medium">
        ← Back to Texts
      </router-link>
    </div>

    <!-- Text Content -->
    <div v-else-if="currentText" class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <router-link to="/texts" class="text-primary-600 hover:text-primary-700 font-medium flex items-center">
            <BaseIcon size="sm" class="mr-2">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </BaseIcon>
            Back to Texts
          </router-link>
          
          <div class="flex items-center gap-2">
            <BaseButton variant="outline" size="sm" @click="editText">
              <BaseIcon size="sm" class="mr-2">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </BaseIcon>
              Edit
            </BaseButton>

            <BaseButton variant="outline" size="sm" @click="deleteText">
              <BaseIcon size="sm" class="mr-2">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </BaseIcon>
              Delete
            </BaseButton>

            <BaseButton variant="outline" size="sm" @click="toggleAnnotations">
              <BaseIcon size="sm" class="mr-2">
                <path fill="none"  stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </BaseIcon>
              {{ showAnnotations ? 'Hide' : 'Show' }} Annotations
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
      </div>

      <!-- Main Content Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Text Content (3/4 width on large screens) -->
        <BaseCard class="lg:col-span-3">
          <div class="space-y-8">
            <!-- Arabic Content -->
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Arabic Text</h2>
              <div 
                class="text-2xl leading-relaxed text-gray-900 font-arabic text-right bg-gray-50 p-6 rounded-lg"
                dir="rtl"
                lang="ar"
              >
                {{ displayText?.arabicContent || 'No content' }}
              </div>
            </div>

            <!-- Transliteration -->
            <div v-if="displayText?.transliteration">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Transliteration</h2>
              <div class="text-lg leading-relaxed text-gray-700 italic bg-blue-50 p-6 rounded-lg">
                {{ displayText.transliteration }}
              </div>
            </div>

            <!-- Translation -->
            <div v-if="displayText?.translation">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Translation</h2>
              <div class="text-lg leading-relaxed text-gray-800 bg-green-50 p-6 rounded-lg">
                {{ displayText.translation }}
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Annotations Panel (1/4 width on large screens) -->
        <div v-if="showAnnotations" class="lg:col-span-1">
          <BaseCard>
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Annotations</h2>
            
            <div v-if="annotations.length === 0" class="text-center py-8 text-gray-500">
              <BaseIcon size="lg" class="mx-auto mb-2">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </BaseIcon>
              <p>No annotations yet</p>
              <p class="text-sm mt-1">Annotations will appear here when available</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="annotation in annotations"
                :key="annotation.id"
                class="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div class="flex items-start justify-between mb-2">
                  <BaseBadge 
                    :variant="getAnnotationColor(annotation.type)"
                    size="sm"
                  >
                    {{ annotation.type }}
                  </BaseBadge>
                  <span class="text-xs text-gray-500">
                    {{ formatAnnotationDate(annotation.createdAt) }}
                  </span>
                </div>
                <p class="text-sm text-gray-700">{{ annotation.content }}</p>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>

    <!-- Text Edit Modal -->
    <TextEditModal
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
  </div>
</template>

<script setup lang="ts">
import type { BadgeVariant } from '@/types'
import { Dialect, Difficulty } from '@/types'
import { computed, onMounted, ref } from 'vue'
import BaseBadge from '../components/common/BaseBadge.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseIcon from '../components/common/BaseIcon.vue'
import TextDeleteModal from '../components/text/TextDeleteModal.vue'
import TextEditModal from '../components/text/TextEditModal.vue'
import { useTextStore } from '../stores/textStore'

interface Props {
  id: string
}

const props = defineProps<Props>()
const textStore = useTextStore()

// Local state
const showAnnotations = ref(true)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// Computed properties from store
const currentText = computed(() => textStore.currentText)
const annotations = computed(() => textStore.annotations)
const loading = computed(() => textStore.loading)
const error = computed(() => textStore.error)

// Display the current text
const displayText = computed(() => {
  return currentText.value
})

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

// Methods
const toggleAnnotations = () => {
  showAnnotations.value = !showAnnotations.value
}

const getAnnotationColor = (type: string): BadgeVariant => {
  const colors = {
    GRAMMAR: 'primary' as const,
    VOCABULARY: 'success' as const,
    CULTURAL: 'warning' as const,
    PRONUNCIATION: 'error' as const,
  }
  return colors[type as keyof typeof colors] || 'neutral'
}

const formatAnnotationDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
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
    await textStore.fetchTextById(props.id)
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

// Lifecycle
onMounted(async () => {
  try {
    await textStore.fetchTextById(props.id)
  } catch (err) {
    console.error('Failed to load text:', err)
  }
})
</script>

<style scoped>
.font-arabic {
  font-family: 'Noto Naskh Arabic', 'Arabic Typesetting', 'Times New Roman', serif;
}

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
