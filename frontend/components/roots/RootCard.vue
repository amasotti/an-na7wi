<template>
  <article 
    class="card-base card-interactive card-padding-sm group"
    :class="mobileClasses"
    @click="handleClick"
  >
    <!-- Root Display -->
    <header class="text-center">
      <h3 :class="rootTextClasses">
        {{ root.displayForm }}
      </h3>
      <p v-if="root.meaning" :class="meaningClasses">
        {{ root.meaning }}
      </p>
    </header>

    <!-- Root Details -->
    <section :class="detailsClasses">
      <dl class="flex-between text-small text-muted">
        <div>
          <dt class="sr-only">Letter count</dt>
          <dd>{{ root.letterCount }} letters</dd>
        </div>
        <div>
          <dt class="sr-only">Word count</dt>
          <dd>{{ root.wordCount }} words</dd>
        </div>
      </dl>
      
      <!-- Root Letters -->
      <div class="flex justify-center gap-sm mt-2">
        <span
          v-for="(letter, index) in root.letters"
          :key="index"
          class="flex-center w-6 h-6 bg-gray-100 text-gray-700 text-sm font-medium rounded arabic"
        >
          {{ letter }}
        </span>
      </div>
    </section>

    <!-- Action Buttons -->
    <aside :class="actionButtonsClasses" aria-label="Root actions">
      <!-- Delete Button -->
      <button
        v-if="showDeleteButton && root.wordCount === 0"
        @click.stop="handleDelete"
        class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 action-button text-red-600 hover:bg-red-100"
        title="Delete root"
        aria-label="Delete root"
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

      <!-- Hover Indicator -->
      <div class="opacity-0 group-hover:opacity-100 transition-medium">
        <BaseIcon size="xs" class="text-primary-400">
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
    </aside>
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
  'arabic-root font-bold',
  props.mobile ? 'text-xl' : 'text-2xl',
])

const meaningClasses = computed(() => [
  'text-muted font-medium',
  props.mobile ? 'text-xs' : 'text-small',
])

const detailsClasses = computed(() => 
  props.mobile ? 'space-xs' : 'space-sm'
)

const actionButtonsClasses = computed(() => [
  'absolute flex items-center gap-xs',
  props.mobile ? 'top-1 right-1' : 'top-2 right-2',
])

const handleClick = () => {
  emit('click')
}

const handleDelete = (event: Event) => {
  event.stopPropagation()
  emit('delete', props.root.id)
}
</script>