package com.tonihacks.annahwi.exception

import com.tonihacks.annahwi.config.GlobalTestProfile
import com.tonihacks.annahwi.entity.Dialect
import io.quarkus.test.junit.QuarkusTest
import io.quarkus.test.junit.TestProfile
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*

@QuarkusTest
@TestProfile(GlobalTestProfile::class)
class AppErrorTest {

    @Test
    fun `should create NotFound Text error with correct properties`() {
        val textId = "123e4567-e89b-12d3-a456-426614174000"
        val error = AppError.NotFound.Text(textId)
        
        assertEquals("RESOURCE_NOT_FOUND", error.code)
        assertEquals("Text with ID '$textId' not found", error.message)
        assertNull(error.details)
    }

    @Test
    fun `should create NotFound TextVersion error with correct properties`() {
        val textId = "123e4567-e89b-12d3-a456-426614174000"
        val versionNumber = 5
        val error = AppError.NotFound.TextVersion(textId, versionNumber)
        
        assertEquals("RESOURCE_NOT_FOUND", error.code)
        assertEquals("Version $versionNumber not found for text '$textId'", error.message)
    }

    @Test
    fun `should create InvalidDialect error with correct properties`() {
        val invalidDialect = "INVALID"
        val error = AppError.ValidationError.InvalidDialect(invalidDialect)
        
        assertEquals("VALIDATION_ERROR", error.code)
        assertTrue(error.message.contains("Invalid dialect '$invalidDialect'"))
        assertTrue(error.message.contains(Dialect.allToJoinedString()))
        assertEquals("dialect", error.fieldName)
        assertEquals(invalidDialect, error.rejectedValue)
    }

    @Test
    fun `should create InvalidPageNumber error with correct properties`() {
        val invalidPage = -1
        val error = AppError.ValidationError.InvalidPageNumber(invalidPage)
        
        assertEquals("VALIDATION_ERROR", error.code)
        assertEquals("Page number must be greater than 0", error.message)
        assertEquals("page", error.fieldName)
        assertEquals(invalidPage, error.rejectedValue)
    }

    @Test
    fun `should create InvalidPageSize error with correct properties`() {
        val invalidSize = 0
        val error = AppError.ValidationError.InvalidPageSize(invalidSize)
        
        assertEquals("VALIDATION_ERROR", error.code)
        assertEquals("Page size must be greater than 0", error.message)
        assertEquals("size", error.fieldName)
        assertEquals(invalidSize, error.rejectedValue)
    }

    @Test
    fun `should create BusinessRule TextAlreadyExists error with correct properties`() {
        val title = "Duplicate Title"
        val error = AppError.BusinessRule.TextAlreadyExists(title)
        
        assertEquals("TEXT_ALREADY_EXISTS", error.code)
        assertEquals("Text with title '$title' already exists", error.message)
    }

    @Test
    fun `should create Internal Database error with correct properties`() {
        val error = AppError.Internal.Database
        
        assertEquals("INTERNAL_SERVER_ERROR", error.code)
        assertEquals("Database operation failed", error.message)
    }

    @Test
    fun `should create Internal Unexpected error with cause`() {
        val cause = RuntimeException("Test exception")
        val error = AppError.Internal.Unexpected(cause)
        
        assertEquals("INTERNAL_SERVER_ERROR", error.code)
        assertEquals("An unexpected error occurred: Test exception", error.message)
    }

    @Test
    fun `should create Conflict ResourceAlreadyExists error with correct properties`() {
        val resource = "Text"
        val identifier = "test-id"
        val error = AppError.Conflict.ResourceAlreadyExists(resource, identifier)
        
        assertEquals("CONFLICT", error.code)
        assertEquals("$resource with identifier '$identifier' already exists", error.message)
    }

    @Test
    fun `should create MultipleFields validation error`() {
        val fieldErrors = mapOf(
            "title" to "Title is required",
            "content" to "Content cannot be empty"
        )
        val error = AppError.ValidationError.MultipleFields(fieldErrors)
        
        assertEquals("VALIDATION_ERROR", error.code)
        assertEquals("Multiple validation errors occurred", error.message)
        assertEquals(fieldErrors, error.fieldErrors)
    }
}
