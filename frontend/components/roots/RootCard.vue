<template>
  <article 
    class="root-card group"
    :class="mobileClasses"
    @click="handleClick"
  >
    <!-- Action Buttons - Positioned at top-left to avoid Arabic text -->
    <aside class="absolute top-3 left-3 z-10">
      <button
        @click.stop="handleDelete"
        class="action-button"
        title="Delete root"
        aria-label="Delete root"
      >
        <BaseIcon size="sm">
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
    </aside>

    <!-- Root Display -->
    <header class="text-center mb-4">
      <h3 :class="rootTextClasses">
        {{ root.displayForm }}
      </h3>
      <p v-if="root.meaning" :class="meaningClasses">
        {{ root.meaning }}
      </p>
    </header>

    <!-- Root Letters -->
    <section class="flex justify-center gap-2 mb-4">
      <span
        v-for="(letter, index) in root.letters"
        :key="index"
        class="letter-badge arabic"
      >
        {{ letter }}
      </span>
    </section>

    <!-- Root Stats -->
    <footer class="grid grid-cols-2 gap-4 text-center">
      <div class="stat-item">
        <div class="stat-number">{{ root.letterCount }}</div>
        <div class="stat-label">Letters</div>
      </div>
      <div class="stat-item">
        <div class="stat-number text-blue-600">{{ root.wordCount }}</div>
        <div class="stat-label">Words</div>
      </div>
    </footer>

    <!-- Hover Indicator -->
    <div class="hover-indicator">
      <BaseIcon size="sm" class="text-blue-500">
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
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import type { Root } from '~/types'

interface Props {
  root: Root
  mobile?: boolean
  showDeleteButton?: boolean
}

interface Emits {
  (e: 'click'): void
  (e: 'delete', rootId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  mobile: false,
  showDeleteButton: false,
})

const emit = defineEmits<Emits>()

const mobileClasses = computed(() =>
  props.mobile ? 'border rounded-lg' : 'border-b lg:border-r last:border-r-0'
)

const rootTextClasses = computed(() => [
  'text-3xl font-bold text-gray-900 arabic mb-2 text-center text-2xl',
])

const meaningClasses = computed(() => [
  'text-gray-600 font-medium',
  props.mobile ? 'text-sm' : 'text-base',
])

const handleClick = () => {
  emit('click')
}

const handleDelete = (event: Event) => {
  event.stopPropagation()
  emit('delete', props.root.id)
}
</script>

<style scoped>
.root-card {
  @apply relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300 hover:-translate-y-1;
}

.action-button {
  @apply p-2 rounded-full bg-white/90 text-red-500 hover:bg-red-50 hover:text-red-600 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200/50 backdrop-blur-sm opacity-0 group-hover:opacity-100;
}

.letter-badge {
  @apply inline-flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-700 text-lg font-semibold rounded-lg border border-blue-200;
}

.stat-item {
  @apply bg-gray-50 rounded-lg p-3;
}

.stat-number {
  @apply text-2xl font-bold text-gray-900;
}

.stat-label {
  @apply text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.hover-indicator {
  @apply absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1;
}

.root-card:hover {
  @apply bg-gradient-to-br from-blue-50/50 to-indigo-50/30;
}
</style>
