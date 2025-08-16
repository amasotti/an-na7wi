import { computed, ref } from 'vue'
import type { FlashcardSession, ReviewMode, SessionResults, TrainingResult } from '~/types/training'

export const useFlashcardStore = defineStore('flashcard', () => {
  // State
  const MAX_SESSION_LENGTH = 50 // Maximum session length
  const loading = ref(false)
  const session = ref<FlashcardSession | null>(null)
  const sessionLength = ref(15) // Default session length
  const showResults = ref(false)
  const selectedReviewMode = ref<ReviewMode>('NEW') // Default review mode

  // Computed
  const currentWord = computed(() => {
    if (
      !session.value ||
      session.value.currentIndex >= session.value.trainingSession.words.length
    ) {
      return null
    }
    return session.value.trainingSession.words[session.value.currentIndex]
  })

  const progress = computed(() => {
    if (!session.value) return { current: 0, total: 0, percentage: 0 }
    const current = session.value.currentIndex + 1
    const total = session.value.trainingSession.words.length
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
      total: session.value.trainingSession.words.length,
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
  const startNewSession = async () => {
    loading.value = true
    showResults.value = false

    try {
      const trainingSession = await trainingService.startSession(selectedReviewMode.value, sessionLength.value)

      if (trainingSession.words.length === 0) {
        session.value = null
        return false
      }

      session.value = {
        trainingSession,
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

  const markWordAs = async (result: TrainingResult) => {
    if (!session.value || !currentWord.value) return

    try {
      await trainingService.recordResult(
        session.value.trainingSession.id,
        currentWord.value.id,
        result
      )

      // Add result locally
      session.value.results.push({
        word: currentWord.value,
        result,
      })

      // Move to next word or end session
      if (session.value.currentIndex < session.value.trainingSession.words.length - 1) {
        session.value.currentIndex++
        session.value.showAnswer = false
        session.value.displayMode = getRandomDisplayMode()
      } else {
        await endSession()
      }
    } catch (error) {
      console.error('Error recording result:', error)
    }
  }

  const endSession = async () => {
    if (session.value) {
      try {
        await trainingService.completeSession(session.value.trainingSession.id)

        session.value.endTime = new Date()
        showResults.value = true
      } catch (error) {
        console.error('Error completing session:', error)
        // Still show results even if API call fails
        session.value.endTime = new Date()
        showResults.value = true
      }
    }
  }

  const resetSession = () => {
    session.value = null
    showResults.value = false
  }

  const getRandomDisplayMode = (): 'arabic' | 'translation' => {
    return Math.random() > 0.5 ? 'arabic' : 'translation'
  }

  // Modify sessionLength
  const updateSessionLength = (length: number) => {
    if (length < 1) {
      console.warn('Session length must be at least 1')
      sessionLength.value = 1
    }
    sessionLength.value = Math.min(length, MAX_SESSION_LENGTH)
  }

  const updateReviewMode = (mode: ReviewMode) => {
    if (['NEW', 'KNOWN', 'LEARNING', 'MIXED'].includes(mode)) {
      selectedReviewMode.value = mode
    } else {
      console.warn('Invalid review mode:', mode)
    }
  }

  return {
    // State
    loading,
    session: readonly(session),
    sessionLength: readonly(sessionLength),
    showResults: readonly(showResults),
    selectedReviewMode: readonly(selectedReviewMode),

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
    updateSessionLength,
    updateReviewMode,
  }
})
