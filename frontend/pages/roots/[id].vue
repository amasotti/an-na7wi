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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import BaseButton from '~/components/common/BaseButton.vue'
import EditRootModal from '~/components/roots/EditRootModal.vue'
import RootDetailHeader from '~/components/roots/RootDetailHeader.vue'
import RootWordsList from '~/components/roots/RootWordsList.vue'
import { useRootStore } from '~/stores/rootStore'
import type { Root } from '~/types'

const route = useRoute()
const rootStore = useRootStore()

const showEditModal = ref(false)

const loadRootData = async (rootId: string) => {
  if (rootId) {
    rootStore.clearError()
    await rootStore.fetchRootWithWords(rootId)
  }
}

const handleRootUpdated = async (updatedRoot: Root) => {
  try {
    await rootStore.updateRoot(updatedRoot.id, updatedRoot.displayForm, updatedRoot.meaning)
    // Refresh the root data to get updated info including word associations
    const id = route.params.id as string
    if (id) {
      await loadRootData(id)
    }
  } catch (error) {
    console.error('Error handling root update:', error)
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
</script>