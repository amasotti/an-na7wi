<template>
  <div class="vocabulary-header">
    <div class="header-content">
      <div>
        <h1 class="vocabulary-title">Vocabulary Manager</h1>
        <p v-if="isSearching" class="vocabulary-subtitle">
          {{ searchLoading ? 'Searching...' : `Found ${searchResultsCount} result${searchResultsCount !== 1 ? 's' : ''}` }}
        </p>
      </div>
      <AddButton @click="$emit('add-word')">
        Add New Word
      </AddButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import AddButton from '../common/AddButton.vue'

interface Props {
  isSearching: boolean
  searchLoading: boolean
  searchResultsCount: number
}

defineProps<Props>()

defineEmits<{
  'add-word': []
}>()
</script>

<style scoped>
.vocabulary-header {
  @apply mb-8;
}

.header-content {
  @apply flex justify-between items-center;
}

.vocabulary-title {
  @apply text-3xl font-bold text-gray-900;
}

.vocabulary-subtitle {
  @apply text-gray-600 mt-1;
}
</style>