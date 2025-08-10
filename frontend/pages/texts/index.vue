<template>
  <div class="texts animate-fade-in">
    <!-- Header -->
    <TextHeader
      title="Arabic Texts"
      subtitle="Create, manage, and explore your Arabic learning materials"
      :view-mode="viewMode"
      @toggle-view-mode="toggleViewMode"
      @show-create-modal="showCreateModal = true"
    />

    <!-- Filters -->
    <TextFilters
      :search-query="searchQuery"
      :selected-dialect="selectedDialect"
      :selected-difficulty="selectedDifficulty"
      :active-tags="activeTags"
      :has-active-filters="hasActiveFilters"
      :dialect-options="dialectOptions"
      :difficulty-options="difficultyOptions"
      @update:search-query="setSearchQuery"
      @update:selected-dialect="setSelectedDialect"
      @update:selected-difficulty="setSelectedDifficulty"
      @remove-tag="removeTag"
      @clear-filters="clearFilters"
    />

    <!-- Results Header -->
    <TextListControls
      :texts="texts"
      :total-count="totalCount"
      :sort-by="sortBy"
      :sort-options="sortOptions"
      @update:sort-by="sortBy = $event"
    />

    <!-- Text Grid/List -->
    <div v-if="texts && texts.length > 0" :class="gridClasses">
      <TextCard
        v-for="text in texts"
        :key="text.id"
        :text="text"
        :view-mode="viewMode"
        @edit="editText"
        @delete="deleteTextConfirm"
      />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="!loading && texts"
      :has-filters="hasActiveFilters"
      @create="showCreateModal = true"
      @clear-filters="clearFilters"
    />

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TextCardSkeleton v-for="i in 6" :key="i" />
    </div>

    <!-- Pagination -->
    <div v-if="totalCount > pageSize" class="mt-12 flex justify-center">
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
    </div>

    <!-- Text Modal (unified create/edit) -->
    <TextModal
      :open="showCreateModal || showEditModal"
      :loading="loading"
      :text="textToEdit"
      @close="showCreateModal ? (showCreateModal = false) : closeEditModal()"
      @submit="handleTextSubmit"
    />

    <!-- Text Delete Modal -->
    <TextDeleteModal
      :open="showDeleteModal"
      :loading="loading"
      :text="textToDelete"
      @close="closeDeleteModal"
      @confirm="handleDeleteText"
    />
  </div>
</template>

<script setup lang="ts">
// import router from '@/router' // Not needed in Nuxt
import { Dialect, Difficulty } from '@/types'
import type { SelectOption, Text } from '@/types'
import { computed, onMounted, ref } from 'vue'
import Pagination from '~/components/common/Pagination.vue'
import EmptyState from '~/components/text/EmptyState.vue'
import TextCard from '~/components/text/TextCard.vue'
import TextCardSkeleton from '~/components/text/TextCardSkeleton.vue'
import TextDeleteModal from '~/components/text/TextDeleteModal.vue'
import TextFilters from '~/components/text/TextFilters.vue'
import TextHeader from '~/components/text/TextHeader.vue'
import TextListControls from '~/components/text/TextListControls.vue'
import TextModal from '~/components/text/TextModal.vue'
import { useTextStore } from '~/stores/textStore'
import { layoutClasses } from '~/styles/component-classes'

const textStore = useTextStore()
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const textToEdit = ref<Text | null>(null)
const textToDelete = ref<Text | null>(null)
const viewMode = ref<'grid' | 'list'>('grid')

// Computed properties from store
const texts = computed(() => textStore.texts)
const loading = computed(() => textStore.loading)
const totalCount = computed(() => textStore.totalCount)
const currentPage = computed(() => textStore.currentPage)
const pageSize = computed(() => textStore.pageSize)
const searchQuery = computed(() => textStore.searchQuery)
const selectedDialect = computed(() => textStore.selectedDialect)
const selectedDifficulty = computed(() => textStore.selectedDifficulty)

// Local state
const sortBy = ref('updatedAt')
const activeTags = ref<string[]>([])

// Options
const dialectOptions: SelectOption<Dialect>[] = [
  { value: Dialect.TUNISIAN, label: 'Tunisian' },
  { value: Dialect.MOROCCAN, label: 'Moroccan' },
  { value: Dialect.EGYPTIAN, label: 'Egyptian' },
  { value: Dialect.LEVANTINE, label: 'Levantine' },
  { value: Dialect.GULF, label: 'Gulf' },
  { value: Dialect.IRAQI, label: 'Iraqi' },
  { value: Dialect.MSA, label: 'Modern Standard Arabic' },
]

const difficultyOptions: SelectOption<Difficulty>[] = [
  { value: Difficulty.BEGINNER, label: 'Beginner' },
  { value: Difficulty.INTERMEDIATE, label: 'Intermediate' },
  { value: Difficulty.ADVANCED, label: 'Advanced' },
]

const sortOptions: SelectOption<string>[] = [
  { value: 'updatedAt', label: 'Recently Updated' },
  { value: 'createdAt', label: 'Recently Created' },
  { value: 'title', label: 'Title (A-Z)' },
  { value: 'difficulty', label: 'Difficulty' },
  { value: 'wordCount', label: 'Word Count' },
]

// Computed
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))
const hasActiveFilters = computed(() => {
  return Boolean(
      selectedDialect.value ||
      selectedDifficulty.value ||
      activeTags.value.length > 0
  )
})

const gridClasses = computed(() => {
  return viewMode.value === 'grid' ? layoutClasses.grid.cols3 : 'space-y-4'
})

// Methods
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const setSearchQuery = (value: string) => {
  if (value.trim().length < 5) {
    textStore.fetchTexts()
  } else {
    textStore.searchTexts(value)
  }

}

const setSelectedDialect = (value: Dialect | null) => {
  textStore.setFilters({ dialect: value })
}

const setSelectedDifficulty = (value: Difficulty | null) => {
  textStore.setFilters({ difficulty: value })
}

const removeTag = (tag: string) => {
  activeTags.value = activeTags.value.filter(t => t !== tag)
  textStore.setFilters({ tags: activeTags.value })
}

const clearFilters = () => {
  textStore.resetFilters()
  activeTags.value = []
}

const handlePageChange = (page: number) => {
  textStore.currentPage = page
  textStore.fetchTexts()
}

const editText = (textId: string) => {
  const text = texts.value.find(t => t.id === textId)
  if (text) {
    textToEdit.value = text
    showEditModal.value = true
  }
}

const deleteTextConfirm = (textId: string) => {
  const text = texts.value.find(t => t.id === textId)
  if (text) {
    textToDelete.value = text
    showDeleteModal.value = true
  }
}

const handleTextSubmit = async (formData: {
  title: string
  arabicContent: string
  transliteration?: string
  translation?: string
  comments?: string
  tags: string[]
  difficulty: Difficulty
  dialect: Dialect
}) => {
  try {
    if (textToEdit.value) {
      // Edit mode
      await textStore.updateText(textToEdit.value.id, formData)
      closeEditModal()
    } else {
      // Create mode
      await textStore.createText(formData)
      showCreateModal.value = false
    }
    // Refresh the texts list
    await textStore.fetchTexts()
  } catch (error) {
    console.error('Failed to save text:', error)
  }
}

const handleDeleteText = async () => {
  if (!textToDelete.value) return

  try {
    await textStore.deleteText(textToDelete.value.id)
    closeDeleteModal()
    // Refresh the texts list
    await textStore.fetchTexts()
  } catch (error) {
    console.error('Failed to delete text:', error)
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  textToEdit.value = null
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  textToDelete.value = null
}

// Lifecycle
onMounted(() => {
  textStore.fetchTexts()
})
</script>
