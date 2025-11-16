<template>
  <BaseButton
    variant="outline"
    size="sm"
    :type="type"
    :disabled="disabled"
    :loading="loading"
    class="edit-button"
    @click="$emit('click')"
  >
    <BaseIcon size="sm" class="mr-2">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </BaseIcon>
    <slot>{{ text }}</slot>
  </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from '~/components/common/BaseButton.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import type { ButtonRole } from '~/types'

interface EditBtnProps {
  text?: string
  loading?: boolean
  disabled?: boolean
  type?: ButtonRole
}

withDefaults(defineProps<EditBtnProps>(), {
  text: 'Edit',
  loading: false,
  disabled: false,
  type: 'button',
})

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.edit-button {
  @apply text-blue-600 hover:text-blue-700 border-blue-300 hover:border-blue-400 hover:bg-blue-50 shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-200;
}
</style>
