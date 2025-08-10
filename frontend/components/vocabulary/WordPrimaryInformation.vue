<template>
  <header class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
    <section class="flex justify-end space-x-3">
      <!-- Edit Button -->
      <BaseButton
        variant="outline"
        size="sm"
        @click="$emit('edit')"
      >
        <BaseIcon size="sm" class="mr-2">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </BaseIcon>
        Edit
      </BaseButton>
      <!-- Delete Button -->
      <BaseButton
        variant="outline"
        size="sm"
        class="action-button-danger"
        @click="$emit('delete')"
      >
        <BaseIcon size="sm" class="mr-2">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </BaseIcon>
        Delete
      </BaseButton>
    </section>

    <article>
      <h1 class="word-arabic arabic">
        {{ currentWord!!.arabic }}
      </h1>
      <section
        v-if="currentWord?.transliteration"
        class="word-basic-info italic"
      >
        {{ currentWord!!.transliteration }}
      </section>
      <div v-if="currentWord?.translation" class="word-basic-info">
        {{ currentWord!!.translation }}
      </div>
    </article>

  </header>

</template>

<script setup lang="ts">
import BaseButton from '~/components/common/BaseButton.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'

const wordStore = useWordStore()

const currentWord = computed(() => wordStore.currentWord)

const emit = defineEmits<{
  edit: []
  delete: []
}>()
</script>

<style scoped>
.word-arabic {
  @apply text-5xl font-bold text-gray-900 text-center;
}

.word-basic-info {
  @apply text-lg text-gray-600 font-light text-center;
}
</style>
