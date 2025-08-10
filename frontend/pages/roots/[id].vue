<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Loading State -->
      <LoadingEffect v-if="rootStore.loading" />

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
        <BaseBreadcrumb
          :parent-link="'/roots'"
          :parent-text="'Roots'"
          :separator="'/'"
          :item="rootStore.currentRootWithWords.root.displayForm"
        />

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
      <BaseEmptyState
        v-else
        link="/roots"
        link-text="Go Back to Roots"
        message="No root data available"
      />
    </div>

    <!-- Edit Root Modal -->
    <RootModal
      :open="showEditModal"
      :root="rootStore.currentRootWithWords?.root || null"
      @close="showEditModal = false"
      @root-updated="handleRootUpdated"
    />

    <!-- Add Word Modal -->
    <WordForm
      :open="showWordModal"
      :loading="wordFormLoading"
      :word="wordToEdit"
      @close="handleWordModalClose"
      @submit="handleWordSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import BaseBreadcrumb from '~/components/common/BaseBreadcrumb.vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseEmptyState from '~/components/common/BaseEmptyState.vue'
import LoadingEffect from '~/components/common/LoadingEffect.vue'
import RootDetailHeader from '~/components/roots/RootDetailHeader.vue'
import RootModal from '~/components/roots/RootModal.vue'
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
