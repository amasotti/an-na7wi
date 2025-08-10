<template>
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <div>
      <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ title }}</h1>
      <p class="text-gray-600">{{ subtitle }}</p>
    </div>
    
    <div class="flex gap-3">
      <BaseButton 
        v-if="showViewToggle"
        variant="outline" 
        @click="$emit('toggleViewMode')"
        class="hidden sm:inline-flex"
      >
        <BaseIcon size="sm" class="mr-2">
          <component :is="viewMode === 'grid' ? gridIcon : listIcon" />
        </BaseIcon>
        {{ viewMode === 'grid' ? 'Grid' : 'List' }}
      </BaseButton>
      
      <AddButton @click="$emit('showCreateModal')">
        Add New Text
      </AddButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import AddButton from '../common/AddButton.vue'
import BaseButton from '../common/BaseButton.vue'
import BaseIcon from '../common/BaseIcon.vue'

interface Props {
  title: string
  subtitle: string
  viewMode?: 'grid' | 'list'
  showViewToggle?: boolean
}

withDefaults(defineProps<Props>(), {
  viewMode: 'grid',
  showViewToggle: true,
})

defineEmits<{
  toggleViewMode: []
  showCreateModal: []
}>()

// Icons
const gridIcon = () =>
  h('path', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  })

const listIcon = () =>
  h('path', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M4 6h16M4 10h16M4 14h16M4 18h16',
  })
</script>