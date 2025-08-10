<template>
  <article class="container-notes">
    <h3 id="example-usage" class="word-note-header flex items-center gap-2">
      <BaseIcon size="lg" class="section-icon text-primary-600">
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </BaseIcon>
      Example Usage
    </h3>

    <section v-if="examples.length" aria-labelledby="example-usage">
      <article
        v-for="(ex, index) in examples"
        :key="index"
        class="example-item space-y-1 py-3 border-b border-green-100 last:border-0"
      >
        <p class="arabic text-left">{{ ex.example }}</p>
        <p v-if="ex.transliteration" class="italic text-sm">
          {{ ex.transliteration }}
        </p>
        <p v-if="ex.translation" class="example-translation text-gray-600">
          {{ ex.translation }}
        </p>
      </article>
    </section>
  </article>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/common/BaseIcon.vue'
import type { Word } from '~/types'

const wordStore = useWordStore()
const currentWord = computed((): Word | null => wordStore.currentWord)

type Example = {
  example: string
  translation?: string
  transliteration?: string
}

const isLikelyTransliteration = (text: string) => /[a-zA-Zāīūḍṣṭẓḥʿʾ]/.test(text)

const examples = computed<Example[]>(() => {
  const raw = currentWord.value?.example ?? ''
  const lines = raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

  const result: Example[] = []
  for (let i = 0; i < lines.length; ) {
    const ex: Example = { example: lines[i]! }

    const next = lines[i + 1]
    const third = lines[i + 2]

    if (next && !isArabicText(next)) {
      if (third && !isArabicText(third)) {
        if (isLikelyTransliteration(next)) {
          ex.transliteration = next
          ex.translation = third
        } else {
          ex.translation = next
          ex.transliteration = third
        }
        i += 3
      } else {
        ex.translation = next
        i += 2
      }
    } else {
      i += 1
    }

    result.push(ex)
  }

  return result
})
</script>

<style scoped>
.container-notes {
  @apply bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-xl p-6 border border-green-100/50;
  @apply shadow-sm;
  border: 1px solid #c6f6d5; /* Tailwind's green-200 */
}

.word-note-header {
  @apply text-lg font-bold mt-4;
  border-bottom: 2px solid #d1fae5;
  padding-bottom: 0.5rem;
}
</style>
