<template>
  <div class="word-card" @click="$emit('click', word)">
    <div class="word-card-header">
      <div class="arabic-section">
        <div class="arabic-word rtl">{{ word.arabic }}</div>
        <div class="transliteration">{{ word.transliteration || 'No transliteration' }}</div>
      </div>
      <div class="word-actions">
        <BaseButton 
          variant="ghost" 
          size="sm" 
          @click.stop="$emit('edit', word)"
          class="action-button"
          title="Edit word"
        >
          <BaseIcon size="sm">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </BaseIcon>
        </BaseButton>
        <BaseButton 
          variant="ghost" 
          size="sm" 
          @click.stop="$emit('delete', word)"
          class="action-button delete-button"
          title="Delete word"
        >
          <BaseIcon size="sm">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </BaseIcon>
        </BaseButton>
      </div>
    </div>
    
    <div class="word-card-content">
      <div class="translation">{{ word.translation || 'No translation' }}</div>
      
      <div v-if="word.example" class="example">
        <p class="example-label">Example:</p>
        <span class="example-text rtl">{{ word.example }}</span>
      </div>

      <div v-if="word.notes" class="example">
        <p class="example-label">Notes:</p>
        <span class="example-text rtl">{{ word.notes }}</span>
      </div>
      
      <!-- Metadata badges -->
      <div class="metadata-section">
        <span :class="getDifficultyBadgeClass(word.difficulty)">
          {{ word.difficulty }}
        </span>
        <span :class="getMasteryBadgeClass(word.masteryLevel)">
          {{ word.masteryLevel || 'NEW' }}
        </span>
        <span class="dialect-badge">
          {{ word.dialect }}
        </span>
      </div>
      
      <!-- Dictionary links section -->
      <div v-if="hasLinks" class="dictionary-section">
        <div class="links-header">
          <BaseIcon size="xs" class="mr-1">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </BaseIcon>
          <span class="links-label">References</span>
        </div>
        
        <div class="links-grid">
          <!-- Pronunciation link -->
          <button
            v-if="word.pronunciationLink"
            @click.stop="openLink(word.pronunciationLink)"
            class="pronunciation-link-card"
            title="Listen to pronunciation"
          >
            <BaseIcon size="sm" class="mr-2">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 12.536a9 9 0 01-2.828-2.828M12 6v12m-8-6a8 8 0 108 8" />
            </BaseIcon>
            <span>Audio</span>
          </button>
          
          <!-- Dictionary links -->
          <button
            v-for="dictLink in word.dictionaryLinks"
            :key="dictLink.id"
            @click.stop="openLink(dictLink.url)"
            :class="getDictionaryCardClass(dictLink.type)"
            :title="`Open in ${dictLink.displayName || DICTIONARY_CONFIG[dictLink.type].name}`"
          >
            <span class="dictionary-icon">
              {{ DICTIONARY_CONFIG[dictLink.type].icon }}
            </span>
            <span class="dictionary-name">
              {{ dictLink.displayName || DICTIONARY_CONFIG[dictLink.type].name }}
            </span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Root link -->
    <div v-if="word.root" class="word-card-footer">
      <NuxtLink 
        :to="getRootDetailPath(word.root)" 
        class="root-link"
        @click.stop
      >
        <BaseIcon size="xs" class="mr-1">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </BaseIcon>
        Root: {{ word.root }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Word } from '@/types'
import { Difficulty, MasteryLevel } from '@/types/enums'
import { computed } from 'vue'
import { DICTIONARY_CONFIG, getDictionaryCardClass } from '~/config/dictionaries'
import BaseButton from '../common/BaseButton.vue'
import BaseIcon from '../common/BaseIcon.vue'

interface Props {
  word: Word
}

const props = defineProps<Props>()

defineEmits<{
  edit: [word: Word]
  delete: [word: Word]
  click: [word: Word]
}>()

const hasLinks = computed(() => {
  return Boolean(
    (props.word.dictionaryLinks && props.word.dictionaryLinks.length > 0) ||
      props.word.pronunciationLink
  )
})

// Utility methods for styling (same as WordTable)
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

// Create root link path
const getRootDetailPath = (rootString: string) => {
  return `/roots?search=${encodeURIComponent(rootString)}`
}
</script>

<style scoped>
.word-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden;
}

.word-card-header {
  @apply flex items-start justify-between p-4 pb-0;
}

.arabic-section {
  @apply flex-1 min-w-0;
}

.arabic-word {
  @apply text-xl font-semibold text-gray-900 mb-1 leading-tight;
  direction: rtl;
}

.transliteration {
  @apply text-sm text-gray-500;
}

.word-actions {
  @apply flex items-center space-x-1 ml-2;
}

.action-button {
  @apply text-gray-400 hover:text-gray-600 p-1;
}

.delete-button {
  @apply hover:text-red-600;
}

.word-card-content {
  @apply p-4 space-y-3;
}

.translation {
  @apply text-gray-900 font-medium;
}

.example {
  @apply text-sm text-gray-600;
}

.example-label {
  @apply font-bold italic;
}

.example-text {
  direction: rtl;
}

.metadata-section {
  @apply flex flex-wrap gap-2;
}

.dialect-badge {
  @apply px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700;
}

.dictionary-section {
  @apply mt-4 pt-3 border-t border-gray-100;
}

.links-header {
  @apply flex items-center text-xs font-medium text-gray-600 mb-2;
}

.links-label {
  @apply text-xs font-medium text-gray-600;
}

.links-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-2;
}

.pronunciation-link-card {
  @apply flex items-center p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors text-sm;
}

.dictionary-icon {
  @apply text-base;
}

.dictionary-name {
  @apply text-sm font-medium truncate;
}

.word-card-footer {
  @apply px-4 pb-4;
}

.root-link {
  @apply inline-flex items-center text-xs text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded-full transition-colors border border-purple-200;
}

.rtl {
  direction: rtl;
}
</style>
