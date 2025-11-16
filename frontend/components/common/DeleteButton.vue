<template>
  <BaseButton
    variant="danger"
    size="sm"
    :type="type"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <BaseIcon size="sm" class="mr-2">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </BaseIcon>
    <slot>{{ text }}</slot>
  </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from '~/components/common/BaseButton.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'

interface Props {
  text?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<Props>(), {
  text: 'Delete',
  disabled: false,
  type: 'submit',
})

defineEmits<{
  click: []
}>()
</script>
