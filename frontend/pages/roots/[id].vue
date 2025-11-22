<template>
  <LoadingEffect v-if="rootStore.loading" />

  <main v-else-if="rootStore.currentRootWithWords" class="page-container-detail">

    <header class="mb-6">
      <BaseBreadcrumb
        :parent-link="'/roots'"
        :parent-text="'Roots'"
        :separator="'/'"
        :item="rootStore.currentRootWithWords.root.displayForm"
      />
    </header>

    <!-- Hero Section with Root Info -->
    <RootDetailHeader 
      @edit="showEditModal = true"
      @add-word="showWordModal = true"
      @delete="showDeleteModal = true"
    />

    <!-- Content Grid -->
    <div class="content-grid-detail-3col">
      <!-- Left Column: Root Analysis -->
      <div class="content-main-column-3col">
        <RootAnalysis 
          v-if="rootStore.currentRootWithWords.root.analysis" 
        />
      </div>

      <!-- Right Column: Related Words -->
      <section class="content-side-column">
        <RootWordsList />
      </section>
    </div>

    <section>
      <h2 class="text-xl font-semibold text-gray-900">
        Linguistic Analysis
      </h2>
      <RootsRootMap />
    </section>

  </main>

  <footer v-else>
    <BaseEmptyState
      link="/roots"
      link-text="Go Back to Roots"
      message="No root data available"
    />
  </footer>

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

  <!-- Root Delete Modal -->
  <RootDeleteModal
    :open="showDeleteModal"
    :loading="deleteLoading"
    :root="rootStore.currentRootWithWords?.root || null"
    @close="showDeleteModal = false"
    @confirm="handleDeleteRoot"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import BaseBreadcrumb from '~/components/common/BaseBreadcrumb.vue'
import BaseEmptyState from '~/components/common/BaseEmptyState.vue'
import LoadingEffect from '~/components/common/LoadingEffect.vue'
import RootAnalysis from '~/components/roots/RootAnalysis.vue'
import RootDeleteModal from '~/components/roots/RootDeleteModal.vue'
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
const showDeleteModal = ref(false)
const wordFormLoading = ref(false)
const deleteLoading = ref(false)
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

const handleDeleteRoot = async () => {
  if (!rootStore.currentRootWithWords?.root) return

  deleteLoading.value = true
  try {
    await rootStore.deleteRoot(rootStore.currentRootWithWords.root.id)
    showDeleteModal.value = false
    navigateTo('/roots')
  } catch (error) {
    console.error('Error deleting root:', error)
  } finally {
    deleteLoading.value = false
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
  (newId, oldId) => {
    if (typeof newId !== 'string') return
    if (newId && newId !== oldId) {
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
