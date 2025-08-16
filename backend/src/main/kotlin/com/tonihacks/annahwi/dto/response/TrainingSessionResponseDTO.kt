package com.tonihacks.annahwi.dto.response

import com.tonihacks.annahwi.entity.ReviewMode
import java.time.LocalDateTime
import java.util.UUID

data class TrainingSessionResponseDTO(
    val id: UUID,
    val sessionType: String,
    val reviewMode: ReviewMode,
    val startedAt: LocalDateTime,
    val completedAt: LocalDateTime?,
    val totalWords: Int,
    val correctAnswers: Int,
    val words: List<WordResponseDTO>
)
