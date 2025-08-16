<template>
  <fieldset class="color-picker">
    <legend v-if="label" class="text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </legend>
    
    <div class="color-grid">
      <button
        v-for="color in colors"
        :key="color.value"
        type="button"
        :title="color.name"
        :aria-pressed="modelValue === color.value"
        class="color-button"
        :class="{ 'color-button--selected': modelValue === color.value }"
        :style="{ backgroundColor: color.value }"
        @click="selectColor(color.value)"
      >
        <svg
          v-if="modelValue === color.value"
          class="check-icon"
          :class="isLightColor(color.value) ? 'text-gray-900' : 'text-white'"
          viewBox="0 0 16 16"
        >
          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
        </svg>
      </button>
    </div>
    <aside class="text-sm pt-2">Selected: {{ colorName }}</aside>
  </fieldset>
</template>

<script setup lang="ts">
type ColorOption = {
  name: string
  value: string
}

type ColorPickerProps = {
  modelValue?: string
  label?: string
  required?: boolean
}

const props = withDefaults(defineProps<ColorPickerProps>(), {
  modelValue: '',
  label: '',
  required: false,
})

const emit = defineEmits<(e: 'update:modelValue', value: string) => void>()

const colors: ColorOption[] = [
  { name: 'Light Blue', value: '#32a7cf' },
  { name: 'Sky Blue', value: '#0ea5e9' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Gray', value: '#6b7280' },
]

// Computed function to get human readable color name for the current modelValue
const colorName = computed(() => {
  const color = colors.find(c => c.value === props.modelValue)
  return color ? color.name : ''
})

const selectColor = (colorValue: string) => {
  emit('update:modelValue', colorValue)
}

const isLightColor = (hex: string): boolean => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}
</script>

<style scoped>
.color-grid {
  @apply grid grid-cols-5 gap-1.5 p-2 border border-gray-300 rounded-md;
}

.color-button {
  @apply relative w-5 h-5 rounded border border-gray-300 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1;
}

.color-button--selected {
  @apply border-gray-800 ring-2 ring-gray-800 ring-offset-1;
}

.check-icon {
  @apply absolute inset-0 w-3 h-3 m-auto drop-shadow-sm;
}
</style>
