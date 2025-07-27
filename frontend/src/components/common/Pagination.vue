<template>
  <nav class="flex items-center justify-center space-x-2">
    <!-- Previous button -->
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage <= 1"
      class="pagination-btn"
      :class="{ 'pagination-btn-disabled': currentPage <= 1 }"
    >
      <BaseIcon size="sm">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </BaseIcon>
    </button>

    <!-- First page -->
    <button
      v-if="showFirstPage"
      @click="goToPage(1)"
      class="pagination-btn"
      :class="{ 'pagination-btn-active': currentPage === 1 }"
    >
      1
    </button>

    <!-- First ellipsis -->
    <span v-if="showFirstEllipsis" class="pagination-ellipsis">
      ...
    </span>

    <!-- Page numbers around current page -->
    <button
      v-for="page in visiblePages"
      :key="page"
      @click="goToPage(page)"
      class="pagination-btn"
      :class="{ 'pagination-btn-active': currentPage === page }"
    >
      {{ page }}
    </button>

    <!-- Last ellipsis -->
    <span v-if="showLastEllipsis" class="pagination-ellipsis">
      ...
    </span>

    <!-- Last page -->
    <button
      v-if="showLastPage"
      @click="goToPage(totalPages)"
      class="pagination-btn"
      :class="{ 'pagination-btn-active': currentPage === totalPages }"
    >
      {{ totalPages }}
    </button>

    <!-- Next button -->
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage >= totalPages"
      class="pagination-btn"
      :class="{ 'pagination-btn-disabled': currentPage >= totalPages }"
    >
      <BaseIcon size="sm">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </BaseIcon>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

interface Props {
  currentPage: number
  totalPages: number
  maxVisible?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxVisible: 7,
})

const emit = defineEmits<{
  'page-change': [page: number]
}>()

const visiblePages = computed(() => {
  const delta = Math.floor(props.maxVisible / 2)
  const start = Math.max(2, props.currentPage - delta)
  const end = Math.min(props.totalPages - 1, props.currentPage + delta)

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const showFirstPage = computed(() => props.totalPages > 1)
const showLastPage = computed(() => props.totalPages > 1 && props.totalPages !== 1)
const showFirstEllipsis = computed(() => visiblePages.value[0] > 2)
const showLastEllipsis = computed(
  () => visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1
)

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}
</script>

<style scoped>
.pagination-btn {
  @apply min-w-[40px] h-10 px-3 py-2 rounded-xl font-medium text-sm border-2 border-transparent transition-all duration-200 flex items-center justify-center;
}

.pagination-btn:not(.pagination-btn-disabled):not(.pagination-btn-active) {
  @apply text-gray-700 hover:text-primary-700 hover:bg-primary-50 hover:border-primary-200;
}

.pagination-btn-active {
  @apply bg-primary-600 text-white shadow-lg;
}

.pagination-btn-disabled {
  @apply text-gray-400 cursor-not-allowed;
}

.pagination-ellipsis {
  @apply px-2 py-2 text-gray-500 text-sm;
}
</style>
