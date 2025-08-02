<template>
  <div class="vocabulary-header">
    <div class="header-content">
      <div>
        <h1 class="vocabulary-title">Vocabulary Manager</h1>
        <p v-if="isSearching" class="vocabulary-subtitle">
          {{ searchLoading ? 'Searching...' : `Found ${searchResultsCount} result${searchResultsCount !== 1 ? 's' : ''}` }}
        </p>
      </div>
      <BaseButton @click="$emit('add-word')" class="flex items-center">
        <BaseIcon size="sm" class="mr-2">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </BaseIcon>
        Add New Word
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../common/BaseButton.vue'
import BaseIcon from '../common/BaseIcon.vue'

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