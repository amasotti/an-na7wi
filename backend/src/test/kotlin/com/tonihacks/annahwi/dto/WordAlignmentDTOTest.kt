package com.tonihacks.annahwi.dto

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.tonihacks.annahwi.dto.request.WordAlignmentRequestDTO
import com.tonihacks.annahwi.dto.response.WordAlignmentResponseDTO
import com.tonihacks.annahwi.entity.WordAlignment
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.util.UUID

class WordAlignmentDTOTest {

    private val objectMapper = ObjectMapper().findAndRegisterModules()
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)

    @Test
    fun testWordAlignmentRequestDTOSerialization() {
        val vocabularyWordId = UUID.randomUUID()
        val requestDTO = WordAlignmentRequestDTO(
            arabicTokens = "زيت زيتونة",
            transliterationTokens = "zayt zaytuna",
            translationTokens = "olive oil",
            tokenOrder = 1,
            vocabularyWordId = vocabularyWordId
        )

        val json = objectMapper.writeValueAsString(requestDTO)
        val deserializedDTO = objectMapper.readValue(json, WordAlignmentRequestDTO::class.java)

        assertNotNull(deserializedDTO)
        assertEquals(requestDTO.arabicTokens, deserializedDTO.arabicTokens)
        assertEquals(requestDTO.transliterationTokens, deserializedDTO.transliterationTokens)
        assertEquals(requestDTO.translationTokens, deserializedDTO.translationTokens)
        assertEquals(requestDTO.tokenOrder, deserializedDTO.tokenOrder)
        assertEquals(requestDTO.vocabularyWordId, deserializedDTO.vocabularyWordId)
    }

    @Test
    fun testWordAlignmentRequestDTODefaults() {
        val requestDTO = WordAlignmentRequestDTO(
            arabicTokens = "كتاب",
            transliterationTokens = "kitab",
            translationTokens = "book",
            tokenOrder = 0
        )

        assertEquals("كتاب", requestDTO.arabicTokens)
        assertEquals("kitab", requestDTO.transliterationTokens)
        assertEquals("book", requestDTO.translationTokens)
        assertEquals(0, requestDTO.tokenOrder)
        assertEquals(null, requestDTO.vocabularyWordId)
    }

    @Test
    fun testWordAlignmentRequestDTOToEntity() {
        val requestDTO = WordAlignmentRequestDTO(
            arabicTokens = "البيت",
            transliterationTokens = "al-bayt",
            translationTokens = "the house",
            tokenOrder = 2
        )

        val entity = requestDTO.toEntity()

        assertNotNull(entity)
        assertEquals(requestDTO.arabicTokens, entity.arabicTokens)
        assertEquals(requestDTO.transliterationTokens, entity.transliterationTokens)
        assertEquals(requestDTO.translationTokens, entity.translationTokens)
        assertEquals(requestDTO.tokenOrder, entity.tokenOrder)
    }

    @Test
    fun testWordAlignmentRequestDTOUpdateEntity() {
        val existingAlignment = WordAlignment().apply {
            id = UUID.randomUUID()
            arabicTokens = "Old Arabic"
            transliterationTokens = "Old Trans"
            translationTokens = "Old Translation"
            tokenOrder = 1
            createdAt = LocalDateTime.now()
        }

        val requestDTO = WordAlignmentRequestDTO(
            arabicTokens = "New Arabic",
            transliterationTokens = "New Trans",
            translationTokens = "New Translation",
            tokenOrder = 3
        )

        val updatedEntity = requestDTO.updateEntity(existingAlignment)

        assertEquals(existingAlignment.id, updatedEntity.id)
        assertEquals(existingAlignment.createdAt, updatedEntity.createdAt)
        assertEquals(requestDTO.arabicTokens, updatedEntity.arabicTokens)
        assertEquals(requestDTO.transliterationTokens, updatedEntity.transliterationTokens)
        assertEquals(requestDTO.translationTokens, updatedEntity.translationTokens)
        assertEquals(requestDTO.tokenOrder, updatedEntity.tokenOrder)
    }

    @Test
    fun testWordAlignmentResponseDTOFromEntity() {
        val alignment = WordAlignment().apply {
            id = UUID.randomUUID()
            arabicTokens = "القلم"
            transliterationTokens = "al-qalam"
            translationTokens = "the pen"
            tokenOrder = 0
            createdAt = LocalDateTime.now()
            updatedAt = LocalDateTime.now()
        }

        val responseDTO = WordAlignmentResponseDTO.fromEntity(alignment)

        assertNotNull(responseDTO)
        assertEquals(alignment.id, responseDTO.id)
        assertEquals(alignment.arabicTokens, responseDTO.arabicTokens)
        assertEquals(alignment.transliterationTokens, responseDTO.transliterationTokens)
        assertEquals(alignment.translationTokens, responseDTO.translationTokens)
        assertEquals(alignment.tokenOrder, responseDTO.tokenOrder)
        assertEquals(null, responseDTO.vocabularyWordId)
        assertEquals(alignment.createdAt, responseDTO.createdAt)
        assertEquals(alignment.updatedAt, responseDTO.updatedAt)
    }
}
