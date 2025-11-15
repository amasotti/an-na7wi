<template>
  <button
    @click="$emit('click')"
    class="menu"
    aria-label="Text actions menu"
  >
    <BaseIcon size="sm">
      <path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </BaseIcon>
  </button>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/common/BaseIcon.vue'

defineEmits<{
  click: []
}>()
</script>


<style scoped>
.menu {
  @apply p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-100 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm opacity-0 group-hover:opacity-100
}
</style>
