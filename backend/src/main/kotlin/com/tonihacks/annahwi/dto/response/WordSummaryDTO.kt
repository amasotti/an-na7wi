package com.tonihacks.annahwi.dto.response

import com.tonihacks.annahwi.entity.Word
import java.util.UUID

/**
 * Simple word summary for UI display
 * Contains only essential information for word lists
 */
data class WordSummaryDTO(
    val id: UUID,
    val arabic: String,
    val transliteration: String?,
    val translation: String?,
    val partOfSpeech: String?,
    val difficulty: String,
    val dialect: String
) {
    companion object {
        fun fromEntity(word: Word): WordSummaryDTO {
            return WordSummaryDTO(
                id = word.id!!,
                arabic = word.arabic,
                transliteration = word.transliteration,
                translation = word.translation,
                partOfSpeech = word.partOfSpeech?.name,
                difficulty = word.difficulty.name,
                dialect = word.dialect.name
            )
        }
        
        fun fromEntities(words: List<Word>): List<WordSummaryDTO> {
            return words.map { fromEntity(it) }
        }
    }
}
