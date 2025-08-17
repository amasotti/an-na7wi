package com.tonihacks.annahwi.dto.response

import com.tonihacks.annahwi.entity.Annotation
import com.tonihacks.annahwi.entity.AnnotationType
import com.tonihacks.annahwi.entity.MasteryLevel
import java.time.LocalDateTime
import java.util.UUID

/**
 * Data Transfer Object for Annotation entity responses
 * Contains minimal text information to avoid cascading large text objects
 */
data class AnnotationResponseDTO(
    val id: UUID?,
    // Minimal text information - just ID and title for reference
    val textId: UUID,
    val textTitle: String,
    // Annotation-specific fields
    val anchorText: String,
    val content: String,
    val type: AnnotationType,
    val masteryLevel: MasteryLevel,
    val needsReview: Boolean,
    val color: String?,
    val createdAt: LocalDateTime,
    val linkedWords: List<WordResponseDTO> = emptyList()
) {
    companion object {
        /**
         * Converts an Annotation entity to AnnotationResponseDTO
         */
        fun fromEntity(annotation: Annotation): AnnotationResponseDTO {
            return AnnotationResponseDTO(
                id = annotation.id,
                textId = annotation.text.id,
                textTitle = annotation.text.title,
                anchorText = annotation.anchorText,
                content = annotation.content,
                type = annotation.type,
                masteryLevel = annotation.masteryLevel,
                needsReview = annotation.needsReview,
                color = annotation.color,
                createdAt = annotation.createdAt,
                linkedWords = buildLinkedWordsDTO(annotation)
            )
        }

      fun buildLinkedWordsDTO(annotation: Annotation) : List<WordResponseDTO> {
            return annotation
              .getLinkedWords()
              .map { word -> WordResponseDTO.fromEntity(word) }
        }
    }
}
