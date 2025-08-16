<template>
  <div :class="wrapperClasses">
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      v-model="internalValue"
      :disabled="disabled"
      :class="computedSliderClasses"
      v-bind="$attrs"
      @input="handleInput"
    />

    <span v-if="showValue" :class="valueClasses">
      {{ internalValue }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { sliderClasses, combineClasses } from '@/styles/component-classes'

interface Props {
  modelValue: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  showValue: true,
  size: 'md',
  variant: 'primary',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  input: [value: number]
}>()

const internalValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    if (val !== internalValue.value) {
      internalValue.value = val
    }
  }
)

const computedSliderClasses = computed(() => {
  return combineClasses(
    sliderClasses.base,
    sliderClasses.variants[props.variant],
    sliderClasses.sizes[props.size]
  )
})

const wrapperClasses = computed(() => {
  return sliderClasses.wrapper
})

const valueClasses = computed(() => {
  return sliderClasses.value
})

const handleInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  internalValue.value = value
  emit('update:modelValue', value)
  emit('input', value)
}
</script>
