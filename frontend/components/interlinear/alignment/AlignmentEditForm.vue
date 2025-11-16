<template>
  <form @submit.prevent="handleSubmit" class="space-md">
      <BaseInput
        v-model="localData.arabicTokens"
        label="Arabic Word"
        required
        class="arabic text-2xl"
        aria-describedby="arabic-help"
      />

    <BaseInput
      v-model="localData.transliterationTokens"
      placeholder="Transliteration tokens"
      label="Transliteration Tokens"
      required
      />

    <BaseInput
      v-model="localData.translationTokens"
      placeholder="Translation tokens"
      label="Translation Tokens"
      required
    />

    <div class="form-actions">
      <CancelButton type="button" @click="$emit('close')" />
      <SaveButton type="submit" :loading="loading" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseInput from '~/components/common/BaseInput.vue'
import CancelButton from '~/components/common/CancelButton.vue'
import SaveButton from '~/components/common/SaveButton.vue'
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
      arabicTokens: arabic,
      transliterationTokens: transliteration,
      translationTokens: translation,
    }
  }
)

const handleSubmit = async () => {
  await store.updateAlignmentTokens(props.alignmentId, localData.value)
  emit('close')
}
</script>
