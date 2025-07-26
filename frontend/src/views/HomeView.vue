<template>
  <div class="home">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-primary-800 mb-4">
          {{ $t('app.title') }} <span class="text-primary-600 arabic">النحوي</span>
        </h1>
        <p class="text-xl text-gray-600">
          {{ $t('app.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div class="card hover:shadow-lg transition-medium">
          <h2 class="text-xl font-bold text-primary-700 mb-3">Manage Arabic Texts</h2>
          <p class="text-gray-600 mb-4">
            Create, edit, and organize Arabic texts with transliteration and translation.
            Add annotations for grammar, vocabulary, and cultural notes.
          </p>
          <router-link to="/texts" class="btn btn-primary inline-block">
            Browse Texts
          </router-link>
        </div>

        <div class="card hover:shadow-lg transition-medium">
          <h2 class="text-xl font-bold text-secondary-700 mb-3">Build Your Vocabulary</h2>
          <p class="text-gray-600 mb-4">
            Manage your Arabic vocabulary with translations, root patterns, and usage examples.
            Track your learning progress and review words by frequency.
          </p>
          <router-link to="/vocabulary" class="btn btn-secondary inline-block">
            Explore Vocabulary
          </router-link>
        </div>
      </div>

      <div class="card mb-8">
        <h2 class="text-xl font-bold mb-4">Sample Arabic Text</h2>
        <div class="bg-gray-50 p-4 rounded-md mb-4">
          <p class="arabic text-lg mb-2">
            مرحبا بكم في تطبيق النحوي! هذا التطبيق يساعدك على تعلم اللغة العربية بطريقة سهلة وممتعة.
          </p>
          <p class="text-gray-600 italic mb-2">
            Marhaban bikum fi tatbiq an-nahwi! Hadha al-tatbiq yusa'iduka 'ala ta'allum al-lugha al-'arabiyya bi-tariqa sahla wa mumti'a.
          </p>
          <p class="text-gray-700">
            Welcome to the An-Nahwi application! This app helps you learn Arabic in an easy and enjoyable way.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// HomeView component
</script>
