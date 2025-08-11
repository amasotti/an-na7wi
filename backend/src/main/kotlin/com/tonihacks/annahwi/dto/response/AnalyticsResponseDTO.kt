package com.tonihacks.annahwi.dto.response

import com.tonihacks.annahwi.entity.*

data class AnalyticsResponseDTO(
    val overview: AnalyticsOverviewDTO,
    val contentDistribution: ContentDistributionDTO,
    val learningProgress: LearningProgressDTO,
    val activityMetrics: ActivityMetricsDTO,
    val rootAnalytics: RootAnalyticsDTO,
    val studyPatterns: StudyPatternsDTO,
    val generatedAt: String
)

data class AnalyticsOverviewDTO(
    val totalTexts: Long,
    val totalWords: Long,
    val totalAnnotations: Long,
    val totalRoots: Long,
    val averageWordsPerText: Double,
    val averageAnnotationsPerText: Double
)

data class ContentDistributionDTO(
    val byDifficulty: Map<Difficulty, Long>,
    val byDialect: Map<Dialect, Long>,
    val byPartOfSpeech: Map<PartOfSpeech, Long>,
    val byAnnotationType: Map<AnnotationType, Long>
)

data class LearningProgressDTO(
    val masteryDistribution: Map<MasteryLevel, Long>,
    val wordsNeedingReview: Long,
    val annotationsNeedingReview: Long,
    val progressOverTime: List<TimeSeriesDataDTO>
)

data class TimeSeriesDataDTO(
    val date: String,
    val value: Long,
    val category: String? = null
)

data class ActivityMetricsDTO(
    val textsCreatedOverTime: List<TimeSeriesDataDTO>,
    val wordsAddedOverTime: List<TimeSeriesDataDTO>,
    val annotationsCreatedOverTime: List<TimeSeriesDataDTO>,
    val dailyActivity: List<DailyActivityDTO>
)

data class DailyActivityDTO(
    val date: String,
    val textsCreated: Long,
    val wordsAdded: Long,
    val annotationsCreated: Long
)

data class RootAnalyticsDTO(
    val mostFrequentRoots: List<RootFrequencyDTO>,
    val rootDistribution: RootDistributionDTO,
    val averageWordsPerRoot: Double
)

data class RootFrequencyDTO(
    val root: String,
    val displayForm: String,
    val wordCount: Long,
    val meaning: String?
) {
    companion object {
        fun fromEntity(entity: ArabicRoot, wordCount: Long): RootFrequencyDTO {
            return RootFrequencyDTO(
                root = entity.normalizedForm,
                displayForm = entity.displayForm,
                wordCount = wordCount,
                meaning = entity.meaning
            )
        }
    }
}

data class RootDistributionDTO(
    val triLiteral: Long,
    val quadriLiteral: Long,
    val quinqueLiteral: Long,
    val other: Long
)

data class StudyPatternsDTO(
    val reviewSchedule: ReviewScheduleDTO,
    val studyStreak: Long,
    val mostStudiedTopics: List<String>,
    val averageSessionLength: Double
)

data class ReviewScheduleDTO(
    val due: Long,
    val overdue: Long,
    val upcoming: Long
)
