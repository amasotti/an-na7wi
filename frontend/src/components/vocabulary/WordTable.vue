<template>
  <div class="word-table">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="word-table-header">
              Word
            </th>
            <th scope="col" class="word-table-header">
              Translation
            </th>
            <th scope="col" class="word-table-header">
              Difficulty
            </th>
            <th scope="col" class="word-table-header">
              Mastery
            </th>
            <th scope="col" class="word-table-header">
              Dialect
            </th>
            <th scope="col" class="word-table-header text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="word in words" :key="word.id" class="hover:bg-gray-50">
            <td class="word-table-cell">
              <div class="flex items-center">
                <div>
                  <div class="text-lg font-medium text-gray-900 rtl">{{ word.arabic }}</div>
                  <div class="text-sm text-gray-500">{{ word.transliteration }}</div>
                </div>
              </div>
            </td>
            <td class="word-table-cell">
              <div class="text-sm text-gray-900">{{ word.translation }}</div>
            </td>
            <td class="word-table-cell whitespace-nowrap">
              <span :class="getDifficultyBadgeClass(word.difficulty)">
                {{ word.difficulty }}
              </span>
            </td>
            <td class="word-table-cell whitespace-nowrap">
              <span :class="getMasteryBadgeClass(word.masteryLevel)">
                {{ word.masteryLevel || 'NEW' }}
              </span>
            </td>
            <td class="word-table-cell whitespace-nowrap text-sm text-gray-500">
              {{ word.dialect }}
            </td>
            <td class="word-table-cell whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="$emit('edit', word)" 
                class="word-table-action-btn word-table-edit-btn"
              >
                Edit
              </button>
              <button 
                @click="$emit('delete', word)" 
                class="word-table-action-btn word-table-delete-btn"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Word } from '@/types'
import { Difficulty, MasteryLevel } from '@/types/enums'

interface Props {
  words: Word[]
}

defineProps<Props>()

defineEmits<{
  edit: [word: Word]
  delete: [word: Word]
}>()

// Utility methods for styling
const getDifficultyBadgeClass = (difficulty: Difficulty) => {
  const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
  switch (difficulty) {
    case Difficulty.BEGINNER:
      return `${baseClasses} bg-green-100 text-green-800`
    case Difficulty.INTERMEDIATE:
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    case Difficulty.ADVANCED:
      return `${baseClasses} bg-red-100 text-red-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

const getMasteryBadgeClass = (masteryLevel?: MasteryLevel) => {
  const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
  switch (masteryLevel) {
    case MasteryLevel.NEW:
      return `${baseClasses} bg-blue-100 text-blue-800`
    case MasteryLevel.LEARNING:
      return `${baseClasses} bg-purple-100 text-purple-800`
    case MasteryLevel.KNOWN:
      return `${baseClasses} bg-indigo-100 text-indigo-800`
    case MasteryLevel.MASTERED:
      return `${baseClasses} bg-green-100 text-green-800`
    default:
      return `${baseClasses} bg-blue-100 text-blue-800`
  }
}
</script>

<style scoped>
.word-table {
  @apply bg-white rounded-xl shadow-sm overflow-hidden;
}

.word-table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.word-table-cell {
  @apply px-6 py-4;
}

.word-table-action-btn {
  @apply text-sm font-medium;
}

.word-table-edit-btn {
  @apply text-primary-600 hover:text-primary-900 mr-3;
}

.word-table-delete-btn {
  @apply text-red-600 hover:text-red-900;
}

.rtl {
  direction: rtl;
}
</style>
