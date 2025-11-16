<template>
  <article>
    <!-- Arabic Text -->
    <div class="margin-bottom-md">
      <BaseTextArea
        :id="`arabic-${sentenceId}`"
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
        :id="`transliteration-${sentenceId}`"
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
        :id="`translation-${sentenceId}`"
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
        :id="`annotations-${sentenceId}`"
        :model-value="editingSentence?.annotations || ''"
        label="Notes (Markdown)"
        :rows="3"
        placeholder="Optional notes"
        @update:model-value="store.updateSentenceField('annotations', $event)"
      />
    </div>

    <!-- Actions -->
    <div class="form-actions" role="group" aria-label="Form actions">
      <DeleteButton v-if="editingSentence?.id" @click="store.deleteSentenceFromModal()" text="Delete Sentence" />
      <BaseButton
        type="button"
        variant="secondary"
        size="sm"
        :disabled="!canTokenize"
        @click="store.autoAlign()"
      >
        <BaseIcon size="xs" class="button-icon">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </BaseIcon>
        Tokenize
      </BaseButton>
    </div>
    <p class="tokenize-hint">The "tokenize" function will try to create tokens based on empty spaces and the convention that dashed words belong together</p>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import BaseTextArea from '~/components/common/BaseTextArea.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'

interface Props {
  sentenceId: string
  sentenceOrder: number
}

defineProps<Props>()

const store = useInterlinearStore()
const { editingSentence } = storeToRefs(store)

// Check if sentence can be tokenized (all three fields filled)
const canTokenize = computed(() => {
  return (
    editingSentence.value?.arabicText?.trim() &&
    editingSentence.value?.transliteration?.trim() &&
    editingSentence.value?.translation?.trim()
  )
})
</script>

<style scoped>
.tokenize-hint {
  @apply text-sm text-gray-600 text-center mt-2 italic;
}
</style>
