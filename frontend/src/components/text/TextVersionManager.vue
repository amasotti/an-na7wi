<template>
  <BaseCard class="mt-8">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900">Version History</h2>
      <div v-if="isViewingCurrentVersion" class="text-sm text-gray-500">
        Currently viewing the latest version
      </div>
      <BaseButton 
        v-else
        variant="primary" 
        size="sm" 
        @click="restoreVersion"
      >
        <BaseIcon size="sm" class="mr-2">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </BaseIcon>
        Restore This Version
      </BaseButton>
    </div>

    <div v-if="versions.length === 0" class="text-center py-8 text-gray-500">
      <BaseIcon size="lg" class="mx-auto mb-2">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </BaseIcon>
      <p>No version history available</p>
    </div>

    <div v-else class="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <ul role="list" class="divide-y divide-gray-200">
        <li 
          v-for="version in versions" 
          :key="version.id!!"
          class="relative p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          :class="{ 'bg-blue-50 hover:bg-blue-50': isSelectedVersion(version.versionNumber) }"
          @click="selectVersion(version.versionNumber)"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center">
                <span class="font-medium text-gray-900">
                  Version {{ version.versionNumber }}
                </span>
                <span v-if="version.isCurrent" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Current
                </span>
                <span v-if="isSelectedVersion(version.versionNumber) && !version.isCurrent" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Selected
                </span>
              </div>
              <p class="mt-1 text-sm text-gray-500">
                {{ formatVersionDate(version.updatedAt) }}
              </p>
            </div>
            <BaseIcon 
              v-if="isSelectedVersion(version.versionNumber)"
              size="sm" 
              class="text-primary-600"
            >
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </BaseIcon>
          </div>
        </li>
      </ul>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { TextVersion, TextVersionSummary } from '@/types'
import BaseButton from '../common/BaseButton.vue'
import BaseCard from '../common/BaseCard.vue'
import BaseIcon from '../common/BaseIcon.vue'

interface Props {
  versions: TextVersionSummary[]
  selectedVersion: TextVersion | null
  isViewingCurrentVersion: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select-version', versionNumber: number): void
  (e: 'restore-version'): void
}>()

const selectVersion = (versionNumber: number) => {
  emit('select-version', versionNumber)
}

const restoreVersion = () => {
  emit('restore-version')
}

const isSelectedVersion = (versionNumber: number): boolean => {
  if (props.selectedVersion) {
    return props.selectedVersion.versionNumber === versionNumber
  }

  // If no version is selected, check if this is the current version
  if (props.isViewingCurrentVersion) {
    const currentVersion = props.versions.find(v => v.isCurrent)
    return currentVersion?.versionNumber === versionNumber
  }

  return false
}

const formatVersionDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
