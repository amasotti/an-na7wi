<template>
  <BaseButton
    variant="primary"
    size="sm"
    class="add-button"
    @click="$emit('click')"
  >
    <BaseIcon size="sm" class="mr-2">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </BaseIcon>
    <slot>Add</slot>
  </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from '~/components/common/BaseButton.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.add-button {
  @apply bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 shadow-sm hover:shadow-md transform hover:scale-[1.01] transition-all duration-200;
}
</style>
