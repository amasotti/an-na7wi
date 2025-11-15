<template>
  <span :class="badgeClasses">
    <BaseIcon v-if="icon" :size="iconSize" class="button-icon">
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
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </BaseIcon>
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BadgeVariant, ButtonSize } from '~/types'
import BaseIcon from './BaseIcon.vue'

interface Props {
  variant?: BadgeVariant
  size?: ButtonSize
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
  const base =
    'badge inline-flex items-center font-medium rounded-full transition-colors duration-200'

  const variants: Record<BadgeVariant, string> = {
    primary:
      'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 border border-indigo-300 shadow-sm',

    secondary:
      'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border border-purple-300 shadow-sm',

    success:
      'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 border border-emerald-300 shadow-sm',

    warning:
      'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 border border-amber-300 shadow-sm',

    error:
      'bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600 border border-rose-300 shadow-sm',

    neutral:
      'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600 border border-gray-300 shadow-sm',

    // ---- ColorVariant expansions ----

    red: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 border border-red-300 shadow-sm',

    blue: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 border border-blue-300 shadow-sm',

    green:
      'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 border border-green-300 shadow-sm',

    yellow:
      'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 border border-yellow-300 shadow-sm',

    purple:
      'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 border border-purple-300 shadow-sm',

    pink: 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 border border-pink-300 shadow-sm',

    amber:
      'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 border border-amber-300 shadow-sm',

    teal: 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 border border-teal-300 shadow-sm',

    gray: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 border border-gray-300 shadow-sm',
  }

  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return [base, variants[props.variant], sizes[props.size]].filter(Boolean).join(' ')
})

const iconSize = computed(() => {
  return props.size === 'lg' ? 'sm' : 'xs'
})
</script>
