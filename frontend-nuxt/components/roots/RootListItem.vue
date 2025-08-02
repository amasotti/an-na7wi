<template>
  <div
    class="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
    @click="$emit('click')"
  >
    <div class="flex items-center justify-between">
      <!-- Root Info -->
      <div class="flex items-center space-x-4">
        <div class="text-xl font-bold text-gray-900 arabic">
          {{ root.displayForm }}
        </div>
        <div class="text-sm text-gray-600">
          {{ root.letterCount }} letters
        </div>
      </div>

      <!-- Word Count & Actions -->
      <div class="flex items-center space-x-3">
        <!-- Delete Button -->
        <button
          v-if="showDeleteButton && root.wordCount === 0"
          @click.stop="handleDelete"
          class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700"
          title="Delete root"
        >
          <BaseIcon size="xs">
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </BaseIcon>
        </button>
        
        <div class="text-sm text-gray-600">
          {{ root.wordCount }} words
        </div>
        <BaseIcon size="xs" class="text-gray-400 group-hover:text-primary-500 transition-colors">
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </BaseIcon>
      </div>
    </div>

    <!-- Meaning -->
    <div v-if="root.meaning" class="mt-2 text-sm text-gray-600 font-medium">
      {{ root.meaning }}
    </div>

    <!-- Root Letters -->
    <div class="flex space-x-2 mt-3">
      <span
        v-for="(letter, index) in root.letters"
        :key="index"
        class="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 text-sm font-medium rounded arabic"
      >
        {{ letter }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '@/components/common/BaseIcon.vue'
import type { Root } from '@/types'

interface Props {
  root: Root
  showDeleteButton?: boolean
}

interface Emits {
  (e: 'click'): void
  (e: 'delete', rootId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  showDeleteButton: false,
})

const emit = defineEmits<Emits>()

const handleDelete = (event: Event) => {
  event.stopPropagation()
  emit('delete', props.root.id)
}
</script>