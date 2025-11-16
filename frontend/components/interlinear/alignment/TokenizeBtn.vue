<template>
    <BaseButton variant="secondary" size="sm" :disabled="!canTokenize" @click="store.autoAlign(withConfirmation)">
      <BaseIcon size="xs" class="button-icon">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </BaseIcon>
      Tokenize
    </BaseButton>
</template>


<script setup lang="ts">
import BaseButton from "~/components/common/BaseButton.vue";
import BaseIcon from "~/components/common/BaseIcon.vue";
import {useInterlinearStore} from "#imports";
import {computed} from "vue";

type TokenBtnProps = {
  withConfirmation?: boolean
}

withDefaults(defineProps<TokenBtnProps>(), {
  withConfirmation: false,
})

const store = useInterlinearStore();
const { editingSentence } = storeToRefs(store)

const canTokenize = computed(() => {
  return (
    editingSentence.value?.arabicText?.trim() &&
    editingSentence.value?.transliteration?.trim() &&
    editingSentence.value?.translation?.trim()
  )
})
</script>
