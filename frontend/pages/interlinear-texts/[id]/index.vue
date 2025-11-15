<template>
  <div class="animate-fade-in">
    <!-- Loading State -->
    <LoadingEffect v-if="loading" />

    <!-- Error State -->
    <BaseErrorState
      v-else-if="error"
      message="Interlinear Text Not Found"
      :error="error"
    />

    <!-- Text Content -->
    <main v-else-if="currentText" class="page-container-detail">
      <!-- Header -->
      <header class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <NuxtLink to="/interlinear-texts" class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center">
            <BaseIcon size="sm" class="mr-2">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </BaseIcon>
            Back to Interlinear Texts
          </NuxtLink>

          <div class="flex items-center gap-2">
            <EditButton @click="editText" />
            <DeleteButton @click="deleteText" />
          </div>
        </div>

        <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{{ currentText.title }}</h1>

        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div class="flex items-center gap-2">
            <BaseBadge variant="neutral" size="sm">
              {{ dialectLabel }}
            </BaseBadge>
          </div>

          <div class="flex items-center">
            <BaseIcon size="xs" class="mr-1">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </BaseIcon>
            {{ currentText.sentences?.length || 0 }} {{ currentText.sentences?.length === 1 ? 'sentence' : 'sentences' }}
          </div>

          <span>Updated {{ formattedDate }}</span>
        </div>

        <!-- Description -->
        <div v-if="currentText.description" class="mt-4 text-gray-700 dark:text-gray-300">
          <p>{{ currentText.description }}</p>
        </div>
      </header>

      <!-- Main Content -->
      <section>
        <InterlinearTextViewer
          :text="currentText"
          @edit-sentence="editSentence"
          @delete-sentence="deleteSentenceConfirm"
        />
      </section>
    </main>

    <!-- Delete Text Modal -->
    <InterlinearTextDeleteModal
      :open="showDeleteModal"
      :loading="deleteLoading"
      :text="currentText"
      @close="closeDeleteModal"
      @confirm="handleDeleteText"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseBadge from '~/components/common/BaseBadge.vue'
import BaseErrorState from '~/components/common/BaseErrorState.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import LoadingEffect from '~/components/common/LoadingEffect.vue'
import InterlinearTextDeleteModal from '~/components/interlinear/InterlinearTextDeleteModal.vue'
import InterlinearTextViewer from '~/components/interlinear/InterlinearTextViewer.vue'
import { useInterlinearStore } from '~/stores/interlinearStore'
import { Dialect } from '~/types'

const route = useRoute()
const interlinearStore = useInterlinearStore()

// Local state
const showDeleteModal = ref(false)
const deleteLoading = ref(false)

// Computed properties from store
const currentText = computed(() => interlinearStore.currentText)
const loading = computed(() => interlinearStore.loading)
const error = computed(() => interlinearStore.error)

// Computed UI properties
const dialectLabel = computed(() => {
  if (!currentText.value) return ''
  const labels = {
    [Dialect.TUNISIAN]: 'Tunisian',
    [Dialect.MOROCCAN]: 'Moroccan',
    [Dialect.EGYPTIAN]: 'Egyptian',
    [Dialect.LEVANTINE]: 'Levantine',
    [Dialect.GULF]: 'Gulf',
    [Dialect.IRAQI]: 'Iraqi',
    [Dialect.MSA]: 'MSA',
  }
  return labels[currentText.value.dialect]
})

const formattedDate = computed(() => {
  if (!currentText.value) return ''
  return new Date(currentText.value.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
})

// Methods
const editText = () => {
  navigateTo(`/interlinear-texts/${route.params.id}/edit`)
}

const deleteText = () => {
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

const handleDeleteText = async () => {
  if (!currentText.value) return

  deleteLoading.value = true
  try {
    await interlinearStore.deleteText(currentText.value.id)
    closeDeleteModal()
    navigateTo('/interlinear-texts')
  } catch (error) {
    console.error('Failed to delete interlinear text:', error)
  } finally {
    deleteLoading.value = false
  }
}

const editSentence = (sentenceId: string) => {
  // TODO: Implement sentence editing in Phase 6
  console.log('Edit sentence:', sentenceId)
}

const deleteSentenceConfirm = (sentenceId: string) => {
  // TODO: Implement sentence deletion in Phase 6
  console.log('Delete sentence:', sentenceId)
}

// Lifecycle
onMounted(async () => {
  try {
    const id = route.params.id as string
    if (id) {
      await interlinearStore.fetchTextById(id)
    }
  } catch (err) {
    console.error('Failed to load interlinear text:', err)
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
