<template>
  <BaseModal
    :open="open"
    title="Delete Text"
    size="sm"
    @close="handleClose"
  >
    <div class="text-center">
      <div class="warning-icon">
        <BaseIcon size="lg" class="text-red-500">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </BaseIcon>
      </div>
      
      <div class="text-center">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Are you sure you want to delete this text?
        </h3>
        
        <p class="text-gray-600 mb-4">
          This action cannot be undone. The text "{{ text?.title }}" and all its associated data will be permanently deleted.
        </p>
        
        <div class="text-sm text-gray-500 bg-gray-50 rounded-lg p-3 mb-4">
          <p class="font-medium mb-1">This will also delete:</p>
          <ul class="list-disc list-inside space-y-1">
            <li>All text versions and history</li>
            <li>Associated annotations</li>
            <li>Text-word relationships</li>
          </ul>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="form-actions">
        <CancelButton @click="handleClose"/>
        <DeleteButton :loading="loading" @click="handleConfirm"/>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { Text } from '@/types'
import CancelButton from '~/components/common/CancelButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import BaseIcon from '../common/BaseIcon.vue'
import BaseModal from '../common/BaseModal.vue'

interface Props {
  open: boolean
  loading?: boolean
  text?: Text | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  text: null,
})

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style scoped>
.warning-icon {
  @apply flex justify-center mb-4;
}
</style>
