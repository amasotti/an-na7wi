<template>
  <svg 
    :style="iconStyle"
    :viewBox="viewBox || '0 0 24 24'"
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

const iconStyle = computed(() => {
  const sizes = {
    xs: { width: '12px', height: '12px', minWidth: '12px', minHeight: '12px' },
    sm: { width: '16px', height: '16px', minWidth: '16px', minHeight: '16px' },
    md: { width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' },
    lg: { width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' },
    xl: { width: '32px', height: '32px', minWidth: '32px', minHeight: '32px' },
  }
  return {
    ...sizes[props.size],
    flexShrink: '0',
    display: 'block',
  }
})
</script>
