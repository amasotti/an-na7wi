<template>
  <div
    :class="cardClasses"
    @click="handleClick"
  >
    <div class="p-4 space-y-3">
      <!-- Root Display -->
      <div class="text-center">
        <div :class="rootTextClasses">
          {{ root.displayForm }}
        </div>
        <div v-if="root.meaning" :class="meaningClasses">
          {{ root.meaning }}
        </div>
      </div>

      <!-- Root Details -->
      <div :class="detailsClasses">
        <div class="flex items-center justify-between text-xs text-gray-600">
          <span>{{ root.letterCount }} letters</span>
          <span>{{ root.wordCount }} words</span>
        </div>
        
        <!-- Root Letters -->
        <div class="flex justify-center space-x-2 mt-2">
          <span
            v-for="(letter, index) in root.letters"
            :key="index"
            class="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 text-sm font-medium rounded arabic"
          >
            {{ letter }}
          </span>
        </div>
      </div>

      <!-- Hover Indicator -->
      <div :class="hoverIndicatorClasses">
        <BaseIcon size="xs" class="text-primary-400">
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </BaseIcon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '@/components/common/BaseIcon.vue'
import type { Root } from '@/types'
import { computed } from 'vue'

interface Props {
  root: Root
  mobile?: boolean
}

type Emits = (e: 'click') => void

const props = withDefaults(defineProps<Props>(), {
  mobile: false,
})

const emit = defineEmits<Emits>()

const cardClasses = computed(() => [
  'bg-white border-gray-200 cursor-pointer relative transition-all duration-200',
  'hover:bg-gradient-to-br hover:from-primary-50 hover:to-blue-50',
  'hover:border-primary-200 hover:shadow-md',
  'group',
  props.mobile ? 'border rounded-lg' : 'border-b lg:border-r last:border-r-0',
])

const rootTextClasses = computed(() => [
  'font-bold text-gray-900 arabic',
  props.mobile ? 'text-xl' : 'text-2xl',
])

const meaningClasses = computed(() => [
  'text-gray-600 font-medium',
  props.mobile ? 'text-xs' : 'text-sm',
])

const detailsClasses = computed(() => [props.mobile ? 'space-y-1' : 'space-y-2'])

const hoverIndicatorClasses = computed(() => [
  'absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200',
  props.mobile ? 'top-1 right-1' : '',
])

const handleClick = () => {
  emit('click')
}
</script>