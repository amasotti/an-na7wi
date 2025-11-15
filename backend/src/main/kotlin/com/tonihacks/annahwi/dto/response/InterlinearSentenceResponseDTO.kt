package com.tonihacks.annahwi.dto.response

import com.tonihacks.annahwi.entity.InterlinearSentence
import java.time.LocalDateTime
import java.util.UUID

data class InterlinearSentenceResponseDTO(
    val id: UUID,
    val arabicText: String,
    val transliteration: String,
    val translation: String,
    val annotations: String?,
    val sentenceOrder: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val alignments: List<WordAlignmentResponseDTO>
) {
    companion object {
        fun fromEntity(sentence: InterlinearSentence): InterlinearSentenceResponseDTO {
            return InterlinearSentenceResponseDTO(
                id = sentence.id,
                arabicText = sentence.arabicText,
                transliteration = sentence.transliteration,
                translation = sentence.translation,
                annotations = sentence.annotations,
                sentenceOrder = sentence.sentenceOrder,
                createdAt = sentence.createdAt,
                updatedAt = sentence.updatedAt,
                alignments = sentence.alignments.map { WordAlignmentResponseDTO.fromEntity(it) }
            )
        }
    }
}
