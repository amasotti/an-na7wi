<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    
    <div :class="bodyClasses">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'elevated' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  hover: true,
})

const cardClasses = computed(() => {
  const base = 'card overflow-hidden'

  const variants = {
    default: '',
    elevated: 'card-elevated',
    glass: 'glass',
  }

  const hover = props.hover ? 'hover:shadow-xl transition-all duration-300' : ''

  return [base, variants[props.variant], hover].filter(Boolean).join(' ')
})

const bodyClasses = computed(() => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return paddings[props.padding]
})
</script>

<style scoped>
.card-header {
  @apply px-6 py-4 border-b border-gray-100 bg-gray-50/50;
}

.card-footer {
  @apply px-6 py-4 border-t border-gray-100 bg-gray-50/50;
}
</style>
