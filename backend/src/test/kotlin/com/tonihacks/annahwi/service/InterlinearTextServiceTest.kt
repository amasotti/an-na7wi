package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.dto.request.InterlinearTextRequestDTO
import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.InterlinearText
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.util.UUID

class InterlinearTextServiceTest {

    @Test
    fun testInterlinearTextCreationFromDTO() {
        val textDTO = InterlinearTextRequestDTO(
            title = "My First Interlinear Text",
            description = "A sample text for learning",
            dialect = Dialect.MSA
        )

        val text = textDTO.toEntity()

        assertNotNull(text)
        assertEquals(textDTO.title, text.title)
        assertEquals(textDTO.description, text.description)
        assertEquals(textDTO.dialect, text.dialect)
    }

    @Test
    fun testInterlinearTextUpdateFromDTO() {
        val textId = UUID.randomUUID()
        val originalCreatedAt = LocalDateTime.now().minusDays(1)

        val existingText = InterlinearText().apply {
            id = textId
            title = "Old Title"
            description = "Old Description"
            dialect = Dialect.TUNISIAN
            createdAt = originalCreatedAt
            updatedAt = originalCreatedAt
        }

        val updateDTO = InterlinearTextRequestDTO(
            title = "New Title",
            description = "New Description",
            dialect = Dialect.MSA
        )

        val updatedText = updateDTO.updateEntity(existingText)

        assertNotNull(updatedText)
        assertEquals(textId, updatedText.id)
        assertEquals(updateDTO.title, updatedText.title)
        assertEquals(updateDTO.description, updatedText.description)
        assertEquals(updateDTO.dialect, updatedText.dialect)
        assertEquals(originalCreatedAt, updatedText.createdAt)
    }

    @Test
    fun testInterlinearTextCreationWithMinimalDTO() {
        val minimalDTO = InterlinearTextRequestDTO(
            title = "Minimal Text",
            dialect = Dialect.EGYPTIAN
        )

        val text = minimalDTO.toEntity()

        assertNotNull(text)
        assertEquals(minimalDTO.title, text.title)
        assertEquals(null, text.description)
        assertEquals(minimalDTO.dialect, text.dialect)
    }

    @Test
    fun testInterlinearTextSentenceInitialization() {
        val text = InterlinearText().apply {
            id = UUID.randomUUID()
            title = "Test Text"
            dialect = Dialect.LEVANTINE
            createdAt = LocalDateTime.now()
            updatedAt = LocalDateTime.now()
        }

        assertNotNull(text.sentences)
        assertEquals(0, text.sentences.size)
    }
}
