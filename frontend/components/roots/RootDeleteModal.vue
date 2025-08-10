<template>
  <BaseModal
    :open="open"
    title="Delete Root"
    size="sm"
    @close="handleClose"
  >
    <div class="root-delete-content">
      <div class="warning-icon">
        <BaseIcon size="lg" class="text-red-500">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </BaseIcon>
      </div>
      
      <div class="text-center">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Are you sure you want to delete this root?
        </h3>
        
        <p class="text-gray-600 mb-4">
          Are you sure you want to delete the root <span class="font-bold arabic">{{ root?.displayForm }}</span>?
          This will also remove all <span class="font-bold">{{ root?.wordCount }} associated words</span>.
          This action cannot be undone.
        </p>
      </div>
    </div>

    <template #footer>
      <div class="modal-actions">
        <BaseButton variant="outline" @click="handleClose">
          Cancel
        </BaseButton>
        <BaseButton 
          variant="danger"
          @click="handleConfirm" 
          :loading="loading"
        >
          Delete Root
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { Root } from '@/types'
import BaseButton from '../common/BaseButton.vue'
import BaseIcon from '../common/BaseIcon.vue'
import BaseModal from '../common/BaseModal.vue'

interface Props {
  open: boolean
  loading?: boolean
  root?: Root | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  root: null,
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
.root-delete-content {
  @apply text-center;
}

.warning-icon {
  @apply flex justify-center mb-4;
}

.modal-actions {
  @apply flex gap-3 justify-end;
}

.arabic {
  direction: rtl;
}
</style>