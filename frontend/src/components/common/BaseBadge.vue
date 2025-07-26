<template>
  <span :class="badgeClasses">
    <BaseIcon v-if="icon" :size="iconSize" class="mr-1.5">
      <component :is="icon" />
    </BaseIcon>
    
    <slot />
    
    <button 
      v-if="closable"
      type="button"
      class="ml-1.5 -mr-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
      @click="$emit('close')"
    >
      <BaseIcon size="xs">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </BaseIcon>
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md',
})

defineEmits<{
  close: []
}>()

const badgeClasses = computed(() => {
  const base = 'badge inline-flex items-center font-medium'

  const variants = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    neutral: 'bg-gray-100 text-gray-800',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  return [base, variants[props.variant], sizes[props.size]].filter(Boolean).join(' ')
})

const iconSize = computed(() => {
  return props.size === 'lg' ? 'sm' : 'xs'
})
</script>
