<template>
  <article>
    <!-- Arabic Text -->
    <div class="margin-bottom-md">
      <BaseTextArea
        :id="`arabic-${editingSentence?.id || 'editing'}`"
        :model-value="editingSentence?.arabicText || ''"
        label="Arabic"
        :rows="1"
        :required="true"
        placeholder="أدخل النص العربي"
        arabic
        @update:model-value="store.updateSentenceField('arabicText', $event)"
      />
    </div>

    <!-- Transliteration -->
    <div class="margin-bottom-md">
      <BaseInput
        :id="`transliteration-${editingSentence?.id || 'editing'}`"
        :model-value="editingSentence?.transliteration || ''"
        type="text"
        label="Transliteration"
        placeholder="Enter transliteration..."
        :clearable="true"
        :required="true"
        @update:model-value="store.updateSentenceField('transliteration', $event)"
      />
    </div>

    <!-- Translation -->
    <div class="margin-bottom-md">
      <BaseInput
        :id="`translation-${editingSentence?.id || 'editing'}`"
        :model-value="editingSentence?.translation || ''"
        type="text"
        label="Translation"
        placeholder="Enter English translation"
        :clearable="true"
        :required="true"
        @update:model-value="store.updateSentenceField('translation', $event)"
      />
    </div>

    <!-- Annotations (Optional) -->
    <div class="margin-bottom-md">
      <BaseTextArea
        :id="`annotations-${editingSentence?.id || 'editing'}`"
        :model-value="editingSentence?.annotations || ''"
        label="Notes (Markdown)"
        :rows="3"
        placeholder="Optional notes"
        @update:model-value="store.updateSentenceField('annotations', $event)"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import BaseInput from '~/components/common/BaseInput.vue'
import BaseTextArea from '~/components/common/BaseTextArea.vue'

const store = useInterlinearStore()
const { editingSentence } = storeToRefs(store)

</script>
