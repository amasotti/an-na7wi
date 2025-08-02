<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
    <div class="text-center space-y-6">
      <!-- Root Display -->
      <div class="space-y-3">
        <h1 class="text-5xl font-bold text-gray-900 arabic">
          {{ root.displayForm }}
        </h1>
        <div v-if="root.meaning" class="text-xl text-gray-700 font-medium">
          {{ root.meaning }}
        </div>
      </div>

      <!-- Root Letters -->
      <div class="flex justify-center space-x-3">
        <div
          v-for="(letter, index) in root.letters"
          :key="index"
          class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-100 to-blue-100 text-primary-700 text-xl font-bold rounded-xl arabic border border-primary-200"
        >
          {{ letter }}
        </div>
      </div>

      <!-- Root Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-primary-600">{{ root.letterCount }}</div>
          <div class="text-sm text-gray-600">Letters</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ root.wordCount }}</div>
          <div class="text-sm text-gray-600">Words</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ rootType }}</div>
          <div class="text-sm text-gray-600">Root Type</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">{{ root.normalizedForm }}</div>
          <div class="text-sm text-gray-600">Normalized</div>
        </div>
      </div>

      <!-- Root Info -->
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Display Form:</span>
            <span class="font-mono arabic">{{ root.displayForm }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Normalized:</span>
            <span class="font-mono arabic">{{ root.normalizedForm }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Added:</span>
            <span>{{ formatDate(root.createdAt) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Updated:</span>
            <span>{{ formatDate(root.updatedAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Root } from '@/types'
import { computed } from 'vue'

interface Props {
  root: Root
}

const props = defineProps<Props>()

const rootType = computed(() => {
  switch (props.root.letterCount) {
    case 2:
      return 'Bilateral'
    case 3:
      return 'Trilateral'
    case 4:
      return 'Quadrilateral'
    case 5:
      return 'Quinqueliteral'
    default:
      return `${props.root.letterCount}-Letter`
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>