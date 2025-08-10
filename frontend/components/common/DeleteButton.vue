<template>
  <BaseButton
    variant="outline"
    size="sm"
    class="delete-button"
    @click="$emit('click')"
  >
    <BaseIcon size="sm" class="mr-2">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </BaseIcon>
    <slot>Delete</slot>
  </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from '~/components/common/BaseButton.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.delete-button {
  @apply text-red-600 hover:text-red-700 border-red-300 hover:border-red-400 hover:bg-red-50 shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-200;
}
</style>