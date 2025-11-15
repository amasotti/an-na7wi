package com.tonihacks.annahwi.dto

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.tonihacks.annahwi.dto.request.InterlinearSentenceRequestDTO
import com.tonihacks.annahwi.dto.response.InterlinearSentenceResponseDTO
import com.tonihacks.annahwi.entity.InterlinearSentence
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.util.UUID

class InterlinearSentenceDTOTest {

    private val objectMapper = ObjectMapper().findAndRegisterModules()
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)

    @Test
    fun testInterlinearSentenceRequestDTOSerialization() {
        val requestDTO = InterlinearSentenceRequestDTO(
            arabicText = "السلام عليكم",
            transliteration = "as-salamu alaykum",
            translation = "peace be upon you",
            annotations = "A common greeting",
            sentenceOrder = 1
        )

        val json = objectMapper.writeValueAsString(requestDTO)
        val deserializedDTO = objectMapper.readValue(json, InterlinearSentenceRequestDTO::class.java)

        assertNotNull(deserializedDTO)
        assertEquals(requestDTO.arabicText, deserializedDTO.arabicText)
        assertEquals(requestDTO.transliteration, deserializedDTO.transliteration)
        assertEquals(requestDTO.translation, deserializedDTO.translation)
        assertEquals(requestDTO.annotations, deserializedDTO.annotations)
        assertEquals(requestDTO.sentenceOrder, deserializedDTO.sentenceOrder)
    }

    @Test
    fun testInterlinearSentenceRequestDTODefaults() {
        val requestDTO = InterlinearSentenceRequestDTO(
            arabicText = "أهلا",
            transliteration = "ahlan",
            translation = "hello",
            sentenceOrder = 0
        )

        assertEquals("أهلا", requestDTO.arabicText)
        assertEquals("ahlan", requestDTO.transliteration)
        assertEquals("hello", requestDTO.translation)
        assertEquals(null, requestDTO.annotations)
        assertEquals(0, requestDTO.sentenceOrder)
    }

    @Test
    fun testInterlinearSentenceRequestDTOToEntity() {
        val requestDTO = InterlinearSentenceRequestDTO(
            arabicText = "كيف حالك؟",
            transliteration = "kayfa haluk?",
            translation = "How are you?",
            annotations = "Common question",
            sentenceOrder = 2
        )

        val entity = requestDTO.toEntity()

        assertNotNull(entity)
        assertEquals(requestDTO.arabicText, entity.arabicText)
        assertEquals(requestDTO.transliteration, entity.transliteration)
        assertEquals(requestDTO.translation, entity.translation)
        assertEquals(requestDTO.annotations, entity.annotations)
        assertEquals(requestDTO.sentenceOrder, entity.sentenceOrder)
    }

    @Test
    fun testInterlinearSentenceRequestDTOUpdateEntity() {
        val existingSentence = InterlinearSentence().apply {
            id = UUID.randomUUID()
            arabicText = "Old Arabic"
            transliteration = "Old Trans"
            translation = "Old Translation"
            annotations = "Old Notes"
            sentenceOrder = 1
            createdAt = LocalDateTime.now()
        }

        val requestDTO = InterlinearSentenceRequestDTO(
            arabicText = "New Arabic",
            transliteration = "New Trans",
            translation = "New Translation",
            annotations = "New Notes",
            sentenceOrder = 3
        )

        val updatedEntity = requestDTO.updateEntity(existingSentence)

        assertEquals(existingSentence.id, updatedEntity.id)
        assertEquals(existingSentence.createdAt, updatedEntity.createdAt)
        assertEquals(requestDTO.arabicText, updatedEntity.arabicText)
        assertEquals(requestDTO.transliteration, updatedEntity.transliteration)
        assertEquals(requestDTO.translation, updatedEntity.translation)
        assertEquals(requestDTO.annotations, updatedEntity.annotations)
        assertEquals(requestDTO.sentenceOrder, updatedEntity.sentenceOrder)
    }

    @Test
    fun testInterlinearSentenceResponseDTOFromEntity() {
        val sentence = InterlinearSentence().apply {
            id = UUID.randomUUID()
            arabicText = "مرحبا"
            transliteration = "marhaba"
            translation = "hello"
            annotations = "Informal greeting"
            sentenceOrder = 1
            createdAt = LocalDateTime.now()
            updatedAt = LocalDateTime.now()
        }

        val responseDTO = InterlinearSentenceResponseDTO.fromEntity(sentence)

        assertNotNull(responseDTO)
        assertEquals(sentence.id, responseDTO.id)
        assertEquals(sentence.arabicText, responseDTO.arabicText)
        assertEquals(sentence.transliteration, responseDTO.transliteration)
        assertEquals(sentence.translation, responseDTO.translation)
        assertEquals(sentence.annotations, responseDTO.annotations)
        assertEquals(sentence.sentenceOrder, responseDTO.sentenceOrder)
        assertEquals(sentence.createdAt, responseDTO.createdAt)
        assertEquals(sentence.updatedAt, responseDTO.updatedAt)
        assertEquals(0, responseDTO.alignments.size)
    }
}
