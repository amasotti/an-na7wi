<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
    <TheNavigation />

    <main class="flex-grow">
      <slot />
    </main>

    <footer class="glass border-t border-white/20 mt-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="text-center">
          <div class="flex items-center justify-center mb-3">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-3">
              <span class="text-white font-bold">ن</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-0">An-Nahwi</h3>
            <span class="arabic text-gray-600 ml-2">النحوي</span>
          </div>
          <p class="text-gray-600 mb-4">Arabic Learning Application</p>
          <div class="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span>&copy; {{ new Date().getFullYear() }} ToniHacks</span>
            <span>•</span>
            <a href="https://github.com/amasotti/an-na7wi" class="hover:text-primary-600 transition-colors">Documentation</a>
            <span>•</span>
            <a href="https://github.com/amasotti/an-na7wi/issues" class="hover:text-primary-600 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import TheNavigation from '~/components/layout/TheNavigation.vue'
</script>

<style>
/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
