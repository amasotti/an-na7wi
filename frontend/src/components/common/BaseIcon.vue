<template>
  <svg 
    :class="sizeClass" 
    :viewBox="viewBox || '0 0 24 24'" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    v-bind="$attrs"
  >
    <slot />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  viewBox?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const sizeClass = computed(() => {
  const sizes = {
    xs: 'w-3 h-3 min-w-3 min-h-3',
    sm: 'w-4 h-4 min-w-4 min-h-4',
    md: 'w-5 h-5 min-w-5 min-h-5',
    lg: 'w-6 h-6 min-w-6 min-h-6',
    xl: 'w-8 h-8 min-w-8 min-h-8',
  }
  return sizes[props.size]
})
</script>
