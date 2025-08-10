<template>
  <LoadingEffect v-if="loading" />

  <main v-else-if="currentWord" class="space-y-6">

    <header>
      <BaseBreadcrumb
        :parent-link="breadCrumb.parentLink"
        :parent-text="breadCrumb.parentText"
        :separator="breadCrumb.separator"
        :item="breadCrumb.item"
      />
    </header>

    <WordPrimaryInformation
    @edit="handleOpenWordModal"
    @delete="toggleDeleteModal"
    />

    <WordExamples v-if="currentWord.example" />

    <WordNotes v-if="currentWord.notes" />

    <RelatedWords v-if="currentWord.root" />

    <WordReferences v-if="currentWord.dictionaryLinks.length > 0" />

  </main>

  <!-- Word Edit Modal -->
  <WordForm
    :open="showWordModal"
    :loading="loading"
    :word="currentWord"
    @close="handleWordModalClose"
    @submit="handleWordSubmit"
  />

  <!-- Word Delete Modal -->
  <WordDeleteModal
    :open="showDeleteModal"
    :loading="loading"
    :word="currentWord"
    @close="toggleDeleteModal"
    @confirm="handleDeleteWord"
  />

  <footer>
    <BaseEmptyState
      v-if="!currentWord"
      link="/words"
      link-text="Go Back to Words"
      message="No word data available :("
    />
  </footer>
</template>


<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { useWordStore } from '~/stores/wordStore'
import LoadingEffect from '~/components/common/LoadingEffect.vue'
import BaseBreadcrumb from '~/components/common/BaseBreadcrumb.vue'
import BaseEmptyState from '~/components/common/BaseEmptyState.vue'
import WordForm from '~/components/vocabulary/WordForm.vue'
import type { Word } from '~/types'
import WordPrimaryInformation from '~/components/vocabulary/WordPrimaryInformation.vue'
import WordDeleteModal from '~/components/vocabulary/WordDeleteModal.vue'
import WordExamples from '~/components/vocabulary/WordExamples.vue'
import WordNotes from '~/components/vocabulary/WordNotes.vue'
import RelatedWords from '~/components/vocabulary/RelatedWords.vue'
import WordReferences from '~/components/vocabulary/WordReferences.vue'

const route = useRoute()
const wordStore = useWordStore()

const loading = computed(() => wordStore.loading)
const breadCrumb = computed(() => ({
  parentLink: '/words',
  parentText: 'Words',
  separator: '/',
  item: wordStore.currentWord?.transliteration || 'Word Details',
}))

const showWordModal = ref(false)
const showDeleteModal = ref(false)
const currentWord = computed(() => wordStore.currentWord)

const handleOpenWordModal = () => {
  showWordModal.value = true
}

const handleWordModalClose = () => {
  showWordModal.value = false
}

const handleWordSubmit = async (word: Word) => {
  if (!currentWord.value) return
  try {
    await wordStore.updateWord(currentWord.value.id, word)
    showWordModal.value = false
  } catch (error) {
    console.error('Failed to update word:', error)
  }
}

const toggleDeleteModal = () => {
  showDeleteModal.value = !showDeleteModal.value
}

const handleDeleteWord = async () => {
  if (!currentWord.value) return

  wordStore.loading = true
  try {
    await wordStore.deleteWord(currentWord.value.id)
    toggleDeleteModal()
  } catch (error) {
    console.error('Error deleting word:', error)
  } finally {
    wordStore.loading = false
    navigateTo('/words')
  }
}

// Lifecycle hooks
onMounted(async () => {
  try {
    const id = route.params.id as string
    if (!id) return

    await wordStore.fetchWordById(id)
  } catch (err) {
    console.error('Failed to load text:', err)
    wordStore.loading = true
  }
})
</script>
