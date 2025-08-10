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

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <BaseButton
        v-if="currentWord?.pronunciationLink"
        variant="outline"
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
        class="reference-card group"
      >
        <div class="flex items-center gap-3">
          <span class="dictionary-icon">
              {{ DICTIONARY_CONFIG[ref.type].icon }}
            </span>
          <span class="dictionary-name">
              {{ ref.displayName || DICTIONARY_CONFIG[ref.type].name }}
            </span>
        </div>
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

  dictionaryLinks.value.forEach((dict, index) => {
    window.open(dict.url, '_blank', 'noopener,noreferrer')
  })

  if (currentWord.value?.pronunciationLink) {
    window.open(currentWord.value.pronunciationLink, '_blank', 'noopener,noreferrer')
  }
}
</script>

<style scoped>
.references-container {
  @apply bg-gradient-to-br from-red-100/70 via-violet-100/50 to-pink-50/40 rounded-xl p-6 border border-red-300/50;
  border: 1px solid rgba(220, 38, 38, 0.1); /* Tailwind's red-200 */
  @apply shadow-md;
}

.referece-header {
  @apply text-lg font-bold mt-4;
  border-bottom: 1px solid #e2e8f0; /* Tailwind's gray-200 */
  padding-bottom: 0.5rem;
}

.reference-card {
  @apply flex items-center p-4 rounded-lg border bg-white shadow-sm transition-all;
}
.reference-card:hover {
  @apply shadow-md border-emerald-300;
  transform: translateY(-1px);
}

@media (hover: hover) {
  .reference-card:hover span {
    @apply text-emerald-700;
  }
}
</style>
