<template>
  <div class="flex-start">
    <input
      :id="id"
      :value="modelValue"
      :checked="modelValue"
      type="checkbox"
      class="checkbox-default"
      @change="handleChange"
    />
    <label :for="id" class="checkbox-label">
      {{ labelText }}
    </label>
  </div>
</template>

<script setup lang="ts">

interface BaseCheckBoxProps {
  modelValue: boolean
  id?: string
  labelText?: string
}

withDefaults(defineProps<BaseCheckBoxProps>(), {
  modelValue: false,
  id: 'checkbox-' + Math.random().toString(36).substring(2, 9),
  labelText: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>
