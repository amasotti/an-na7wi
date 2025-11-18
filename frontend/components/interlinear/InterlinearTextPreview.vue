<template>
  <section class="interlinear-preview-container">
    <h3 class="interlinear-preview-header">Full Text Preview</h3>
    <div class="interlinear-preview-content space-md">
      <div class="interlinear-preview-section">
        <div id="arabic-preview" class="arabic interlinear-preview-text" dir="rtl">
          {{ joinedArabicTextPretty }}
        </div>
      </div>
      <div class="interlinear-preview-section">
        <div id="arabic-transliteration-preview" class="interlinear-fallback-transliteration interlinear-preview-text">
          {{ joinedTransliterationTextPretty }}
        </div>
      </div>
      <div class="interlinear-preview-section">
        <div id="translation-preview" class="interlinear-fallback-translation interlinear-preview-text">
          {{ joinedTranslationTextPretty }}
        </div>
      </div>
    </div>
  </section>
</template>


<script setup lang="ts">

const store = useInterlinearStore()
const { currentText } = storeToRefs(store)

const joinedArabicTextPretty = computed(() => {
  if (!currentText.value) return ''
  return currentText.value.sentences
    .map((sentence) => sentence.arabicText)
    .join(' ')
})

const joinedTransliterationTextPretty = computed(() => {
  if (!currentText.value) return ''
  return currentText.value.sentences
    .map((sentence) => sentence.transliteration)
    .join(' ')
})

const joinedTranslationTextPretty = computed(() => {
  if (!currentText.value) return ''
  return currentText.value.sentences
    .map((sentence) => sentence.translation)
    .join(' ')
})

</script>


<style scoped>
</style>
