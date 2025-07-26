<template>
  <div class="analytics animate-fade-in">
    <div class="text-center py-16">
      <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-xl">
        <BaseIcon size="xl" class="text-white">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </BaseIcon>
      </div>
      
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Learning Analytics</h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Track your Arabic learning progress with detailed insights, vocabulary growth, and personalized recommendations.
      </p>
      
      <div class="inline-flex items-center px-6 py-3 bg-primary-100 text-primary-800 rounded-2xl font-medium">
        <BaseIcon size="sm" class="mr-2">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </BaseIcon>
        Coming Soon - Under Development
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '@/components/common/BaseIcon.vue'
</script>
