package com.tonihacks.annahwi.dto.request

import com.tonihacks.annahwi.entity.ReviewMode
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull

data class StartTrainingSessionRequestDTO(
    @field:NotNull
    val reviewMode: ReviewMode,
    
    @field:Min(1)
    @field:Max(50) 
    val sessionLength: Int = 15
)
