import type { AnalyticsData } from '~/types/analytics'

export const mockedAnalyticsData: AnalyticsData = {
  overview: {
    totalTexts: 25,
    totalWords: 1250,
    totalAnnotations: 85,
    totalRoots: 340,
    averageWordsPerText: 50,
    averageAnnotationsPerText: 3.4,
  },
  contentDistribution: {
    byDifficulty: {
      BEGINNER: 10,
      INTERMEDIATE: 12,
      ADVANCED: 3,
    },
    byDialect: {
      MSA: 20,
      EGYPTIAN: 3,
      LEVANTINE: 2,
      TUNISIAN: 1,
      MOROCCAN: 0,
      IRAQI: 2,
      GULF: 1,
    },
    byPartOfSpeech: {
      NOUN: 500,
      VERB: 400,
      ADJECTIVE: 200,
      ADVERB: 100,
      PREPOSITION: 50,
      CONJUNCTION: 30,
      PRONOUN: 20,
      INTERJECTION: 10,
      PARTICLE: 0,
      UNKNOWN: 10,
    },
    byAnnotationType: {
      GRAMMAR: 40,
      VOCABULARY: 30,
      CULTURAL: 15,
      OTHER: 5,
    },
  },
  learningProgress: {
    masteryDistribution: {
      NEW: 100,
      LEARNING: 75,
      KNOWN: 50,
      MASTERED: 25,
    },
    wordsNeedingReview: 45,
    annotationsNeedingReview: 12,
    progressOverTime: [
      { date: '2024-01-01', value: 10 },
      { date: '2024-01-02', value: 15 },
      { date: '2024-01-03', value: 20 },
    ],
  },
  activityMetrics: {
    textsCreatedOverTime: [
      { date: '2024-01-01', value: 1 },
      { date: '2024-01-02', value: 2 },
      { date: '2024-01-03', value: 1 },
    ],
    wordsAddedOverTime: [
      { date: '2024-01-01', value: 50 },
      { date: '2024-01-02', value: 75 },
      { date: '2024-01-03', value: 40 },
    ],
    annotationsCreatedOverTime: [
      { date: '2024-01-01', value: 3 },
      { date: '2024-01-02', value: 5 },
      { date: '2024-01-03', value: 2 },
    ],
    dailyActivity: [
      { date: '2024-01-01', textsCreated: 1, wordsAdded: 50, annotationsCreated: 3 },
      { date: '2024-01-02', textsCreated: 2, wordsAdded: 75, annotationsCreated: 5 },
      { date: '2024-01-03', textsCreated: 1, wordsAdded: 40, annotationsCreated: 2 },
    ],
  },
  rootAnalytics: {
    mostFrequentRoots: [
      { root: 'كتب', displayForm: 'ك ت ب', wordCount: 15, meaning: 'to write' },
      { root: 'قرأ', displayForm: 'ق ر أ', wordCount: 12, meaning: 'to read' },
      { root: 'علم', displayForm: 'ع ل م', wordCount: 10, meaning: 'to know' },
    ],
    rootDistribution: {
      triLiteral: 300,
      quadriLiteral: 35,
      quinqueLiteral: 5,
      other: 0,
    },
    averageWordsPerRoot: 3.7,
  },
  studyPatterns: {
    reviewSchedule: {
      due: 15,
      overdue: 5,
      upcoming: 25,
    },
    studyStreak: 7,
    mostStudiedTopics: ['Grammar', 'Vocabulary', 'Reading'],
    averageSessionLength: 45,
  },
  generatedAt: new Date().toISOString(),
}
