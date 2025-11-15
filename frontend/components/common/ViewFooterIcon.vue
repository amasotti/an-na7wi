<template>
  <button
    @click="$emit('view')"
    class="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors text-xs"
  >
    <BaseIcon size="xs" class="mr-1">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </BaseIcon>
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/common/BaseIcon.vue'

type ViewFooterIconProps = {
  label?: string
}

const props = withDefaults(defineProps<ViewFooterIconProps>(), {
  label: 'Open',
})

defineEmits<{
  view: []
}>()
</script>


<style scoped>

</style>
