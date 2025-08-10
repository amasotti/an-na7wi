<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200">
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">
          Words Found in Text
        </h2>
        <BaseBadge variant="primary">
          {{ totalCount }} words
        </BaseBadge>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-12 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent mx-auto mb-4"></div>
      <span class="text-gray-600">Finding words...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="words.length === 0" class="p-12 text-center">
      <BaseIcon size="xl" class="text-gray-300 mx-auto mb-4">
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </BaseIcon>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No words found</h3>
      <p class="text-gray-600">No vocabulary words were found in the database that match this text.</p>
    </div>

    <!-- Words List -->
    <div v-else class="divide-y divide-gray-200">
      <TokenizedWordItem
        v-for="word in words"
        :key="word.id"
        :word="word"
        @click="handleWordClick"
      />
    </div>

    <!-- Pagination -->
    <div v-if="totalCount > pageSize && !loading" class="p-6 border-t border-gray-200">
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseBadge from '~/components/common/BaseBadge.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import Pagination from '~/components/common/Pagination.vue'
import type { Word } from '~/types'
import TokenizedWordItem from './TokenizedWordItem.vue'

interface Props {
  words: Word[]
  loading: boolean
  totalCount: number
  currentPage: number
  pageSize: number
}

type Emits = (e: 'page-change', page: number) => void

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const totalPages = computed(() => Math.ceil(props.totalCount / props.pageSize))

const handleWordClick = (arabic: string) => {
  // Navigate to vocabulary view with Arabic search query
  navigateTo({
    path: '/words',
    query: { search: arabic },
  })
}

const handlePageChange = (page: number) => {
  emit('page-change', page)
}
</script>
