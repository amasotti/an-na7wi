package com.tonihacks.annahwi.dto.request

import jakarta.validation.constraints.NotBlank

data class TransliterationRequestDTO(
    @field:NotBlank(message = "Arabic text cannot be blank")
    val arabicText: String
)