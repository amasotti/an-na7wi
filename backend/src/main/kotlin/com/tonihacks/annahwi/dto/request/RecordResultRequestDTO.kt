package com.tonihacks.annahwi.dto.request

import com.tonihacks.annahwi.entity.TrainingResult
import jakarta.validation.constraints.NotNull
import java.util.UUID

data class RecordResultRequestDTO(
    @field:NotNull
    val wordId: UUID,
    
    @field:NotNull
    val result: TrainingResult
)
