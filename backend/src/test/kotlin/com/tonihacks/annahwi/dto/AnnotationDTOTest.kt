package com.tonihacks.annahwi.dto

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.tonihacks.annahwi.dto.request.AnnotationRequestDTO
import com.tonihacks.annahwi.dto.response.AnnotationResponseDTO
import com.tonihacks.annahwi.entity.Annotation
import com.tonihacks.annahwi.entity.AnnotationType
import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Difficulty
import com.tonihacks.annahwi.entity.MasteryLevel
import com.tonihacks.annahwi.entity.Text
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.util.UUID

class AnnotationDTOTest {

    private val objectMapper = ObjectMapper().findAndRegisterModules()
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)

    @Test
    fun testAnnotationRequestDTOSerialization() {
        val requestDTO = AnnotationRequestDTO(
            anchorText = "كلمة",
            content = "This is a grammar annotation",
            type = AnnotationType.GRAMMAR,
            masteryLevel = MasteryLevel.LEARNING,
            needsReview = true,
            color = "#FF0000"
        )

        val json = objectMapper.writeValueAsString(requestDTO)
        val deserializedDTO = objectMapper.readValue(json, AnnotationRequestDTO::class.java)

        assertNotNull(deserializedDTO)
        assertEquals(requestDTO.anchorText, deserializedDTO.anchorText)
        assertEquals(requestDTO.content, deserializedDTO.content)
        assertEquals(requestDTO.type, deserializedDTO.type)
        assertEquals(requestDTO.masteryLevel, deserializedDTO.masteryLevel)
        assertEquals(requestDTO.needsReview, deserializedDTO.needsReview)
        assertEquals(requestDTO.color, deserializedDTO.color)
    }

    @Test
    fun testAnnotationRequestDTODefaults() {
        val requestDTO = AnnotationRequestDTO(
            anchorText = "كلمة",
            content = "Basic annotation",
            type = AnnotationType.VOCABULARY
        )

        assertEquals(MasteryLevel.NEW, requestDTO.masteryLevel)
        assertEquals(false, requestDTO.needsReview)
        assertEquals(null, requestDTO.color)
    }

    @Test
    fun testAnnotationResponseDTOFromEntity() {
        val text = Text().apply {
            id = UUID.randomUUID()
            title = "Test Text"
            arabicContent = "هذا نص اختبار"
            difficulty = Difficulty.BEGINNER
            dialect = Dialect.MSA
            wordCount = 4
            createdAt = LocalDateTime.now()
            updatedAt = LocalDateTime.now()
        }

        val annotation = Annotation().apply {
            id = UUID.randomUUID()
            this.text = text
            anchorText = "كلمة"
            content = "This is a vocabulary annotation"
            type = AnnotationType.VOCABULARY
            masteryLevel = MasteryLevel.LEARNING
            needsReview = true
            color = "#00FF00"
            createdAt = LocalDateTime.now()
        }

        val responseDTO = AnnotationResponseDTO.fromEntity(annotation)

        assertNotNull(responseDTO)
        assertEquals(annotation.id, responseDTO.id)
        assertEquals(text.id, responseDTO.textId)
        assertEquals(text.title, responseDTO.textTitle)
        assertEquals(annotation.anchorText, responseDTO.anchorText)
        assertEquals(annotation.content, responseDTO.content)
        assertEquals(annotation.type, responseDTO.type)
        assertEquals(annotation.masteryLevel, responseDTO.masteryLevel)
        assertEquals(annotation.needsReview, responseDTO.needsReview)
        assertEquals(annotation.color, responseDTO.color)
        assertEquals(annotation.createdAt, responseDTO.createdAt)
    }

    @Test
    fun testAnnotationResponseDTOSerialization() {
        val responseDTO = AnnotationResponseDTO(
            id = UUID.randomUUID(),
            textId = UUID.randomUUID(),
            textTitle = "Test Text",
            anchorText = "كلمة",
            content = "Cultural annotation",
            type = AnnotationType.CULTURAL,
            masteryLevel = MasteryLevel.MASTERED,
            needsReview = false,
            color = "#0000FF",
            createdAt = LocalDateTime.now()
        )

        val json = objectMapper.writeValueAsString(responseDTO)
        val deserializedDTO = objectMapper.readValue(json, AnnotationResponseDTO::class.java)

        assertNotNull(deserializedDTO)
        assertEquals(responseDTO.id, deserializedDTO.id)
        assertEquals(responseDTO.textId, deserializedDTO.textId)
        assertEquals(responseDTO.textTitle, deserializedDTO.textTitle)
        assertEquals(responseDTO.anchorText, deserializedDTO.anchorText)
        assertEquals(responseDTO.content, deserializedDTO.content)
        assertEquals(responseDTO.type, deserializedDTO.type)
        assertEquals(responseDTO.masteryLevel, deserializedDTO.masteryLevel)
        assertEquals(responseDTO.needsReview, deserializedDTO.needsReview)
        assertEquals(responseDTO.color, deserializedDTO.color)
    }
}
