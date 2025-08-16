<template>
  <section class="references-container" aria-labelledby="word-references-title">
    <h2 id="word-reference" class="referece-header">
      <BaseIcon size="lg" class="section-icon text-grey-600">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </BaseIcon>
      Dictionary Links
    </h2>

    <!-- Open all links button    -->
    <div class="flex justify-end mb-4">
      <BaseButton
        variant="outline"
        @click.stop="openAllDictionaries"
        title="Open all links in new tabs"
      >
        <BaseIcon size="sm" class="mr-2">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </BaseIcon>
        Open All
      </BaseButton>
    </div>

    <div class="references-list">
      <BaseButton
        v-if="currentWord?.pronunciationLink"
        variant="outline"
        class="reference-button"
        @click.stop="openLink(currentWord.pronunciationLink)"
        title="Listen to pronunciation"
      >
        <BaseIcon size="sm" class="mr-2">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 12.536a9 9 0 01-2.828-2.828M12 6v12m-8-6a8 8 0 108 8" />
        </BaseIcon>
        <span>Audio</span>
      </BaseButton>
      <a
        v-for="ref in dictionaryLinks"
        :key="ref.id"
        :href="ref.url"
        target="_blank"
        rel="noopener noreferrer"
        class="reference-card"
      >
        <span class="dictionary-icon">
          {{ DICTIONARY_CONFIG[ref.type].icon }}
        </span>
        <span class="dictionary-name">
          {{ ref.displayName || DICTIONARY_CONFIG[ref.type].name }}
        </span>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseButton from '~/components/common/BaseButton.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import { DICTIONARY_CONFIG } from '~/config/dictionaries'
import { openLink } from '~/utils/linkUtils'

const wordStore = useWordStore()

const currentWord = computed(() => wordStore.currentWord)
const dictionaryLinks = computed(() => wordStore.dictionaryLinks)

const openAllDictionaries = () => {
  if (!dictionaryLinks.value || dictionaryLinks.value.length === 0) {
    console.warn('No dictionary links available to open.')
    return
  }

  dictionaryLinks.value.forEach((dict, _index) => {
    window.open(dict.url, '_blank', 'noopener,noreferrer')
  })

  if (currentWord.value?.pronunciationLink) {
    window.open(currentWord.value.pronunciationLink, '_blank', 'noopener,noreferrer')
  }
}
</script>

<style scoped>
.references-container {
  @apply bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden;
}

.referece-header {
  @apply text-lg font-semibold mb-0 text-gray-900 px-6 pt-6 border-b border-blue-100 pb-4;
  @apply bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center gap-2;
}

.references-container > div:first-of-type {
  @apply px-6 pt-4;
}

.references-list {
  @apply px-6 pb-6 space-y-3;
}

.reference-button {
  @apply w-full;
}

.reference-card {
  @apply flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white transition-all duration-200;
  @apply hover:shadow-sm hover:border-gray-300 w-full;
}

.dictionary-icon {
  @apply text-lg flex-shrink-0;
}

.dictionary-name {
  @apply font-medium text-gray-700 truncate;
}

.section-icon {
  @apply text-blue-600;
}
</style>
