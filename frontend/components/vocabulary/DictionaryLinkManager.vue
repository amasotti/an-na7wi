<template>
  <section aria-label="Dictionary and pronunciation links management">
    <!-- Dictionary Links Section -->
    <fieldset class="form-group">
      <legend class="form-label">Dictionary & Pronunciation Links</legend>
      <!--   Header with the two buttons (Generate or add manually)     -->
      <header class="form-header">
        <div class="form-actions">
          <!--   Auto Generate Links     -->
          <BaseButton
            v-if="arabicText"
            type="button"
            variant="outline"
            size="sm"
            @click="generateAllLinks"
            :title="'Auto-generate links for: ' + arabicText"
            class="whitespace-nowrap"
          >
            <BaseIcon size="xs" class="mr-1">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m12 3-1.912 5.813a2 2 0 01-1.275 1.275L3 12l5.813 1.912a2 2 0 011.275 1.275L12 21l1.912-5.813a2 2 0 011.275-1.275L21 12l-5.813-1.912a2 2 0 01-1.275-1.275L12 3zM5 3v4M3 5h4M6 17v4M4 19h4" />
            </BaseIcon>
            Auto-generate
          </BaseButton>
          <!--   Add Links     -->
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
      </header>
      
      <div class="form-section">
        <article 
          v-for="(link, index) in links" 
          :key="link.id"
          class="form-row"
        >
          <BaseSelect
            v-model="link.type"
            :options="dictionaryTypeOptions"
            class="w-fit"
            placeholder="Select dictionary"
            :aria-label="`Dictionary type for link ${index + 1}`"
          />
          <div class="flex-1">
            <BaseInput
              v-model="link.url"
              class="text-sm"
              placeholder="Dictionary URL"
              :error="getUrlError(link)"
              :aria-label="`Dictionary URL for link ${index + 1}`"
            />
          </div>
          <BaseInput
            v-if="link.type === DictionaryType.CUSTOM"
            v-model="link.displayName"
            placeholder="Display name"
            class="w-32"
            :aria-label="`Display name for custom dictionary ${index + 1}`"
          />
          <!-- Paste Clipboard -->
          <BaseButton
            type="button"
            variant="ghost"
            size="sm"
            @click="pasteContent(index)"
            class="action-button-clear"
            :title="`Clear dictionary link ${index + 1}`"
            :aria-label="`Clear dictionary link ${index + 1}`"
          >
            <BaseIcon size="sm">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2m4-1h4a1 1 0 011 1v3a1 1 0 01-1 1H8a1 1 0 01-1-1V4a1 1 0 011-1h4z" />
            </BaseIcon>
          </BaseButton>
          <BaseButton
            type="button"
            variant="outline"
            size="sm"
            @click="removeDictionaryLink(index)"
            class="action-button-danger"
            :title="`Remove dictionary link ${index + 1}`"
            :aria-label="`Remove dictionary link ${index + 1}`"
          >
            <BaseIcon size="sm">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </BaseIcon>
          </BaseButton>
        </article>
        
        <div v-if="links.length === 0" class="empty-state">
          No dictionary links added yet. Click "Add Dictionary" to get started.
        </div>
      </div>
    </fieldset>

    <!-- Pronunciation Link Section -->
    <fieldset class="form-group mt-6">
      <legend class="form-label mb-3">Pronunciation Link</legend>
      <div class="form-row">
        <div class="flex items-center gap-sm w-40">
          <span class="text-lg" role="img" aria-label="Audio">🔊</span>
          <span class="text-small font-medium text-gray-700">Forvo</span>
        </div>
        <div class="flex-1">
          <BaseInput
            v-model="pronunciationLink"
            placeholder="Pronunciation URL (auto-generated if empty)"
            :error="getPronunciationUrlError()"
            aria-label="Forvo pronunciation URL"
          />
        </div>
        <BaseButton
          v-if="arabicText"
          type="button"
          variant="ghost"
          size="sm"
          @click="generatePronunciationLink"
          title="Auto-generate Forvo pronunciation link"
          aria-label="Auto-generate Forvo pronunciation link"
          class="flex-shrink-0"
        >
          <BaseIcon size="sm">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m12 3-1.912 5.813a2 2 0 01-1.275 1.275L3 12l5.813 1.912a2 2 0 011.275 1.275L12 21l1.912-5.813a2 2 0 011.275-1.275L21 12l-5.813-1.912a2 2 0 01-1.275-1.275L12 3zM5 3v4M3 5h4M6 17v4M4 19h4" />
          </BaseIcon>
        </BaseButton>
      </div>
    </fieldset>
    
    <!-- Preview Section -->
    <aside v-if="links.length > 0 || pronunciationLink" class="form-preview" aria-label="Link preview">
      <h4 class="form-preview-title">Preview:</h4>
      <nav class="form-preview-content" aria-label="External dictionary and pronunciation links">
        <!-- Dictionary links -->
        <a
          v-for="link in validLinks"
          :key="link.id"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          :class="['external-link', getDictionaryBadgeClass(link.type)]"
          :title="`${link.displayName || DICTIONARY_CONFIG[link.type].name} - Click to open in new tab`"
        >
          <span class="mr-1">{{ DICTIONARY_CONFIG[link.type].icon }}</span>
          {{ link.displayName || DICTIONARY_CONFIG[link.type].name }}
          <BaseIcon size="xs" class="external-link-icon">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </BaseIcon>
        </a>
        
        <!-- Pronunciation link -->
        <a
          v-if="validPronunciationLink"
          :href="pronunciationLink"
          target="_blank"
          rel="noopener noreferrer"
          :class="['external-link', getForfoBadgeClass()]"
          title="Forvo Pronunciation - Click to open in new tab"
        >
          <span class="mr-1" role="img" aria-label="Audio">🔊</span>
          Forvo
          <BaseIcon size="xs" class="external-link-icon">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </BaseIcon>
        </a>
      </nav>
    </aside>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { DictionaryLink } from '@/types'
import { DictionaryType } from '@/types/enums'
import {
  DICTIONARY_CONFIG,
  DICTIONARY_TYPE_OPTIONS,
  generateAllDictionaryLinks,
  getDictionaryBadgeClass,
} from '~/config/dictionaries'
import { generateForvoUrl, getForfoBadgeClass } from '~/config/pronunciation'
import BaseButton from '../common/BaseButton.vue'
import BaseIcon from '../common/BaseIcon.vue'
import BaseInput from '../common/BaseInput.vue'
import BaseSelect from '../common/BaseSelect.vue'

interface Props {
  modelValue: DictionaryLink[]
  pronunciationUrl?: string
  arabicText?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [links: DictionaryLink[]]
  'update:pronunciationUrl': [url?: string]
}>()

const links = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const pronunciationLink = computed({
  get: () => props.pronunciationUrl || '',
  set: value => emit('update:pronunciationUrl', value || undefined),
})

const dictionaryTypeOptions = DICTIONARY_TYPE_OPTIONS

const validLinks = computed(() =>
  links.value.filter(link => link.url?.trim() && isValidUrl(link.url))
)

const validPronunciationLink = computed(
  () => pronunciationLink.value?.trim() && isValidUrl(pronunciationLink.value)
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

const generatePronunciationLink = () => {
  if (!props.arabicText) return
  pronunciationLink.value = generateForvoUrl(props.arabicText)
}

const generateAllLinks = () => {
  generateDictionaryLinks()
  generatePronunciationLink()
}

const removeDictionaryLink = (index: number) => {
  links.value = links.value.filter((_, i) => i !== index)
}

const pasteContent = (index: number) => {
  navigator.clipboard
    .readText()
    .then(text => {
      if (text) {
        links.value[index]!.url = text
      }
    })
    .catch(err => {
      console.error('Failed to read clipboard contents:', err)
    })
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    console.error('Invalid URL:', url)
    return false
  }
}

const getUrlError = (link: DictionaryLink): string => {
  if (!link.url?.trim()) {
    return ''
  }
  return isValidUrl(link.url) ? '' : 'Please enter a valid URL'
}

const getPronunciationUrlError = (): string => {
  if (!pronunciationLink.value?.trim()) {
    return ''
  }
  return isValidUrl(pronunciationLink.value) ? '' : 'Please enter a valid URL'
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

