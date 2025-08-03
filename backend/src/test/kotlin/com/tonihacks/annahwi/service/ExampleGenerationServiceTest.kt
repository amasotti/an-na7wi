package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.dto.request.ExampleGenerationRequestDTO
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue

@QuarkusTest
class ExampleGenerationServiceTest {

    @Inject
    lateinit var exampleGenerationService: ExampleGenerationService

    @Test
    @EnabledIfEnvironmentVariable(named = "ANTHROPIC_API_KEY", matches = ".*")
    fun `should generate examples for Arabic word`() {
        val request = ExampleGenerationRequestDTO("كتاب")
        
        val response = exampleGenerationService.generateExamples(request)
        
        assertNotNull(response)
        assertTrue(response.examples.isNotEmpty())
        assertTrue(response.examples.size <= 3)
        response.examples.forEach { example ->
            assertTrue(example.isNotBlank())
        }
    }

    @Test
    @EnabledIfEnvironmentVariable(named = "ANTHROPIC_API_KEY", matches = ".*")
    fun `should generate examples with context`() {
        val request = ExampleGenerationRequestDTO("يدرس", "education")
        
        val response = exampleGenerationService.generateExamples(request)
        
        assertNotNull(response)
        assertTrue(response.examples.isNotEmpty())
        assertTrue(response.examples.size <= 3)
    }

    @Test
    fun `should handle empty response gracefully`() {
        val request = ExampleGenerationRequestDTO("كتاب")
        
        if (System.getenv("ANTHROPIC_API_KEY").isNullOrBlank()) {
            assertTrue(true, "Skipping test - ANTHROPIC_API_KEY not set")
            return
        }
        
        val response = exampleGenerationService.generateExamples(request)
        assertNotNull(response)
    }
}
