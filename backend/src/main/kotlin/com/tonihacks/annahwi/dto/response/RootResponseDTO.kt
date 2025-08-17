package com.tonihacks.annahwi.dto.response

import com.tonihacks.annahwi.entity.ArabicRoot
import com.tonihacks.annahwi.service.RootNormalizationService.NormalizedRoot
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
    val analysis: String?,
    val wordCount: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    companion object {
        @Suppress("SwallowedException")
        fun fromEntity(root: ArabicRoot, wordCount: Int? = null): RootResponseDTO {
            return RootResponseDTO(
                id = root.id!!,
                letters = root.letters,
                normalizedForm = root.normalizedForm,
                displayForm = root.displayForm,
                letterCount = root.letterCount,
                meaning = root.meaning,
                analysis = root.analysis,
                wordCount = wordCount ?: try { root.words.size } catch (_: Exception) { 0 },
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
) {
    companion object {
        fun fromNormalizedRoot(input: String, normalizedRoot: NormalizedRoot): RootNormalizationResponseDTO {
            return RootNormalizationResponseDTO(
                input = input,
                letters = normalizedRoot.letters,
                normalizedForm = normalizedRoot.normalizedForm,
                displayForm = normalizedRoot.displayForm,
                letterCount = normalizedRoot.letterCount,
                isValid = true // Normalization implies validity
            )
        }
    }
}

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

