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
            <!-- Version Selector PoC -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">Version:</label>
              <select 
                v-model="selectedVersion" 
                @change="loadVersion"
                class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option v-for="version in versions" :key="version.versionNumber" :value="version.versionNumber">
                  v{{ version.versionNumber }} ({{ formatVersionDate(version.createdAt) }})
                </option>
              </select>
              <BaseButton v-if="viewingVersion" variant="outline" size="sm" @click="restoreVersion">
                <BaseIcon size="sm" class="mr-1">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </BaseIcon>
                Restore
              </BaseButton>
            </div>
            
            <BaseButton variant="outline" size="sm" @click="toggleAnnotations">
              <BaseIcon size="sm" class="mr-2">
                <path fill="none"  stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </BaseIcon>
              {{ showAnnotations ? 'Hide' : 'Show' }} Annotations
            </BaseButton>
            
            <BaseButton variant="outline" size="sm" @click="analyzeText">
              <BaseIcon size="sm" class="mr-2">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </BaseIcon>
              Analyze
            </BaseButton>
          </div>
        </div>

        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ displayText.title }}</h1>
        
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
        <div v-if="currentText.tags.length > 0" class="flex flex-wrap gap-2 mt-4">
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
                {{ displayText.arabicContent }}
              </div>
            </div>

            <!-- Transliteration -->
            <div v-if="displayText.transliteration">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Transliteration</h2>
              <div class="text-lg leading-relaxed text-gray-700 italic bg-blue-50 p-6 rounded-lg">
                {{ displayText.transliteration }}
              </div>
            </div>

            <!-- Translation -->
            <div v-if="displayText.translation">
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseBadge from '../components/common/BaseBadge.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseIcon from '../components/common/BaseIcon.vue'
import { useTextStore } from '../stores/textStore'
import { Dialect, Difficulty } from '@/types'
import type { BadgeVariant } from '@/types'

interface Props {
  id: string
}

const props = defineProps<Props>()
const textStore = useTextStore()

// Local state
const showAnnotations = ref(true)
const selectedVersion = ref<number>(1)

// Computed properties from store
const currentText = computed(() => textStore.currentText)
const annotations = computed(() => textStore.annotations)
const versions = computed(() => textStore.versions)
const viewingVersion = computed(() => textStore.viewingVersion)
const loading = computed(() => textStore.loading)
const error = computed(() => textStore.error)

// Display the current text or selected version
const displayText = computed(() => {
  return viewingVersion.value || currentText.value
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

const analyzeText = async () => {
  if (currentText.value) {
    try {
      await textStore.analyzeText(currentText.value.id)
      // Optionally show success message
    } catch (err) {
      console.error('Failed to analyze text:', err)
    }
  }
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

const formatVersionDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const loadVersions = async () => {
  if (!currentText.value) return

  try {
    await textStore.fetchTextVersions(currentText.value.id)
    // Set selected version to the latest version number
    const latestVersion =
      versions.value.length > 0 ? Math.max(...versions.value.map(v => v.versionNumber)) : 1
    selectedVersion.value = latestVersion
  } catch (err) {
    console.error('Failed to load versions:', err)
  }
}

const loadVersion = async () => {
  if (!currentText.value) return

  // Check if selected version is the current/latest version
  const latestVersion =
    versions.value.length > 0 ? Math.max(...versions.value.map(v => v.versionNumber)) : 1
  if (selectedVersion.value === latestVersion) {
    textStore.clearVersionData()
    return
  }

  try {
    await textStore.fetchTextVersion(currentText.value.id, selectedVersion.value)
  } catch (err) {
    console.error('Failed to load version:', err)
  }
}

const restoreVersion = async () => {
  if (!currentText.value || !selectedVersion.value) return

  if (
    confirm(
      `Are you sure you want to restore version ${selectedVersion.value}? This will create a new version.`
    )
  ) {
    try {
      await textStore.restoreTextVersion(currentText.value.id, selectedVersion.value)
      // Reload versions and select the latest
      await loadVersions()
    } catch (err) {
      console.error('Failed to restore version:', err)
    }
  }
}

// Lifecycle
onMounted(async () => {
  await textStore.fetchTextById(props.id)
  await loadVersions()
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
