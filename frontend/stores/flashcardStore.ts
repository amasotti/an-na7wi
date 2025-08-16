import { computed, ref } from 'vue'
import type { Word } from '~/types'
import type { FlashcardSession, SessionResults } from '~/types/training'

export const useFlashcardStore = defineStore('flashcard', () => {
  // State
  const loading = ref(false)
  const session = ref<FlashcardSession | null>(null)
  const showResults = ref(false)

  // Computed
  const currentWord = computed(() => {
    if (!session.value || session.value.currentIndex >= session.value.words.length) {
      return null
    }
    return session.value.words[session.value.currentIndex]
  })

  const progress = computed(() => {
    if (!session.value) return { current: 0, total: 0, percentage: 0 }
    const current = session.value.currentIndex + 1
    const total = session.value.words.length
    return {
      current,
      total,
      percentage: total > 0 ? Math.round((current / total) * 100) : 0,
    }
  })

  const sessionResults = computed((): SessionResults => {
    if (!session.value) {
      return {
        total: 0,
        correct: 0,
        incorrect: 0,
        skipped: 0,
        words: [],
        startTime: new Date(),
        endTime: null,
      }
    }

    const results = session.value.results
    return {
      total: session.value.words.length,
      correct: results.filter(r => r.result === 'correct').length,
      incorrect: results.filter(r => r.result === 'incorrect').length,
      skipped: results.filter(r => r.result === 'skipped').length,
      words: results,
      startTime: session.value.startTime,
      endTime: session.value.endTime,
    }
  })

  const isSessionActive = computed(() => session.value !== null && !showResults.value)
  const hasCurrentWord = computed(() => currentWord.value !== null)

  // Actions
  const startNewSession = async (sessionLength = 15) => {
    loading.value = true
    showResults.value = false

    try {
      const wordStore = useWordStore()
      const allUnmasteredWords = await wordStore.fetchAllUnmasteredWords()

      if (allUnmasteredWords.length === 0) {
        session.value = null
        return false
      }

      // Shuffle and limit words
      const shuffledWords = shuffleArray([...allUnmasteredWords]).slice(0, sessionLength)

      session.value = {
        words: shuffledWords,
        currentIndex: 0,
        showAnswer: false,
        displayMode: getRandomDisplayMode(),
        results: [],
        startTime: new Date(),
        endTime: null,
      }

      return true
    } catch (error) {
      console.error('Error starting flashcard session:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const revealAnswer = () => {
    if (session.value) {
      session.value.showAnswer = true
    }
  }

  const markWordAs = (result: 'correct' | 'incorrect' | 'skipped') => {
    if (!session.value || !currentWord.value) return

    // Add result
    session.value.results.push({
      word: currentWord.value,
      result,
    })

    // Move to next word or end session
    if (session.value.currentIndex < session.value.words.length - 1) {
      session.value.currentIndex++
      session.value.showAnswer = false
      session.value.displayMode = getRandomDisplayMode()
    } else {
      endSession()
    }
  }

  const endSession = () => {
    if (session.value) {
      session.value.endTime = new Date()
      showResults.value = true
    }
  }

  const resetSession = () => {
    session.value = null
    showResults.value = false
  }

  const getRandomDisplayMode = (): 'arabic' | 'translation' => {
    return Math.random() > 0.5 ? 'arabic' : 'translation'
  }

  const shuffleArray = (array: Word[]): Word[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      if (i < shuffled.length && j < shuffled.length) {
        const temp = shuffled[i]!
        shuffled[i] = shuffled[j]!
        shuffled[j] = temp
      }
    }
    return shuffled
  }

  return {
    // State
    loading,
    session: readonly(session),
    showResults: readonly(showResults),

    // Computed
    currentWord,
    progress,
    sessionResults,
    isSessionActive,
    hasCurrentWord,

    // Actions
    startNewSession,
    revealAnswer,
    markWordAs,
    endSession,
    resetSession,
  }
})
