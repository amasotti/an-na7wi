<template>
  <nav class="text-center py-12">
    <div class="text-gray-400 text-lg">{{ props.message }}</div>
    <NuxtLink
      :to="goBackLink"
      class="inline-block mt-4 text-primary-600 hover:text-primary-700 transition-colors"
    >
      {{ props.linkText }}
    </NuxtLink>
  </nav>
</template>


<script setup lang="ts">
type EmptySateProps = {
  link: string
  linkText: string
  message: string
}

const props = withDefaults(defineProps<EmptySateProps>(), {
  link: '/',
  linkText: 'Go Back',
  message: 'No data available',
})

const goBackLink = computed(() => props.link || '/')
</script>
