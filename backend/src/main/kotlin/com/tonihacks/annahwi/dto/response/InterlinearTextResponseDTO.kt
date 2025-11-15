package com.tonihacks.annahwi.dto.response

import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.InterlinearText
import java.time.LocalDateTime
import java.util.UUID

data class InterlinearTextResponseDTO(
    val id: UUID,
    val title: String,
    val description: String?,
    val dialect: Dialect,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val sentenceCount: Int
) {
    companion object {
        fun fromEntity(text: InterlinearText): InterlinearTextResponseDTO {
            return InterlinearTextResponseDTO(
                id = text.id,
                title = text.title,
                description = text.description,
                dialect = text.dialect,
                createdAt = text.createdAt,
                updatedAt = text.updatedAt,
                sentenceCount = text.sentences.size
            )
        }
    }
}
