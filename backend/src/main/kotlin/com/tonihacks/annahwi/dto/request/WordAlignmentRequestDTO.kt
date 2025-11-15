package com.tonihacks.annahwi.dto.request

import com.tonihacks.annahwi.entity.WordAlignment
import java.util.*

data class WordAlignmentRequestDTO(
    val arabicTokens: String,
    val transliterationTokens: String,
    val translationTokens: String,
    val tokenOrder: Int,
    val vocabularyWordId: UUID? = null
) {
    fun toEntity(): WordAlignment {
        val alignment = WordAlignment()
        alignment.arabicTokens = arabicTokens
        alignment.transliterationTokens = transliterationTokens
        alignment.translationTokens = translationTokens
        alignment.tokenOrder = tokenOrder
        return alignment
    }

    fun updateEntity(existingAlignment: WordAlignment): WordAlignment {
        existingAlignment.arabicTokens = arabicTokens
        existingAlignment.transliterationTokens = transliterationTokens
        existingAlignment.translationTokens = translationTokens
        existingAlignment.tokenOrder = tokenOrder
        return existingAlignment
    }
}
