package com.tonihacks.annahwi.dto.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class ExampleGenerationRequestDTO(
    @field:NotBlank(message = "Arabic word or expression is required")
    @field:Size(max = 200, message = "Arabic word or expression must not exceed 200 characters")
    val arabic: String,
    
    @field:Size(max = 100, message = "Context must not exceed 100 characters")
    val context: String? = null
)
