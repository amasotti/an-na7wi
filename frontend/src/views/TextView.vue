<template>
  <div class="texts animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Arabic Texts</h1>
        <p class="text-gray-600">Create, manage, and explore your Arabic learning materials</p>
      </div>
      
      <div class="flex gap-3">
        <BaseButton 
          variant="outline" 
          @click="toggleViewMode"
          class="hidden sm:inline-flex"
        >
          <BaseIcon size="sm" class="mr-2">
            <component :is="viewMode === 'grid' ? gridIcon : listIcon" />
          </BaseIcon>
          {{ viewMode === 'grid' ? 'Grid' : 'List' }}
        </BaseButton>
        
        <BaseButton @click="showCreateModal = true">
          <BaseIcon size="sm" class="mr-2">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </BaseIcon>
          Add New Text
        </BaseButton>
      </div>
    </div>

    <!-- Filters -->
    <BaseCard class="mb-8">
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <BaseInput
              v-model="searchQuery"
              placeholder="Search texts, titles, or content..."
              clearable
              icon-left="search"
            />
          </div>
          
          <BaseSelect
            v-model="selectedDialect"
            :options="dialectOptions"
            placeholder="All Dialects"
          />
          
          <BaseSelect
            v-model="selectedDifficulty"
            :options="difficultyOptions"
            placeholder="All Difficulties"
          />
        </div>
        
        <div class="flex flex-wrap gap-2">
          <BaseBadge
            v-for="tag in activeTags"
            :key="tag"
            closable
            @close="removeTag(tag)"
          >
            {{ tag }}
          </BaseBadge>
          
          <BaseButton
            v-if="hasActiveFilters"
            variant="ghost"
            size="sm"
            @click="clearFilters"
          >
            Clear All
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- Results Header -->
    <div class="flex justify-between items-center mb-6">
      <div class="text-sm text-gray-600" v-if="texts">
        Showing {{ texts.length }} of {{ totalCount }} texts
      </div>
      <div class="text-sm text-gray-600" v-else>
        No texts yet
      </div>
      
      <BaseSelect
        v-model="sortBy"
        :options="sortOptions"
        size="sm"
        class="w-48"
      />
    </div>

    <!-- Text Grid/List -->
    <div v-if="texts && texts.length > 0" :class="gridClasses">
      <TextCard
        v-for="text in texts"
        :key="text.id"
        :text="text"
        :view-mode="viewMode"
        @edit="editText"
        @delete="deleteTextConfirm"
        @duplicate="duplicateText"
      />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="!loading && texts"
      :has-filters="!!hasActiveFilters"
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

    <!-- Text Create Modal -->
    <TextCreateModal
      :open="showCreateModal"
      :loading="loading"
      @close="showCreateModal = false"
      @submit="handleCreateText"
    />
  </div>
</template>

<script setup lang="ts">
import { type ComputedRef, computed, h, onMounted, ref } from 'vue'
import BaseBadge from '../components/common/BaseBadge.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseIcon from '../components/common/BaseIcon.vue'
import BaseInput from '../components/common/BaseInput.vue'
import BaseSelect from '../components/common/BaseSelect.vue'
import Pagination from '../components/common/Pagination.vue'
import EmptyState from '../components/text/EmptyState.vue'
import TextCard from '../components/text/TextCard.vue'
import TextCardSkeleton from '../components/text/TextCardSkeleton.vue'
import TextCreateModal from '../components/text/TextCreateModal.vue'
import { useTextStore } from '../stores/textStore'
import { combineClasses, layoutClasses } from '../styles/component-classes'
import { Dialect, Difficulty } from '@/types'
import type { SelectOption } from '@/types'

const textStore = useTextStore()
const showCreateModal = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')

// Computed properties from store
const texts = computed(() => textStore.texts)
const loading = computed(() => textStore.loading)
const totalCount = computed(() => textStore.totalCount)
const currentPage = computed(() => textStore.currentPage)
const pageSize = computed(() => textStore.pageSize)
const searchQuery = computed({
  get: () => textStore.searchQuery,
  set: value => textStore.setFilters({ search: value }),
})
const selectedDialect = computed({
  get: () => textStore.selectedDialect,
  set: value => textStore.setFilters({ dialect: value }),
})
const selectedDifficulty = computed({
  get: () => textStore.selectedDifficulty,
  set: value => textStore.setFilters({ difficulty: value }),
})

// Local state
const sortBy = ref('updatedAt')
const activeTags = ref<string[]>([])

// Options
const dialectOptions: SelectOption<Dialect>[] = [
  { value: Dialect.TUNISIAN, label: 'Tunisian' },
  { value: Dialect.MOROCCAN, label: 'Moroccan' },
  { value: Dialect.EGYPTIAN, label: 'Egyptian' },
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
const hasActiveFilters = computed(
  () =>
    searchQuery.value ||
    selectedDialect.value ||
    selectedDifficulty.value ||
    activeTags.value.length > 0
)

const gridClasses = computed(() => {
  return viewMode.value === 'grid' ? layoutClasses.grid.cols3 : 'space-y-4'
})

// Icons
const gridIcon = () =>
  h('path', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  })

const listIcon = () =>
  h('path', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M4 6h16M4 10h16M4 14h16M4 18h16',
  })

// Methods
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
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
  // Handle edit text
  console.log('Edit text:', textId)
}

const deleteTextConfirm = (textId: string) => {
  // Handle delete confirmation
  console.log('Delete text:', textId)
}

const duplicateText = (textId: string) => {
  // Handle duplicate text
  console.log('Duplicate text:', textId)
}

const handleCreateText = async (formData: {
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
    await textStore.createText(formData)
    showCreateModal.value = false
    // Refresh the texts list
    await textStore.fetchTexts()
  } catch (error) {
    console.error('Failed to create text:', error)
  }
}

// Lifecycle
onMounted(() => {
  textStore.fetchTexts()
})
</script>
