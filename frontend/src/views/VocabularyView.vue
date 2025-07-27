<template>
  <div class="vocabulary animate-fade-in">
    <div class="text-center py-16">
      <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-3xl flex items-center justify-center shadow-xl">
        <BaseIcon size="xl" class="text-white">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </BaseIcon>
      </div>
      
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Vocabulary Manager</h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Build and manage your Arabic vocabulary with root analysis, frequency tracking, and contextual learning.
      </p>
      
      <div class="inline-flex items-center px-6 py-3 bg-secondary-100 text-secondary-800 rounded-2xl font-medium">
        <BaseIcon size="sm" class="mr-2">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </BaseIcon>
        Coming Soon - Under Development
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '../components/common/BaseIcon.vue'
</script>
