<template>
  <div class="flex justify-between items-center mb-6">
    <div class="text-sm text-gray-600">
      <span v-if="texts && texts.length > 0">
        Showing {{ texts.length }} of {{ totalCount }} texts
      </span>
      <span v-else>
        No texts yet
      </span>
    </div>
    
    <BaseSelect
      :model-value="sortBy"
      @update:model-value="$emit('update:sortBy', $event)"
      :options="sortOptions"
      size="sm"
      class="w-48"
    />
  </div>
</template>

<script setup lang="ts">
import type { SelectOption, Text } from '@/types'
import BaseSelect from '../common/BaseSelect.vue'

interface Props {
  texts: Text[] | null
  totalCount: number
  sortBy: string
  sortOptions: SelectOption<string>[]
}

defineProps<Props>()

defineEmits<{
  'update:sortBy': [value: string]
}>()
</script>