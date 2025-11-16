<template>
  <BaseButton
    :type="type"
    variant="outline"
    size="sm"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <BaseIcon size="sm" class="mr-2">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
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
  text: 'Cancel',
  disabled: false,
  type: 'button',
})

defineEmits<{
  click: []
}>()
</script>
