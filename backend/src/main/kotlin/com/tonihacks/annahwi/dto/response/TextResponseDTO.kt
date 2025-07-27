package com.tonihacks.annahwi.dto.response

import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Difficulty
import com.tonihacks.annahwi.entity.Text
import java.time.LocalDateTime
import java.util.UUID

/**
 * Data Transfer Object for Text entity responses
 * Prevents circular references and lazy loading issues during serialization
 */
data class TextResponseDTO(
    val id: UUID?,
    val title: String,
    val arabicContent: String,
    val transliteration: String?,
    val translation: String?,
    val comments: String?,
    val tags: List<String>,
    val difficulty: Difficulty,
    val dialect: Dialect,
    val versionNumber: Int,
    val isCurrentVersion: Boolean,
    val parentTextId: UUID?,
    val wordCount: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    // Include only IDs for related entities to prevent circular references
    val annotationIds: List<UUID>,
    val textWordIds: List<UUID>
) {
    companion object {
        /**
         * Converts a Text entity to TextResponseDTO
         */
        fun fromEntity(text: Text): TextResponseDTO {
            return TextResponseDTO(
                id = text.id,
                title = text.title,
                arabicContent = text.arabicContent,
                transliteration = text.transliteration,
                translation = text.translation,
                comments = text.comments,
                tags = text.tags,
                difficulty = text.difficulty,
                dialect = text.dialect,
                versionNumber = text.versionNumber,
                isCurrentVersion = text.isCurrentVersion,
                parentTextId = text.parentTextId,
                wordCount = text.wordCount,
                createdAt = text.createdAt,
                updatedAt = text.updatedAt,
                // Extract only IDs from related entities
                annotationIds = text.annotations.mapNotNull { it.id },
                textWordIds = text.textWords.mapNotNull { it.id }
            )
        }
    }
}
