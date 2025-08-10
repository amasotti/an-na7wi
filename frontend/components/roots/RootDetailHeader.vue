<template>
  <article class="root-hero">
    <!-- Actions Toolbar -->
    <section class="actions-toolbar">
      <BaseButton
        variant="outline"
        size="sm"
        @click="$emit('add-word')"
      >
        <BaseIcon size="sm" class="mr-2">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </BaseIcon>
        Add Word
      </BaseButton>
      <BaseButton
        variant="outline"
        size="sm"
        @click="$emit('edit')"
      >
        <BaseIcon size="sm" class="mr-2">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </BaseIcon>
        Edit
      </BaseButton>
    </section>

    <!-- Main Root Display -->
    <article class="root-display">
      <h1 class="root-arabic arabic">
        {{ currentRoot.displayForm }}
      </h1>
      <section class="root-details" v-if="currentRoot.meaning">
        <p class="meaning">
          {{ currentRoot.meaning }}
        </p>
      </section>
      
      <!-- Root Letters -->
      <section class="root-letters">
        <div
          v-for="(letter, index) in currentRoot.letters"
          :key="index"
          class="letter-badge arabic"
        >
          {{ letter }}
        </div>
      </section>
    </article>

    <!-- Primary Metadata Cards -->
    <section class="metadata-grid">
      <!-- Letter Count Card -->
      <article class="metadata-card primary-metadata">
        <div class="metadata-label">Letters</div>
        <BaseBadge
          variant="primary"
          size="md"
          class="metadata-value"
        >
          {{ currentRoot.letterCount }}
        </BaseBadge>
      </article>

      <!-- Word Count Card -->
      <article class="metadata-card">
        <div class="metadata-label">Words</div>
        <BaseBadge
          variant="success"
          size="md"
          class="metadata-value"
        >
          {{ currentRoot.wordCount }}
        </BaseBadge>
      </article>

      <!-- Root Type Card -->
      <article class="metadata-card">
        <div class="metadata-label">Root Type</div>
        <BaseBadge
          variant="secondary"
          size="md"
          class="metadata-value"
        >
          {{ rootType }}
        </BaseBadge>
      </article>

      <!-- Normalized Form Card -->
      <article class="metadata-card">
        <div class="metadata-label">Normalized</div>
        <div class="metadata-value-ar arabic">
          {{ currentRoot.normalizedForm }}
        </div>
      </article>

      <!-- Created Date Card -->
      <article class="metadata-card secondary-metadata">
        <div class="metadata-label">Added</div>
        <div class="metadata-value text-gray-600">
          {{ formatDate(currentRoot.createdAt) }}
        </div>
      </article>
    </section>
  </article>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/common/BaseBadge.vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import { useRootStore } from '~/stores/rootStore'
import { formatDate } from '~/utils/dateUtils'

const rootStore = useRootStore()

const currentRoot = computed(() => rootStore.currentRootWithWords?.root!)

defineEmits<{
  edit: []
  'add-word': []
}>()

const rootType = computed(() => {
  const letterCount = currentRoot.value.letterCount
  switch (letterCount) {
    case 2:
      return 'Bilateral'
    case 3:
      return 'Trilateral'
    case 4:
      return 'Quadrilateral'
    case 5:
      return 'Quinqueliteral'
    default:
      return `${letterCount}-Letter`
  }
})
</script>

<style scoped>
.root-hero {
  @apply bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden;
}

.actions-toolbar {
  @apply flex justify-end gap-2 p-4 bg-gray-50/50 border-b border-gray-100;
}

.root-display {
  @apply text-center py-8 px-6 bg-gradient-to-br from-indigo-50/20 to-purple-50/20;
}

.root-arabic {
  @apply text-6xl md:text-7xl font-bold text-gray-900 mb-4 text-center;
  line-height: 1.1;
}

.root-details {
  @apply space-y-2 max-w-2xl mx-auto mb-6;
}

.meaning {
  @apply text-xl text-gray-600 font-medium;
}

.root-letters {
  @apply flex justify-center gap-3 flex-wrap;
}

.letter-badge {
  @apply inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-100 to-blue-100 text-primary-700 text-xl font-bold rounded-xl border border-primary-200;
}

.metadata-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-6 bg-white;
}

.metadata-card {
  @apply bg-gray-50/80 rounded-xl p-4 text-center border border-gray-100/50 hover:bg-gray-50 transition-colors;
}

.primary-metadata {
  @apply bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100;
}

.secondary-metadata {
  @apply bg-gradient-to-br from-gray-50 to-slate-50;
}

.metadata-label {
  @apply text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2;
}

.metadata-value {
  @apply text-sm font-medium;
}

.metadata-value-ar {
  @apply text-gray-600 text-xl text-center;
}
</style>
