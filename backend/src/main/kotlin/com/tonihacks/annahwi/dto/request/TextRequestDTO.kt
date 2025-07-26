package com.tonihacks.annahwi.dto.request

import com.fasterxml.jackson.annotation.JsonAlias
import com.fasterxml.jackson.annotation.JsonProperty
import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Difficulty
import com.tonihacks.annahwi.entity.Text

/**
 * Data Transfer Object for Text entity requests
 * Prevents deserialization issues when receiving data from clients
 */
data class TextRequestDTO(
    val title: String,
    val arabicContent: String,
    val transliteration: String? = null,
    val translation: String? = null,
    val tags: List<String> = listOf(),
    val difficulty: Difficulty,
    val dialect: Dialect,
    @JsonProperty("isPublic") @JsonAlias("public") val isPublic: Boolean = false
) {
    /**
     * Converts this DTO to a Text entity
     * Note: This creates a new entity. For updates, use the updateEntity method.
     */
    fun toEntity(): Text {
        val text = Text()
        text.title = title
        text.arabicContent = arabicContent
        text.transliteration = transliteration
        text.translation = translation
        text.tags = tags
        text.difficulty = difficulty
        text.dialect = dialect
        text.isPublic = isPublic
        text.wordCount = calculateWordCount(arabicContent)
        return text
    }
    
    /**
     * Updates an existing Text entity with values from this DTO
     */
    fun updateEntity(existingText: Text): Text {
        existingText.title = title
        existingText.arabicContent = arabicContent
        existingText.transliteration = transliteration
        existingText.translation = translation
        existingText.tags = tags
        existingText.difficulty = difficulty
        existingText.dialect = dialect
        existingText.isPublic = isPublic
        existingText.wordCount = calculateWordCount(arabicContent)
        return existingText
    }
    
    /**
     * Calculates the word count of the Arabic content
     * This is a simple implementation that splits by whitespace
     * A more sophisticated implementation might consider Arabic-specific word boundaries
     */
    private fun calculateWordCount(text: String): Int {
        return text.trim().split("\\s+".toRegex()).size
    }
}
