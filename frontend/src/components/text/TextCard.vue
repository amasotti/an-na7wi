<template>
  <BaseCard 
    :class="computedCardClasses"
  >
    <!-- Actions Menu - Top Right Corner -->
    <div class="absolute top-4 right-4 z-10">
      <button
        @click="toggleDropdown"
        :class="actionButtonClasses"
      >
        <BaseIcon size="xs">
          <path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 5v.01M12 12v.01M12 19v.01" />
        </BaseIcon>
      </button>
      
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 scale-95 -translate-y-2"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 -translate-y-2"
      >
        <div
          v-if="dropdownOpen"
          :class="dropdownClasses"
        >
          <router-link
            :to="`/texts/${text.id}`"
          >
          <ActionMenuItem icon="eye">
            View Text
          </ActionMenuItem>
          </router-link>
          <ActionMenuItem @click="editText" icon="pencil">
            Edit Text
          </ActionMenuItem>
          <hr class="my-2 border-gray-100">
          <ActionMenuItem @click="deleteText" icon="trash" danger>
            Delete
          </ActionMenuItem>
        </div>
      </Transition>
    </div>

    <!-- Card Content -->
    <div class="pr-10">
      <!-- Title -->
      <h3 :class="titleClasses">
        {{ text.title }}
      </h3>
      
      <!-- Badges Row -->
      <div class="flex items-center gap-2 mb-4 mt-2">
        <BaseBadge :variant="difficultyColor" size="sm">
          {{ text.difficulty }}
        </BaseBadge>
        <BaseBadge variant="neutral" size="sm">
          {{ dialectLabel }}
        </BaseBadge>
      </div>

      <!-- Arabic Content -->
      <div class="mb-4">
        <p :class="arabicContentClasses">
          {{ text.arabicContent }}
        </p>
      </div>

      <!-- Transliteration (if available and in list mode) -->
      <div v-if="text.transliteration && viewMode === 'list'" class="mb-4">
        <p :class="transliterationClasses">
          {{ text.transliteration }}
        </p>
      </div>

      <!-- Tags -->
      <div v-if="text.tags.length > 0" class="mb-4">
        <div :class="tagsContainerClasses">
          <BaseBadge
            v-for="tag in text.tags.slice(0, 3)"
            :key="tag"
            variant="secondary"
            size="sm"
          >
            {{ tag }}
          </BaseBadge>
          <BaseBadge
            v-if="text.tags.length > 3"
            variant="secondary"
            size="sm"
          >
            +{{ text.tags.length - 3 }}
          </BaseBadge>
        </div>
      </div>
    </div>

    <!-- Footer - Always at bottom -->
    <div class="mt-auto pt-4 border-t border-gray-100">
      <div class="flex items-center justify-between text-xs text-gray-500">
        <span class="flex items-center">
          <BaseIcon size="xs" class="mr-1">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </BaseIcon>
          {{ text.wordCount }} words
        </span>
        
        <span>{{ formattedDate }}</span>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import {
  cardClasses,
  combineClasses,
  layoutClasses,
  textClasses,
} from '@/styles/component-classes.ts'
import type { Text } from '@/types'
import { Dialect, Difficulty } from '@/types'
import type { BadgeVariant } from '@/types'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ActionMenuItem from './ActionMenuItem.vue'

interface Props {
  text: Text
  viewMode?: 'grid' | 'list'
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'grid',
})

const emit = defineEmits<{
  edit: [textId: string]
  delete: [textId: string]
  duplicate: [textId: string]
}>()

const dropdownOpen = ref(false)

// Computed classes using the style system
const computedCardClasses = computed(() => {
  const baseClasses = combineClasses(
    cardClasses.base,
    'group relative overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col'
  )

  const viewModeClasses = props.viewMode === 'list' ? 'flex-1' : 'h-full'

  return combineClasses(baseClasses, viewModeClasses)
})

const titleClasses = computed(
  () =>
    'text-lg font-bold text-gray-900 truncate group-hover:text-primary-700 transition-colors mb-0'
)
const actionButtonClasses = computed(
  () =>
    'p-1.5 rounded-full bg-primary-500 text-white hover:bg-primary-400 shadow-md hover:shadow-lg transition-all duration-200 border-0'
)
const dropdownClasses = computed(
  () =>
    'absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20'
)
const arabicContentClasses = computed(() => combineClasses(textClasses.arabic.base, 'line-clamp-3'))
const transliterationClasses = computed(() => 'text-gray-600 italic text-sm line-clamp-2')
const tagsContainerClasses = computed(() => `${layoutClasses.flex.wrap} gap-1`)

// Other computed properties
const difficultyColor = computed(() => {
  const colors = {
    [Difficulty.BEGINNER]: 'success',
    [Difficulty.INTERMEDIATE]: 'warning',
    [Difficulty.ADVANCED]: 'error',
  }
  return colors[props.text.difficulty] as BadgeVariant
})

const dialectLabel = computed(() => {
  const labels = {
    [Dialect.TUNISIAN]: 'Tunisian',
    [Dialect.MOROCCAN]: 'Moroccan',
    [Dialect.EGYPTIAN]: 'Egyptian',
    [Dialect.MSA]: 'MSA',
  }
  return labels[props.text.dialect]
})

const formattedDate = computed(() => {
  return new Date(props.text.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
})

// Methods
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const editText = () => {
  dropdownOpen.value = false
  emit('edit', props.text.id)
}

const deleteText = () => {
  dropdownOpen.value = false
  emit('delete', props.text.id)
}

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    if (!target.closest('.relative') && dropdownOpen.value) {
      dropdownOpen.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
