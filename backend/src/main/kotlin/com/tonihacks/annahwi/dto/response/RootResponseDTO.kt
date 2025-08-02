package com.tonihacks.annahwi.dto.response

import com.tonihacks.annahwi.entity.ArabicRoot
import java.time.LocalDateTime
import java.util.UUID

/**
 * DTO for Arabic root responses
 */
data class RootResponseDTO(
    val id: UUID,
    val letters: List<String>,
    val normalizedForm: String,
    val displayForm: String,
    val letterCount: Int,
    val meaning: String?,
    val wordCount: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    companion object {
        fun fromEntity(root: ArabicRoot): RootResponseDTO {
            return RootResponseDTO(
                id = root.id!!,
                letters = root.letters,
                normalizedForm = root.normalizedForm,
                displayForm = root.displayForm,
                letterCount = root.letterCount,
                meaning = root.meaning,
                wordCount = root.words.size,
                createdAt = root.createdAt,
                updatedAt = root.updatedAt
            )
        }
    }
}

/**
 * DTO for root normalization responses
 */
data class RootNormalizationResponseDTO(
    val input: String,
    val letters: List<String>,
    val normalizedForm: String,
    val displayForm: String,
    val letterCount: Int,
    val isValid: Boolean
)

/**
 * DTO for root statistics
 */
data class RootStatisticsDTO(
    val totalRoots: Long,
    val triLiteral: Long,
    val quadriLiteral: Long,
    val quinqueLiteral: Long,
    val otherCounts: Map<Int, Long> = emptyMap()
)

/**
 * DTO for root with word summaries
 */
data class RootWithWordsDTO(
    val root: RootResponseDTO,
    val words: List<WordSummaryDTO>
)

/**
 * Simple word summary for root responses
 */
data class WordSummaryDTO(
    val id: UUID,
    val arabic: String,
    val transliteration: String?,
    val translation: String?,
    val partOfSpeech: String?,
    val difficulty: String,
    val dialect: String
)
