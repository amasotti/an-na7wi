<template>
  <div class="dictionary-link-manager">
    <div class="flex justify-between items-center mb-3">
      <label class="form-label">Dictionary Links</label>
      <BaseButton
        type="button"
        variant="outline"
        size="sm"
        @click="addDictionaryLink"
      >
        <BaseIcon name="plus" size="xs" class="mr-1" />
        Add Dictionary
      </BaseButton>
    </div>
    
    <div class="space-y-3">
      <div 
        v-for="(link, index) in links" 
        :key="link.id"
        class="flex gap-2 items-start p-3 bg-gray-50 rounded-lg"
      >
        <BaseSelect
          v-model="link.type"
          :options="dictionaryTypeOptions"
          class="w-40"
          placeholder="Select dictionary"
        />
        <div class="flex-1">
          <BaseInput
            v-model="link.url"
            placeholder="Dictionary URL"
            :error="getUrlError(link)"
          />
        </div>
        <BaseInput
          v-if="link.type === DictionaryType.CUSTOM"
          v-model="link.displayName"
          placeholder="Display name"
          class="w-32"
        />
        <BaseButton
          type="button"
          variant="ghost"
          size="sm"
          @click="removeDictionaryLink(index)"
          class="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <BaseIcon name="trash" size="xs" />
        </BaseButton>
      </div>
      
      <div v-if="links.length === 0" class="text-center py-6 text-gray-500 text-sm">
        No dictionary links added yet. Click "Add Dictionary" to get started.
      </div>
    </div>
    
    <!-- Preview section -->
    <div v-if="links.length > 0" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 class="text-sm font-medium text-blue-900 mb-2">Preview:</h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="link in validLinks"
          :key="link.id"
          :class="getDictionaryBadgeClass(link.type)"
          :title="link.displayName || DICTIONARY_CONFIG[link.type].name"
        >
          <span class="mr-1">{{ DICTIONARY_CONFIG[link.type].icon }}</span>
          {{ link.displayName || DICTIONARY_CONFIG[link.type].name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DictionaryLink } from '@/types'
import { DictionaryType } from '@/types/enums'
import { computed, watch } from 'vue'
import {
  DICTIONARY_CONFIG,
  DICTIONARY_TYPE_OPTIONS,
  getDictionaryBadgeClass,
} from '~/config/dictionaries'
import BaseButton from '../common/BaseButton.vue'
import BaseIcon from '../common/BaseIcon.vue'
import BaseInput from '../common/BaseInput.vue'
import BaseSelect from '../common/BaseSelect.vue'

interface Props {
  modelValue: DictionaryLink[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [links: DictionaryLink[]]
}>()

const links = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const dictionaryTypeOptions = DICTIONARY_TYPE_OPTIONS

const validLinks = computed(() =>
  links.value.filter(link => link.url?.trim() && isValidUrl(link.url))
)

const addDictionaryLink = () => {
  const newLink: DictionaryLink = {
    id: crypto.randomUUID(),
    type: DictionaryType.CUSTOM,
    url: '',
    displayName: '',
  }
  links.value = [...links.value, newLink]
}

const removeDictionaryLink = (index: number) => {
  links.value = links.value.filter((_, i) => i !== index)
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const getUrlError = (link: DictionaryLink): string => {
  if (!link.url?.trim()) {
    return ''
  }
  return isValidUrl(link.url) ? '' : 'Please enter a valid URL'
}

// Auto-set display name for known dictionary types
watch(
  () => links.value,
  newLinks => {
    for (const link of newLinks) {
      if (link.type !== DictionaryType.CUSTOM && !link.displayName) {
        link.displayName = DICTIONARY_CONFIG[link.type].name
      }
    }
  },
  { deep: true }
)
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700;
}
</style>
