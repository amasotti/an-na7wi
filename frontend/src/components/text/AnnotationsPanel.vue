<template>
  <div v-if="show" class="lg:col-span-1">
    <BaseCard>
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Annotations</h2>
      
      <div v-if="annotations.length === 0" class="text-center py-8 text-gray-500">
        <BaseIcon size="lg" class="mx-auto mb-2">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </BaseIcon>
        <p>No annotations yet</p>
        <p class="text-sm mt-1">Annotations will appear here when available</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="annotation in annotations"
          :key="annotation.id"
          class="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <div class="flex items-start justify-between mb-2">
            <BaseBadge 
              :variant="getAnnotationColor(annotation.type)"
              size="sm"
            >
              {{ annotation.type }}
            </BaseBadge>
            <span class="text-xs text-gray-500">
              {{ formatAnnotationDate(annotation.createdAt) }}
            </span>
          </div>
          <p class="text-sm text-gray-700">{{ annotation.content }}</p>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import type { Annotation, BadgeVariant } from '@/types'
import BaseBadge from '../common/BaseBadge.vue'
import BaseCard from '../common/BaseCard.vue'
import BaseIcon from '../common/BaseIcon.vue'

interface Props {
  show: boolean
  annotations: Annotation[]
}

defineProps<Props>()

const getAnnotationColor = (type: string): BadgeVariant => {
  const colors = {
    GRAMMAR: 'primary' as const,
    VOCABULARY: 'success' as const,
    CULTURAL: 'warning' as const,
    PRONUNCIATION: 'error' as const,
  }
  return colors[type as keyof typeof colors] || 'neutral'
}

const formatAnnotationDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
</script>