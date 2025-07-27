<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div v-if="open" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" :class="modalSizeClasses" @click.stop>
          <div class="modal-header" v-if="title || $slots.header">
            <slot name="header">
              <h3 class="modal-title">{{ title }}</h3>
            </slot>
            <button v-if="!persistent" @click="close" class="modal-close-btn">
              <BaseIcon size="sm">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </BaseIcon>
            </button>
          </div>
          
          <div class="modal-body">
            <slot />
          </div>
          
          <div class="modal-footer" v-if="$slots.footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import BaseIcon from './BaseIcon.vue'

interface Props {
  open: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  persistent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  persistent: false,
})

const emit = defineEmits<{
  close: []
}>()

const modalSizeClasses = computed(() => {
  const sizeMap = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl',
  }
  return sizeMap[props.size]
})

const handleOverlayClick = () => {
  if (!props.persistent) {
    close()
  }
}

const close = () => {
  emit('close')
}

// Handle escape key
watch(
  () => props.open,
  isOpen => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !props.persistent) {
          close()
        }
      }
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'

      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = ''
      }
    } else {
      document.body.style.overflow = ''
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50;
}

.modal-container {
  @apply bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col;
}

.modal-sm {
  @apply w-full max-w-sm;
}

.modal-md {
  @apply w-full max-w-md;
}

.modal-lg {
  @apply w-full max-w-2xl;
}

.modal-xl {
  @apply w-full max-w-4xl;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.modal-title {
  @apply text-lg font-semibold text-gray-900;
}

.modal-close-btn {
  @apply p-1 hover:bg-gray-100 rounded-full transition-colors;
}

.modal-body {
  @apply p-6 overflow-y-auto flex-1;
}

.modal-footer {
  @apply p-6 border-t border-gray-200 bg-gray-50;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}
</style>