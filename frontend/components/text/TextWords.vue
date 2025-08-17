<template>
  <article class="bg-white rounded-xl shadow-sm border border-gray-200">
    <header class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">
          Related Words
        </h2>
        <BaseBadge variant="primary">
          {{ words.length }} words
        </BaseBadge>
      </div>
    </header>

    <!-- Loading State -->
    <LoadingEffect v-if="loading" />

    <!-- Empty State -->
    <BaseEmptyState
      v-else-if="noWords"
      link="/words"
      link-text="No words found"
      message="No vocabulary words are referenced in annotations for this text."
    />

    <!-- Words List -->
    <section v-else>
      <!-- Header -->
      <div class="related-word-tbl-header grid grid-cols-3 gap-6">
          <span>Word</span>
          <span>Translation</span>
          <span>Details</span>
      </div>
      
      <!-- Word Items -->
      <TextWordItem
        v-for="word in words"
        :key="word.id"
        :word="word"
      />
    </section>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseBadge from '~/components/common/BaseBadge.vue'
import BaseEmptyState from '~/components/common/BaseEmptyState.vue'
import LoadingEffect from '~/components/common/LoadingEffect.vue'
import TextWordItem from './TextWordItem.vue'

const textStore = useTextStore()
const words = computed(() => textStore.textWords)
const loading = computed(() => textStore.textWordsLoading)
const noWords = computed(() => textStore.textWords.length === 0)
</script>


<style scoped>
.related-word-tbl-header {
  @apply px-4 py-2 bg-neutral-200 border-b border-zinc-500 text-sm font-medium text-gray-700;
}
</style>
