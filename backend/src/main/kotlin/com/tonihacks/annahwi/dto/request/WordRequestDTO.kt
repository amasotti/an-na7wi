package com.tonihacks.annahwi.dto.request

import com.fasterxml.jackson.annotation.JsonProperty
import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Difficulty
import com.tonihacks.annahwi.entity.MasteryLevel
import com.tonihacks.annahwi.entity.PartOfSpeech
import com.tonihacks.annahwi.entity.Word

/**
 * Data Transfer Object for Word creation and update requests
 */
data class WordRequestDTO(
    val arabic: String,
    val transliteration: String? = null,
    val translation: String? = null,
    val example: String? = null,
    val root: String? = null,
    val partOfSpeech: PartOfSpeech? = null,
    val notes: String? = null,
    val frequency: Int = 0,
    val difficulty: Difficulty,
    val dialect: Dialect,
    val masteryLevel: MasteryLevel? = MasteryLevel.NEW,
    val dictionaryLinks: String? = null,
    val pronunciationLink: String? = null,
    val relatedWords: String? = null,
    @JsonProperty("isVerified") val isVerified: Boolean = false
) {
    fun toEntity(): Word {
        return Word().apply {
            arabic = this@WordRequestDTO.arabic
            transliteration = this@WordRequestDTO.transliteration
            translation = this@WordRequestDTO.translation
            example = this@WordRequestDTO.example
            root = this@WordRequestDTO.root
            partOfSpeech = this@WordRequestDTO.partOfSpeech
            notes = this@WordRequestDTO.notes
            frequency = this@WordRequestDTO.frequency
            difficulty = this@WordRequestDTO.difficulty
            dialect = this@WordRequestDTO.dialect
            masteryLevel = this@WordRequestDTO.masteryLevel
            dictionaryLinks = this@WordRequestDTO.dictionaryLinks
            pronunciationLink = this@WordRequestDTO.pronunciationLink
            relatedWords = this@WordRequestDTO.relatedWords
            isVerified = this@WordRequestDTO.isVerified
        }
    }

    fun updateEntity(existing: Word): Word {
        return existing.apply {
            arabic = this@WordRequestDTO.arabic
            transliteration = this@WordRequestDTO.transliteration
            translation = this@WordRequestDTO.translation
            example = this@WordRequestDTO.example
            root = this@WordRequestDTO.root
            partOfSpeech = this@WordRequestDTO.partOfSpeech
            notes = this@WordRequestDTO.notes
            frequency = this@WordRequestDTO.frequency
            difficulty = this@WordRequestDTO.difficulty
            dialect = this@WordRequestDTO.dialect
            masteryLevel = this@WordRequestDTO.masteryLevel
            dictionaryLinks = this@WordRequestDTO.dictionaryLinks
            pronunciationLink = this@WordRequestDTO.pronunciationLink
            relatedWords = this@WordRequestDTO.relatedWords
            isVerified = this@WordRequestDTO.isVerified
        }
    }
}

