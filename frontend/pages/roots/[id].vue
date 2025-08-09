<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Loading State -->
      <div v-if="rootStore.loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
        <span class="ml-3 text-gray-600">Loading root details...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="rootStore.error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 class="text-red-800 font-medium mb-2">Error Loading Root</h3>
          <p class="text-red-600 text-sm">{{ rootStore.error }}</p>
          <BaseButton @click="loadRootData" variant="outline" size="sm" class="mt-4">
            Try Again
          </BaseButton>
        </div>
      </div>

      <!-- Root Content -->
      <div v-else-if="rootStore.currentRootWithWords" class="space-y-8">
        <!-- Navigation Breadcrumb -->
        <nav class="flex items-center space-x-2 text-sm text-gray-600">
          <NuxtLink to="/roots" class="hover:text-primary-600 transition-colors">
            Roots
          </NuxtLink>
          <span>/</span>
          <span class="text-gray-900 font-medium">
            {{ rootStore.currentRootWithWords.root.displayForm }}
          </span>
        </nav>

        <!-- Root Header -->
        <RootDetailHeader 
          :root="rootStore.currentRootWithWords.root" 
          @edit="showEditModal = true"
          @add-word="showWordModal = true"
        />

        <!-- Root Words -->
        <RootWordsList 
          :words="rootStore.currentRootWithWords.words"
          :root-display="rootStore.currentRootWithWords.root.displayForm"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="text-gray-400 text-lg">Root not found</div>
        <NuxtLink 
          to="/roots" 
          class="inline-block mt-4 text-primary-600 hover:text-primary-700 transition-colors"
        >
          ← Back to Roots
        </NuxtLink>
      </div>
    </div>

    <!-- Edit Root Modal -->
    <EditRootModal
      :show="showEditModal"
      :root="rootStore.currentRootWithWords?.root || null"
      @close="showEditModal = false"
      @root-updated="handleRootUpdated"
    />

    <!-- Add Word Modal -->
    <WordForm
      :open="showWordModal"
      :loading="wordFormLoading"
      :word="wordToEdit"
      :difficulty-options="difficultyOptions"
      :dialect-options="dialectOptions"
      :mastery-level-options="masteryLevelOptions"
      :parts-of-speech-options="partsOfSpeechOptions"
      @close="handleWordModalClose"
      @submit="handleWordSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { Dialect, Difficulty, MasteryLevel, PartOfSpeech } from '@/types/enums'
import { onMounted, ref, watch } from 'vue'
import BaseButton from '~/components/common/BaseButton.vue'
import EditRootModal from '~/components/roots/EditRootModal.vue'
import RootDetailHeader from '~/components/roots/RootDetailHeader.vue'
import RootWordsList from '~/components/roots/RootWordsList.vue'
import WordForm from '~/components/vocabulary/WordForm.vue'
import { wordService } from '~/composables/wordService'
import { useRootStore } from '~/stores/rootStore'
import type { Root, Word } from '~/types'

const route = useRoute()
const rootStore = useRootStore()

const showEditModal = ref(false)
const showWordModal = ref(false)
const wordFormLoading = ref(false)
const wordToEdit = ref<Word | null>(null)

// Form options for word modal
const difficultyOptions = [
  { label: 'Beginner', value: Difficulty.BEGINNER },
  { label: 'Intermediate', value: Difficulty.INTERMEDIATE },
  { label: 'Advanced', value: Difficulty.ADVANCED },
]

const dialectOptions = [
  { label: 'Modern Standard Arabic', value: Dialect.MSA },
  { label: 'Egyptian', value: Dialect.EGYPTIAN },
  { label: 'Levantine', value: Dialect.LEVANTINE },
  { label: 'Gulf', value: Dialect.GULF },
  { label: 'Moroccan', value: Dialect.MOROCCAN },
  { label: 'Iraqi', value: Dialect.IRAQI },
]

const masteryLevelOptions = [
  { label: 'New', value: MasteryLevel.NEW },
  { label: 'Learning', value: MasteryLevel.LEARNING },
  { label: 'Known', value: MasteryLevel.KNOWN },
  { label: 'Mastered', value: MasteryLevel.MASTERED },
]

const partsOfSpeechOptions = [
  { label: 'Noun', value: PartOfSpeech.NOUN },
  { label: 'Verb', value: PartOfSpeech.VERB },
  { label: 'Adjective', value: PartOfSpeech.ADJECTIVE },
  { label: 'Adverb', value: PartOfSpeech.ADVERB },
  { label: 'Preposition', value: PartOfSpeech.PREPOSITION },
  { label: 'Pronoun', value: PartOfSpeech.PRONOUN },
  { label: 'Conjunction', value: PartOfSpeech.CONJUNCTION },
  { label: 'Interjection', value: PartOfSpeech.INTERJECTION },
  { label: 'Particle', value: PartOfSpeech.PARTICLE },
  { label: 'Unknown', value: PartOfSpeech.UNKNOWN },
]

const loadRootData = async (rootId: string) => {
  if (rootId) {
    rootStore.clearError()
    await rootStore.fetchRootWithWords(rootId)
  }
}

const handleRootUpdated = async (updatedRoot: Root) => {
  try {
    await rootStore.updateRoot(
      updatedRoot.id,
      updatedRoot.displayForm,
      updatedRoot.meaning,
      updatedRoot.analysis
    )
    // Refresh the root data to get updated info including word associations
    const id = route.params.id as string
    if (id) {
      await loadRootData(id)
    }
  } catch (error) {
    console.error('Error handling root update:', error)
  }
}

const handleWordModalClose = () => {
  showWordModal.value = false
  wordToEdit.value = null
}

const handleWordSubmit = async (formData: Partial<Word>) => {
  if (!rootStore.currentRootWithWords?.root) return

  wordFormLoading.value = true
  try {
    // Set the root for the new word
    const wordData = {
      ...formData,
      root: rootStore.currentRootWithWords.root.displayForm,
    }

    await wordService.createWord(wordData)

    // Refresh the root data to show the new word
    const id = route.params.id as string
    if (id) {
      await loadRootData(id)
    }

    handleWordModalClose()
  } catch (error) {
    console.error('Error creating word:', error)
  } finally {
    wordFormLoading.value = false
  }
}

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    loadRootData(id)
  }
})

watch(
  () => route.params.id,
  newId => {
    if (newId && typeof newId === 'string') {
      loadRootData(newId)
    }
  }
)

// Reset word modal when opening
watch(
  () => showWordModal.value,
  isOpen => {
    if (isOpen && rootStore.currentRootWithWords?.root) {
      // Create a partial word with the root pre-filled
      wordToEdit.value = {
        root: rootStore.currentRootWithWords.root.displayForm,
      } as Word
    } else if (!isOpen) {
      wordToEdit.value = null
    }
  }
)
</script>