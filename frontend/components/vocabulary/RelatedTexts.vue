<template>
  <LoadingEffect v-if="loading" />

  <BaseEmptyState
    v-else-if="noLinkedTexts"
    link="/words"
    link-text="Go Back to Words"
    message="No related texts found for this word."
  />

  <section v-else class="container-related-texts" aria-labelledby="related-texts-title">
    <h2 id="related-texts-title" class="text-header">
      <BaseIcon size="lg" class="section-icon">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </BaseIcon>
      Related Texts
    </h2>

    <menu class="text-menu">
      <li
        v-for="text in linkedTextsToCurrentWord"
        :key="text.id"
        class="text-item"
        @click="goToText(text.id)"
      >
        <article class="text-content">
          <header class="text-item-header">
            <h3 class="text-title">{{ text.title }}</h3>
            <div class="text-metadata">
              <span class="text-meta-item">{{ formatDate(text.createdAt) }}</span>
              <span v-if="text.dialect" class="text-meta-item">{{ text.dialect }}</span>
              <span v-if="text.difficulty" class="difficulty-badge">{{ text.difficulty }}</span>
            </div>
          </header>
          <div v-if="text.tags && text.tags.length > 0" class="text-tags">
            <span
              v-for="tag in text.tags.slice(0, 3)"
              :key="tag"
              class="tag-badge"
            >
              {{ tag }}
            </span>
            <span v-if="text.tags.length > 3" class="text-xs text-gray-500">
              +{{ text.tags.length - 3 }} more
            </span>
          </div>
        </article>
      </li>
    </menu>
  </section>
</template>

<script setup lang="ts">
import LoadingEffect from "~/components/common/LoadingEffect.vue"
import BaseIcon from "~/components/common/BaseIcon.vue"
import BaseEmptyState from "~/components/common/BaseEmptyState.vue"
import {formatDate} from "~/utils/dateUtils";

const wordStore = useWordStore()
const { loading, linkedTextsToCurrentWord } = storeToRefs(wordStore)

const noLinkedTexts = computed(() => {
  return !linkedTextsToCurrentWord.value || linkedTextsToCurrentWord.value.length === 0
})

const goToText = (textId: string) => {
  navigateTo(`/texts/${textId}`)
}

onMounted(async () => {
  if (wordStore.currentWord) {
    await wordStore.getLinkedTexts()
  }
})
</script>

<style scoped>
.container-related-texts {
  @apply bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden;
}

.text-header {
  @apply text-lg font-semibold mb-0 text-gray-900 px-6 pt-6 border-b border-teal-100 pb-4;
  @apply bg-gradient-to-r from-teal-50 to-cyan-50 flex items-center gap-2;
}

.section-icon {
  @apply text-teal-600;
}

.text-menu {
  @apply p-6 space-y-3;
}

.text-item {
  @apply rounded-xl hover:bg-gray-50 transition-colors cursor-pointer;
  @apply border border-gray-100 bg-white/60 shadow-sm hover:shadow transition-shadow;
}

.text-content {
  @apply p-4;
}

.text-item-header {
  @apply flex flex-col gap-2 mb-3;
}

.text-title {
  @apply font-semibold text-teal-700 text-base;
}

.text-metadata {
  @apply flex items-center gap-2 flex-wrap;
}

.text-meta-item {
  @apply text-sm text-gray-500;
}

.difficulty-badge {
  @apply text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium;
}

.text-tags {
  @apply flex items-center gap-2 flex-wrap mt-2;
}

.tag-badge {
  @apply text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700;
}
</style>
