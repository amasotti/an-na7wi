package com.tonihacks.annahwi.exception

import com.tonihacks.annahwi.config.GlobalTestProfile
import io.quarkus.test.junit.QuarkusTest
import io.quarkus.test.junit.TestProfile
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.assertThrows

@QuarkusTest
@TestProfile(GlobalTestProfile::class)
class ResultTest {

    @Test
    fun `should create successful result`() {
        val value = "test value"
        val result = success<String>(value)
        
        assertTrue(result.isSuccess)
        assertFalse(result.isFailure)
        assertEquals(value, result.getOrNull())
        assertNull(result.errorOrNull())
        assertEquals(value, result.getOrThrow())
    }

    @Test
    fun `should create failure result`() {
        val error = AppError.NotFound.Text("123")
        val result = failure<String>(error)
        
        assertFalse(result.isSuccess)
        assertTrue(result.isFailure)
        assertNull(result.getOrNull())
        assertEquals(error, result.errorOrNull())
    }

    @Test
    fun `should throw exception when calling getOrThrow on failure`() {
        val error = AppError.NotFound.Text("123")
        val result = failure<String>(error)
        
        val exception = assertThrows<AppException> {
            result.getOrThrow()
        }
        assertEquals(error, exception.error)
    }

    @Test
    fun `should map successful result`() {
        val value = 5
        val result = success(value)
        
        val mapped = result.map { it * 2 }
        
        assertTrue(mapped.isSuccess)
        assertEquals(10, mapped.getOrNull())
    }

    @Test
    fun `should not map failure result`() {
        val error = AppError.NotFound.Text("123")
        val result = failure<Int>(error)
        
        val mapped = result.map { it * 2 }
        
        assertTrue(mapped.isFailure)
        assertEquals(error, mapped.errorOrNull())
    }

    @Test
    fun `should flatMap successful result`() {
        val value = 5
        val result = success(value)
        
        val flatMapped = result.flatMap { 
            success(it.toString())
        }
        
        assertTrue(flatMapped.isSuccess)
        assertEquals("5", flatMapped.getOrNull())
    }

    @Test
    fun `should handle flatMap with failure`() {
        val value = 5
        val result = success(value)
        val error = AppError.ValidationError.InvalidPageNumber(-1)
        
        val flatMapped = result.flatMap<String> { 
            failure(error)
        }
        
        assertTrue(flatMapped.isFailure)
        assertEquals(error, flatMapped.errorOrNull())
    }

    @Test
    fun `should mapError on failure`() {
        val originalError = AppError.NotFound.Text("123")
        val result = failure<String>(originalError)
        val newError = AppError.ValidationError.InvalidDialect("INVALID")
        
        val mapped = result.mapError { newError }
        
        assertTrue(mapped.isFailure)
        assertEquals(newError, mapped.errorOrNull())
    }

    @Test
    fun `should not mapError on success`() {
        val value = "test"
        val result = success(value)
        val error = AppError.ValidationError.InvalidDialect("INVALID")
        
        val mapped = result.mapError { error }
        
        assertTrue(mapped.isSuccess)
        assertEquals(value, mapped.getOrNull())
    }

    @Test
    fun `should execute onSuccess callback on successful result`() {
        var callbackExecuted = false
        val result = success("test")
        
        result.onSuccess { callbackExecuted = true }
        
        assertTrue(callbackExecuted)
    }

    @Test
    fun `should not execute onSuccess callback on failure result`() {
        var callbackExecuted = false
        val result = failure<String>(AppError.NotFound.Text("123"))
        
        result.onSuccess { callbackExecuted = true }
        
        assertFalse(callbackExecuted)
    }

    @Test
    fun `should execute onFailure callback on failure result`() {
        var callbackExecuted = false
        val result = failure<String>(AppError.NotFound.Text("123"))
        
        result.onFailure { callbackExecuted = true }
        
        assertTrue(callbackExecuted)
    }

    @Test
    fun `should not execute onFailure callback on successful result`() {
        var callbackExecuted = false
        val result = success("test")
        
        result.onFailure { callbackExecuted = true }
        
        assertFalse(callbackExecuted)
    }

    @Test
    fun `should return value on getOrElse for success`() {
        val value = "test"
        val result = success(value)
        
        assertEquals(value, result.getOrElse("default"))
    }

    @Test
    fun `should return default on getOrElse for failure`() {
        val result = failure<String>(AppError.NotFound.Text("123"))
        val default = "default"
        
        assertEquals(default, result.getOrElse(default))
    }

    @Test
    fun `should catch and convert exceptions to Result`() {
        val result = catching {
            throw BadRequestException("Test exception")
        }
        
        assertTrue(result.isFailure)
        val error = result.errorOrNull()
        assertNotNull(error)
        assertTrue(error is AppError.Internal.Unexpected)
    }

    @Test
    fun `should catch AppException and preserve error`() {
        val originalError = AppError.NotFound.Text("123")
        val result = catching {
            throw AppException(originalError)
        }
        
        assertTrue(result.isFailure)
        assertEquals(originalError, result.errorOrNull())
    }

    @Test
    fun `should return success for normal execution`() {
        val result = catching {
            "success value"
        }
        
        assertTrue(result.isSuccess)
        assertEquals("success value", result.getOrNull())
    }
}

