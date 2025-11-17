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

      <!-- Autotokenize checkbox for new sentences -->
      <BaseCheckBox
        v-if="!editingSentence?.id"
        :model-value="autotokenizeOnSave"
        id="autotokenize-new-sentence"
        labelText="Auto-tokenize after saving"
        @update:modelValue="handleAutotokenizeChange"
      />

      <!-- Actions -->
      <div class="form-actions">
        <DeleteButton v-if="editingSentence?.id" @click="store.deleteSentenceFromModal()" text="Delete Sentence" />
        <TokenizeBtn v-if="editingSentence?.id" />
        <EditButton @click="store.autoTransliterateSentence()" text="Transliterate" />
        <SaveButton
          :loading="sentenceSaving"
          @click="store.saveSentence(autotokenizeOnSave)"
          :text="editingSentence?.id ? 'Save Changes' : 'Add Sentence'"
        />
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseCheckBox from '~/components/common/BaseCheckBox.vue'
import BaseModal from '~/components/common/BaseModal.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import SaveButton from '~/components/common/SaveButton.vue'
import TokenizeBtn from '~/components/interlinear/alignment/TokenizeBtn.vue'
import InterlinearSentenceEditor from '~/components/interlinear/InterlinearSentenceEditor.vue'

const store = useInterlinearStore()
const { showSentenceEditModal, editingSentence, editingSentenceOrder, sentenceSaving } =
  storeToRefs(store)

const autotokenizeOnSave = ref(true)

const handleAutotokenizeChange = (value: boolean) => {
  autotokenizeOnSave.value = value
}
</script>
