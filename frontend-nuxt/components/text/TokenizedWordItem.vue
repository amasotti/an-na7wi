<template>
  <div
    class="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
    @click="$emit('click', word.arabic)"
  >
    <div class="flex items-start space-x-4">
      <!-- Arabic Word -->
      <div class="flex-shrink-0">
        <div class="text-2xl font-bold text-gray-900 arabic">
          {{ word.arabic }}
        </div>
      </div>

      <!-- Word Details -->
      <div class="flex-grow min-w-0 space-y-2">
        <!-- Transliteration -->
        <div v-if="word.transliteration" class="text-sm text-gray-600 font-medium">
          {{ word.transliteration }}
        </div>

        <!-- Translation -->
        <div v-if="word.translation" class="text-gray-800">
          {{ word.translation }}
        </div>

        <!-- Metadata -->
        <div class="flex flex-wrap items-center gap-2">
          <BaseBadge
            v-if="word.partOfSpeech"
            variant="secondary"
            size="sm"
          >
            {{ word.partOfSpeech }}
          </BaseBadge>
          
          <BaseBadge
            :variant="getDifficultyVariant(word.difficulty)"
            size="sm"
          >
            {{ word.difficulty }}
          </BaseBadge>

          <BaseBadge
            v-if="word.dialect !== 'MSA'"
            variant="outline"
            size="sm"
          >
            {{ word.dialect }}
          </BaseBadge>

          <BaseBadge
            v-if="word.root"
            variant="neutral"
            size="sm"
          >
            Root: {{ word.root }}
          </BaseBadge>
        </div>
      </div>

      <!-- Navigation Arrow -->
      <div class="flex-shrink-0 pt-1">
        <BaseIcon 
          size="sm" 
          class="text-gray-400 group-hover:text-primary-500 transition-colors"
        >
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
  </div>
</template>

<script setup lang="ts">
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import type { Word } from '@/types'

interface Props {
  word: Word
}

type Emits = (e: 'click', arabic: string) => void

defineProps<Props>()
defineEmits<Emits>()

const getDifficultyVariant = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'success'
    case 'intermediate':
      return 'warning'
    case 'advanced':
      return 'error'
    default:
      return 'secondary'
  }
}
</script>