
<script setup lang="ts">
</script>


<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="animate-pulse">
      <div class="blended-bg h-8 rounded w-1/3 mb-4"></div>
      <div class="h-4 blended-bg w-1/4 mb-8"></div>
      <div class="bg-white rounded-xl shadow-sm p-8">
        <div class="h-6 blended-bg w-full mb-4"></div>
        <div class="h-6 blended-bg w-3/4 mb-4"></div>
        <div class="h-6 blended-bg w-5/6"></div>
      </div>
      <div class="mt-8 space-y-4">
        <div class="h-6 blended-bg w-full"></div>
        <div class="h-6 blended-bg w-3/4"></div>
        <div class="h-6 blended-bg w-2/3"></div>
        <div class="h-6 blended-bg w-full"></div>
      </div>
    </div>
  </div>
</template>

<style>
  .animate-pulse {
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }

  .blended-bg {
    /*@apply bg-gray-300 rounded;*/
    background: linear-gradient(to bottom right, #f0f4f8, #e0e7ed);

  }
</style>
