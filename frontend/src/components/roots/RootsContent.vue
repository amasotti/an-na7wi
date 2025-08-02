<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
        <span class="ml-3 text-gray-600">Loading roots...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
      <div class="text-center">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 class="text-red-800 font-medium mb-2">Error Loading Roots</h3>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="roots.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
      <div class="text-center">
        <BaseIcon size="xl" class="text-gray-300 mx-auto mb-4">
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </BaseIcon>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No roots found</h3>
        <p class="text-gray-600">Try adjusting your search criteria or filters.</p>
      </div>
    </div>

    <!-- Roots Grid -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200">
      <!-- View Toggle (Mobile) -->
      <div class="md:hidden border-b border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700">View</span>
          <div class="flex rounded-lg border border-gray-300">
            <button
              :class="[
                'px-3 py-1 text-xs font-medium rounded-l-lg transition-colors',
                viewMode === 'grid' 
                  ? 'bg-primary-100 text-primary-700 border-primary-300' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              ]"
              @click="viewMode = 'grid'"
            >
              Grid
            </button>
            <button
              :class="[
                'px-3 py-1 text-xs font-medium rounded-r-lg border-l transition-colors',
                viewMode === 'list' 
                  ? 'bg-primary-100 text-primary-700 border-primary-300' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              ]"
              @click="viewMode = 'list'"
            >
              List
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop Grid View -->
      <div class="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-1 divide-y lg:divide-y-0">
        <RootCard
          v-for="root in roots"
          :key="root.id"
          :root="root"
          :show-delete-button="showDeleteButtons"
          @click="$emit('root-clicked', root.id)"
          @delete="$emit('root-deleted', $event)"
        />
      </div>

      <!-- Mobile Views -->
      <div class="md:hidden">
        <!-- Mobile Grid -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-2 gap-1">
          <RootCard
            v-for="root in roots"
            :key="root.id"
            :root="root"
            :show-delete-button="showDeleteButtons"
            mobile
            @click="$emit('root-clicked', root.id)"
            @delete="$emit('root-deleted', $event)"
          />
        </div>

        <!-- Mobile List -->
        <div v-else class="divide-y divide-gray-200">
          <RootListItem
            v-for="root in roots"
            :key="root.id"
            :root="root"
            :show-delete-button="showDeleteButtons"
            @click="$emit('root-clicked', root.id)"
            @delete="$emit('root-deleted', $event)"
          />
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="border-t border-gray-200 px-6 py-4">
        <Pagination
          :current-page="pagination.page"
          :total-pages="pagination.totalPages"
          :total-count="pagination.totalCount"
          :page-size="pagination.size"
          @page-changed="$emit('page-changed', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '@/components/common/BaseIcon.vue'
import Pagination from '@/components/common/Pagination.vue'
import type { Root } from '@/types'
import { ref } from 'vue'
import RootCard from './RootCard.vue'
import RootListItem from './RootListItem.vue'

interface Props {
  roots: Root[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    size: number
    totalCount: number
    totalPages: number
  }
  showDeleteButtons?: boolean
}

interface Emits {
  (e: 'page-changed', page: number): void
  (e: 'root-clicked', rootId: string): void
  (e: 'root-deleted', rootId: string): void
}

defineProps<Props>()
defineEmits<Emits>()

const viewMode = ref<'grid' | 'list'>('grid')
</script>