package com.tonihacks.annahwi.dto.request

import com.fasterxml.jackson.annotation.JsonProperty
import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Difficulty
import com.tonihacks.annahwi.entity.PartOfSpeech
import com.tonihacks.annahwi.entity.Word

/**
 * Data Transfer Object for Word creation and update requests
 */
data class WordRequestDTO(
    val arabic: String,
    val transliteration: String? = null,
    val translation: String? = null,
    val root: String? = null,
    val partOfSpeech: PartOfSpeech? = null,
    val notes: String? = null,
    val frequency: Int = 0,
    val difficulty: Difficulty,
    val dialect: Dialect,
    @JsonProperty("isVerified") val isVerified: Boolean = false
) {
    fun toEntity(): Word {
        return Word().apply {
            arabic = this@WordRequestDTO.arabic
            transliteration = this@WordRequestDTO.transliteration
            translation = this@WordRequestDTO.translation
            root = this@WordRequestDTO.root
            partOfSpeech = this@WordRequestDTO.partOfSpeech
            notes = this@WordRequestDTO.notes
            frequency = this@WordRequestDTO.frequency
            difficulty = this@WordRequestDTO.difficulty
            dialect = this@WordRequestDTO.dialect
            isVerified = this@WordRequestDTO.isVerified
        }
    }

    fun updateEntity(existing: Word): Word {
        return existing.apply {
            arabic = this@WordRequestDTO.arabic
            transliteration = this@WordRequestDTO.transliteration
            translation = this@WordRequestDTO.translation
            root = this@WordRequestDTO.root
            partOfSpeech = this@WordRequestDTO.partOfSpeech
            notes = this@WordRequestDTO.notes
            frequency = this@WordRequestDTO.frequency
            difficulty = this@WordRequestDTO.difficulty
            dialect = this@WordRequestDTO.dialect
            isVerified = this@WordRequestDTO.isVerified
        }
    }
}

