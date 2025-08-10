<template>
  <LoadingEffect v-if="rootStore.loading" />

  <main v-else-if="rootStore.currentRootWithWords" class="max-w-7xl mx-auto p-4 space-y-6">

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
    />

    <!-- Content Grid -->
    <div class="content-grid">
      <!-- Left Column: Root Analysis -->
      <div class="left-column">
        <RootAnalysis 
          v-if="rootStore.currentRootWithWords.root.analysis" 
        />
      </div>

      <!-- Right Column: Related Words -->
      <div class="right-column">
        <RootWordsList 
          :words="rootStore.currentRootWithWords.words"
          :root-display="rootStore.currentRootWithWords.root.displayForm"
        />
      </div>
    </div>

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
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import BaseBreadcrumb from '~/components/common/BaseBreadcrumb.vue'
import BaseEmptyState from '~/components/common/BaseEmptyState.vue'
import LoadingEffect from '~/components/common/LoadingEffect.vue'
import RootAnalysis from '~/components/roots/RootAnalysis.vue'
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

<style scoped>
.content-grid {
  @apply grid grid-cols-1 lg:grid-cols-3 gap-6;
}

.left-column {
  @apply lg:col-span-2 space-y-6;
}

.right-column {
  @apply lg:col-span-1 space-y-6;
}

@media (max-width: 1024px) {
  .content-grid {
    @apply grid-cols-1;
  }
  
  .left-column,
  .right-column {
    @apply col-span-1;
  }
}
</style>
