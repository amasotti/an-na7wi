<template>
  <BaseCard class="h-fit">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <BaseIcon size="md" class="text-primary-600">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </BaseIcon>
        <h2 class="text-xl font-semibold text-gray-900">Annotations</h2>
      </div>
      
      <!-- New Annotation Button -->
      <BaseButton 
        v-if="annotations.length > 0"
        variant="primary" 
        size="sm" 
        @click="$emit('create-annotation')"
        class="flex items-center space-x-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
      >
        <BaseIcon size="sm" class="text-white">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </BaseIcon>
        <span class="font-medium">New</span>
      </BaseButton>
    </div>
    
    <!-- Empty State -->
    <div v-if="annotations.length === 0" class="text-center py-12">
      <div class="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <BaseIcon size="xl" class="text-gray-400">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </BaseIcon>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No annotations yet</h3>
      <p class="text-gray-600 mb-6 max-w-sm mx-auto">
        Select text and click "Annotate" to add your first annotation and enhance your learning experience.
      </p>
      
      <!-- Elegant Create Button -->
      <BaseButton 
        variant="primary" 
        size="md" 
        @click="$emit('create-annotation')"
        class="inline-flex items-center space-x-3 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <div class="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <BaseIcon size="sm" class="text-white">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </BaseIcon>
        </div>
        <span class="font-semibold">Create Annotation</span>
      </BaseButton>
    </div>

    <!-- Annotations List -->
    <div v-else class="space-y-4">
      <div
        v-for="annotation in annotations"
        :key="annotation.id"
        class="group p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
        @click="$emit('edit-annotation', annotation)"
      >
        <!-- Annotation Header -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <BaseBadge 
              :variant="getAnnotationColor(annotation.type)"
              size="sm"
              class="font-medium"
            >
              {{ annotation.type }}
            </BaseBadge>
            <span class="text-xs text-gray-500 font-medium">
              {{ formatAnnotationDate(annotation.createdAt) }}
            </span>
          </div>
          
          <!-- Hover Actions -->
          <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2">
            <BaseIcon size="sm" class="text-gray-400 hover:text-primary-600 transition-colors">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </BaseIcon>
          </div>
        </div>
        
        <!-- Annotation Content -->
        <div class="space-y-3">
          <div class="flex items-start space-x-3">
            <div class="w-1 h-12 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full flex-shrink-0 mt-1"></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
                "{{ annotation.anchorText }}"
              </p>
              <p class="text-sm text-gray-700 leading-relaxed line-clamp-3">
                {{ annotation.content }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Optional indicators -->
        <div v-if="annotation.needsReview" class="mt-3 flex items-center">
          <div class="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
          <span class="text-xs text-yellow-700 font-medium">Needs Review</span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { Annotation, BadgeVariant } from '@/types'
import BaseBadge from '../common/BaseBadge.vue'
import BaseButton from '../common/BaseButton.vue'
import BaseCard from '../common/BaseCard.vue'
import BaseIcon from '../common/BaseIcon.vue'

interface Props {
  annotations: Annotation[]
}

defineProps<Props>()

defineEmits<{
  'create-annotation': []
  'edit-annotation': [annotation: Annotation]
}>()

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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>