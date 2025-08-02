<template>
  <BaseCard class="mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <BaseInput
          :model-value="search"
          @update:model-value="$emit('update:search', $event)"
          placeholder="Search words..."
          clearable
          icon-left="search"
          @input="$emit('search-input')"
        />
      </div>
      <div>
        <BaseSelect
          :model-value="difficulty"
          @update:model-value="$emit('update:difficulty', $event)"
          :options="difficultyOptions"
          placeholder="All Difficulties"
          @change="$emit('filter-change')"
        />
      </div>
      <div>
        <BaseSelect
          :model-value="dialect"
          @update:model-value="$emit('update:dialect', $event)"
          :options="dialectOptions"
          placeholder="All Dialects"
          @change="$emit('filter-change')"
        />
      </div>
      <div>
        <BaseSelect
          :model-value="masteryLevel"
          @update:model-value="$emit('update:masteryLevel', $event)"
          :options="masteryLevelOptions"
          placeholder="All Levels"
          @change="$emit('filter-change')"
        />
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { SelectOption } from '@/types'
import { Difficulty, Dialect, MasteryLevel } from '@/types/enums'
import BaseCard from '../common/BaseCard.vue'
import BaseInput from '../common/BaseInput.vue'
import BaseSelect from '../common/BaseSelect.vue'

interface Props {
  search: string
  difficulty: string
  dialect: string
  masteryLevel: string
  difficultyOptions: SelectOption<Difficulty>[]
  dialectOptions: SelectOption<Dialect>[]
  masteryLevelOptions: SelectOption<MasteryLevel>[]
}

defineProps<Props>()

defineEmits<{
  'update:search': [value: string]
  'update:difficulty': [value: string]
  'update:dialect': [value: string]
  'update:masteryLevel': [value: string]
  'search-input': []
  'filter-change': []
}>()
</script>
