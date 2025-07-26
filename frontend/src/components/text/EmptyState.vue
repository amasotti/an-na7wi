<template>
  <div class="text-center py-16 animate-fade-in">
    <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
      <BaseIcon size="xl" class="text-gray-400">
        <component :is="iconComponent" />
      </BaseIcon>
    </div>
    
    <h3 class="text-2xl font-bold text-gray-900 mb-3">
      {{ title }}
    </h3>
    
    <p class="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
      {{ description }}
    </p>
    
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <BaseButton 
        v-if="!hasFilters"
        @click="$emit('create')"
        size="lg"
      >
        <BaseIcon size="sm" class="mr-2">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </BaseIcon>
        Create Your First Text
      </BaseButton>
      
      <BaseButton
        v-if="hasFilters"
        @click="$emit('clear-filters')"
        variant="outline"
        size="lg"
      >
        <BaseIcon size="sm" class="mr-2">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </BaseIcon>
        Clear Filters
      </BaseButton>
      
      <BaseButton
        variant="ghost"
        size="lg"
        @click="$emit('browse-examples')"
      >
        <BaseIcon size="sm" class="mr-2">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </BaseIcon>
        Browse Examples
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../common/BaseButton.vue'
import BaseIcon from '../common/BaseIcon.vue'
import {computed, h} from "vue";

interface Props {
  hasFilters?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hasFilters: false,
})

defineEmits<{
  create: []
  'clear-filters': []
  'browse-examples': []
}>()

const title = computed(() => {
  return props.hasFilters ? 'No texts match your filters' : 'No texts found'
})

const description = computed(() => {
  return props.hasFilters
    ? 'Try adjusting your search criteria or clear your filters to see all texts.'
    : 'Start your Arabic learning journey by creating your first text with transliteration and translation.'
})

const iconComponent = computed(() => {
  return props.hasFilters ? searchIcon : documentIcon
})

// Icons
const searchIcon = () =>
  h('path', {
    stroke: 'currentColor',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  })

const documentIcon = () =>
  h('path', {
    stroke: 'currentColor',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  })
</script>
