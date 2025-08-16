package com.tonihacks.annahwi.dto.request

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
    val dictionaryLinks: List<DictionaryLinkRequestDTO> = emptyList(),
    val pronunciationLink: String? = null,
) {
    fun toEntity(): Word {
        val word = Word().apply {
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
            pronunciationLink = this@WordRequestDTO.pronunciationLink
        }
        
        // Add dictionary links
        word.dictionaryLinks.addAll(
            this@WordRequestDTO.dictionaryLinks.map { it.toEntity(word) }
        )
        
        return word
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
            pronunciationLink = this@WordRequestDTO.pronunciationLink
            
            // Update dictionary links - clear existing and add new ones
            // Clear existing links (orphanRemoval will handle deletion)
            dictionaryLinks.clear()
            
            // Add new dictionary links and set the word reference properly
            this@WordRequestDTO.dictionaryLinks.forEach { linkDto ->
                val newLink = linkDto.toEntity(this)
                dictionaryLinks.add(newLink)
            }
        }
    }
}

