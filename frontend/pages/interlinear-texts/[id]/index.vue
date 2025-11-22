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
      <InterlinearTextDetailHeader @delete="openDeleteModal" />

      <!-- Main Content -->
      <InterlinearTextViewer />

      <!-- Full text preview -->
      <InterlinearTextPreview />

    </main>

    <!-- Delete Text Modal -->
    <InterlinearTextDeleteModal
      v-if="currentText"
      :open="showDeleteModal"
      :text="currentText"
      @close="closeDeleteModal"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { InterlinearTextViewer } from '#components'
import BaseErrorState from '~/components/common/BaseErrorState.vue'
import LoadingEffect from '~/components/common/LoadingEffect.vue'
import InterlinearTextDeleteModal from '~/components/interlinear/InterlinearTextDeleteModal.vue'
import InterlinearTextPreview from '~/components/interlinear/InterlinearTextPreview.vue'
import InterlinearTextDetailHeader from '~/components/interlinear/text-detail/InterlinearTextDetailHeader.vue'
import { useInterlinearStore } from '~/stores/interlinearStore'

const route = useRoute()
const interlinearStore = useInterlinearStore()

// Local state
const showDeleteModal = ref(false)

// Computed properties from store
const currentText = computed(() => interlinearStore.currentText)
const loading = computed(() => interlinearStore.loading)
const error = computed(() => interlinearStore.error)

// Methods
const openDeleteModal = () => {
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
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
