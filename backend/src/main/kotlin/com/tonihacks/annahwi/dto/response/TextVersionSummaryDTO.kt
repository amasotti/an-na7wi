package com.tonihacks.annahwi.dto.response

import com.tonihacks.annahwi.entity.TextVersion
import java.time.LocalDateTime
import java.util.UUID

/**
 * Lightweight DTO for text version summaries (used in dropdowns)
 */
data class TextVersionSummaryDTO(
    val id: UUID?,
    val versionNumber: Int,
    val updatedAt: LocalDateTime,
    val isCurrent: Boolean = false
) {
    companion object {
        /**
         * Converts a TextVersion entity to TextVersionSummaryDTO
         */
        fun fromEntity(version: TextVersion): TextVersionSummaryDTO {
            return TextVersionSummaryDTO(
                id = version.id,
                versionNumber = version.versionNumber,
                updatedAt = version.updatedAt
            )
        }
    }
}
