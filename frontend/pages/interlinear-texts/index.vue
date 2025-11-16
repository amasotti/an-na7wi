<template>
  <main class="interlinear-texts animate-fade-in page-container-index">
    <!-- Header -->
    <InterlinearTextHeader
      title="Interlinear Texts"
      subtitle="Create and explore Arabic texts with word-by-word translations"
      @show-create-modal="createText"
    />

    <!-- Results Header -->
    <div v-if="texts && texts.length > 0" class="mb-6 flex items-center justify-between">
      <p class="text-gray-600 dark:text-gray-400">
        Showing {{ texts.length }} of {{ totalCount }} texts
      </p>
    </div>

    <!-- Text Grid -->
    <div v-if="texts && texts.length > 0" class="grid-responsive-3">
      <InterlinearTextCard
        v-for="text in texts"
        :key="text.id"
        :text="text"
        @view="viewText"
        @edit="editText"
        @delete="deleteTextConfirm"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!loading && texts"
      class="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        No interlinear texts yet
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Create your first interlinear text to start learning with word-aligned translations
      </p>
      <button
        type="button"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        @click="createText"
      >
        Create Interlinear Text
      </button>
    </div>

    <!-- Loading State -->
    <LoadingEffect v-if="loading" />

    <!-- Pagination -->
    <div v-if="totalCount > pageSize" class="mt-12 flex justify-center">
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
    </div>

    <!-- Delete Confirmation Modal -->
    <InterlinearTextDeleteModal
      v-if="textToDelete"
      :open="showDeleteModal"
      :loading="deleteLoading"
      :text="textToDelete"
      @close="closeDeleteModal"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { InterlinearText } from '@/types'
import Pagination from '~/components/common/Pagination.vue'
import InterlinearTextCard from '~/components/interlinear/InterlinearTextCard.vue'
import InterlinearTextDeleteModal from '~/components/interlinear/InterlinearTextDeleteModal.vue'
import InterlinearTextHeader from '~/components/interlinear/InterlinearTextHeader.vue'
import { useInterlinearStore } from '~/stores/interlinearStore'
import LoadingEffect from "~/components/common/LoadingEffect.vue";

const interlinearStore = useInterlinearStore()
const showDeleteModal = ref(false)
const deleteLoading = ref(false)
const textToDelete = ref<InterlinearText | null>(null)

// Computed properties from store
const texts = computed(() => interlinearStore.texts)
const loading = computed(() => interlinearStore.loading)
const totalCount = computed(() => interlinearStore.totalCount)
const currentPage = computed(() => interlinearStore.currentPage)
const pageSize = computed(() => interlinearStore.pageSize)

// Computed
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))

// Methods
const handlePageChange = (page: number) => {
  interlinearStore.setPage(page)
  interlinearStore.fetchTexts()
}

const viewText = (textId: string) => {
  navigateTo(`/interlinear-texts/${textId}`)
}

const editText = (textId: string) => {
  navigateTo(`/interlinear-texts/${textId}/edit-metadata`)
}

const createText = () => {
  interlinearStore.openNewTextPage()
}

const deleteTextConfirm = (textId: string) => {
  const text = texts.value.find(t => t.id === textId)
  if (text) {
    textToDelete.value = text
    showDeleteModal.value = true
  }
}



const closeDeleteModal = () => {
  showDeleteModal.value = false
  textToDelete.value = null
}

// Lifecycle
onMounted(() => {
  interlinearStore.fetchTexts()
})
</script>
