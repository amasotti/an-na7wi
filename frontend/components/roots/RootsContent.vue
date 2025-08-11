<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <LoadingEffect v-if="loading" />

    <!-- Error State -->
    <BaseErrorState
      v-if="error"
      message="Failed to load roots"
      :error="error"
    />

    <!-- Empty State -->
    <BaseEmptyState
      v-else-if="!loading && roots.length === 0"
      link="/roots"
      linkText="Create Root"
      message="No roots found. Start by creating a new root."
    />

    <!-- Roots Grid -->
    <main v-else>
      <!-- View Toggle -->
      <ViewToggle
        class="content-controls mb-2"
        :model-value="viewMode"
        @update:model-value="handleViewModeChange"
        aria-label="Switch between table and grid view"
      />

      <article>
        <!-- Root Cards Grid -->
        <section v-if="viewMode === ViewMode.GRID" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <RootCard
            v-for="root in roots"
            :key="root.id"
            :root="root"
            :show-delete-button="showDeleteButtons"
            @click="$emit('root-clicked', root.id)"
            @delete="$emit('root-deleted', $event)"
          />
        </section>

        <!-- Mobile List -->
        <section v-if="viewMode === ViewMode.TABLE" class="divide-y divide-gray-200">
          <RootListItem
            v-for="root in roots"
            :key="root.id"
            :root="root"
            :show-delete-button="showDeleteButtons"
            @click="$emit('root-clicked', root.id)"
            @delete="$emit('root-deleted', $event)"
          />
        </section>
      </article>

      <!-- Pagination -->
      <footer v-if="pagination.totalPages > 1" class="border-t border-gray-200 px-6 py-4">
        <Pagination
          :current-page="pagination.page"
          :total-pages="pagination.totalPages"
          :total-count="pagination.totalCount"
          :page-size="pagination.size"
          @page-change="$emit('page-changed', $event)"
        />
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseEmptyState from '~/components/common/BaseEmptyState.vue'
import BaseErrorState from '~/components/common/BaseErrorState.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import LoadingEffect from '~/components/common/LoadingEffect.vue'
import Pagination from '~/components/common/Pagination.vue'
import ViewToggle from '~/components/common/ViewToggle.vue'
import { ViewMode, type ViewModeType } from '~/config/viewMode'
import type { Root } from '~/types'
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

const viewMode = ref<ViewModeType>(ViewMode.GRID)

const handleViewModeChange = (mode: ViewModeType) => {
  viewMode.value = mode
}
</script>
