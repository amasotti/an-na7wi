<template>
  <div class="full-width">
    <!-- Empty State -->
    <BaseEmptyState
      v-if="!currentText?.sentences || currentText.sentences.length === 0"
      link="#"
      linkText="Add a sentence to start"
      message="No sentences are available for this interlinear text."
    />

    <!-- Sentences -->
    <div v-else class="sentences-list">
      <InterlinearSentenceViewer
        v-for="(sentence, index) in sortedSentences"
        :key="sentence.id"
        :sentence="sentence"
        @edit="openEditModal(sentence, index)"
      />
    </div>

    <!-- Sentence Edit Modal -->
    <SentenceEditModal
      :open="showEditModal"
      :sentence="editingSentence"
      :sentence-order="editingSentenceOrder"
      :text-id="currentText!.id"
      @close="closeEditModal"
      @save="handleSave"
      @update-alignments="handleUpdateAlignments"
      @delete-sentence="handleDeleteSentence"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { InterlinearSentence, WordAlignment } from '@/types'
import BaseEmptyState from '~/components/common/BaseEmptyState.vue'
import { useInterlinearStore } from '~/stores/interlinearStore'
import InterlinearSentenceViewer from './InterlinearSentenceViewer.vue'
import SentenceEditModal from './SentenceEditModal.vue'

const interlinearStore = useInterlinearStore()
// Modal state
const showEditModal = ref(false)
const editingSentence = ref<InterlinearSentence | null>(null)
const editingSentenceOrder = ref(0)
const { currentText } = storeToRefs(interlinearStore)

const sortedSentences = computed(() => {
  if (!currentText.value?.sentences) return []
  return [...currentText.value.sentences].sort((a, b) => a.sentenceOrder - b.sentenceOrder)
})
// Methods
const openEditModal = (sentence: InterlinearSentence, index: number) => {
  editingSentence.value = sentence
  editingSentenceOrder.value = index + 1
  showEditModal.value = true
}
const openAddSentenceModal = () => {
  // Create a new empty sentence
  const newSentenceOrder = (currentText.value?.sentences?.length || 0) + 1
  editingSentence.value = {
    arabicText: '',
    transliteration: '',
    translation: '',
    annotations: '',
    sentenceOrder: newSentenceOrder - 1,
  } as InterlinearSentence
  editingSentenceOrder.value = newSentenceOrder
  showEditModal.value = true
}
const closeEditModal = () => {
  showEditModal.value = false
  editingSentence.value = null
  editingSentenceOrder.value = 0
}
// Expose methods for parent component
defineExpose({
  openAddSentenceModal,
})
const handleSave = async (updatedSentence: Partial<InterlinearSentence>) => {
  try {
    if (editingSentence.value?.id) {
      // Update existing sentence
      await interlinearStore.updateSentence(currentText.value!.id, editingSentence.value.id, {
        arabicText: updatedSentence.arabicText!,
        transliteration: updatedSentence.transliteration!,
        translation: updatedSentence.translation!,
        annotations: updatedSentence.annotations,
        sentenceOrder: editingSentence.value.sentenceOrder,
      })
    } else {
      // Create new sentence
      await interlinearStore.addSentence(currentText.value!.id, {
        arabicText: updatedSentence.arabicText!,
        transliteration: updatedSentence.transliteration!,
        translation: updatedSentence.translation!,
        annotations: updatedSentence.annotations,
        sentenceOrder: editingSentence.value?.sentenceOrder || 0,
      })
    }
    // Refresh the text to get updated data
    await interlinearStore.fetchTextById(currentText.value!.id)
    closeEditModal()
  } catch (error) {
    console.error('Failed to save sentence:', error)
  }
}

const handleUpdateAlignments = async (alignments: WordAlignment[]) => {
  if (!editingSentence.value?.id) return
  try {
    for (const alignment of alignments) {
      if (alignment.id) {
        await interlinearStore.updateAlignment(
          currentText.value!.id,
          editingSentence.value.id,
          alignment.id,
          {
            arabicTokens: alignment.arabicTokens,
            transliterationTokens: alignment.transliterationTokens,
            translationTokens: alignment.translationTokens,
            tokenOrder: alignment.tokenOrder,
            vocabularyWordId: alignment.vocabularyWordId,
          }
        )
      }
    }
    // Refresh the text
    await interlinearStore.fetchTextById(currentText.value!.id)
  } catch (error) {
    console.error('Failed to update alignments:', error)
  }
}

const handleDeleteSentence = async () => {
  if (!editingSentence.value?.id) return

  try {
    await interlinearStore.deleteSentence(currentText.value!.id, editingSentence.value.id)

    // Refresh the text
    await interlinearStore.fetchTextById(currentText.value!.id)
    closeEditModal()
  } catch (error) {
    console.error('Failed to delete sentence:', error)
  }
}
</script>

<style scoped>
.sentences-list {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 px-6 py-2;
}
</style>
