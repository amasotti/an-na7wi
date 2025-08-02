<template>
  <BaseCard class="mb-8">
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <BaseInput
            :model-value="searchQuery"
            @update:model-value="$emit('update:searchQuery', $event)"
            placeholder="Search texts, titles, or content..."
            clearable
            icon-left="search"
          />
        </div>
        
        <BaseSelect
          :model-value="selectedDialect"
          @update:model-value="$emit('update:selectedDialect', $event)"
          :options="dialectOptions"
          placeholder="All Dialects"
        />
        
        <BaseSelect
          :model-value="selectedDifficulty"
          @update:model-value="$emit('update:selectedDifficulty', $event)"
          :options="difficultyOptions"
          placeholder="All Difficulties"
        />
      </div>
      
      <div class="flex flex-wrap gap-2">
        <BaseBadge
          v-for="tag in activeTags"
          :key="tag"
          closable
          @close="$emit('removeTag', tag)"
        >
          {{ tag }}
        </BaseBadge>
        
        <BaseButton
          v-if="hasActiveFilters"
          variant="ghost"
          size="sm"
          @click="$emit('clearFilters')"
        >
          Clear All
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { Dialect, Difficulty, SelectOption } from '@/types'
import BaseBadge from '../common/BaseBadge.vue'
import BaseButton from '../common/BaseButton.vue'
import BaseCard from '../common/BaseCard.vue'
import BaseInput from '../common/BaseInput.vue'
import BaseSelect from '../common/BaseSelect.vue'

interface Props {
  searchQuery: string
  selectedDialect: Dialect | null
  selectedDifficulty: Difficulty | null
  activeTags: string[]
  hasActiveFilters: boolean
  dialectOptions: SelectOption<Dialect>[]
  difficultyOptions: SelectOption<Difficulty>[]
}

defineProps<Props>()

defineEmits<{
  'update:searchQuery': [value: string]
  'update:selectedDialect': [value: Dialect | null]
  'update:selectedDifficulty': [value: Difficulty | null]
  removeTag: [tag: string]
  clearFilters: []
}>()
</script>