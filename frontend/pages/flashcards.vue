<template>
  <div class="flashcard-page min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Flashcard Practice</h1>
            <p class="text-gray-600">Master your vocabulary with interactive flashcards</p>
          </div>
          <BaseButton v-if="!showResults && currentIndex > 0" variant="outline" @click="endSession">
            End Session
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Session Progress -->
    <div v-if="!showResults && sessionWords.length > 0" class="bg-white border-b">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{{ currentIndex + 1 }} of {{ sessionWords.length }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-primary-600 h-2 rounded-full transition-all duration-300" 
               :style="{ width: `${((currentIndex + 1) / sessionWords.length) * 100}%` }"></div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-96">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading practice words...</p>
      </div>
    </div>

    <!-- No Words Available -->
    <div v-else-if="!loading && sessionWords.length === 0" class="flex items-center justify-center min-h-96">
      <div class="text-center max-w-md">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <BaseIcon size="lg" class="text-gray-400">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </BaseIcon>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Words to Practice</h3>
        <p class="text-gray-600 mb-6">All your words are mastered! Add more words to your vocabulary to continue practicing.</p>
        <NuxtLink to="/words">
          <BaseButton>Browse Vocabulary</BaseButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Flashcard -->
    <div v-else-if="!showResults && currentWord" class="flex items-center justify-center min-h-96 px-4 py-8">
      <div class="w-full max-w-lg">
        <FlashCard
          :word="currentWord"
          :show-answer="showAnswer"
          :display-mode="displayMode"
          @reveal="handleReveal"
          @know="handleKnow"
          @dont-know="handleDontKnow"
        />
      </div>
    </div>

    <!-- Session Results -->
    <div v-else-if="showResults" class="max-w-4xl mx-auto px-4 py-8">
      <SessionResults
        :session-data="sessionResults"
        @restart="startNewSession"
        @return-home="$router.push('/')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Word } from '~/types'
import { MasteryLevel } from '~/types/enums'
import BaseButton from "~/components/common/BaseButton.vue";
import BaseIcon from "~/components/common/BaseIcon.vue";
import FlashCard from "~/components/flashcards/FlashCard.vue";
import SessionResults from "~/components/flashcards/SessionResults.vue";

// Store
const wordStore = useWordStore()

// State
const loading = ref(true)
const sessionWords = ref<Word[]>([])
const currentIndex = ref(0)
const showAnswer = ref(false)
const showResults = ref(false)
const displayMode = ref<'arabic' | 'translation'>('arabic')

// Session tracking
const sessionResults = ref({
  total: 0,
  correct: 0,
  incorrect: 0,
  skipped: 0,
  words: [] as Array<{ word: Word; result: 'correct' | 'incorrect' | 'skipped' }>,
  startTime: new Date(),
  endTime: null as Date | null,
})

// Computed
const currentWord = computed(() => sessionWords.value[currentIndex.value] || null)

// Methods
const loadPracticeWords = async () => {
  loading.value = true
  try {
    // Fetch words that are not mastered
    await wordStore.updateFilters({ masteryLevel: '' }) // Clear any existing filters
    await wordStore.fetchWords(true)
    
    // Filter out mastered words
    const unmastered = wordStore.words.filter(word => 
      word.masteryLevel !== MasteryLevel.MASTERED
    )
    
    // Shuffle the words and limit to 15 items for session
    const shuffled = shuffleArray([...unmastered])
    sessionWords.value = shuffled.slice(0, 15)
    sessionResults.value.total = sessionWords.value.length
  } catch (error) {
    console.error('Error loading practice words:', error)
  } finally {
    loading.value = false
  }
}

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const setRandomDisplayMode = () => {
  // Randomly choose what to show first (and what to blur)
  displayMode.value = Math.random() > 0.5 ? 'arabic' : 'translation'
  showAnswer.value = false
}

const handleReveal = () => {
  showAnswer.value = true
}

const handleKnow = () => {
  if (!currentWord.value) return
  
  sessionResults.value.words.push({
    word: currentWord.value,
    result: 'correct',
  })
  sessionResults.value.correct++
  
  nextCard()
}

const handleDontKnow = () => {
  if (!currentWord.value) return
  
  sessionResults.value.words.push({
    word: currentWord.value,
    result: 'incorrect',
  })
  sessionResults.value.incorrect++
  
  nextCard()
}

const nextCard = () => {
  if (currentIndex.value < sessionWords.value.length - 1) {
    currentIndex.value++
    setRandomDisplayMode()
  } else {
    endSession()
  }
}

const endSession = () => {
  sessionResults.value.endTime = new Date()
  showResults.value = true
}

const startNewSession = async () => {
  // Reset state
  currentIndex.value = 0
  showAnswer.value = false
  showResults.value = false
  sessionResults.value = {
    total: 0,
    correct: 0,
    incorrect: 0,
    skipped: 0,
    words: [],
    startTime: new Date(),
    endTime: null,
  }
  
  // Reload words and start
  await loadPracticeWords()
  if (sessionWords.value.length > 0) {
    setRandomDisplayMode()
  }
}

// Initialize
onMounted(() => {
  loadPracticeWords().then(() => {
    if (sessionWords.value.length > 0) {
      setRandomDisplayMode()
    }
  })
})
</script>
