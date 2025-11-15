package com.tonihacks.annahwi.dto

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.tonihacks.annahwi.dto.request.InterlinearTextRequestDTO
import com.tonihacks.annahwi.dto.response.InterlinearTextResponseDTO
import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.InterlinearText
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.util.UUID

class InterlinearTextDTOTest {

    private val objectMapper = ObjectMapper().findAndRegisterModules()
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)

    @Test
    fun testInterlinearTextRequestDTOSerialization() {
        val requestDTO = InterlinearTextRequestDTO(
            title = "My First Interlinear Text",
            description = "A sample text for testing",
            dialect = Dialect.MSA
        )

        val json = objectMapper.writeValueAsString(requestDTO)
        val deserializedDTO = objectMapper.readValue(json, InterlinearTextRequestDTO::class.java)

        assertNotNull(deserializedDTO)
        assertEquals(requestDTO.title, deserializedDTO.title)
        assertEquals(requestDTO.description, deserializedDTO.description)
        assertEquals(requestDTO.dialect, deserializedDTO.dialect)
    }

    @Test
    fun testInterlinearTextRequestDTODefaults() {
        val requestDTO = InterlinearTextRequestDTO(
            title = "Test Title",
            dialect = Dialect.TUNISIAN
        )

        assertEquals("Test Title", requestDTO.title)
        assertEquals(null, requestDTO.description)
        assertEquals(Dialect.TUNISIAN, requestDTO.dialect)
    }

    @Test
    fun testInterlinearTextRequestDTOToEntity() {
        val requestDTO = InterlinearTextRequestDTO(
            title = "Sample Interlinear",
            description = "Description here",
            dialect = Dialect.EGYPTIAN
        )

        val entity = requestDTO.toEntity()

        assertNotNull(entity)
        assertEquals(requestDTO.title, entity.title)
        assertEquals(requestDTO.description, entity.description)
        assertEquals(requestDTO.dialect, entity.dialect)
    }

    @Test
    fun testInterlinearTextRequestDTOUpdateEntity() {
        val existingText = InterlinearText().apply {
            id = UUID.randomUUID()
            title = "Old Title"
            description = "Old Description"
            dialect = Dialect.GULF
            createdAt = LocalDateTime.now()
        }

        val requestDTO = InterlinearTextRequestDTO(
            title = "New Title",
            description = "New Description",
            dialect = Dialect.LEVANTINE
        )

        val updatedEntity = requestDTO.updateEntity(existingText)

        assertEquals(existingText.id, updatedEntity.id)
        assertEquals(existingText.createdAt, updatedEntity.createdAt)
        assertEquals(requestDTO.title, updatedEntity.title)
        assertEquals(requestDTO.description, updatedEntity.description)
        assertEquals(requestDTO.dialect, updatedEntity.dialect)
    }

    @Test
    fun testInterlinearTextResponseDTOFromEntity() {
        val text = InterlinearText().apply {
            id = UUID.randomUUID()
            title = "Test Text"
            description = "Test Description"
            dialect = Dialect.MSA
            createdAt = LocalDateTime.now()
            updatedAt = LocalDateTime.now()
        }

        val responseDTO = InterlinearTextResponseDTO.fromEntity(text)

        assertNotNull(responseDTO)
        assertEquals(text.id, responseDTO.id)
        assertEquals(text.title, responseDTO.title)
        assertEquals(text.description, responseDTO.description)
        assertEquals(text.dialect, responseDTO.dialect)
        assertEquals(text.createdAt, responseDTO.createdAt)
        assertEquals(text.updatedAt, responseDTO.updatedAt)
        assertEquals(0, responseDTO.sentenceCount)
    }
}
