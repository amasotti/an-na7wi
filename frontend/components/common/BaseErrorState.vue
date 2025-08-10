<template>
  <article class="error-state text-center">
    <section>
        <h3>{{ props.message }}</h3>
        <p>{{ props.error }}</p>
    </section>
  </article>
</template>


<script setup lang="ts">
type ErrorStateProps = {
  message: string
  error?: string
}

const props = withDefaults(defineProps<ErrorStateProps>(), {
  message: 'An unexpected error occurred.',
  error: 'check console for details',
})
</script>

<style scoped>

.error-state {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-12;
}

.error-state h3 {
  @apply text-red-800 font-medium mb-2;
}

.error-state p {
  @apply text-red-600 text-sm;
}

.error-state section {
  @apply bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto text-center;
}

</style>
