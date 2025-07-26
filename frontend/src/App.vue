<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-primary-700 m-0">
            {{ $t('app.title') }}
          </h1>
          <span class="ml-2 text-sm text-gray-500">{{ $t('app.subtitle') }}</span>
        </div>
        <nav>
          <ul class="flex space-x-6">
            <li>
              <router-link to="/" class="nav-link">{{ $t('nav.home') }}</router-link>
            </li>
            <li>
              <router-link to="/texts" class="nav-link">{{ $t('nav.texts') }}</router-link>
            </li>
            <li>
              <router-link to="/vocabulary" class="nav-link">{{ $t('nav.vocabulary') }}</router-link>
            </li>
            <li>
              <router-link to="/settings" class="nav-link">{{ $t('nav.settings') }}</router-link>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <main class="flex-grow container mx-auto px-4 py-6">
      <router-view />
    </main>

    <footer class="bg-gray-100 border-t border-gray-200">
      <div class="container mx-auto px-4 py-4 text-center text-gray-600 text-sm">
        <p>An-Nahwi (النحوي) - Arabic Learning Application</p>
        <p class="mt-1">&copy; {{ new Date().getFullYear() }} ToniHacks</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// App.vue is the root component
</script>

<style>
.nav-link {
  @apply text-gray-600 hover:text-primary-600 font-medium;
}

.nav-link.router-link-active {
  @apply text-primary-600 font-semibold;
}
</style>
