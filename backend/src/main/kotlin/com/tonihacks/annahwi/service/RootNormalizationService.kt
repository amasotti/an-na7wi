package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.exception.AppError
import com.tonihacks.annahwi.exception.AppException
import com.tonihacks.annahwi.util.loggerFor
import jakarta.enterprise.context.ApplicationScoped

/**
 * Service for normalizing Arabic root inputs into consistent formats
 */
@ApplicationScoped
class RootNormalizationService {
    
    private val logger = loggerFor(RootNormalizationService::class.java)
    
    // Arabic letter ranges for validation
    private val arabicLetterRange = '\u0621'..'\u06FF'
    private val commonSeparators = setOf('-', ' ', '_', '،', '/', '\\', '|')
    
    /**
     * Normalize root input into constituent letters
     * Input examples: "ر ح ب", "ر-ح-ب", "رحب", " ر - ح - ب "
     * Output: ["ر", "ح", "ب"]
     */
    @Suppress("ThrowsCount", "CyclomaticComplexMethod", "NestedBlockDepth")
    fun normalizeToLetters(input: String): List<String> {

        if (input.isBlank()) {
            throw AppException(AppError.ValidationError.InvalidRoot("Root input cannot be blank"))
        }
        logger.debug("Normalizing root input: '$input'")
        
        // Clean input: trim whitespace and normalize separators
        val cleaned = input.trim()
        val letters = mutableListOf<String>()
        val currentLetter = StringBuilder()
        
        // Check if we have separators (spaces, dashes, etc.)
        val hasSeparators = cleaned.any { it in commonSeparators || it.isWhitespace() }
        
        if (hasSeparators) {
            // Process with separators
            cleaned.forEach { char ->
                when {
                    char in arabicLetterRange -> {
                        currentLetter.append(char)
                    }
                    char in commonSeparators || char.isWhitespace() -> {
                        if (currentLetter.isNotEmpty()) {
                            letters.add(currentLetter.toString())
                            currentLetter.clear()
                        }
                    }
                }
            }
            
            // Add the last letter if any
            if (currentLetter.isNotEmpty()) {
                letters.add(currentLetter.toString())
            }
        } else {
            // No separators - split each Arabic character as individual letter
            cleaned.forEach { char ->
                if (char in arabicLetterRange) {
                    letters.add(char.toString())
                }
            }
        }
        
        // Validate result
        if (letters.isEmpty()) {
            throw AppException(AppError.ValidationError.InvalidRoot("No Arabic letters found in input: '$input'"))
        }
        
        if (letters.size < 2 || letters.size > 6) {
            throw AppException(AppError.ValidationError.InvalidRoot(
                "Arabic roots must have 2-6 letters, found ${letters.size} in: '$input'"
            ))
        }
        
        // Validate each letter is Arabic
        letters.forEach { letter ->
            if (letter.any { it !in arabicLetterRange }) {
                throw AppException(AppError.ValidationError.InvalidRoot("Invalid Arabic letter found: '$letter'"))
            }
        }
        
        logger.debug("Normalized '$input' to letters: $letters")
        return letters
    }
    
    /**
     * Create normalized form (letters joined without separators)
     */
    fun createNormalizedForm(letters: List<String>): String {
        return letters.joinToString("")
    }
    
    /**
     * Create display form (letters joined with dashes)
     */
    fun createDisplayForm(letters: List<String>): String {
        return letters.joinToString("-")
    }
    
    /**
     * Data class for normalized root result
     */
    data class NormalizedRoot(
        val letters: List<String>,
        val normalizedForm: String,
        val displayForm: String,
        val letterCount: Int
    )
    
    /**
     * Complete normalization from raw input to all formats
     */
    fun normalize(input: String): NormalizedRoot {
        val letters = normalizeToLetters(input)
        return NormalizedRoot(
            letters = letters,
            normalizedForm = createNormalizedForm(letters),
            displayForm = createDisplayForm(letters),
            letterCount = letters.size
        )
    }
}
