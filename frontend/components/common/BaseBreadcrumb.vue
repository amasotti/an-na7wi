<template>
  <nav class="flex items-center space-x-2 text-sm text-gray-600">
    <NuxtLink :to="parentLink" class="hover:text-primary-600 transition-colors">
      {{ props.parentText }}
    </NuxtLink>
    <span>{{props.separator}}</span>
    <span class="text-gray-900 font-medium">{{ props.item }}</span>
  </nav>
</template>


<script setup lang="ts">
type BreadcrumbProps = {
  parentLink: string
  parentText: string
  separator: string
  item: string
}

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  parentLink: '/',
  parentText: 'Home',
  separator: '>',
  item: 'Home',
})

const parentLink = computed(() => props.parentLink || '/')
</script>
