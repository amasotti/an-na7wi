<template>
  <div class="text-detail animate-fade-in">
    <div class="text-center py-16">
      <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center shadow-xl">
        <BaseIcon size="xl" class="text-white">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </BaseIcon>
      </div>
      
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Text Detail View</h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Interactive text viewer with annotations, vocabulary highlights, and learning tools.
      </p>
      
      <div class="inline-flex items-center px-6 py-3 bg-yellow-100 text-yellow-800 rounded-2xl font-medium">
        <BaseIcon size="sm" class="mr-2">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </BaseIcon>
        Coming Soon - Under Development
      </div>
      
      <div class="mt-8">
        <router-link to="/texts" class="text-primary-600 hover:text-primary-700 font-medium">
          ← Back to Texts
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '../components/common/BaseIcon.vue'

interface Props {
  id: string
}

const props = defineProps<Props>()

// In a real implementation, this would fetch the text data using the ID
console.log('Text ID:', props.id)
</script>