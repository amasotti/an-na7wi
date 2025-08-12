<template>
  <BaseCard class="p-6">
    <div class="flex items-center">
      <div :class="iconBackground">
        <BaseIcon size="md" :class="iconClass">
          <slot />
        </BaseIcon>
      </div>
      <div class="ml-4">
        <p class="summary-title">{{ title }}</p>
        <p class="summary-count">{{ count }}</p>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/common/BaseCard.vue'
import BaseIcon from '~/components/common/BaseIcon.vue'

type AnalyticsProps = {
  iconClass: string
  iconBgClass: string
  title: string
  count: number
}

const props = defineProps<AnalyticsProps>()

const iconBackground = computed(() => {
  return `${props.iconBgClass} p-3 rounded-lg`
})
</script>


<style scoped>

.summary-title {
  @apply text-sm font-medium text-gray-600;
}

.summary-count {
  @apply text-2xl font-bold text-gray-900;
}

</style>
