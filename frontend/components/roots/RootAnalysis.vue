<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200">
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-900">
        Linguistic Analysis
      </h2>
    </div>
    
    <div class="p-6">
      <div v-if="rootAnalysis" class="text-gray-800 prose prose-sm max-w-none prose-headings:text-gray-900 prose-strong:text-gray-900" v-html="$markdownit.render(rootAnalysis)"></div>
      <div v-else class="text-gray-600">No linguistic analysis available for this root.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRootStore } from '~/stores/rootStore'

const rootStore = useRootStore()

const rootAnalysis = computed(() => rootStore.currentRootWithWords?.root?.analysis ?? null)
</script>
