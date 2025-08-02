package com.tonihacks.annahwi.dto.response

import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Difficulty
import com.tonihacks.annahwi.entity.MasteryLevel
import com.tonihacks.annahwi.entity.PartOfSpeech
import com.tonihacks.annahwi.entity.Word
import java.time.LocalDateTime
import java.util.UUID

/**
 * Response DTO for Word entity with safe serialization
 */
data class WordResponseDTO(
    val id: UUID?,
    val arabic: String,
    val transliteration: String?,
    val translation: String?,
    val example: String?,
    val root: String?,
    val arabicRoot: RootResponseDTO?,
    val partOfSpeech: PartOfSpeech?,
    val notes: String?,
    val frequency: Int,
    val difficulty: Difficulty,
    val dialect: Dialect,
    val masteryLevel: MasteryLevel?,
    val dictionaryLinks: String?,
    val pronunciationLink: String?,
    val relatedWords: String?,
    val isVerified: Boolean,
    val createdAt: LocalDateTime
) {
    companion object {
        /**
         * Convert Word entity to WordResponseDTO
         */
        fun fromEntity(word: Word): WordResponseDTO {
            return WordResponseDTO(
                id = word.id,
                arabic = word.arabic,
                transliteration = word.transliteration,
                translation = word.translation,
                example = word.example,
                root = word.root,
                arabicRoot = word.arabicRoot?.let { RootResponseDTO.fromEntity(it) },
                partOfSpeech = word.partOfSpeech,
                notes = word.notes,
                frequency = word.frequency,
                difficulty = word.difficulty,
                dialect = word.dialect,
                masteryLevel = word.masteryLevel,
                dictionaryLinks = word.dictionaryLinks,
                pronunciationLink = word.pronunciationLink,
                relatedWords = word.relatedWords,
                isVerified = word.isVerified,
                createdAt = word.createdAt
            )
        }
        
        /**
         * Convert list of Word entities to list of WordResponseDTOs
         */
        fun fromEntities(words: List<Word>): List<WordResponseDTO> {
            return words.map { fromEntity(it) }
        }
    }
}
