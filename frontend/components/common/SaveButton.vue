<template>
  <BaseButton
    :type="type"
    variant="primary"
    size="sm"
    :loading="loading"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <BaseIcon size="sm" class="mr-2">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </BaseIcon>
    <slot>{{ text }}</slot>
  </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from '~/components/common/BaseButton.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'

interface Props {
  text?: string
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<Props>(), {
  text: 'Save',
  loading: false,
  disabled: false,
  type: 'submit',
})

defineEmits<{
  click: []
}>()
</script>

