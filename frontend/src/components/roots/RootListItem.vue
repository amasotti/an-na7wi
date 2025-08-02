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

      <!-- Word Count & Arrow -->
      <div class="flex items-center space-x-3">
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
}

type Emits = (e: 'click') => void

defineProps<Props>()
defineEmits<Emits>()
</script>