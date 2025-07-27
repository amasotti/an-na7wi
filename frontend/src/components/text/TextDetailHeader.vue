<template>
  <div class="mb-8">
    <div class="flex items-center justify-between mb-4">
      <router-link to="/texts" class="text-primary-600 hover:text-primary-700 font-medium flex items-center">
        <BaseIcon size="sm" class="mr-2">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </BaseIcon>
        Back to Texts
      </router-link>
      
      <div class="flex items-center gap-2">
        <!-- Primary Actions -->
        <div class="flex items-center gap-2">
          <BaseButton variant="outline" size="sm" @click="$emit('edit')">
            <BaseIcon size="sm" class="mr-2">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </BaseIcon>
            Edit
          </BaseButton>

          <!-- Dropdown Menu for Other Actions -->
          <div class="relative">
            <BaseButton variant="outline" size="sm" @click="toggleMenu">
              <BaseIcon size="sm">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
              </BaseIcon>
            </BaseButton>
            
            <div v-if="showMenu" class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-10">
              <button @click="handleMenuAction('toggleAnnotations')" class="w-full px-4 py-2 text-left flex items-center text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                <BaseIcon size="sm" class="mr-3">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </BaseIcon>
                {{ showAnnotations ? 'Hide' : 'Show' }} Annotations
              </button>
              
              <button @click="handleMenuAction('analyze')" class="w-full px-4 py-2 text-left flex items-center text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                <BaseIcon size="sm" class="mr-3">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </BaseIcon>
                Analyze Text
              </button>

              <div v-if="versions && versions.length > 1" class="border-t border-gray-100 my-1"></div>
              
              <div v-if="versions && versions.length > 1" class="px-4 py-2">
                <label class="text-xs text-gray-500 block mb-1">Version:</label>
                <select 
                  :value="selectedVersion" 
                  @change="handleVersionChange"
                  class="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option v-for="version in versions" :key="version.versionNumber" :value="version.versionNumber">
                    v{{ version.versionNumber }} ({{ formatVersionDate(version.createdAt) }})
                  </option>
                </select>
                <BaseButton v-if="viewingVersion" variant="outline" size="sm" class="w-full mt-2" @click="handleMenuAction('restoreVersion')">
                  <BaseIcon size="sm" class="mr-1">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </BaseIcon>
                  Restore
                </BaseButton>
              </div>

              <div class="border-t border-gray-100 my-1"></div>
              
              <button @click="handleMenuAction('delete')" class="w-full px-4 py-2 text-left flex items-center text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors">
                <BaseIcon size="sm" class="mr-3">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </BaseIcon>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ text?.title || 'Untitled' }}</h1>
    
    <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
      <div class="flex items-center gap-2">
        <BaseBadge :variant="difficultyColor" size="sm">
          {{ text?.difficulty }}
        </BaseBadge>
        <BaseBadge variant="neutral" size="sm">
          {{ dialectLabel }}
        </BaseBadge>
      </div>
      
      <div class="flex items-center">
        <BaseIcon size="xs" class="mr-1">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </BaseIcon>
        {{ text?.wordCount }} words
      </div>
      
      <span>Updated {{ formattedDate }}</span>
    </div>

    <!-- Tags -->
    <div v-if="text?.tags.length > 0" class="flex flex-wrap gap-2 mt-4">
      <BaseBadge
        v-for="tag in text.tags"
        :key="tag"
        variant="neutral"
        size="sm"
      >
        {{ tag }}
      </BaseBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BadgeVariant, Dialect, Difficulty, Text, TextVersion } from '@/types'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import BaseBadge from '../common/BaseBadge.vue'
import BaseButton from '../common/BaseButton.vue'
import BaseIcon from '../common/BaseIcon.vue'

interface Props {
  text: Text | null
  versions: TextVersion[] | null
  viewingVersion: TextVersion | null
  selectedVersion: number
  showAnnotations: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  versionChange: [version: string]
  restoreVersion: []
  toggleAnnotations: []
  analyze: []
  edit: []
  delete: []
}>()

const showMenu = ref(false)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const handleMenuAction = (action: string) => {
  showMenu.value = false
  switch (action) {
    case 'toggleAnnotations':
      emit('toggleAnnotations')
      break
    case 'analyze':
      emit('analyze')
      break
    case 'restoreVersion':
      emit('restoreVersion')
      break
    case 'delete':
      emit('delete')
      break
  }
}

const handleVersionChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('versionChange', target.value)
}

const difficultyColor = computed(() => {
  if (!props.text) return 'neutral'
  const colors = {
    [Difficulty.BEGINNER]: 'success',
    [Difficulty.INTERMEDIATE]: 'warning',
    [Difficulty.ADVANCED]: 'error',
  }
  return colors[props.text.difficulty] as BadgeVariant
})

const dialectLabel = computed(() => {
  if (!props.text) return ''
  const labels = {
    [Dialect.TUNISIAN]: 'Tunisian',
    [Dialect.MOROCCAN]: 'Moroccan',
    [Dialect.EGYPTIAN]: 'Egyptian',
    [Dialect.MSA]: 'MSA',
  }
  return labels[props.text.dialect]
})

const formattedDate = computed(() => {
  if (!props.text) return ''
  return new Date(props.text.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
})

const formatVersionDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    if (!target.closest('.relative') && showMenu.value) {
      showMenu.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
