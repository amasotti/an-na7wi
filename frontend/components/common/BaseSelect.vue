<template>
  <div class="relative">
    <select
      :value="modelValue"
      :class="selectClasses"
      @change="handleChange"
      v-bind="$attrs"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option 
        v-for="option in options" 
        :key="option.value" 
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    
    <!-- Custom dropdown arrow -->
    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <BaseIcon size="sm" class="text-gray-400">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </BaseIcon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

interface Option {
  value: string | number | null
  label: string
}

interface Props {
  modelValue?: string | number | null
  options: Option[]
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const selectClasses = computed(() => {
  const base = 'form-input appearance-none pr-10 cursor-pointer'

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: '',
    lg: 'px-5 py-4 text-lg',
  }

  const disabled = props.disabled ? 'opacity-50 cursor-not-allowed' : ''

  return [base, sizes[props.size], disabled].filter(Boolean).join(' ')
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value === '' ? null : target.value
  emit('update:modelValue', value)
}
</script>
