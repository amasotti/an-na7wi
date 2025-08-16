<template>
  <component
    :is="tag"
    :class="computedButtonClasses"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="handleClick"
  >
    <BaseIcon v-if="loading" size="sm" class="mr-2 animate-spin">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12a8 8 0 0 1 16 0M4 12a8 8 0 0 0 16 0" />
    </BaseIcon>
    
    <BaseIcon v-else-if="iconLeft" :size="iconSize" class="mr-2">
      <component :is="iconLeft" />
    </BaseIcon>
    
    <span v-if="$slots.default">
      <slot />
    </span>
    
    <BaseIcon v-if="iconRight && !loading" :size="iconSize" class="ml-2">
      <component :is="iconRight" />
    </BaseIcon>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { buttonClasses, combineClasses } from '@/styles/component-classes'
import type { ButtonSize, ButtonVariant } from '@/types'
import BaseIcon from './BaseIcon.vue'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  tag?: 'button' | 'a' | 'router-link'
  disabled?: boolean
  loading?: boolean
  iconLeft?: string
  iconRight?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  tag: 'button',
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const computedButtonClasses = computed(() => {
  return combineClasses(
    buttonClasses.base,
    buttonClasses.variants[props.variant],
    buttonClasses.sizes[props.size]
  )
})

const iconSize = computed(() => {
  return props.size === 'lg' ? 'md' : 'sm'
})

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
