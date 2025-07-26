<template>
  <router-link
    :to="to"
    :class="linkClasses"
    class="group relative flex items-center transition-all duration-300 transform hover:scale-105"
  >
    <!-- Background Glow -->
    <div 
      v-if="isActive"
      class="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur-sm -z-10 animate-pulse"
    />
    
    <!-- Icon Container -->
    <div v-if="icon" class="flex-shrink-0 mr-3 relative">
      <div class="p-2 rounded-xl transition-all duration-300" :class="iconContainerClasses">
        <BaseIcon :size="mobile ? 'md' : 'sm'" class="transition-all duration-300" :class="iconClasses">
          <path
            v-if="icon === 'HomeIcon'"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
          <path
            v-else-if="icon === 'DocumentTextIcon'"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
          <path
            v-else-if="icon === 'BookOpenIcon'"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
          <path
            v-else-if="icon === 'MagnifyingGlassIcon'"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </BaseIcon>
      </div>
      
      <!-- Icon Indicator Dot -->
      <div 
        v-if="isActive && !mobile"
        class="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-pulse"
      />
    </div>
    
    <!-- Text -->
    <span class="font-semibold transition-all duration-300" :class="textClasses">
      <slot />
    </span>
    
    <!-- Enhanced Active Indicator -->
    <div 
      v-if="!mobile"
      class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-300"
      :class="indicatorClasses"
    >
      <div class="w-8 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
    </div>
    
    <!-- Mobile Active Border -->
    <div 
      v-if="mobile && isActive"
      class="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-r-full"
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
  const base = props.mobile 
    ? 'px-6 py-4 rounded-2xl w-full border border-transparent backdrop-blur-sm' 
    : 'px-5 py-3 rounded-2xl border border-transparent backdrop-blur-sm'

  const active = isActive.value
    ? 'bg-gradient-to-r from-primary-100/80 to-secondary-100/80 border-primary-200/50 shadow-lg text-primary-800'
    : 'text-gray-700 hover:text-primary-700 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-secondary-50/50 hover:border-primary-200/30 hover:shadow-md'

  return `${base} ${active}`
})

const iconContainerClasses = computed(() => {
  return isActive.value
    ? 'bg-gradient-to-br from-primary-500/20 to-secondary-500/20 shadow-sm'
    : 'group-hover:bg-gradient-to-br group-hover:from-primary-500/10 group-hover:to-secondary-500/10'
})

const iconClasses = computed(() => {
  return isActive.value
    ? 'text-primary-600 drop-shadow-sm'
    : 'text-gray-600 group-hover:text-primary-600'
})

const textClasses = computed(() => {
  return isActive.value
    ? 'text-primary-800'
    : 'text-gray-700 group-hover:text-primary-700'
})

const indicatorClasses = computed(() => {
  return isActive.value
    ? 'opacity-100 scale-100'
    : 'opacity-0 scale-75 group-hover:opacity-60 group-hover:scale-90'
})
</script>
