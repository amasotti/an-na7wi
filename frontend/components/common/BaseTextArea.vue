<template>
  <div class="space-xs">
    <label v-if="label" :for="textareaId" class="form-label">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <textarea
      :id="textareaId"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :rows="rows"
      :class="textareaClasses"
      :dir="arabic ? 'rtl' : undefined"
      :value="modelValue"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      v-bind="$attrs"
    ></textarea>

    <div v-if="error || hint" class="text-sm">
      <p v-if="error" class="text-red-600 flex items-center" id="error">
        <BaseIcon size="sm" class="mr-1 flex-shrink-0">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </BaseIcon>
        {{ error }}
      </p>
      <p v-else-if="hint" class="text-gray-500 italic text-sm" id="hint">{{ hint }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

interface Props {
  modelValue?: string
  id?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  rows?: number
  arabic?: boolean
  autoResize?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
  autoResize: false,
  label: 'Content',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const textareaId = computed(
  () => props.id || `textarea-${Math.random().toString(36).substring(2, 9)}`
)

const textareaClasses = computed(() => {
  const base = 'form-textarea-na7wi'
  const error = props.error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''
  const resize = props.autoResize ? 'resize-none' : 'resize-y'
  const arabic = props.arabic ? 'arabic' : ''

  return [base, resize, error, arabic].filter(Boolean).join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)

  if (props.autoResize) {
    target.style.height = 'auto'
    target.style.height = `${target.scrollHeight}px`
  }
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>
