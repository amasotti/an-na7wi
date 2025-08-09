<template>
  <div class="dictionary-link-manager">
    <div class="flex justify-between items-center mb-3">
      <label class="form-label">Dictionary Links</label>
      <div class="flex gap-2">
        <BaseButton
          v-if="arabicText"
          type="button"
          variant="outline"
          size="sm"
          @click="generateDictionaryLinks"
          :title="'Auto-generate links for: ' + arabicText"
          class="whitespace-nowrap"
        >
          <BaseIcon size="xs" class="mr-1">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m12 3-1.912 5.813a2 2 0 01-1.275 1.275L3 12l5.813 1.912a2 2 0 011.275 1.275L12 21l1.912-5.813a2 2 0 011.275-1.275L21 12l-5.813-1.912a2 2 0 01-1.275-1.275L12 3zM5 3v4M3 5h4M6 17v4M4 19h4" />
          </BaseIcon>
          Auto-generate
        </BaseButton>
        <BaseButton
          type="button"
          variant="outline"
          size="sm"
          @click="addDictionaryLink"
          class="whitespace-nowrap"
        >
          <BaseIcon size="xs" class="mr-1">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14" />
          </BaseIcon>
          Add Dictionary
        </BaseButton>
      </div>
    </div>
    
    <div class="space-y-3">
      <div 
        v-for="(link, index) in links" 
        :key="link.id"
        class="flex gap-2 items-center p-3 bg-gray-50 rounded-lg"
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
          class="text-red-600 hover:text-red-800 hover:bg-red-100 border border-transparent hover:border-red-200 flex-shrink-0"
          title="Remove dictionary link"
        >
          <BaseIcon size="sm">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </BaseIcon>
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
        <a
          v-for="link in validLinks"
          :key="link.id"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          :class="getDictionaryBadgeClass(link.type)"
          :title="`${link.displayName || DICTIONARY_CONFIG[link.type].name} - Click to open in new tab`"
        >
          <span class="mr-1">{{ DICTIONARY_CONFIG[link.type].icon }}</span>
          {{ link.displayName || DICTIONARY_CONFIG[link.type].name }}
          <BaseIcon size="xs" class="ml-1 opacity-60">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </BaseIcon>
        </a>
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
  generateAllDictionaryLinks,
  getDictionaryBadgeClass,
} from '~/config/dictionaries'
import BaseButton from '../common/BaseButton.vue'
import BaseIcon from '../common/BaseIcon.vue'
import BaseInput from '../common/BaseInput.vue'
import BaseSelect from '../common/BaseSelect.vue'

interface Props {
  modelValue: DictionaryLink[]
  arabicText?: string
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

const generateDictionaryLinks = () => {
  if (!props.arabicText) return

  const generatedLinks = generateAllDictionaryLinks(props.arabicText)
  const existingTypes = new Set(links.value.map(link => link.type))

  // Only add links for dictionaries that don't already exist
  const newLinks = generatedLinks
    .filter(link => !existingTypes.has(link.type))
    .map(link => ({
      id: crypto.randomUUID(),
      type: link.type,
      url: link.url,
      displayName: link.displayName,
    }))

  links.value = [...links.value, ...newLinks]
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
