package com.tonihacks.annahwi.dto.response

import java.time.LocalDateTime

data class TrainingStatsResponseDTO(
    val totalSessions: Long,
    val totalWordsReviewed: Long,
    val averageAccuracy: Double,
    val recentSessions: List<RecentSessionDTO>,
    val accuracyByReviewMode: Map<String, Double>
)

data class RecentSessionDTO(
    val id: String,
    val completedAt: LocalDateTime,
    val reviewMode: String,
    val totalWords: Int,
    val correctAnswers: Int,
    val accuracy: Double
)
