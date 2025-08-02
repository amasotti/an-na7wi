package com.tonihacks.annahwi.dto.request

/**
 * DTO for creating/updating Arabic roots
 */
data class RootRequestDTO(
    val input: String
)

/**
 * DTO for normalizing root input
 */
data class RootNormalizationRequestDTO(
    val input: String
)
