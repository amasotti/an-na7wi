<template>
  <BaseModal
    :open="open"
    title="Delete Word"
    size="sm"
    @close="handleClose"
  >
    <div class="word-delete-content">
      <div class="warning-icon">
        <BaseIcon size="lg" class="text-red-500">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </BaseIcon>
      </div>
      
      <div class="text-center">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Are you sure you want to delete this word?
        </h3>
        
        <p class="text-gray-600 mb-4">
          Are you sure you want to delete the word <span class="font-bold arabic">{{ word?.arabic }}</span>?
          This action cannot be undone.
        </p>
      </div>
    </div>

    <template #footer>
      <div class="form-actions">
        <CancelButton  @click="handleClose" />
        <DeleteButton @click="handleConfirm" :loading="loading" />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { Word } from '@/types'
import CancelButton from '~/components/common/CancelButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import BaseIcon from '../common/BaseIcon.vue'
import BaseModal from '../common/BaseModal.vue'

interface Props {
  open: boolean
  loading?: boolean
  word?: Word | null
}

withDefaults(defineProps<Props>(), {
  loading: false,
  word: null,
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
.word-delete-content {
  @apply text-center;
}

.warning-icon {
  @apply flex justify-center mb-4;
}

</style>
