<template>
  <div class="full-width">
    <!-- Empty State -->
    <BaseEmptyState
      v-if="!text.sentences || text.sentences.length === 0"
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
      :text-id="text.id"
      @close="closeEditModal"
      @save="handleSave"
      @update-alignments="handleUpdateAlignments"
      @split="handleSplit"
      @merge="handleMerge"
      @delete-sentence="handleDeleteSentence"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { InterlinearSentence, InterlinearTextDetail, WordAlignment } from '@/types'
import BaseEmptyState from '~/components/common/BaseEmptyState.vue'
import { useInterlinearStore } from '~/stores/interlinearStore'
import { createAlignments } from '~/utils/tokenization'
import InterlinearSentenceViewer from './InterlinearSentenceViewer.vue'
import SentenceEditModal from './SentenceEditModal.vue'

interface Props {
  text: InterlinearTextDetail
}

const props = defineProps<Props>()

const interlinearStore = useInterlinearStore()

// Modal state
const showEditModal = ref(false)
const editingSentence = ref<InterlinearSentence | null>(null)
const editingSentenceOrder = ref(0)

const sortedSentences = computed(() => {
  if (!props.text.sentences) return []
  return [...props.text.sentences].sort((a, b) => a.sentenceOrder - b.sentenceOrder)
})

// Methods
const openEditModal = (sentence: InterlinearSentence, index: number) => {
  editingSentence.value = sentence
  editingSentenceOrder.value = index + 1
  showEditModal.value = true
}

const openAddSentenceModal = () => {
  // Create a new empty sentence
  const newSentenceOrder = (props.text.sentences?.length || 0) + 1
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
      await interlinearStore.updateSentence(props.text.id, editingSentence.value.id, {
        arabicText: updatedSentence.arabicText!,
        transliteration: updatedSentence.transliteration!,
        translation: updatedSentence.translation!,
        annotations: updatedSentence.annotations,
        sentenceOrder: editingSentence.value.sentenceOrder,
      })
    } else {
      // Create new sentence
      await interlinearStore.addSentence(props.text.id, {
        arabicText: updatedSentence.arabicText!,
        transliteration: updatedSentence.transliteration!,
        translation: updatedSentence.translation!,
        annotations: updatedSentence.annotations,
        sentenceOrder: editingSentence.value?.sentenceOrder || 0,
      })
    }

    // Refresh the text to get updated data
    await interlinearStore.fetchTextById(props.text.id)
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
          props.text.id,
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
    await interlinearStore.fetchTextById(props.text.id)
  } catch (error) {
    console.error('Failed to update alignments:', error)
  }
}

const handleSplit = async (alignmentIndex: number) => {
  if (!editingSentence.value?.id || !editingSentence.value.alignments) return

  const alignment = editingSentence.value.alignments[alignmentIndex]
  if (!alignment) return

  try {
    // Split the alignment
    const arabicTokens = alignment.arabicTokens.trim().split(/\s+/)
    const transliterationTokens = alignment.transliterationTokens.trim().split(/\s+/)
    const translationTokens = alignment.translationTokens.trim().split(/\s+/)

    const maxLength = Math.max(
      arabicTokens.length,
      transliterationTokens.length,
      translationTokens.length
    )
    if (maxLength <= 1) return

    // Delete original
    await interlinearStore.deleteAlignment(props.text.id, editingSentence.value.id, alignment.id)

    // Create new ones
    for (let i = 0; i < maxLength; i++) {
      await interlinearStore.addAlignment(props.text.id, editingSentence.value.id, {
        arabicTokens: arabicTokens[i] || '',
        transliterationTokens: transliterationTokens[i] || '',
        translationTokens: translationTokens[i] || '',
        tokenOrder: alignment.tokenOrder + i * 0.1,
      })
    }

    // Refresh
    await interlinearStore.fetchTextById(props.text.id)
  } catch (error) {
    console.error('Failed to split alignment:', error)
  }
}

const handleMerge = async (alignmentIndices: number[]) => {
  if (
    !editingSentence.value?.id ||
    !editingSentence.value.alignments ||
    alignmentIndices.length < 2
  )
    return

  try {
    const alignmentsToMerge = alignmentIndices
      .map(i => editingSentence.value!.alignments![i])
      .filter((a): a is WordAlignment => a !== undefined)

    if (alignmentsToMerge.length === 0) return

    // Merge tokens
    const mergedAlignment = {
      arabicTokens: alignmentsToMerge
        .map(a => a.arabicTokens)
        .filter(t => t)
        .join(' '),
      transliterationTokens: alignmentsToMerge
        .map(a => a.transliterationTokens)
        .filter(t => t)
        .join(' '),
      translationTokens: alignmentsToMerge
        .map(a => a.translationTokens)
        .filter(t => t)
        .join(' '),
      tokenOrder: alignmentsToMerge[0]!.tokenOrder,
    }

    // Delete all selected
    for (const alignment of alignmentsToMerge) {
      if (alignment) {
        await interlinearStore.deleteAlignment(
          props.text.id,
          editingSentence.value.id,
          alignment.id
        )
      }
    }

    // Create merged
    await interlinearStore.addAlignment(props.text.id, editingSentence.value.id, mergedAlignment)

    // Refresh
    await interlinearStore.fetchTextById(props.text.id)
  } catch (error) {
    console.error('Failed to merge alignments:', error)
  }
}

const handleDeleteSentence = async () => {
  if (!editingSentence.value?.id) return

  try {
    await interlinearStore.deleteSentence(props.text.id, editingSentence.value.id)

    // Refresh the text
    await interlinearStore.fetchTextById(props.text.id)
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
