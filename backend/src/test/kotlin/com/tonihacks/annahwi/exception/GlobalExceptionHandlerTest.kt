package com.tonihacks.annahwi.exception

import com.tonihacks.annahwi.dto.response.ErrorResponseDTO
import com.tonihacks.annahwi.dto.response.ValidationErrorResponseDTO
import jakarta.ws.rs.core.Response
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach

class GlobalExceptionHandlerTest {

    private lateinit var handler: GlobalExceptionHandler

    @BeforeEach
    fun setup() {
        handler = GlobalExceptionHandler()
    }

    @Test
    fun `should handle AppException with NotFound error`() {
        val error = AppError.NotFound.Text("123")
        val exception = AppException(error)
        
        val response = handler.toResponse(exception)
        
        assertEquals(Response.Status.NOT_FOUND.statusCode, response.status)
        val errorResponse = response.entity as ErrorResponseDTO
        assertEquals("RESOURCE_NOT_FOUND", errorResponse.error.code)
        assertEquals("Text with ID '123' not found", errorResponse.error.message)
    }

    @Test
    fun `should handle AppException with ValidationError`() {
        val error = AppError.ValidationError.InvalidDialect("INVALID")
        val exception = AppException(error)
        
        val response = handler.toResponse(exception)
        
        assertEquals(Response.Status.BAD_REQUEST.statusCode, response.status)
        val errorResponse = response.entity as ErrorResponseDTO
        assertEquals("VALIDATION_ERROR", errorResponse.error.code)
        assertTrue(errorResponse.error.message.contains("Invalid dialect"))
        assertEquals("dialect", errorResponse.error.field)
    }

    @Test
    fun `should handle AppException with MultipleFields ValidationError`() {
        val fieldErrors = mapOf(
            "title" to "Title is required",
            "content" to "Content cannot be empty"
        )
        val error = AppError.ValidationError.MultipleFields(fieldErrors)
        val exception = AppException(error)
        
        val response = handler.toResponse(exception)
        
        assertEquals(Response.Status.BAD_REQUEST.statusCode, response.status)
        val errorResponse = response.entity as ValidationErrorResponseDTO
        assertEquals("VALIDATION_ERROR", errorResponse.error.code)
        assertEquals(2, errorResponse.error.fieldErrors.size)
        
        val titleError = errorResponse.error.fieldErrors.find { it.field == "title" }
        assertNotNull(titleError)
        assertEquals("Title is required", titleError!!.message)
        
        val contentError = errorResponse.error.fieldErrors.find { it.field == "content" }
        assertNotNull(contentError)
        assertEquals("Content cannot be empty", contentError!!.message)
    }

    @Test
    fun `should handle AppException with BusinessRule error`() {
        val error = AppError.BusinessRule.TextAlreadyExists("Duplicate Title")
        val exception = AppException(error)
        
        val response = handler.toResponse(exception)
        
        assertEquals(Response.Status.BAD_REQUEST.statusCode, response.status)
        val errorResponse = response.entity as ErrorResponseDTO
        assertEquals("TEXT_ALREADY_EXISTS", errorResponse.error.code)
        assertEquals("Text with title 'Duplicate Title' already exists", errorResponse.error.message)
    }

    @Test
    fun `should handle AppException with Conflict error`() {
        val error = AppError.Conflict.ResourceAlreadyExists("Text", "test-id")
        val exception = AppException(error)
        
        val response = handler.toResponse(exception)
        
        assertEquals(Response.Status.CONFLICT.statusCode, response.status)
        val errorResponse = response.entity as ErrorResponseDTO
        assertEquals("CONFLICT", errorResponse.error.code)
        assertEquals("Text with identifier 'test-id' already exists", errorResponse.error.message)
    }

    @Test
    fun `should handle AppException with Internal error`() {
        val error = AppError.Internal.Database
        val exception = AppException(error)
        
        val response = handler.toResponse(exception)
        
        assertEquals(Response.Status.INTERNAL_SERVER_ERROR.statusCode, response.status)
        val errorResponse = response.entity as ErrorResponseDTO
        assertEquals("INTERNAL_SERVER_ERROR", errorResponse.error.code)
        assertEquals("Database operation failed", errorResponse.error.message)
    }

    @Test
    fun `should handle IllegalArgumentException`() {
        val exception = IllegalArgumentException("Invalid argument provided")
        
        val response = handler.toResponse(exception)
        
        assertEquals(Response.Status.BAD_REQUEST.statusCode, response.status)
        val errorResponse = response.entity as ErrorResponseDTO
        assertEquals("INVALID_ARGUMENT", errorResponse.error.code)
        assertEquals("Invalid argument provided", errorResponse.error.message)
    }

    @Test
    fun `should handle generic Exception`() {
        val exception = RuntimeException("Unexpected error")
        
        val response = handler.toResponse(exception)
        
        assertEquals(Response.Status.INTERNAL_SERVER_ERROR.statusCode, response.status)
        val errorResponse = response.entity as ErrorResponseDTO
        assertEquals("INTERNAL_SERVER_ERROR", errorResponse.error.code)
        assertEquals("An unexpected error occurred", errorResponse.error.message)
    }

    @Test
    fun `should handle IllegalArgumentException with null message`() {
        val exception = IllegalArgumentException()
        
        val response = handler.toResponse(exception)
        
        assertEquals(Response.Status.BAD_REQUEST.statusCode, response.status)
        val errorResponse = response.entity as ErrorResponseDTO
        assertEquals("INVALID_ARGUMENT", errorResponse.error.code)
        assertEquals("Invalid argument provided", errorResponse.error.message)
    }
}
