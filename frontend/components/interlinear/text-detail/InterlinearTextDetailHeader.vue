<template>
  <header class="mb-8" v-if="currentText">
    <div class="flex items-center justify-between mb-4">
      <BaseBreadcrumb
        parent-link="/interlinear-texts"
        parent-text="Interlinear Texts"
        :item="currentText.title"
      />

      <div class="flex items-center gap-2">
        <AddButton @click="addSentence" text="Add Sentence" />
        <EditButton @click="editText" />
        <DeleteButton @click="$emit('delete')" />
      </div>
    </div>

    <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{{ currentText.title }}</h1>
    <!-- Description -->
    <div v-if="currentText.description" class="my-4 text-small">
      <p>{{ currentText.description }}</p>
    </div>

    <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
      <div class="flex items-center gap-2">
        <BaseBadge :variant="dialectColor" size="sm">
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
  </header>
</template>


<script setup lang="ts">
import { computed } from 'vue'
import AddButton from '~/components/common/AddButton.vue'
import BaseBadge from '~/components/common/BaseBadge.vue'
import BaseBreadcrumb from '~/components/common/BaseBreadcrumb.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import { useInterlinearStore } from '~/stores/interlinearStore'
import { dialectToLabel } from '~/utils/arabicDialects'
import { formatDate } from '~/utils/dateUtils'
import { dialectToColor } from '~/utils/textMetadata'

const route = useRoute()
const interlinearStore = useInterlinearStore()
const currentText = computed(() => interlinearStore.currentText)

defineEmits<{
  delete: []
}>()

const addSentence = () => {
  interlinearStore.openSentenceEditModal()
}

const editText = () => {
  navigateTo(`/interlinear-texts/${route.params.id}/edit-metadata`)
}

const dialectLabel = computed(() => {
  if (!currentText.value) return ''
  return dialectToLabel[currentText.value.dialect]
})

const dialectColor = computed(() => {
  if (!currentText.value) return 'gray'
  return dialectToColor[currentText.value.dialect]
})

const formattedDate = computed(() => {
  if (!currentText.value) return ''
  return formatDate(currentText.value.updatedAt)
})
</script>


<style scoped>

</style>
