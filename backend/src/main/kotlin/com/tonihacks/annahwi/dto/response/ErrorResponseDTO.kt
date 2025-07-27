package com.tonihacks.annahwi.dto.response

import com.fasterxml.jackson.annotation.JsonInclude
import java.time.LocalDateTime

/**
 * Standard error response DTO for API endpoints
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
data class ErrorResponseDTO(
    val error: ErrorDetailDTO,
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val path: String? = null
)

/**
 * Error detail information
 */
data class ErrorDetailDTO(
    val code: String,
    val message: String,
    val details: String? = null,
    val field: String? = null
)

/**
 * Validation error response for multiple field errors
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
data class ValidationErrorResponseDTO(
    val error: ValidationErrorDetailDTO,
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val path: String? = null
)

/**
 * Validation error detail with multiple field errors
 */
data class ValidationErrorDetailDTO(
    val code: String = "VALIDATION_ERROR",
    val message: String = "Validation failed",
    val fieldErrors: List<FieldErrorDTO>
)

/**
 * Individual field error
 */
data class FieldErrorDTO(
    val field: String,
    val message: String,
    val rejectedValue: Any? = null
)
