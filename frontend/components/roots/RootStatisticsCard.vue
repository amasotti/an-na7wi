<template>
  <div :class="cardClasses">
    <h3 :class="titleClasses">Statistics</h3>
    <div :class="statsGridClasses">
      <div class="text-center">
        <div :class="numberClasses">{{ statistics.totalRoots }}</div>
        <div :class="labelClasses">Total Roots</div>
      </div>
      <div class="text-center">
        <div :class="numberClasses">{{ statistics.triLiteral }}</div>
        <div :class="labelClasses">3-Letter</div>
      </div>
      <div class="text-center">
        <div :class="numberClasses">{{ statistics.quadriLiteral }}</div>
        <div :class="labelClasses">4-Letter</div>
      </div>
      <div v-if="statistics.quinqueLiteral > 0" class="text-center">
        <div :class="numberClasses">{{ statistics.quinqueLiteral }}</div>
        <div :class="labelClasses">5-Letter</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RootStatistics } from '@/types'
import { computed } from 'vue'

interface Props {
  statistics: RootStatistics
  mobile?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mobile: false,
})

const cardClasses = computed(() => [
  'bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200',
  props.mobile ? 'p-4' : 'p-6',
])

const titleClasses = computed(() => [
  'font-semibold text-primary-900 mb-3',
  props.mobile ? 'text-base' : 'text-lg',
])

const statsGridClasses = computed(() => [
  'grid gap-4',
  props.mobile ? 'grid-cols-3' : 'grid-cols-4',
])

const numberClasses = computed(() => [
  'font-bold text-primary-600',
  props.mobile ? 'text-lg' : 'text-2xl',
])

const labelClasses = computed(() => ['text-primary-700', props.mobile ? 'text-xs' : 'text-sm'])
</script>