<template>
  <BaseCard class="lg:col-span-3">
    <div class="space-y-8">
      <!-- Arabic Content -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Arabic Text</h2>
        <div 
          class="text-2xl leading-relaxed text-gray-900 font-arabic text-right bg-gray-50 p-6 rounded-lg"
          dir="rtl"
          lang="ar"
        >
          {{ displayText?.arabicContent || 'No content' }}
        </div>
      </div>

      <!-- Transliteration -->
      <div v-if="displayText?.transliteration">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Transliteration</h2>
        <div class="text-lg leading-relaxed text-gray-700 italic bg-blue-50 p-6 rounded-lg">
          {{ displayText.transliteration }}
        </div>
      </div>

      <!-- Translation -->
      <div v-if="displayText?.translation">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Translation</h2>
        <div class="text-lg leading-relaxed text-gray-800 bg-green-50 p-6 rounded-lg">
          {{ displayText.translation }}
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { Text, TextVersion } from '@/types'
import BaseCard from '../common/BaseCard.vue'

interface Props {
  displayText: Text | null
}

defineProps<Props>()
</script>

<style scoped>
.font-arabic {
  font-family: 'Noto Naskh Arabic', 'Arabic Typesetting', 'Times New Roman', serif;
}
</style>
