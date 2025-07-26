<template>
  <button
    @click="$emit('click')"
    :class="computedItemClasses"
  >
    <BaseIcon size="sm" :class="iconClasses">
      <component :is="iconComponent" />
    </BaseIcon>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { combineClasses } from '../../styles/component-classes'
import BaseIcon from '../common/BaseIcon.vue'

interface Props {
  icon: string
  danger?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  danger: false,
})

defineEmits<{
  click: []
}>()

// Computed classes using style system
const computedItemClasses = computed(() => {
  const baseClasses =
    'w-full px-4 py-2 text-left flex items-center text-sm transition-colors duration-150'

  const variantClasses = props.danger
    ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'

  return combineClasses(baseClasses, variantClasses)
})

const iconClasses = computed(() => 'mr-3')

// Icon components mapping
const iconComponents = {
  eye: () =>
    h('path', {
      stroke: 'currentColor',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    }),
  pencil: () =>
    h('path', {
      stroke: 'currentColor',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    }),
  duplicate: () =>
    h('path', {
      stroke: 'currentColor',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z',
    }),
  trash: () =>
    h('path', {
      stroke: 'currentColor',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    }),
}

const iconComponent = computed(() => {
  return iconComponents[props.icon as keyof typeof iconComponents]
})
</script>