package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.dto.response.*
import com.tonihacks.annahwi.entity.*
import com.tonihacks.annahwi.repository.*
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.persistence.EntityManager
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@ApplicationScoped
class AnalyticsService @Inject constructor(
  private val rootService: RootService,
  private val entityManager: EntityManager,
  private val textRepository: TextRepository,
  private val wordRepository: WordRepository,
  private val annotationRepository: AnnotationRepository,
  private val arabicRootRepository: ArabicRootRepository,
) {

  fun getAnalytics(): AnalyticsResponseDTO {
    val now = LocalDateTime.now()
    return AnalyticsResponseDTO(
      overview = getOverview(),
      contentDistribution = getContentDistribution(),
      learningProgress = getLearningProgress(),
      activityMetrics = getActivityMetrics(),
      rootAnalytics = getRootAnalytics(),
      studyPatterns = getStudyPatterns(),
      generatedAt = now.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
    )
  }

  private fun getOverview(): AnalyticsOverviewDTO {
    val totalTexts = textRepository.count()
    val totalWords = wordRepository.count()
    val totalAnnotations = annotationRepository.count()
    val totalRoots = arabicRootRepository.count()

    val averageWordsPerText = if (totalTexts > 0) {
      querySingle<Double>("SELECT AVG(t.wordCount) AS avgWords FROM Text t") ?: 0.0
    } else 0.0

    val averageAnnotationsPerText = if (totalTexts > 0) {
      totalAnnotations.toDouble() / totalTexts
    } else 0.0

    return AnalyticsOverviewDTO(
      totalTexts = totalTexts,
      totalWords = totalWords,
      totalAnnotations = totalAnnotations,
      totalRoots = totalRoots,
      averageWordsPerText = averageWordsPerText,
      averageAnnotationsPerText = averageAnnotationsPerText
    )
  }

  private fun getContentDistribution(): ContentDistributionDTO =
    ContentDistributionDTO(
      byDifficulty = groupedCount<Difficulty>("t.difficulty", "Text t"),
      byDialect = groupedCount<Dialect>("t.dialect", "Text t"),
      byPartOfSpeech = groupedCount<PartOfSpeech>("w.partOfSpeech", "Word w", "w.partOfSpeech IS NOT NULL"),
      byAnnotationType = groupedCount<AnnotationType>("a.type", "Annotation a")
    )

  private fun getLearningProgress(): LearningProgressDTO {
    val masteryDistribution = groupedCount<MasteryLevel>("w.masteryLevel", "Word w")
    val wordsNeedingReview = querySingle<Long>(
      "SELECT COUNT(a) AS cnt FROM Annotation a WHERE a.needsReview = true"
    ) ?: 0L
    val annotationsNeedingReview = querySingle<Long>(
      "SELECT COUNT(a) AS cnt FROM Annotation a WHERE a.nextReviewDate <= :now",
      "now" to LocalDateTime.now()
    ) ?: 0L

    return LearningProgressDTO(
      masteryDistribution = masteryDistribution,
      wordsNeedingReview = wordsNeedingReview,
      annotationsNeedingReview = annotationsNeedingReview,
      progressOverTime = getProgressOverTime()
    )
  }

  private fun getActivityMetrics(): ActivityMetricsDTO =
    ActivityMetricsDTO(
      textsCreatedOverTime = getEntityCreationOverTime("Text"),
      wordsAddedOverTime = getEntityCreationOverTime("Word"),
      annotationsCreatedOverTime = getEntityCreationOverTime("Annotation"),
      dailyActivity = getDailyActivity()
    )

  private fun getRootAnalytics(): RootAnalyticsDTO {
    val mostFrequentRoots = rootService.getAllRoots().map { root ->
      val wordCount = rootService.getWordCountForRoot(requireNotNull(root.id))
      RootFrequencyDTO.fromEntity(root, wordCount.toLong())
    }

    val distribution = groupedCount<Int>("r.letterCount", "ArabicRoot r")
    val avgWordsPerRoot = mostFrequentRoots.map { it.wordCount }.average().takeIf { !it.isNaN() } ?: 0.0

    return RootAnalyticsDTO(
      mostFrequentRoots = mostFrequentRoots,
      rootDistribution = RootDistributionDTO(
        triLiteral = distribution[3] ?: 0,
        quadriLiteral = distribution[4] ?: 0,
        quinqueLiteral = distribution[5] ?: 0,
        other = distribution.filterKeys { it !in listOf(3, 4, 5) }.values.sum()
      ),
      averageWordsPerRoot = avgWordsPerRoot
    )
  }

  private fun getStudyPatterns(): StudyPatternsDTO {
    val now = LocalDateTime.now()
    val today = now.toLocalDate()

    val due = countWhere<Annotation>("DATE(e.nextReviewDate) = :today", "today" to today)
    val overdue = countWhere<Annotation>("e.nextReviewDate < :now", "now" to now)
    val upcoming = countWhere<Annotation>(
      "e.nextReviewDate > :now AND e.nextReviewDate <= :nextWeek",
      "now" to now, "nextWeek" to now.plusWeeks(1)
    )

    return StudyPatternsDTO(
      reviewSchedule = ReviewScheduleDTO(due, overdue, upcoming),
      studyStreak = calculateStudyStreak(),
      mostStudiedTopics = listOf("grammar", "vocabulary", "conversation", "culture", "pronunciation"),
      averageSessionLength = 0.0 // placeholder
    )
  }

  private fun getProgressOverTime(): List<TimeSeriesDataDTO> {
    val start = LocalDate.now().minusDays(30)
    return timeSeries(
      """
            SELECT DATE(w.createdAt) AS dt, COUNT(w) AS cnt
            FROM Word w
            WHERE DATE(w.createdAt) >= :startDate
            GROUP BY dt
            ORDER BY dt DESC
            """,
      "startDate" to start,
      category = "words"
    )
  }

  private fun getEntityCreationOverTime(entityName: String): List<TimeSeriesDataDTO> {
    val start = LocalDate.now().minusDays(30)
    return timeSeries(
      """
            SELECT DATE(e.createdAt) AS dt, COUNT(e) AS cnt
            FROM $entityName e
            WHERE DATE(e.createdAt) >= :startDate
            GROUP BY dt
            ORDER BY dt DESC
            """,
      "startDate" to start
    )
  }

  private fun getDailyActivity(): List<DailyActivityDTO> {
    val start = LocalDate.now().minusDays(30)
    val dates = generateSequence(start) { it.plusDays(1) }
      .takeWhile { it <= LocalDate.now() }
      .toList()

    return dates.map { date ->
      DailyActivityDTO(
        date = date.toString(),
        textsCreated = countWhere<Text>("DATE(e.createdAt) = :date", "date" to date),
        wordsAdded = countWhere<Word>("DATE(e.createdAt) = :date", "date" to date),
        annotationsCreated = countWhere<Annotation>("DATE(e.createdAt) = :date", "date" to date)
      )
    }
  }

  private fun calculateStudyStreak(): Long {
    var streak = 0L
    var date = LocalDate.now()

    while (true) {
      val activity = querySingle<Long>(
        """
                SELECT COUNT(*) AS cnt FROM (
                    SELECT 1 AS x FROM Text t WHERE DATE(t.createdAt) = :date
                    UNION ALL
                    SELECT 1 AS x FROM Word w WHERE DATE(w.createdAt) = :date
                    UNION ALL
                    SELECT 1 AS x FROM Annotation a WHERE DATE(a.createdAt) = :date
                    UNION ALL
                    SELECT 1 AS x FROM ArabicRoot a WHERE DATE(a.createdAt) = :date
                )
                """, "date" to date
      ) ?: 0L

      if (activity > 0) {
        streak++
        date = date.minusDays(1)
      } else break
    }
    return streak
  }

  // --- helper methods ---

  private inline fun <reified T> groupedCount(field: String, from: String, where: String? = null): Map<T, Long> {
    val whereClause = where?.let { " WHERE $it" } ?: ""
    val rows = entityManager.createQuery(
      "SELECT $field AS k, COUNT(*) AS v FROM $from$whereClause GROUP BY k",
      Array<Any>::class.java
    ).resultList
    return rows.associate { (it[0] as T) to (it[1] as Long) }
  }

  private inline fun <reified E> countWhere(where: String, vararg params: Pair<String, Any>): Long =
    querySingle<Long>(
      "SELECT COUNT(e) AS cnt FROM ${E::class.simpleName} e WHERE $where", *params
    ) ?: 0L

  private fun <T> querySingle(jpql: String, vararg params: Pair<String, Any>): T? =
    entityManager.createQuery(jpql, Any::class.java)
      .apply { params.forEach { setParameter(it.first, it.second) } }
      .resultList.firstOrNull() as? T

  private fun timeSeries(
    jpql: String,
    vararg params: Pair<String, Any>,
    category: String? = null
  ): List<TimeSeriesDataDTO> =
    entityManager.createQuery(jpql, Array<Any>::class.java)
      .apply { params.forEach { setParameter(it.first, it.second) } }
      .resultList.map {
        TimeSeriesDataDTO(
          date = (it[0] as LocalDate).toString(),
          value = it[1] as Long,
          category = category
        )
      }
}
