<template>
  <BaseCard 
    :class="computedCardClasses"
  >
    <!-- Card Header -->
    <div :class="headerClasses">
      <div class="flex-1 min-w-0">
        <h3 :class="titleClasses">
          {{ text.title }}
        </h3>
        <div :class="badgeContainerClasses">
          <BaseBadge :variant="difficultyColor" size="sm">
            {{ text.difficulty }}
          </BaseBadge>
          <BaseBadge variant="neutral" size="sm">
            {{ dialectLabel }}
          </BaseBadge>
        </div>
      </div>
      
      <!-- Actions Dropdown -->
      <div class="relative ml-4">
        <button
          @click="toggleDropdown"
          :class="actionButtonClasses"
        >
          <BaseIcon size="sm" class="text-gray-500">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
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
            <ActionMenuItem @click="viewText" icon="eye">
              View Details
            </ActionMenuItem>
            <ActionMenuItem @click="editText" icon="pencil">
              Edit Text
            </ActionMenuItem>
            <ActionMenuItem @click="duplicateText" icon="duplicate">
              Duplicate
            </ActionMenuItem>
            <hr class="my-2 border-gray-100">
            <ActionMenuItem @click="deleteText" icon="trash" danger>
              Delete
            </ActionMenuItem>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Arabic Content -->
    <div class="mb-4">
      <p :class="arabicContentClasses">
        {{ text.arabicContent }}
      </p>
    </div>

    <!-- Transliteration (if available) -->
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
          variant="neutral"
          size="sm"
        >
          {{ tag }}
        </BaseBadge>
        <BaseBadge
          v-if="text.tags.length > 3"
          variant="neutral"
          size="sm"
        >
          +{{ text.tags.length - 3 }}
        </BaseBadge>
      </div>
    </div>

    <!-- Footer -->
    <div :class="footerClasses">
      <div :class="footerInfoClasses">
        <span class="flex items-center">
          <BaseIcon size="xs" class="mr-1">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </BaseIcon>
          {{ text.wordCount }} words
        </span>
        <span>{{ formattedDate }}</span>
      </div>
      
      <router-link
        :to="`/texts/${text.id}`"
        :class="viewLinkClasses"
      >
        View
        <BaseIcon size="xs" class="ml-1">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </BaseIcon>
      </router-link>
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
  const baseClasses = combineClasses(cardClasses.base, 'group relative overflow-hidden')

  const viewModeClasses =
    props.viewMode === 'list' ? 'flex-1' : combineClasses('h-full', cardClasses.hover)

  return combineClasses(baseClasses, viewModeClasses)
})

const headerClasses = computed(() => `${layoutClasses.flex.between} mb-4`)
const titleClasses = computed(
  () => 'text-lg font-bold text-gray-900 truncate group-hover:text-primary-700 transition-colors'
)
const badgeContainerClasses = computed(() => `${layoutClasses.flex.center} space-x-2 mt-1`)
const actionButtonClasses = computed(
  () =>
    'p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all duration-200'
)
const dropdownClasses = computed(
  () =>
    'absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-10'
)
const arabicContentClasses = computed(() => combineClasses(textClasses.arabic.base, 'line-clamp-3'))
const transliterationClasses = computed(() => 'text-gray-600 italic text-sm line-clamp-2')
const tagsContainerClasses = computed(() => `${layoutClasses.flex.wrap} gap-1`)
const footerClasses = computed(() => `${layoutClasses.flex.between} text-sm text-gray-500`)
const footerInfoClasses = computed(() => `${layoutClasses.flex.center} space-x-4`)
const viewLinkClasses = computed(
  () => 'flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors'
)

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

const viewText = () => {
  dropdownOpen.value = false
  // Navigate to text detail view
}

const editText = () => {
  dropdownOpen.value = false
  emit('edit', props.text.id)
}

const duplicateText = () => {
  dropdownOpen.value = false
  emit('duplicate', props.text.id)
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
