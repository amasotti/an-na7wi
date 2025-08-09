<template>
  <div class="view-toggle">
    <div class="toggle-group">
      <button
        :class="[
          'toggle-button',
          modelValue === 'table' ? 'toggle-button-active' : 'toggle-button-inactive'
        ]"
        @click="$emit('update:modelValue', 'table')"
        title="Table view"
      >
        <BaseIcon size="sm">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18v18H3zM3 9h18M9 21V9" />
        </BaseIcon>
      </button>
      <button
        :class="[
          'toggle-button',
          modelValue === 'grid' ? 'toggle-button-active' : 'toggle-button-inactive'
        ]"
        @click="$emit('update:modelValue', 'grid')"
        title="Card view"
      >
        <BaseIcon size="sm">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h7v5H3zM14 3h7v5h-7zM14 12h7v5h-7zM3 12h7v5H3z" />
        </BaseIcon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from './BaseIcon.vue'

interface Props {
  modelValue: 'table' | 'grid'
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: 'table' | 'grid']
}>()
</script>

<style scoped>
.view-toggle {
  @apply flex items-center;
}

.toggle-group {
  @apply inline-flex rounded-lg border border-gray-200 bg-white p-1;
}

.toggle-button {
  @apply px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}

.toggle-button-active {
  @apply bg-primary-600 text-white shadow-sm;
}

.toggle-button-inactive {
  @apply text-gray-500 hover:text-gray-700 hover:bg-gray-50;
}
</style>