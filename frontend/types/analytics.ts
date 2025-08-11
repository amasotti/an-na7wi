import type { AnnotationType, Dialect, Difficulty, MasteryLevel, PartOfSpeech } from './enums'

// Overview metrics
export interface AnalyticsOverview {
  totalTexts: number
  totalWords: number
  totalAnnotations: number
  totalRoots: number
  averageWordsPerText: number
  averageAnnotationsPerText: number
}

// Content distribution metrics
export interface ContentDistribution {
  byDifficulty: Record<Difficulty, number>
  byDialect: Record<Dialect, number>
  byPartOfSpeech: Record<PartOfSpeech, number>
  byAnnotationType: Record<AnnotationType, number>
}

// Learning progress metrics
export interface LearningProgress {
  masteryDistribution: Record<MasteryLevel, number>
  wordsNeedingReview: number
  annotationsNeedingReview: number
  progressOverTime: TimeSeriesData[]
}

// Time-based data for charts
export interface TimeSeriesData {
  date: string
  value: number
  category?: string
}

// Activity metrics
export interface ActivityMetrics {
  textsCreatedOverTime: TimeSeriesData[]
  wordsAddedOverTime: TimeSeriesData[]
  annotationsCreatedOverTime: TimeSeriesData[]
  dailyActivity: DailyActivity[]
}

export interface DailyActivity {
  date: string
  textsCreated: number
  wordsAdded: number
  annotationsCreated: number
}

// Root analysis metrics
export interface RootAnalytics {
  mostFrequentRoots: RootFrequency[]
  rootDistribution: {
    triLiteral: number
    quadriLiteral: number
    quinqueLiteral: number
    other: number
  }
  averageWordsPerRoot: number
}

export interface RootFrequency {
  root: string
  displayForm: string
  wordCount: number
  meaning?: string
}

// Study patterns
export interface StudyPatterns {
  reviewSchedule: {
    due: number
    overdue: number
    upcoming: number
  }
  studyStreak: number
  mostStudiedTopics: string[]
  averageSessionLength: number
}

// Complete analytics response
export interface AnalyticsData {
  overview: AnalyticsOverview
  contentDistribution: ContentDistribution
  learningProgress: LearningProgress
  activityMetrics: ActivityMetrics
  rootAnalytics: RootAnalytics
  studyPatterns: StudyPatterns
  generatedAt: string
}
