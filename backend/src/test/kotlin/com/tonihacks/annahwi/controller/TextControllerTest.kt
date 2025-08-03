package com.tonihacks.annahwi.controller

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.tonihacks.annahwi.config.GlobalTestProfile
import com.tonihacks.annahwi.dto.request.TextRequestDTO
import com.tonihacks.annahwi.dto.response.TextResponseDTO
import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Difficulty
import com.tonihacks.annahwi.entity.Text
import io.quarkus.test.junit.QuarkusTest
import io.quarkus.test.junit.TestProfile
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.util.UUID

/**
 * Simple test class to verify that our DTOs can be properly serialized and deserialized
 * without circular reference issues.
 */
@QuarkusTest
@TestProfile(GlobalTestProfile::class)
class TextControllerTest {

    private val objectMapper = ObjectMapper().findAndRegisterModules()
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)

    @Test
    fun testTextResponseDTOSerialization() {
        // Create a Text entity with relationships
        val text = Text().apply {
            id = UUID.randomUUID()
            title = "Test Text"
            arabicContent = "هذا نص اختبار"
            transliteration = "Hadha nass ikhtebar"
            translation = "This is a test text"
            tags = listOf("test", "example")
            difficulty = Difficulty.BEGINNER
            dialect = Dialect.MSA
            wordCount = 4
            createdAt = LocalDateTime.now()
            updatedAt = LocalDateTime.now()
        }

        // Convert to DTO
        val dto = TextResponseDTO.fromEntity(text)

        // Serialize to JSON
        val json = objectMapper.writeValueAsString(dto)
        
        // Print the JSON for debugging
        println("DEBUG JSON RESPONSE: $json")
        
        // Deserialize back to DTO
        val deserializedDTO = objectMapper.readValue(json, TextResponseDTO::class.java)
        
        // Verify
        assertNotNull(deserializedDTO)
        assertEquals(text.id, deserializedDTO.id)
        assertEquals(text.title, deserializedDTO.title)
        assertEquals(text.arabicContent, deserializedDTO.arabicContent)
        assertEquals(text.transliteration, deserializedDTO.transliteration)
        assertEquals(text.translation, deserializedDTO.translation)
        assertEquals(text.tags, deserializedDTO.tags)
        assertEquals(text.difficulty, deserializedDTO.difficulty)
        assertEquals(text.dialect, deserializedDTO.dialect)
        assertEquals(text.wordCount, deserializedDTO.wordCount)
    }

    @Test
    fun testTextRequestDTOSerialization() {
        // Create a request DTO
        val requestDTO = TextRequestDTO(
            title = "Test Text",
            arabicContent = "هذا نص اختبار",
            transliteration = "Hadha nass ikhtebar",
            translation = "This is a test text",
            tags = listOf("test", "example"),
            difficulty = Difficulty.BEGINNER,
            dialect = Dialect.MSA,
        )

        // Serialize to JSON
        val json = objectMapper.writeValueAsString(requestDTO)
        
        // Print the JSON for debugging
        println("DEBUG JSON: $json")
        
        // Deserialize back to DTO
        val deserializedDTO = objectMapper.readValue(json, TextRequestDTO::class.java)
        
        // Verify
        assertNotNull(deserializedDTO)
        assertEquals(requestDTO.title, deserializedDTO.title)
        assertEquals(requestDTO.arabicContent, deserializedDTO.arabicContent)
        assertEquals(requestDTO.transliteration, deserializedDTO.transliteration)
        assertEquals(requestDTO.translation, deserializedDTO.translation)
        assertEquals(requestDTO.tags, deserializedDTO.tags)
        assertEquals(requestDTO.difficulty, deserializedDTO.difficulty)
        assertEquals(requestDTO.dialect, deserializedDTO.dialect)
    }

    @Test
    fun testEntityToDTOConversion() {
        // Create a Text entity
        val text = Text().apply {
            id = UUID.randomUUID()
            title = "Test Text"
            arabicContent = "هذا نص اختبار"
            transliteration = "Hadha nass ikhtebar"
            translation = "This is a test text"
            tags = listOf("test", "example")
            difficulty = Difficulty.BEGINNER
            dialect = Dialect.MSA
            wordCount = 4
            createdAt = LocalDateTime.now()
            updatedAt = LocalDateTime.now()
        }

        // Convert to DTO
        val dto = TextResponseDTO.fromEntity(text)
        
        // Verify
        assertNotNull(dto)
        assertEquals(text.id, dto.id)
        assertEquals(text.title, dto.title)
        assertEquals(text.arabicContent, dto.arabicContent)
        assertEquals(text.transliteration, dto.transliteration)
        assertEquals(text.translation, dto.translation)
        assertEquals(text.tags, dto.tags)
        assertEquals(text.difficulty, dto.difficulty)
        assertEquals(text.dialect, dto.dialect)
        assertEquals(text.wordCount, dto.wordCount)
    }

    @Test
    fun testDTOToEntityConversion() {
        // Create a request DTO
        val requestDTO = TextRequestDTO(
            title = "Test Text",
            arabicContent = "هذا نص اختبار",
            transliteration = "Hadha nass ikhtebar",
            translation = "This is a test text",
            tags = listOf("test", "example"),
            difficulty = Difficulty.BEGINNER,
            dialect = Dialect.MSA,
        )

        // Convert to entity
        val entity = requestDTO.toEntity()
        
        // Verify
        assertNotNull(entity)
        assertEquals(requestDTO.title, entity.title)
        assertEquals(requestDTO.arabicContent, entity.arabicContent)
        assertEquals(requestDTO.transliteration, entity.transliteration)
        assertEquals(requestDTO.translation, entity.translation)
        assertEquals(requestDTO.tags, entity.tags)
        assertEquals(requestDTO.difficulty, entity.difficulty)
        assertEquals(requestDTO.dialect, entity.dialect)
    }
}
