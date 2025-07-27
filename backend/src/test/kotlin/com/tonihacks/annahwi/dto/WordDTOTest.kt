package com.tonihacks.annahwi.dto

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
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

class WordDTOTest {

    private val objectMapper = ObjectMapper().findAndRegisterModules()
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)

    @Test
    fun testWordRequestDTOSerialization() {
        val requestDTO = WordRequestDTO(
            arabic = "كتاب",
            transliteration = "kitab",
            translation = "book",
            root = "ك-ت-ب",
            partOfSpeech = PartOfSpeech.NOUN,
            notes = "Common word for book",
            frequency = 150,
            difficulty = Difficulty.BEGINNER,
            dialect = Dialect.MSA,
            isVerified = true
        )

        val json = objectMapper.writeValueAsString(requestDTO)
        val deserializedDTO = objectMapper.readValue(json, WordRequestDTO::class.java)

        assertNotNull(deserializedDTO)
        assertEquals(requestDTO.arabic, deserializedDTO.arabic)
        assertEquals(requestDTO.transliteration, deserializedDTO.transliteration)
        assertEquals(requestDTO.translation, deserializedDTO.translation)
        assertEquals(requestDTO.root, deserializedDTO.root)
        assertEquals(requestDTO.partOfSpeech, deserializedDTO.partOfSpeech)
        assertEquals(requestDTO.notes, deserializedDTO.notes)
        assertEquals(requestDTO.frequency, deserializedDTO.frequency)
        assertEquals(requestDTO.difficulty, deserializedDTO.difficulty)
        assertEquals(requestDTO.dialect, deserializedDTO.dialect)
        assertEquals(requestDTO.isVerified, deserializedDTO.isVerified)
    }

    @Test
    fun testWordRequestDTODefaults() {
        val requestDTO = WordRequestDTO(
            arabic = "كلمة",
            difficulty = Difficulty.INTERMEDIATE,
            dialect = Dialect.LEVANTINE
        )

        assertEquals("كلمة", requestDTO.arabic)
        assertEquals(null, requestDTO.transliteration)
        assertEquals(null, requestDTO.translation)
        assertEquals(null, requestDTO.root)
        assertEquals(null, requestDTO.partOfSpeech)
        assertEquals(null, requestDTO.notes)
        assertEquals(0, requestDTO.frequency)
        assertEquals(Difficulty.INTERMEDIATE, requestDTO.difficulty)
        assertEquals(Dialect.LEVANTINE, requestDTO.dialect)
        assertEquals(false, requestDTO.isVerified)
    }

    @Test
    fun testWordRequestDTOToEntity() {
        val requestDTO = WordRequestDTO(
            arabic = "مدرسة",
            transliteration = "madrasa",
            translation = "school",
            root = "د-ر-س",
            partOfSpeech = PartOfSpeech.NOUN,
            notes = "Educational institution",
            frequency = 200,
            difficulty = Difficulty.BEGINNER,
            dialect = Dialect.MSA,
            isVerified = true
        )

        val entity = requestDTO.toEntity()

        assertNotNull(entity)
        assertEquals(requestDTO.arabic, entity.arabic)
        assertEquals(requestDTO.transliteration, entity.transliteration)
        assertEquals(requestDTO.translation, entity.translation)
        assertEquals(requestDTO.root, entity.root)
        assertEquals(requestDTO.partOfSpeech, entity.partOfSpeech)
        assertEquals(requestDTO.notes, entity.notes)
        assertEquals(requestDTO.frequency, entity.frequency)
        assertEquals(requestDTO.difficulty, entity.difficulty)
        assertEquals(requestDTO.dialect, entity.dialect)
        assertEquals(requestDTO.isVerified, entity.isVerified)
    }

    @Test
    fun testWordRequestDTOUpdateEntity() {
        val existingWord = Word().apply {
            id = UUID.randomUUID()
            arabic = "قديم"
            transliteration = "qadeem"
            translation = "old"
            root = "ق-د-م"
            partOfSpeech = PartOfSpeech.ADJECTIVE
            notes = "Old notes"
            frequency = 50
            difficulty = Difficulty.ADVANCED
            dialect = Dialect.GULF
            isVerified = false
            createdAt = LocalDateTime.now()
        }

        val requestDTO = WordRequestDTO(
            arabic = "جديد",
            transliteration = "jadeed",
            translation = "new",
            root = "ج-د-د",
            partOfSpeech = PartOfSpeech.ADJECTIVE,
            notes = "Updated notes",
            frequency = 100,
            difficulty = Difficulty.BEGINNER,
            dialect = Dialect.MSA,
            isVerified = true
        )

        val updatedEntity = requestDTO.updateEntity(existingWord)

        assertEquals(existingWord.id, updatedEntity.id) // ID should remain the same
        assertEquals(existingWord.createdAt, updatedEntity.createdAt) // Created date should remain the same
        assertEquals(requestDTO.arabic, updatedEntity.arabic)
        assertEquals(requestDTO.transliteration, updatedEntity.transliteration)
        assertEquals(requestDTO.translation, updatedEntity.translation)
        assertEquals(requestDTO.root, updatedEntity.root)
        assertEquals(requestDTO.partOfSpeech, updatedEntity.partOfSpeech)
        assertEquals(requestDTO.notes, updatedEntity.notes)
        assertEquals(requestDTO.frequency, updatedEntity.frequency)
        assertEquals(requestDTO.difficulty, updatedEntity.difficulty)
        assertEquals(requestDTO.dialect, updatedEntity.dialect)
        assertEquals(requestDTO.isVerified, updatedEntity.isVerified)
    }

    @Test
    fun testWordRequestDTOMinimalData() {
        val requestDTO = WordRequestDTO(
            arabic = "بيت",
            difficulty = Difficulty.BEGINNER,
            dialect = Dialect.MSA
        )

        val entity = requestDTO.toEntity()

        assertNotNull(entity)
        assertEquals("بيت", entity.arabic)
        assertEquals(null, entity.transliteration)
        assertEquals(null, entity.translation)
        assertEquals(null, entity.root)
        assertEquals(null, entity.partOfSpeech)
        assertEquals(null, entity.notes)
        assertEquals(0, entity.frequency)
        assertEquals(Difficulty.BEGINNER, entity.difficulty)
        assertEquals(Dialect.MSA, entity.dialect)
        assertEquals(false, entity.isVerified)
    }
}
