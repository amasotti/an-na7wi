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
        <div v-html="formattedNotes"></div>
      </article>
    </section>
  </article>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/common/BaseIcon.vue'
import type { Word } from '~/types'

const wordStore = useWordStore()
const currentWord = computed((): Word | null => wordStore.currentWord)

// Convert \n to <br> for line breaks in notes
const formattedNotes = computed(() => {
  if (!currentWord.value?.notes) return ''
  return currentWord.value.notes.replace(/\n/g, '<br>')
})


</script>

<style scoped>
.container-notes {
  @apply bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden;
}

.word-note-header {
  @apply text-lg font-semibold mb-0 text-gray-900 px-6 pt-6 border-b border-amber-100 pb-4;
  @apply bg-gradient-to-r from-amber-50 to-yellow-50;
}

section {
  @apply p-6;
}

article {
  @apply text-gray-700 leading-relaxed;
}
</style>
