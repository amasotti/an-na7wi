package com.tonihacks.annahwi.dto.response

import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.InterlinearText
import java.time.LocalDateTime
import java.util.UUID

data class InterlinearTextDetailDTO(
    val id: UUID,
    val title: String,
    val description: String?,
    val dialect: Dialect,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val sentences: List<InterlinearSentenceResponseDTO>
) {
    companion object {
        fun fromEntity(text: InterlinearText): InterlinearTextDetailDTO {
            return InterlinearTextDetailDTO(
                id = text.id,
                title = text.title,
                description = text.description,
                dialect = text.dialect,
                createdAt = text.createdAt,
                updatedAt = text.updatedAt,
                sentences = text.sentences
                    .sortedBy { it.sentenceOrder }
                    .map { InterlinearSentenceResponseDTO.fromEntity(it) }
            )
        }
    }
}
