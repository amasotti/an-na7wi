<template>
  <div class="page-container-narrow">
    <LoadingEffect v-if="loading" />

    <BaseErrorState
      v-else-if="error"
      message="Failed to Load Sentence"
      :error="error"
    />

    <div v-else-if="currentText && currentSentence" class="container">
      <div class="margin-bottom-lg">
        <BaseBreadcrumb
          :parent-link="`/interlinear-texts/${route.params.id}`"
          :parent-text="currentText.title"
          item="Edit Word Alignments"
        />

        <h1 class="page-title">Edit Word Alignments</h1>
        <p class="page-description">
          Manage word-by-word alignments between Arabic, transliteration, and translation
        </p>
      </div>

      <!-- Sentence Preview -->
      <!-- NOTE: Good candidate for a small component on its own     -->
      <div class="card-base card-padding space-sm margin-bottom-lg">
        <div class="space-xs">
          <div class="arabic text-center">{{ currentSentence.arabicText }}</div>
          <div class="text-small text-center">{{ currentSentence.transliteration }}</div>
          <div class="italic text-center">{{ currentSentence.translation }}</div>
        </div>
      </div>

      <!-- Alignments Section -->
      <div class="card-base card-padding space-md">
        <h2 class="heading-sm">Word Alignments</h2>

        <AlignmentGrid
          v-if="sortedAlignments.length > 0"
          :alignments="sortedAlignments"
          :selected-indices="selectedAlignments"
          @toggle-selection="store.toggleAlignmentSelection"
          @clear-selection="store.clearAlignmentSelection"
          @edit-alignment="handleEdit"
          @link-to-vocabulary="handleLinkToVocabulary"
        />

        <BaseEmptyState
          v-else
          :link="`/interlinear-texts/${route.params.id}`"
          link-text="No alignments yet"
          message="Use the Auto-align button to automatically create word alignments"
        />
      </div>

      <p class="tokenize-hint">
        The tokenize function will remove already available tokens and
        try to create tokens based on empty spaces and the convention that dashed words belong together
      </p>

      <!-- Navigation -->
      <div class="form-actions">
        <DeleteButton @click="store.clearSentenceAlignments()" text="Clear all Alignments" />
        <CancelButton type="button" @click="handleBack" text="Back to Text" />
        <TokenizeBtn :with-confirmation="false" />
      </div>
    </div>

    <!-- Edit Alignment Modal -->
    <BaseModal
      :open="showEditModal"
      title="Edit Alignment"
      @close="closeEditModal"
    >
      <AlignmentEditForm
        v-if="editingAlignment"
        :alignment-id="editingAlignment.id"
        :arabic-tokens="editingAlignment.arabicTokens"
        :transliteration-tokens="editingAlignment.transliterationTokens"
        :translation-tokens="editingAlignment.translationTokens"
        @save="saveAlignment"
        @cancel="closeEditModal"
      />
    </BaseModal>

    <!-- Vocabulary Linking Modal -->
    <BaseModal
      :open="showVocabLinkModal"
      title="Link to Vocabulary"
      @close="store.closeVocabLinkModal()"
    >
      <VocabularyLinkingPanel
        :alignment="linkingAlignment"
        :search-query="vocabSearchQuery"
        :search-results="vocabSearchResults"
        :linked-word="currentLinkedWord"
        @update:search-query="vocabSearchQuery = $event"
        @link="handleLinkWord"
        @unlink="store.unlinkAlignmentFromVocab()"
        @close="store.closeVocabLinkModal()"
      />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import BaseBreadcrumb from '~/components/common/BaseBreadcrumb.vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseEmptyState from '~/components/common/BaseEmptyState.vue'
import BaseErrorState from '~/components/common/BaseErrorState.vue'
import BaseModal from '~/components/common/BaseModal.vue'
import LoadingEffect from '~/components/common/LoadingEffect.vue'
import AlignmentEditForm from '~/components/interlinear/alignment/AlignmentEditForm.vue'
import AlignmentGrid from '~/components/interlinear/alignment/AlignmentGrid.vue'
import VocabularyLinkingPanel from '~/components/interlinear/alignment/VocabularyLinkingPanel.vue'
import { useInterlinearStore } from '~/stores/interlinearStore'
import DeleteButton from "~/components/common/DeleteButton.vue";
import CancelButton from "~/components/common/CancelButton.vue";
import SaveButton from "~/components/common/SaveButton.vue";
import TokenizeBtn from "~/components/interlinear/alignment/TokenizeBtn.vue";

const route = useRoute()
const router = useRouter()
const store = useInterlinearStore()

const {
  currentText,
  loading,
  error,
  sortedAlignments,
  selectedAlignments,
  showVocabLinkModal,
  linkingAlignment,
  currentLinkedWord,
} = storeToRefs(store)

// Local state for edit modal
const showEditModal = ref(false)
const editingAlignment = ref<{
  id: string
  arabicTokens: string
  transliterationTokens: string
  translationTokens: string
} | null>(null)

// Local state for vocabulary search
const vocabSearchQuery = ref('')
const vocabSearchResults = computed(() => store.vocabSearchResults)

const currentSentence = computed(() => {
  if (!currentText.value) return null
  const sentenceId = route.params.sentenceId as string
  return currentText.value.sentences.find(s => s.id === sentenceId)
})

const handleEdit = () => {
  if (selectedAlignments.value.length !== 1) return
  const index = selectedAlignments.value[0]
  if (index === undefined) return
  const alignment = sortedAlignments.value[index]
  if (!alignment) return

  editingAlignment.value = {
    id: alignment.id!,
    arabicTokens: alignment.arabicTokens,
    transliterationTokens: alignment.transliterationTokens,
    translationTokens: alignment.translationTokens,
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingAlignment.value = null
}

const saveAlignment = async (data: {
  arabicTokens: string
  transliterationTokens: string
  translationTokens: string
}) => {
  if (!editingAlignment.value) return

  await store.updateAlignmentTokens(editingAlignment.value.id, data)
  closeEditModal()
}

const handleLinkToVocabulary = async () => {
  if (selectedAlignments.value.length !== 1) return
  const index = selectedAlignments.value[0]
  if (index === undefined) return

  await store.openVocabLinkModal(index)
}

const handleLinkWord = async (wordId: string) => {
  await store.linkAlignmentToVocab(wordId)
}

const handleBack = () => {
  router.push(`/interlinear-texts/${route.params.id}`)
}

// Watch for vocabulary search query changes
let vocabSearchTimer: ReturnType<typeof setTimeout> | null = null
watch(vocabSearchQuery, newQuery => {
  if (vocabSearchTimer) clearTimeout(vocabSearchTimer)
  if (!newQuery.trim()) {
    return
  }
  vocabSearchTimer = setTimeout(() => store.searchVocabulary(newQuery.trim()), 400)
})

onMounted(async () => {
  const textId = route.params.id as string
  const sentenceId = route.params.sentenceId as string

  if (!textId || !sentenceId) {
    error.value = 'Missing text or sentence ID'
    return
  }

  // Load the text if not already loaded
  if (!currentText.value || currentText.value.id !== textId) {
    await store.fetchTextById(textId)
  }

  // Initialize alignment editor
  store.openAlignmentEditor(sentenceId)

  if (!currentText.value?.sentences.find(s => s.id === sentenceId)) {
    error.value = 'Sentence not found'
  }
})

onUnmounted(() => {
  store.closeAlignmentEditor()
})
</script>

<style scoped>
.tokenize-hint {
   @apply text-sm text-gray-600 text-center mt-2 italic;
 }

</style>
