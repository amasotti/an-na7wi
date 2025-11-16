<template>
  <BaseModal
    :open="showSentenceEditModal"
    :title="editingSentence?.id ? `Edit Sentence ${editingSentenceOrder}` : `Add Sentence ${editingSentenceOrder}`"
    size="xl"
    @close="store.closeSentenceEditModal()"
  >
    <div class="space-y-4">
      <!-- Sentence Editor -->
      <InterlinearSentenceEditor />

      <!-- Actions -->
      <div class="form-actions">
        <DeleteButton v-if="editingSentence?.id" @click="store.deleteSentenceFromModal()" text="Delete Sentence" />
        <TokenizeBtn v-if="editingSentence?.id" />
        <SaveButton
          :loading="sentenceSaving"
          @click="store.saveSentence()"
          :text="editingSentence?.id ? 'Save Changes' : 'Add Sentence'"
        />
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '~/components/common/BaseModal.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import SaveButton from '~/components/common/SaveButton.vue'
import InterlinearSentenceEditor from '~/components/interlinear/InterlinearSentenceEditor.vue'
import TokenizeBtn from "~/components/interlinear/alignment/TokenizeBtn.vue";

const store = useInterlinearStore()
const { showSentenceEditModal, editingSentence, editingSentenceOrder, sentenceSaving } =
  storeToRefs(store)
</script>
