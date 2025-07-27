<template>
  <BaseCard 
    :hover="true"
    :class="cardClass"
    @click="navigateToFeature"
  >
    <div class="text-center">
      <!-- Icon -->
      <div 
        class="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center transition-all duration-200"
        :class="iconClasses"
      >
        <BaseIcon size="lg" class="text-white">
          <component :is="iconComponent" />
        </BaseIcon>
      </div>
      
      <!-- Content -->
      <h3 class="text-xl font-bold text-gray-900 mb-3">
        {{ feature.title }}
      </h3>
      
      <p class="text-gray-600 mb-4 leading-relaxed">
        {{ feature.description }}
      </p>
      
      <!-- CTA -->
      <div class="flex items-center justify-center text-sm font-semibold transition-colors duration-300"
           :class="ctaClasses">
        <span>Learn More</span>
        <BaseIcon size="sm" class="ml-2 transition-transform duration-300 group-hover:translate-x-1">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </BaseIcon>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { cardClasses, combineClasses } from '../../styles/component-classes'
import BaseCard from '../common/BaseCard.vue'
import BaseIcon from '../common/BaseIcon.vue'

interface Feature {
  title: string
  description: string
  icon: string
  color: 'primary' | 'secondary' | 'accent'
  link: string
}

interface Props {
  feature: Feature
  delay?: number
}

const props = defineProps<Props>()
const router = useRouter()

const iconClasses = computed(() => {
  const colors = {
    primary: 'bg-gradient-to-br from-primary-600 to-primary-700 shadow-lg',
    secondary: 'bg-gradient-to-br from-secondary-600 to-secondary-700 shadow-lg',
    accent: 'bg-gradient-to-br from-accent-600 to-accent-700 shadow-lg',
  }
  return colors[props.feature.color]
})

const cardClass = computed(() => {
  return combineClasses(
    cardClasses.base,
    'h-full group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary-200'
  )
})

const ctaClasses = computed(() => {
  const colors = {
    primary: 'text-primary-600 group-hover:text-primary-700',
    secondary: 'text-secondary-600 group-hover:text-secondary-700',
    accent: 'text-accent-600 group-hover:text-accent-700',
  }
  return colors[props.feature.color]
})

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
  'magnifying-glass': () =>
    h('path', {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
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
  annotation: () =>
    h('path', {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
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
  return iconComponents[props.feature.icon as keyof typeof iconComponents]
})

const navigateToFeature = () => {
  router.push(props.feature.link)
}
</script>
