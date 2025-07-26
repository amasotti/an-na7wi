<template>
  <div class="not-found animate-fade-in">
    <div class="text-center py-16">
      <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center shadow-xl">
        <BaseIcon size="xl" class="text-white">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </BaseIcon>
      </div>
      
      <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 class="text-3xl font-bold text-gray-700 mb-4">Page Not Found</h2>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <BaseButton 
          tag="router-link" 
          to="/" 
          size="lg"
        >
          <BaseIcon size="sm" class="mr-2">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </BaseIcon>
          Go Home
        </BaseButton>
        
        <BaseButton 
          variant="outline" 
          size="lg"
          @click="goBack"
        >
          <BaseIcon size="sm" class="mr-2">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </BaseIcon>
          Go Back
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '../components/common/BaseButton.vue'
import BaseIcon from '../components/common/BaseIcon.vue'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>