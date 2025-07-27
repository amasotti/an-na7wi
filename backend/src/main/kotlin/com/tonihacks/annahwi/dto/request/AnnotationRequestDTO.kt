package com.tonihacks.annahwi.dto.request

import com.tonihacks.annahwi.entity.AnnotationType
import com.tonihacks.annahwi.entity.MasteryLevel

/**
 * Data Transfer Object for Annotation creation and update requests
 */
data class AnnotationRequestDTO(
    val anchorText: String,
    val content: String,
    val type: AnnotationType,
    val masteryLevel: MasteryLevel = MasteryLevel.NEW,
    val needsReview: Boolean = false,
    val color: String? = null
)
