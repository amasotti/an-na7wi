<template>
  <form @submit.prevent="handleSubmit" class="space-md">
    <!--  Arabic token  -->
    <BaseInput
      v-model="localData.arabicTokens"
      label="Arabic Word"
      required
      class="arabic text-2xl"
      aria-describedby="arabic-help"
    />

    <!-- Transliteration -->
    <BaseInput
      v-model="localData.transliterationTokens"
      label="Transliteration"
      placeholder="Transliteration tokens"
      required
    />

    <!-- Translation  -->
    <BaseInput
      v-model="localData.translationTokens"
      placeholder="Translation tokens"
      label="Translation Tokens"
      required
    />

    <div class="form-actions">
      <CancelButton type="button" @click="$emit('close')" />
      <EditButton @click="handleAutoTransliterate" :disabled="!localData.arabicTokens" text="Transliterate" />
      <SaveButton type="submit" :loading="loading" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseInput from '~/components/common/BaseInput.vue'
import CancelButton from '~/components/common/CancelButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import SaveButton from '~/components/common/SaveButton.vue'
import { textService } from '~/composables/textService'
import { useInterlinearStore } from '~/stores/interlinearStore'

type AlignmentEditFormProps = {
  alignmentId: string
  arabicTokens: string
  transliterationTokens: string
  translationTokens: string
}

const props = defineProps<AlignmentEditFormProps>()

const emit = defineEmits<{
  close: []
}>()

const store = useInterlinearStore()
const { loading } = storeToRefs(store)

const localData = ref({
  arabicTokens: props.arabicTokens,
  transliterationTokens: props.transliterationTokens,
  translationTokens: props.translationTokens,
})

// Watch for prop changes (if alignment changes)
watch(
  () => [props.arabicTokens, props.transliterationTokens, props.translationTokens],
  ([arabic, transliteration, translation]) => {
    localData.value = {
      arabicTokens: arabic!,
      transliterationTokens: transliteration!,
      translationTokens: translation!,
    }
  }
)

const handleAutoTransliterate = async () => {
  try {
    const response = await textService.transliterateText(localData.value.arabicTokens)
    localData.value.transliterationTokens = response.transliteratedText
  } catch (err) {
    console.error('Failed to transliterate:', err)
  }
}

const handleSubmit = async () => {
  await store.updateAlignmentTokens(props.alignmentId, localData.value)
  emit('close')
}
</script>
