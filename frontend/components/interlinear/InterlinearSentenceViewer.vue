<template>
  <article class="interlinear-sentence group">
    <EditButton @click="$emit('edit')" />

    <!-- Interlinear Words (flowing inline like text) -->
    <div v-if="sortedAlignments.length > 0" class="interlinear-word-grid gap-sm gap-x-4" dir="rtl">
      <component
        :is="alignment.vocabularyWordId ? NuxtLink : 'div'"
        v-for="alignment in sortedAlignments"
        :key="alignment.id"
        :to="alignment.vocabularyWordId ? `/words/${alignment.vocabularyWordId}` : undefined"
        :class="['interlinear-word', { 'interlinear-word-linked': alignment.vocabularyWordId }]"
        :title="alignment.vocabularyWordId ? 'Click to view in vocabulary' : undefined"
      >
        <div
          :class="['interlinear-word-arabic', { 'interlinear-word-arabic-linked': alignment.vocabularyWordId }]"
          dir="rtl"
        >
          {{ alignment.arabicTokens }}
        </div>
        <div class="interlinear-gloss gap-0">
          <span class="interlinear-transliteration">{{ alignment.transliterationTokens }}</span>
          <span class="interlinear-translation">{{ alignment.translationTokens }}</span>
        </div>
      </component>
    </div>

    <!-- Fallback: show full sentence if no alignments -->
    <div v-else class="interlinear-fallback space-xs">
      <div class="arabic-base">{{ sentence.arabicText }}</div>
      <div class="interlinear-fallback-transliteration" dir="rtl">{{ sentence.transliteration }}</div>
      <div class="interlinear-fallback-translation" dir="rtl">{{ sentence.translation }}</div>
    </div>

    <!-- Annotations -->
    <div v-if="sentence.annotations" class="interlinear-annotations gap-sm">
      <BaseIcon size="sm" class="interlinear-annotations-icon">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </BaseIcon>
      <span class="interlinear-annotations-text">{{ sentence.annotations }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NuxtLink } from '#components'
import BaseIcon from '@/components/common/BaseIcon.vue'
import type { InterlinearSentence } from '@/types'
import EditButton from '~/components/common/EditButton.vue'

interface InterlinearSentenceProps {
  sentence: InterlinearSentence
}

const props = defineProps<InterlinearSentenceProps>()

defineEmits<{
  edit: []
  delete: []
}>()

const sortedAlignments = computed(() => {
  if (!props.sentence.alignments) return []
  return [...props.sentence.alignments].sort((a, b) => a.tokenOrder - b.tokenOrder)
})
</script>

