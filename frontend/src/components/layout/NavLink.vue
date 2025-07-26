<template>
  <router-link
    :to="to"
    :class="linkClasses"
    class="group relative flex items-center transition-colors duration-200"
  >
    <!-- Icon -->
    <div v-if="icon" class="flex-shrink-0 mr-3">
      <BaseIcon :size="mobile ? 'md' : 'sm'" class="transition-colors">
        <path
          v-if="icon === 'HomeIcon'"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
        <path
          v-else-if="icon === 'DocumentTextIcon'"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
        <path
          v-else-if="icon === 'BookOpenIcon'"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
        <path
          v-else-if="icon === 'MagnifyingGlassIcon'"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </BaseIcon>
    </div>
    
    <!-- Text -->
    <span class="font-medium">
      <slot />
    </span>
    
    <!-- Active indicator -->
    <div 
      v-if="!mobile"
      class="absolute -bottom-4 left-1/2 w-1 h-1 bg-primary-500 rounded-full transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      :class="{ 'opacity-100': isActive }"
    />
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BaseIcon from '../common/BaseIcon.vue'

interface Props {
  to: string
  icon?: string
  mobile?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mobile: false,
})

const route = useRoute()

const isActive = computed(() => {
  if (props.to === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(props.to)
})

const linkClasses = computed(() => {
  const base = props.mobile ? 'px-4 py-3 rounded-xl w-full' : 'px-4 py-2 rounded-xl'

  const active = isActive.value
    ? 'bg-primary-100 text-primary-700'
    : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'

  return `${base} ${active}`
})
</script>
