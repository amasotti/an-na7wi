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

        <h2>Edit Word Alignments</h2>
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
        <p class="annotation-item">{{currentSentence.annotations}}</p>
      </div>

      <!-- Alignments Section -->
      <div class="card-base card-padding space-md">
        <h2 class="heading-sm">Word Alignments</h2>

        <div v-if="sortedAlignments.length > 0" class="space-md">
          <!-- Action Buttons -->
          <div class="form-actions">
            <CancelButton v-if="selectedAlignments.length > 0" variant="outline" size="sm" @click="store.clearAlignmentSelection()" text="Clear Selection" />
            <!--  single selection actions -->
            <EditButton v-if="selectedAlignments.length === 1" @click="handleEdit" />
            <EditButton v-if="selectedAlignments.length === 1" text="Link Word" size="sm" @click="handleLinkToVocabulary" />
          </div>

          <!-- Alignments Grid -->
          <div class="alignments-grid">
            <InteractiveGlossa
              v-for="(alignment, index) in sortedAlignments"
              :key="alignment.id || `temp-${index}`"
              :alignment="alignment"
              :index="index"
              :is-selected="selectedAlignments.includes(index)"
              @toggle-selection="store.toggleAlignmentSelection"
            />
          </div>

          <!-- Helper Text -->
<!--          <p v-if="selectedAlignments.length === 0" class="form-help">-->
<!--            Click an alignment to select it. Use Cmd/Ctrl+click to select multiple, or Shift+click to select a range.-->
<!--          </p>-->
        </div>

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
        @close="closeEditModal"
      />
    </BaseModal>

    <!-- Vocabulary Linking Modal -->
    <BaseModal
      :open="showVocabLinkModal"
      title="Link to Vocabulary"
      @close="store.closeVocabLinkModal()"
    >
      <VocabularyLinkingPanel />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import BaseBreadcrumb from '~/components/common/BaseBreadcrumb.vue'
import BaseEmptyState from '~/components/common/BaseEmptyState.vue'
import BaseErrorState from '~/components/common/BaseErrorState.vue'
import BaseModal from '~/components/common/BaseModal.vue'
import CancelButton from '~/components/common/CancelButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import LoadingEffect from '~/components/common/LoadingEffect.vue'
import AlignmentEditForm from '~/components/interlinear/alignment/AlignmentEditForm.vue'
import InteractiveGlossa from '~/components/interlinear/alignment/InteractiveGlossa.vue'
import TokenizeBtn from '~/components/interlinear/alignment/TokenizeBtn.vue'
import VocabularyLinkingPanel from '~/components/interlinear/alignment/VocabularyLinkingPanel.vue'
import { useInterlinearStore } from '~/stores/interlinearStore'

const route = useRoute()
const router = useRouter()
const store = useInterlinearStore()

const { currentText, loading, error, sortedAlignments, selectedAlignments, showVocabLinkModal } =
  storeToRefs(store)

// Local state for edit modal
const showEditModal = ref(false)
const editingAlignment = ref<{
  id: string
  arabicTokens: string
  transliterationTokens: string
  translationTokens: string
} | null>(null)

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

const handleLinkToVocabulary = async () => {
  if (selectedAlignments.value.length !== 1) return
  const index = selectedAlignments.value[0]
  if (index === undefined) return

  await store.openVocabLinkModal(index)
}

const handleBack = () => {
  router.push(`/interlinear-texts/${route.params.id}`)
}

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

.annotation-item {
  @apply text-sm pt-2 mt-2 bottom-3 text-gray-500 border-t-2;
}

.alignments-grid {
  @apply flex flex-wrap items-start gap-y-6;
  direction: rtl;
}
</style>
