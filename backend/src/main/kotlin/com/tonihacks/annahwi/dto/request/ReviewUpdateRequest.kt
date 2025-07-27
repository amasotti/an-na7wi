package com.tonihacks.annahwi.dto.request

import java.time.LocalDateTime

data class ReviewUpdateRequest(
    val needsReview: Boolean,
    val nextReviewDate: LocalDateTime? = null
)
