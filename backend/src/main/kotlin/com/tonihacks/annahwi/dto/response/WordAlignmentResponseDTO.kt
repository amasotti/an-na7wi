package com.tonihacks.annahwi.dto.response

import com.tonihacks.annahwi.entity.WordAlignment
import java.time.LocalDateTime
import java.util.UUID

data class WordAlignmentResponseDTO(
    val id: UUID,
    val arabicTokens: String,
    val transliterationTokens: String,
    val translationTokens: String,
    val tokenOrder: Int,
    val vocabularyWordId: UUID?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    companion object {
        fun fromEntity(alignment: WordAlignment): WordAlignmentResponseDTO {
            return WordAlignmentResponseDTO(
                id = alignment.id,
                arabicTokens = alignment.arabicTokens,
                transliterationTokens = alignment.transliterationTokens,
                translationTokens = alignment.translationTokens,
                tokenOrder = alignment.tokenOrder,
                vocabularyWordId = alignment.vocabularyWord?.id,
                createdAt = alignment.createdAt,
                updatedAt = alignment.updatedAt
            )
        }
    }
}
