<template>
  <div class="search animate-fade-in">
    <div class="text-center py-16">
      <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl flex items-center justify-center shadow-xl">
        <BaseIcon size="xl" class="text-white">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </BaseIcon>
      </div>
      
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Advanced Search</h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Powerful search across texts and vocabulary with Arabic root pattern matching and intelligent filtering.
      </p>
      
      <div class="inline-flex items-center px-6 py-3 bg-accent-100 text-accent-800 rounded-2xl font-medium">
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
