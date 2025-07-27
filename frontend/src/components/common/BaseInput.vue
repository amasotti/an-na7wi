<template>
  <div class="space-y-2">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <div v-if="iconLeft" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <BaseIcon :class="iconClasses">
          <component :is="iconLeft" />
        </BaseIcon>
      </div>
      
      <input
        :id="inputId"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="inputClasses"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        v-bind="$attrs"
      />
      
      <div v-if="iconRight || clearable" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button
          v-if="clearable && modelValue"
          type="button"
          class="text-gray-400 hover:text-gray-600 transition-colors"
          @click="clearInput"
        >
          <BaseIcon size="sm">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </BaseIcon>
        </button>
        <BaseIcon v-else-if="iconRight" :class="iconClasses">
          <component :is="iconRight" />
        </BaseIcon>
      </div>
    </div>
    
    <div v-if="error || hint" class="text-sm">
      <p v-if="error" class="text-red-600 flex items-center">
        <BaseIcon size="sm" class="mr-1 flex-shrink-0">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </BaseIcon>
        {{ error }}
      </p>
      <p v-else-if="hint" class="text-gray-500">{{ hint }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'tel'
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  clearable?: boolean
  iconLeft?: string
  iconRight?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substring(2, 9)}`)

const inputClasses = computed(() => {
  const base = 'form-input'
  const withIcon = props.iconLeft ? 'pl-10' : ''
  const withRightIcon = props.iconRight || props.clearable ? 'pr-10' : ''
  const error = props.error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''

  return [base, withIcon, withRightIcon, error].filter(Boolean).join(' ')
})

const iconClasses = computed(() => {
  return props.error ? 'text-red-400' : 'text-gray-400'
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const clearInput = () => {
  emit('update:modelValue', '')
}
</script>
