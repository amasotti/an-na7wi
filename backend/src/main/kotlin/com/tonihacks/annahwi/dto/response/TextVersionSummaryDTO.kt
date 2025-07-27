package com.tonihacks.annahwi.dto.response

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
)
