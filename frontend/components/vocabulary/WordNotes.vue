<template>
  <article class="container-notes">
    <h2 id="word-note-header" class="word-note-header flex items-center gap-2">
      <BaseIcon size="lg" class="section-icon text-grey-600">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </BaseIcon>
      Notes
    </h2>

    <section aria-labelledby="word-notes">
      <article>
        {{ currentWord?.notes }}
      </article>
    </section>
  </article>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/common/BaseIcon.vue'
import type { Word } from '~/types'

const wordStore = useWordStore()
const currentWord = computed((): Word | null => wordStore.currentWord)
</script>

<style scoped>
.container-notes {
  @apply bg-gradient-to-br from-yellow-50/50 to-lime-50/40 rounded-xl p-6 border border-yellow-100/50;
  border: 1px solid #f6e05e; /* Tailwind's yellow-200 */
  @apply shadow-md;
}

.word-note-header {
  @apply text-lg font-bold mt-4;
  border-bottom: 1px solid #e2e8f0; /* Tailwind's gray-200 */
  padding-bottom: 0.5rem;
}
</style>
