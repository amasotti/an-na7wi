package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.dto.request.WordRequestDTO
import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Difficulty
import com.tonihacks.annahwi.entity.PartOfSpeech
import com.tonihacks.annahwi.entity.Word
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.util.UUID

class WordServiceDTOTest {

    @Test
    fun testWordCreationFromDTO() {
        val wordDTO = WordRequestDTO(
            arabic = "مكتبة",
            transliteration = "maktaba",
            translation = "library",
            root = "ك-ت-ب",
            partOfSpeech = PartOfSpeech.NOUN,
            notes = "Place for books",
            frequency = 75,
            difficulty = Difficulty.INTERMEDIATE,
            dialect = Dialect.MSA,
            isVerified = true
        )

        // Test DTO to entity conversion
        val word = wordDTO.toEntity()
        word.createdAt = LocalDateTime.now()

        assertNotNull(word)
        assertEquals(wordDTO.arabic, word.arabic)
        assertEquals(wordDTO.transliteration, word.transliteration)
        assertEquals(wordDTO.translation, word.translation)
        assertEquals(wordDTO.root, word.root)
        assertEquals(wordDTO.partOfSpeech, word.partOfSpeech)
        assertEquals(wordDTO.notes, word.notes)
        assertEquals(wordDTO.frequency, word.frequency)
        assertEquals(wordDTO.difficulty, word.difficulty)
        assertEquals(wordDTO.dialect, word.dialect)
        assertEquals(wordDTO.isVerified, word.isVerified)
        assertNotNull(word.createdAt)
    }

    @Test
    fun testWordUpdateFromDTO() {
        val wordId = UUID.randomUUID()
        val originalCreatedAt = LocalDateTime.now().minusDays(1)
        
        val existingWord = Word().apply {
            id = wordId
            arabic = "قلم"
            transliteration = "qalam"
            translation = "pen"
            root = "ق-ل-م"
            partOfSpeech = PartOfSpeech.NOUN
            notes = "Writing instrument"
            frequency = 50
            difficulty = Difficulty.BEGINNER
            dialect = Dialect.MSA
            isVerified = false
            createdAt = originalCreatedAt
        }

        val updateDTO = WordRequestDTO(
            arabic = "قلم",
            transliteration = "qalam",
            translation = "pen, pencil",
            root = "ق-ل-م",
            partOfSpeech = PartOfSpeech.NOUN,
            notes = "Writing instrument - updated",
            frequency = 100,
            difficulty = Difficulty.BEGINNER,
            dialect = Dialect.MSA,
            isVerified = true
        )

        // Test DTO update entity method
        val updatedWord = updateDTO.updateEntity(existingWord)

        assertNotNull(updatedWord)
        assertEquals(wordId, updatedWord.id)
        assertEquals(updateDTO.arabic, updatedWord.arabic)
        assertEquals(updateDTO.transliteration, updatedWord.transliteration)
        assertEquals(updateDTO.translation, updatedWord.translation)
        assertEquals(updateDTO.root, updatedWord.root)
        assertEquals(updateDTO.partOfSpeech, updatedWord.partOfSpeech)
        assertEquals(updateDTO.notes, updatedWord.notes)
        assertEquals(updateDTO.frequency, updatedWord.frequency)
        assertEquals(updateDTO.difficulty, updatedWord.difficulty)
        assertEquals(updateDTO.dialect, updatedWord.dialect)
        assertEquals(updateDTO.isVerified, updatedWord.isVerified)
        // Created date should remain unchanged
        assertEquals(originalCreatedAt, updatedWord.createdAt)
    }

    @Test
    fun testWordCreationWithMinimalDTO() {
        val minimalDTO = WordRequestDTO(
            arabic = "بيت",
            difficulty = Difficulty.BEGINNER,
            dialect = Dialect.LEVANTINE
        )

        // Test minimal DTO to entity conversion
        val word = minimalDTO.toEntity()
        word.createdAt = LocalDateTime.now()

        assertNotNull(word)
        assertEquals(minimalDTO.arabic, word.arabic)
        assertEquals(null, word.transliteration)
        assertEquals(null, word.translation)
        assertEquals(null, word.root)
        assertEquals(null, word.partOfSpeech)
        assertEquals(null, word.notes)
        assertEquals(0, word.frequency)
        assertEquals(minimalDTO.difficulty, word.difficulty)
        assertEquals(minimalDTO.dialect, word.dialect)
        assertEquals(false, word.isVerified)
        assertNotNull(word.createdAt)
    }

    @Test
    fun testWordUpdatePartialFields() {
        val wordId = UUID.randomUUID()
        val originalCreatedAt = LocalDateTime.now().minusDays(1)
        
        val existingWord = Word().apply {
            id = wordId
            arabic = "كتاب"
            transliteration = "kitab"
            translation = "book"
            root = "ك-ت-ب"
            partOfSpeech = PartOfSpeech.NOUN
            notes = "Reading material"
            frequency = 200
            difficulty = Difficulty.BEGINNER
            dialect = Dialect.MSA
            isVerified = true
            createdAt = originalCreatedAt
        }

        val partialUpdateDTO = WordRequestDTO(
            arabic = "كتاب",
            transliteration = "kitab",
            translation = "book, textbook",
            root = "ك-ت-ب",
            partOfSpeech = PartOfSpeech.NOUN,
            notes = null, // Clear notes
            frequency = 250, // Increase frequency
            difficulty = Difficulty.BEGINNER,
            dialect = Dialect.MSA,
            isVerified = true
        )

        // Test partial update
        val updatedWord = partialUpdateDTO.updateEntity(existingWord)

        assertNotNull(updatedWord)
        assertEquals(wordId, updatedWord.id)
        assertEquals(partialUpdateDTO.translation, updatedWord.translation)
        assertEquals(null, updatedWord.notes) // Should be cleared
        assertEquals(250, updatedWord.frequency) // Should be updated
        assertEquals(originalCreatedAt, updatedWord.createdAt) // Should remain unchanged
    }
}
