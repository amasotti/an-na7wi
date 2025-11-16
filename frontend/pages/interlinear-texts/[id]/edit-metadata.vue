<template>
  <div class="page-container-narrow">
    <LoadingEffect v-if="loading" />

    <BaseErrorState
      v-else-if="error"
      message="Failed to Load Text"
      :error="error"
    />

    <div v-else-if="currentText && editingMetadata" class="space-lg">
      <div class="margin-bottom-lg">
        <BaseBreadcrumb
          :parent-link="`/interlinear-texts/${route.params.id}`"
          :parent-text="currentText.title"
          item="Edit Metadata"
        />

        <h1 class="page-title">Edit Text Information</h1>
        <p class="page-description">
          Update the title, description, and dialect for this interlinear text
        </p>
      </div>

      <div class="card-base card-padding space-md">
        <BaseInput
          id="title"
          :model-value="editingMetadata.title"
          @update:model-value="store.updateMetadataField('title', $event)"
          label="Title"
          required
          placeholder="Text title"
        />

        <BaseTextArea
          id="description"
          :model-value="editingMetadata.description"
          @update:model-value="store.updateMetadataField('description', $event)"
          label="Description"
          :rows="3"
          placeholder="Optional description"
        />

        <BaseSelect
          :model-value="editingMetadata.dialect"
          @update:model-value="store.updateMetadataField('dialect', $event)"
          :options="dialectOptions"
          placeholder="Select dialect"
          required
          aria-describedby="dialect-help"
        />

        <div class="form-actions">
          <CancelButton @click="handleCancel" :disabled="metadataSaving" />
          <SaveButton @click="handleSave" :loading="metadataSaving" />
        </div>
      </div>

      <BaseErrorState
        v-if="metadataSaveError"
        :message="metadataSaveError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BaseBreadcrumb from '~/components/common/BaseBreadcrumb.vue'
import BaseErrorState from '~/components/common/BaseErrorState.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import BaseTextArea from '~/components/common/BaseTextArea.vue'
import CancelButton from '~/components/common/CancelButton.vue'
import LoadingEffect from '~/components/common/LoadingEffect.vue'
import SaveButton from '~/components/common/SaveButton.vue'
import { dialectOptions } from '~/constants/dialects'
import { useInterlinearStore } from '~/stores/interlinearStore'

const route = useRoute()
const store = useInterlinearStore()

const { currentText, loading, error, editingMetadata, metadataSaving, metadataSaveError } =
  storeToRefs(store)

const handleSave = async () => {
  const textId = route.params.id as string
  const success = await store.saveMetadata(textId)

  if (success) {
    await navigateTo(`/interlinear-texts/${textId}`)
  }
}

const handleCancel = () => {
  if (confirm('Discard unsaved changes?')) {
    store.cancelMetadataEdit()
    navigateTo(`/interlinear-texts/${route.params.id}`)
  }
}

onMounted(async () => {
  const id = route.params.id as string
  await store.fetchTextById(id)
  store.openMetadataEditor()
})
</script>

