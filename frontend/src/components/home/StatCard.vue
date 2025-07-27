<template>
  <div class="bg-white rounded-xl p-6 text-center hover:shadow-md transition-shadow duration-200 border border-gray-200">
    <!-- Icon -->
    <div class="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-md">
      <BaseIcon class="text-white">
        <component :is="iconComponent" />
      </BaseIcon>
    </div>
    
    <!-- Value -->
    <div class="text-3xl font-bold text-gray-900 mb-2">
      {{ stat.value }}
    </div>
    
    <!-- Label -->
    <div class="text-sm font-medium text-gray-600">
      {{ stat.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import BaseIcon from '../common/BaseIcon.vue'

interface Stat {
  value: string
  label: string
  icon: string
}

interface Props {
  stat: Stat
}

const props = defineProps<Props>()

// Icon components mapping
const iconComponents = {
  'document-text': () =>
    h('path', {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    }),
  'book-open': () =>
    h('path', {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    }),
  globe: () =>
    h('path', {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
    }),
  chart: () =>
    h('path', {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    }),
}

const iconComponent = computed(() => {
  return iconComponents[props.stat.icon as keyof typeof iconComponents]
})
</script>
