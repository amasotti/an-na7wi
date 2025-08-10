<template>
  <LoadingEffect v-if="loading" />

  <section v-else class="container-related-words" aria-labelledby="related-words-title">
    <h2 id="related-words-title" class="text-lg font-semibold mb-4">
      <BaseIcon size="lg" class="section-icon text-teal-600">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </BaseIcon>
      Related Words (Same Root)
    </h2>

    <menu class="space-y-3">
      <li
        v-for="word in relatedWords"
        :key="word.id"
        class="p-4 rounded-lg border bg-white/60 shadow-sm hover:shadow transition"
      >
        <article class="flex flex-col" @click="handleWordClicked(word)">
          <header class="related-word-box">
            <h3 class="arabic font-bold text-emerald-700">{{ word.arabic }}</h3>
            <span class="text-sm text-gray-500 italic">({{ word.transliteration }})</span>
            <span class="text-gray-700 text-sm mt-1">{{ word.translation }}</span>
          </header>

        </article>
      </li>
    </menu>
  </section>
</template>

<script setup lang="ts">
import { rootService, useWordStore, wordService } from '#imports'
import LoadingEffect from '~/components/common/LoadingEffect.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import { ref } from 'vue'
import type { Word } from '~/types'

const wordStore = useWordStore()

const loading = ref(true)
const relatedWords = ref<Partial<Word>[]>([])
const currentWord = ref<Word | null>(wordStore.currentWord)

const loadRelatedWords = async () => {
  const root = currentWord.value?.root

  if (!root?.trim()) {
    relatedWords.value = []
    return
  }

  loading.value = true
  try {
    // First normalize the root to get the proper form
    const normalization = await rootService.normalizeRoot(root.trim())
    if (normalization.isValid) {
      const response = await wordService.findByRoot(normalization.displayForm, 1, 5)

      relatedWords.value = response.items
        .filter(word => word.id !== currentWord.value?.id)
        .map(word => ({
          id: word.id,
          arabic: word.arabic,
          transliteration: word.transliteration,
          translation: word.translation,
          partOfSpeech: word.partOfSpeech,
          difficulty: word.difficulty,
          dialect: word.dialect,
        }))
    }
  } catch (error) {
    console.error('Error loading related words:', error)
    relatedWords.value = []
  } finally {
    loading.value = false
  }
}

const handleWordClicked = (word: Partial<Word>) => {
  if (word.id) {
    wordStore
      .fetchWordById(word.id)
      .then(() => {
        // Navigate to the word details page
        navigateTo(`/words/${word.id}`)
      })
      .catch(error => {
        console.error('Error fetching word details:', error)
      })
  }
}

onMounted(() => {
  if (currentWord.value) {
    loadRelatedWords()
  }
})
</script>

<style scoped>
.container-related-words {
  @apply bg-gradient-to-br from-purple-50/50 to-violet-50/50 rounded-xl p-6 border border-purple-100/30;
  @apply shadow-lg;
  border: 1px solid rgba(209, 213, 219, 0.3);
}

.related-word-box {
  @apply flex items-baseline gap-3;
}

.related-word-box:hover {
  @apply bg-purple-100/50 shadow-md cursor-pointer;
}
</style>
