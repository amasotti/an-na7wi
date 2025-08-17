<template>
  <article class="word-hero">
    <!-- Actions Toolbar -->
    <section class="actions-toolbar">
      <EditButton @click="$emit('edit')" />
      <DeleteButton @click="$emit('delete')" />
    </section>

    <!-- Main Word Display -->
    <article class="word-display">
      <h1 class="word-arabic arabic">
        {{ currentWord!!.arabic }}
      </h1>
      <section class="word-details">
        <p v-if="currentWord?.transliteration" class="transliteration">
          {{ currentWord.transliteration }}
        </p>
        <p v-if="currentWord?.translation" class="translation">
          {{ currentWord.translation }}
        </p>
      </section>
    </article>

    <!-- Primary Metadata Cards -->
    <section class="metadata-grid">
      <!-- Root Card -->
      <article class="metadata-card primary-metadata" v-if="currentWord?.root">
        <div class="metadata-label">Root</div>
        <BaseBadge
          variant="primary"
          size="md"
          class="metadata-value arabic root-badge"
          @click="handleRootClicked"
        >
          {{ currentWord.root }}
        </BaseBadge>
      </article>

      <!-- Part of Speech Card -->
      <article class="metadata-card">
        <div class="metadata-label">Part of Speech</div>
        <BaseBadge
          variant="secondary"
          size="md"
          class="metadata-value"
        >
          {{ currentWord?.partOfSpeech || 'N/A' }}
        </BaseBadge>
      </article>

      <!-- Dialect Card -->
      <article class="metadata-card">
        <div class="metadata-label">Dialect</div>
        <BaseBadge
          :variant="getDialectVariant(currentWord?.dialect)"
          size="md"
          class="metadata-value"
        >
          {{ currentWord?.dialect || 'Standard' }}
        </BaseBadge>
      </article>

      <!-- Mastery Level Card -->
      <article class="metadata-card">
        <div class="metadata-label">Mastery</div>
        <BaseBadge
          :variant="getMasteryVariant(currentWord?.masteryLevel)"
          size="md"
          class="metadata-value"
        >
          {{ currentWord?.masteryLevel || 'Standard' }}
        </BaseBadge>
      </article>

      <!-- Created Date Card -->
      <article class="metadata-card secondary-metadata">
        <div class="metadata-label">Added</div>
        <div class="metadata-value text-gray-600">
          {{ formatDate(currentWord!!.createdAt) }}
        </div>
      </article>
    </section>
  </article>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/common/BaseBadge.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import type { BadgeVariant } from '~/types'
import { formatDate } from '~/utils/dateUtils'

const wordStore = useWordStore()

const currentWord = computed(() => wordStore.currentWord)

defineEmits<{
  edit: []
  delete: []
}>()

const getRootDetailPath = () => {
  const root = currentWord.value?.root
  return root ? `/roots?search=${encodeURIComponent(root)}` : '/roots'
}

const handleRootClicked = () => {
  const rootDetailPath = getRootDetailPath()
  navigateTo(rootDetailPath)
}

const getDialectVariant = (dialect?: string) => {
  const dialectMap: Record<string, BadgeVariant> = {
    tunisian: 'warning',
    levantine: 'neutral',
    gulf: 'primary',
    maghrebi: 'error',
    standard: 'success',
    msa: 'success',
  }
  return dialectMap[dialect?.toLowerCase() || 'standard'] || 'neutral'
}

const getMasteryVariant = (mastery?: string) => {
  const masteryMap: Record<string, BadgeVariant> = {
    new: 'warning',
    beginner: 'error',
    intermediate: 'warning',
    known: 'success',
    mastered: 'primary',
    learning: 'secondary',
    standard: 'primary',
  }
  return masteryMap[mastery?.toLowerCase() || 'standard'] || 'neutral'
}
</script>

<style scoped>
.word-hero {
  @apply bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden;
}

.actions-toolbar {
  @apply flex justify-end gap-2 p-4 bg-gray-50/50 border-b border-gray-100;
}

.word-display {
  @apply text-center py-8 px-6 bg-gradient-to-br from-indigo-50/20 to-purple-50/20;
}

.word-arabic {
  @apply text-6xl md:text-7xl font-bold text-gray-900 mb-4 text-center;
  line-height: 1.1;
}

.word-details {
  @apply space-y-2 max-w-2xl mx-auto;
}

.transliteration {
  @apply text-xl text-gray-600 italic font-light;
}

.translation {
  @apply text-lg text-gray-700 font-medium;
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

.root-badge {
  @apply cursor-pointer hover:scale-[1.02] transition-transform;
}
</style>
