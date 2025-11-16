package com.tonihacks.annahwi.dto.request

import com.tonihacks.annahwi.entity.WordAlignment
import java.util.*

data class WordAlignmentRequestDTO(
    val arabicTokens: String,
    val transliterationTokens: String,
    val translationTokens: String,
    val tokenOrder: Int? = null,
    val vocabularyWordId: UUID? = null
) {
    fun toEntity(): WordAlignment {
        val alignment = WordAlignment()
        alignment.arabicTokens = arabicTokens
        alignment.transliterationTokens = transliterationTokens
        alignment.translationTokens = translationTokens
        alignment.tokenOrder = tokenOrder ?: 0
        return alignment
    }

    fun updateEntity(existingAlignment: WordAlignment): WordAlignment {
        existingAlignment.arabicTokens = arabicTokens
        existingAlignment.transliterationTokens = transliterationTokens
        existingAlignment.translationTokens = translationTokens
        // Only update tokenOrder if provided
        tokenOrder?.let { existingAlignment.tokenOrder = it }
        vocabularyWordId?.let { existingAlignment.vocabularyWord = null } // Will be set by service
        return existingAlignment
    }
}
