package com.tonihacks.annahwi.service

import com.anthropic.client.okhttp.AnthropicOkHttpClient
import com.anthropic.models.messages.ContentBlock
import com.anthropic.models.messages.Message
import com.anthropic.models.messages.MessageCreateParams
import com.anthropic.models.messages.Model
import com.tonihacks.annahwi.dto.request.ExampleGenerationRequestDTO
import com.tonihacks.annahwi.dto.response.ExampleGenerationResponseDTO
import com.tonihacks.annahwi.dto.response.ExampleDTO
import com.tonihacks.annahwi.exception.InternalServerErrorException
import jakarta.enterprise.context.ApplicationScoped
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.jboss.logging.Logger

@ApplicationScoped
class ExampleGenerationService {

    @ConfigProperty(name = "anthropic.api.key")
    private lateinit var anthropicApiKey: String

    private val logger = Logger.getLogger(ExampleGenerationService::class.java)

    fun generateExamples(request: ExampleGenerationRequestDTO): ExampleGenerationResponseDTO {
        logger.info("Generating examples for Arabic word/expression: ${request.arabic}")
        
        val client = AnthropicOkHttpClient.builder()
            .apiKey(anthropicApiKey)
            .build()

        val prompt = buildPrompt(request.arabic, request.context)
        
        try {
            val messageRequest = MessageCreateParams.builder()
                .model(Model.CLAUDE_3_5_HAIKU_20241022)
                .maxTokens(300)
                .addUserMessage(prompt)
                .build()

            val response: Message = client.messages().create(messageRequest)
            val examples = parseExamplesFromResponse(response)
            
            logger.info("Generated ${examples.size} examples for: ${request.arabic}")
            return ExampleGenerationResponseDTO(examples)
            
        } catch (e: Exception) {
            logger.debug("Error generating examples for ${request.arabic}: ${e.message}")
            throw InternalServerErrorException("Failed to generate examples: ${e.message}", e)
        }
    }

    private fun buildPrompt(arabic: String, context: String?): String {
        val contextPart = if (context != null) " in the context of '$context'" else ""
        
        return """
            Please provide 2 very short, simple Arabic example sentences using the word or expression "$arabic"$contextPart.
            
            Requirements:
            - Each example should be maximum 8 words
            - Use Modern Standard Arabic (MSA) or Tunisian Arabic colloquial dialect
            - Examples should be practical and commonly used
            - Show the word/expression in different grammatical contexts when possible
            - For each example, provide the Arabic sentence followed by its English translation
            
            Format your response as exactly 5 lines:
            Line 1: First Arabic sentence
            Line 2: English translation of first sentence
            Line 3: Six dashes (------) to separate examples
            Line 4: Second Arabic sentence
            Line 5: English translation of second sentence
            
            Example format:
            ```
            هذا كتاب مفيد
            This is a useful book
            ------
            أقرأ الكتاب كل يوم
            I read the book every day
            ```
        """.trimIndent()
    }

    /**
     * Parses the examples from the Anthropic response.
     */
    private fun parseExamplesFromResponse(response: Message): List<ExampleDTO> =
        response.firstContentOrNull()
            ?.extractExampleLines()
            ?.let { lines ->
                if (lines.hasEnoughExampleData()) {
                    listOf(
                        lines.extractExample(0, 2),
                        lines.extractExample(3, 5)
                    )
                } else {
                    logger.warn("Response does not contain enough lines for examples: ${lines.size}")
                    listOf(ExampleDTO(arabic = lines.toString(), english = ""))
                }
            }
            ?: run {
                logger.warn("No content found in Anthropic response")
                emptyList()
            }

    /** Checks if there are enough lines to form two complete examples. */
    private fun List<String>.hasEnoughExampleData() = size >= 5

    /** Extracts an ExampleDTO from the given range in the list. */
    private fun List<String>.extractExample(start: Int, end: Int): ExampleDTO =
        ExampleDTO.fromAntrhopicWordExampleResponse(subListSafe(start, end))

    /** Returns a safe sublist within bounds, trimming each entry. */
    private fun List<String>.subListSafe(fromIndex: Int, toIndex: Int): List<String> =
        subList(fromIndex.coerceAtLeast(0), toIndex.coerceAtMost(size))
            .map { it.trim() }

    private fun ContentBlock.extractExampleLines(): List<String> =
        this.asText()
            .text()
            .lines()
            .map { it.trim() }
            .filter { it.isNotBlank() }

    private fun Message.firstContentOrNull() = content().firstOrNull()
}
