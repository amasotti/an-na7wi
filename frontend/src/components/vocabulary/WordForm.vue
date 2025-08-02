<template>
  <BaseModal
    :open="open"
    :title="isEditing ? 'Edit Word' : 'Add New Word'"
    size="xl"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="word-form">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Arabic Word -->
        <div class="col-span-2">
          <BaseInput
            v-model="form.arabic"
            label="Arabic Word*"
            required
            class="rtl"
          />
        </div>

        <!-- Transliteration -->
        <div>
          <BaseInput
            v-model="form.transliteration"
            label="Transliteration"
          />
        </div>

        <!-- Translation -->
        <div>
          <BaseInput
            v-model="form.translation"
            label="Translation/Definition*"
            required
          />
        </div>

        <!-- Example -->
        <div class="col-span-2">
          <label class="form-label">Example Sentence</label>
          <textarea 
            v-model="form.example" 
            rows="2"
            class="form-textarea rtl"
          ></textarea>
        </div>

        <!-- Root -->
        <div>
          <BaseInput
            v-model="form.root"
            label="Root"
            class="rtl"
          />
        </div>

        <!-- Part of Speech -->
        <div>
          <BaseSelect
            v-model="form.partOfSpeech"
            label="Part of Speech"
            :options="partsOfSpeechOptions"
            placeholder="Select Part of Speech"
          />
        </div>

        <!-- Difficulty -->
        <div>
          <BaseSelect
            v-model="form.difficulty"
            label="Difficulty*"
            :options="difficultyOptions"
            required
          />
        </div>

        <!-- Dialect -->
        <div>
          <BaseSelect
            v-model="form.dialect"
            label="Dialect*"
            :options="dialectOptions"
            required
          />
        </div>

        <!-- Mastery Level -->
        <div>
          <BaseSelect
            v-model="form.masteryLevel"
            label="Mastery Level"
            :options="masteryLevelOptions"
          />
        </div>

        <!-- Dictionary Links -->
        <div>
          <BaseInput
            v-model="form.dictionaryLinks"
            label="Dictionary Links"
            placeholder="Comma-separated URLs"
          />
        </div>

        <!-- Pronunciation Link -->
        <div>
          <BaseInput
            v-model="form.pronunciationLink"
            label="Pronunciation Link"
            placeholder="URL to audio pronunciation"
          />
        </div>

        <!-- Related Words -->
        <div>
          <BaseInput
            v-model="form.relatedWords"
            label="Related Words"
            placeholder="Comma-separated related words"
          />
        </div>

        <!-- Notes -->
        <div class="col-span-2">
          <label class="form-label">Notes</label>
          <textarea 
            v-model="form.notes" 
            rows="3"
            class="form-textarea"
          ></textarea>
        </div>
      </div>

      <div class="form-actions">
        <BaseButton 
          type="button" 
          variant="outline" 
          @click="handleClose"
        >
          Cancel
        </BaseButton>
        <BaseButton 
          type="submit" 
          :loading="loading"
        >
          {{ isEditing ? 'Update Word' : 'Add Word' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import type { SelectOption, Word } from '@/types'
import { Dialect, Difficulty, MasteryLevel, PartOfSpeech } from '@/types/enums'
import { computed, ref, watch } from 'vue'
import BaseButton from '../common/BaseButton.vue'
import BaseInput from '../common/BaseInput.vue'
import BaseModal from '../common/BaseModal.vue'
import BaseSelect from '../common/BaseSelect.vue'

interface Props {
  open: boolean
  loading?: boolean
  word?: Word | null
  difficultyOptions: SelectOption<Difficulty>[]
  dialectOptions: SelectOption<Dialect>[]
  masteryLevelOptions: SelectOption<MasteryLevel>[]
  partsOfSpeechOptions: SelectOption<PartOfSpeech>[]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  word: null,
})

const emit = defineEmits<{
  close: []
  submit: [formData: Partial<Word>]
}>()

const isEditing = computed(() => !!props.word)

const form = ref({
  arabic: '',
  transliteration: '',
  translation: '',
  example: '',
  root: '',
  notes: '',
  partOfSpeech: PartOfSpeech.UNKNOWN,
  difficulty: Difficulty.BEGINNER,
  dialect: Dialect.MSA,
  masteryLevel: MasteryLevel.NEW,
  dictionaryLinks: '',
  pronunciationLink: '',
  relatedWords: '',
  isVerified: false,
})

// Watch for changes in the word prop to update the form
watch(
  () => props.word,
  newWord => {
    if (newWord) {
      form.value = {
        arabic: newWord.arabic,
        transliteration: newWord.transliteration || '',
        translation: newWord.translation || '',
        example: newWord.example || '',
        root: newWord.root || '',
        partOfSpeech: newWord.partOfSpeech || PartOfSpeech.UNKNOWN,
        notes: newWord.notes || '',
        difficulty: newWord.difficulty,
        dialect: newWord.dialect,
        masteryLevel: newWord.masteryLevel || MasteryLevel.NEW,
        dictionaryLinks: newWord.dictionaryLinks || '',
        pronunciationLink: newWord.pronunciationLink || '',
        relatedWords: newWord.relatedWords || '',
        isVerified: newWord.isVerified,
      }
    } else {
      form.value = {
        arabic: '',
        transliteration: '',
        translation: '',
        example: '',
        root: '',
        partOfSpeech: PartOfSpeech.UNKNOWN,
        notes: '',
        difficulty: Difficulty.BEGINNER,
        dialect: Dialect.MSA,
        masteryLevel: MasteryLevel.NEW,
        dictionaryLinks: '',
        pronunciationLink: '',
        relatedWords: '',
        isVerified: false,
      }
    }
  },
  { immediate: true }
)

const handleClose = () => {
  emit('close')
}

const handleSubmit = () => {
  emit('submit', form.value)
}
</script>

<style scoped>
.word-form {
  @apply space-y-6;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-textarea {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500;
}

.form-actions {
  @apply mt-6 flex justify-end gap-3;
}

.rtl {
  direction: rtl;
}
</style>
