<template>
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <div>
      <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ title }}</h1>
      <p class="text-gray-600 dark:text-gray-400">{{ subtitle }}</p>
    </div>

    <div class="flex gap-3">
      <AddButton @click="$emit('showCreateModal')">
        Create Interlinear Text
      </AddButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import AddButton from '../common/AddButton.vue'

interface Props {
  title: string
  subtitle: string
}

defineProps<Props>()

defineEmits<{
  showCreateModal: []
}>()
</script>
