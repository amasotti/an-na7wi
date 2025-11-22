<template>
  <section class="interlinear-preview-container">
    <div class="interlinear-preview-header">
      <h3 class="interlinear-preview-title">Full Text Preview</h3>
      <button
        class="dictionary-search-button"
        :disabled="!selectedText"
        @click="searchInDictionaries"
      >
        <BaseIcon size="sm" class="dictionary-button-icon">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </BaseIcon>
        <span class="dictionary-button-text">Search {{ selectedText }}</span>
      </button>
    </div>
    <div class="interlinear-preview-content space-md">
      <div class="interlinear-preview-section">
        <div
          id="arabic-preview"
          class="arabic interlinear-preview-text"
          dir="rtl"
          @mouseup="handleTextSelection"
        >
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
import { computed, ref } from 'vue'
import BaseIcon from '~/components/common/BaseIcon.vue'

const store = useInterlinearStore()
const { currentText } = storeToRefs(store)

const selectedText = ref('')

const joinedArabicTextPretty = computed(() => {
  if (!currentText.value) return ''
  return currentText.value.sentences.map(sentence => sentence.arabicText).join(' ')
})

const joinedTransliterationTextPretty = computed(() => {
  if (!currentText.value) return ''
  return currentText.value.sentences.map(sentence => sentence.transliteration).join(' ')
})

const joinedTranslationTextPretty = computed(() => {
  if (!currentText.value) return ''
  return currentText.value.sentences.map(sentence => sentence.translation).join(' ')
})

const handleTextSelection = () => {
  const selection = window.getSelection()
  const text = selection?.toString().trim()

  if (text && text.length > 0) {
    selectedText.value = text
  } else {
    selectedText.value = ''
  }
}

const searchInDictionaries = () => {
  const word = selectedText.value
  if (!word) return

  const derjaNinjaUrl = `https://derja.ninja/search?search=${encodeURIComponent(word)}&script=arabic`
  const arabicDictionaryUrl = `https://www.arabicstudentsdictionary.com/search?q=${encodeURIComponent(word)}`

  window.open(derjaNinjaUrl, '_blank')
  window.open(arabicDictionaryUrl, '_blank')
}
</script>
