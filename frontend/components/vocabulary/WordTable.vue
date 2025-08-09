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
              Root
            </th>
            <th scope="col" class="word-table-header">
              Links
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
          <tr v-for="word in words" :key="word.id" class="hover:bg-gray-50 transition-colors duration-150">
            <td class="word-table-cell">
              <div class="flex items-center">
                <div class="cursor-pointer hover:bg-blue-50 rounded-lg p-2 -m-2 transition-colors" @click="$emit('word-click', word)">
                  <div class="text-xl arabic text-left font-normal text-gray-900 rtl hover:text-blue-600 transition-colors">{{ word.arabic }}</div>
                  <aside class="text-sm italic text-gray-500">{{ word.transliteration || 'No transliteration' }}</aside>
                </div>
              </div>
            </td>
            <td class="word-table-cell">
              <div 
                class="text-sm text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                @click="$emit('word-click', word)"
              >
                {{ word.translation || 'No translation' }}
              </div>
            </td>
            <td class="word-table-cell">
              <div v-if="word.root" class="root-cell">
                <NuxtLink
                  :to="getRootDetailPath(word.root)"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors arabic"
                  :title="`Explore root: ${word.root}`"
                >
                  <BaseIcon size="xs" class="mr-1">
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </BaseIcon>
                  {{ word.root }}
                </NuxtLink>
              </div>
              <span v-else class="text-xs text-gray-400">No root</span>
            </td>
            <td class="word-table-cell">
              <div class="flex items-center space-x-1 flex-wrap">
                <!-- Pronunciation link -->
                <button
                  v-if="word.pronunciationLink"
                  @click="openLink(word.pronunciationLink)"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                  title="Listen to pronunciation"
                >
                  <BaseIcon size="xs" class="mr-1">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 12.536a9 9 0 01-2.828-2.828M12 6v12m-8-6a8 8 0 108 8" />
                  </BaseIcon>
                  Audio
                </button>
                
                <!-- Dictionary links -->
                <template v-if="word.dictionaryLinks && word.dictionaryLinks.length > 0">
                  <button
                    v-for="dictLink in word.dictionaryLinks.slice(0, 3)"
                    :key="dictLink.id"
                    @click="openLink(dictLink.url)"
                    :class="getDictionaryBadgeClass(dictLink.type)"
                    :title="dictLink.displayName || DICTIONARY_CONFIG[dictLink.type].name"
                  >
                    <span class="mr-1">{{ DICTIONARY_CONFIG[dictLink.type].icon }}</span>
                    <span class="hidden sm:inline">{{ (dictLink.displayName || DICTIONARY_CONFIG[dictLink.type].name).substring(0, 8) }}</span>
                  </button>
                  
                  <!-- More links dropdown -->
                  <BaseDropdown v-if="word.dictionaryLinks.length > 3" placement="bottom-end">
                    <template #trigger>
                      <button class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        +{{ word.dictionaryLinks.length - 3 }}
                      </button>
                    </template>
                    <template #content>
                      <div class="space-y-1">
                        <button
                          v-for="dictLink in word.dictionaryLinks.slice(3)"
                          :key="dictLink.id"
                          @click="openLink(dictLink.url)"
                          class="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <span class="mr-2">{{ DICTIONARY_CONFIG[dictLink.type].icon }}</span>
                          {{ dictLink.displayName || DICTIONARY_CONFIG[dictLink.type].name }}
                        </button>
                      </div>
                    </template>
                  </BaseDropdown>
                </template>
                
                <span v-if="!word.pronunciationLink && (!word.dictionaryLinks || word.dictionaryLinks.length === 0)" class="text-xs text-gray-400">
                  No links
                </span>
              </div>
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
            <td class="word-table-cell whitespace-nowrap text-right">
              <div class="flex items-center justify-end space-x-2">
                <button 
                  @click="openAllDictionaries(word.arabic)" 
                  class="action-btn dict-btn"
                  title="Open all dictionaries"
                >
                  <BaseIcon size="sm">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </BaseIcon>
                </button>
                <button 
                  @click="$emit('edit', word)" 
                  class="action-btn edit-btn"
                  title="Edit word"
                >
                  <BaseIcon size="sm">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </BaseIcon>
                </button>
                <button 
                  @click="$emit('delete', word)" 
                  class="action-btn delete-btn"
                  title="Delete word"
                >
                  <BaseIcon size="sm">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </BaseIcon>
                </button>
              </div>
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
import BaseDropdown from '~/components/common/BaseDropdown.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import {
  DICTIONARY_CONFIG,
  generateAllDictionaryLinks,
  getDictionaryBadgeClass,
} from '~/config/dictionaries'

interface Props {
  words: Word[]
}

defineProps<Props>()

defineEmits<{
  edit: [word: Word]
  delete: [word: Word]
  'word-click': [word: Word]
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

// Utility method for opening links
const openLink = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

// Open all dictionaries for a word
const openAllDictionaries = (arabicText: string) => {
  const dictionaryLinks = generateAllDictionaryLinks(arabicText)
  // Use setTimeout to avoid popup blockers and ensure all tabs open
  dictionaryLinks.forEach((link, index) => {
    setTimeout(() => {
      window.open(link.url, '_blank', 'noopener,noreferrer')
    }, index * 100) // Small delay between each tab opening
  })
}

// Create root link path - this is a simplified approach for demo
// In production, you'd want to get the actual root ID from the backend
const getRootDetailPath = (rootString: string) => {
  // For now, we'll use root normalization to try to find the root
  // This should be improved to use actual root IDs in production
  return `/roots?search=${encodeURIComponent(rootString)}`
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

.action-btn {
  @apply inline-flex items-center justify-center w-8 h-8 rounded-lg border border-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.edit-btn {
  @apply text-blue-600 hover:text-blue-700 hover:bg-blue-50 focus:ring-blue-500;
}

.delete-btn {
  @apply text-red-600 hover:text-red-700 hover:bg-red-50 focus:ring-red-500;
}

.dict-btn {
  @apply text-green-600 hover:text-green-700 hover:bg-green-50 focus:ring-green-500;
}

.rtl {
  direction: rtl;
}

.root-cell {
  @apply min-w-0;
}
</style>
