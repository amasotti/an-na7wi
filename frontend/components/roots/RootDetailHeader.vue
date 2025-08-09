<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
    <div class="text-center space-y-6">
      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3">
        <BaseButton
          variant="outline"
          size="sm"
          @click="$emit('add-word')"
        >
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Word</span>
          </div>
        </BaseButton>
        <BaseButton
          variant="outline"
          size="sm"
          @click="$emit('edit')"
        >
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </div>
        </BaseButton>
      </div>

      <div class="space-y-3">
        <h1 class="text-5xl font-bold text-gray-900 arabic text-center">
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

      <!-- Root Display -->
      <div class="space-y-3">
        <div v-if="root.analysis" class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="text-sm font-semibold text-blue-900 mb-2">Linguistic Analysis</h3>
          <div class="text-left text-blue-800 prose prose-sm max-w-none prose-headings:text-blue-900 prose-strong:text-blue-900" v-html="$markdownit.render(root.analysis)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/common/BaseButton.vue'
import type { Root } from '@/types'
import { computed } from 'vue'

interface Props {
  root: Root
}

type Emits = {
  edit: []
  'add-word': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

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
