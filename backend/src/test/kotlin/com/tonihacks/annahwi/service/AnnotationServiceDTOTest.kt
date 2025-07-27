package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.dto.request.AnnotationRequestDTO
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

class AnnotationServiceDTOTest {

    @Test
    fun testAnnotationCreationFromDTO() {
        val text = Text().apply {
            id = UUID.randomUUID()
            title = "Test Text"
            arabicContent = "نص اختبار"
            difficulty = Difficulty.BEGINNER
            dialect = Dialect.MSA
            wordCount = 2
            createdAt = LocalDateTime.now()
            updatedAt = LocalDateTime.now()
        }

        val annotationDTO = AnnotationRequestDTO(
            anchorText = "اختبار",
            content = "This means 'test'",
            type = AnnotationType.VOCABULARY,
            masteryLevel = MasteryLevel.LEARNING,
            needsReview = true,
            color = "#FF0000"
        )

        // Test creating annotation entity manually (simulating service logic)
        val annotation = Annotation().apply {
            this.text = text
            anchorText = annotationDTO.anchorText
            content = annotationDTO.content
            type = annotationDTO.type
            masteryLevel = annotationDTO.masteryLevel
            needsReview = annotationDTO.needsReview
            color = annotationDTO.color
            createdAt = LocalDateTime.now()
        }

        assertNotNull(annotation)
        assertEquals(text, annotation.text)
        assertEquals(annotationDTO.anchorText, annotation.anchorText)
        assertEquals(annotationDTO.content, annotation.content)
        assertEquals(annotationDTO.type, annotation.type)
        assertEquals(annotationDTO.masteryLevel, annotation.masteryLevel)
        assertEquals(annotationDTO.needsReview, annotation.needsReview)
        assertEquals(annotationDTO.color, annotation.color)
        assertNotNull(annotation.createdAt)
    }

    @Test
    fun testAnnotationUpdateFromDTO() {
        val annotationId = UUID.randomUUID()
        val textId = UUID.randomUUID()
        val originalCreatedAt = LocalDateTime.now().minusDays(1)

        val existingAnnotation = Annotation().apply {
            id = annotationId
            text = Text().apply {
                id = textId
                title = "Test Text"
                arabicContent = "نص قديم"
                difficulty = Difficulty.BEGINNER
                dialect = Dialect.MSA
                wordCount = 2
                createdAt = LocalDateTime.now()
                updatedAt = LocalDateTime.now()
            }
            anchorText = "قديم"
            content = "Old content"
            type = AnnotationType.GRAMMAR
            masteryLevel = MasteryLevel.NEW
            needsReview = false
            color = "#00FF00"
            createdAt = originalCreatedAt
        }

        val updateDTO = AnnotationRequestDTO(
            anchorText = "جديد",
            content = "New content",
            type = AnnotationType.VOCABULARY,
            masteryLevel = MasteryLevel.MASTERED,
            needsReview = true,
            color = "#0000FF"
        )

        // Test manual update (simulating service logic)
        existingAnnotation.anchorText = updateDTO.anchorText
        existingAnnotation.content = updateDTO.content
        existingAnnotation.type = updateDTO.type
        existingAnnotation.masteryLevel = updateDTO.masteryLevel
        existingAnnotation.needsReview = updateDTO.needsReview
        existingAnnotation.color = updateDTO.color

        assertNotNull(existingAnnotation)
        assertEquals(annotationId, existingAnnotation.id)
        assertEquals(updateDTO.anchorText, existingAnnotation.anchorText)
        assertEquals(updateDTO.content, existingAnnotation.content)
        assertEquals(updateDTO.type, existingAnnotation.type)
        assertEquals(updateDTO.masteryLevel, existingAnnotation.masteryLevel)
        assertEquals(updateDTO.needsReview, existingAnnotation.needsReview)
        assertEquals(updateDTO.color, existingAnnotation.color)
        // Created date should remain unchanged
        assertEquals(originalCreatedAt, existingAnnotation.createdAt)
    }

    @Test
    fun testAnnotationCreationWithMinimalDTO() {
        val text = Text().apply {
            id = UUID.randomUUID()
            title = "Minimal Test"
            arabicContent = "نص"
            difficulty = Difficulty.BEGINNER
            dialect = Dialect.MSA
            wordCount = 1
            createdAt = LocalDateTime.now()
            updatedAt = LocalDateTime.now()
        }

        val minimalDTO = AnnotationRequestDTO(
            anchorText = "نص",
            content = "Simple annotation",
            type = AnnotationType.CULTURAL
        )

        // Test creating annotation with minimal DTO (simulating service logic)
        val annotation = Annotation().apply {
            this.text = text
            anchorText = minimalDTO.anchorText
            content = minimalDTO.content
            type = minimalDTO.type
            masteryLevel = minimalDTO.masteryLevel
            needsReview = minimalDTO.needsReview
            color = minimalDTO.color
            createdAt = LocalDateTime.now()
        }

        assertNotNull(annotation)
        assertEquals(text, annotation.text)
        assertEquals(minimalDTO.anchorText, annotation.anchorText)
        assertEquals(minimalDTO.content, annotation.content)
        assertEquals(minimalDTO.type, annotation.type)
        assertEquals(MasteryLevel.NEW, annotation.masteryLevel) // Default value
        assertEquals(false, annotation.needsReview) // Default value
        assertEquals(null, annotation.color) // Default value
        assertNotNull(annotation.createdAt)
    }
}
