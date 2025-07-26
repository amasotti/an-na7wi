<template>
  <div class="texts">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Arabic Texts</h1>
      <button class="btn btn-primary">
        Add New Text
      </button>
    </div>

    <div class="mb-6">
      <div class="flex gap-4 mb-4">
        <div class="w-full">
          <input 
            type="text" 
            placeholder="Search texts..." 
            class="form-input"
          />
        </div>
        <div class="w-48">
          <select class="form-input">
            <option value="">All Dialects</option>
            <option value="TUNISIAN">Tunisian</option>
            <option value="MOROCCAN">Moroccan</option>
            <option value="EGYPTIAN">Egyptian</option>
            <option value="MSA">Modern Standard Arabic</option>
          </select>
        </div>
        <div class="w-48">
          <select class="form-input">
            <option value="">All Difficulties</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Text list (placeholder) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card hover:shadow-lg transition-medium">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-bold text-primary-700">Sample Text {{ i }}</h3>
          <span class="px-2 py-1 text-xs rounded-full" 
                :class="i % 3 === 0 ? 'bg-green-100 text-green-800' : 
                        i % 3 === 1 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'">
            {{ i % 3 === 0 ? 'Beginner' : i % 3 === 1 ? 'Intermediate' : 'Advanced' }}
          </span>
        </div>
        <p class="arabic text-sm mb-2">
          هذا مثال لنص باللغة العربية. يمكن أن يكون هذا النص قصة قصيرة أو مقالة أو حوارًا.
        </p>
        <div class="flex justify-between items-center mt-4">
          <span class="text-xs text-gray-500">
            {{ i % 2 === 0 ? 'Tunisian' : 'Egyptian' }} • {{ 50 + i * 10 }} words
          </span>
          <router-link :to="`/texts/${i}`" class="text-primary-600 hover:text-primary-800 text-sm font-medium">
            View Details →
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty state (hidden in this example) -->
    <div class="hidden text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No texts found</h3>
      <p class="text-gray-500 mb-6">Get started by creating your first Arabic text.</p>
      <button class="btn btn-primary">
        Add New Text
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// TextView component
</script>
