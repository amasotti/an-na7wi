package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Difficulty
import com.tonihacks.annahwi.entity.Text
import com.tonihacks.annahwi.repository.AnnotationRepository
import com.tonihacks.annahwi.repository.TextRepository
import com.tonihacks.annahwi.repository.TextWordRepository
import io.quarkus.panache.common.Page
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import jakarta.ws.rs.NotFoundException
import org.jboss.logging.Logger
import java.time.LocalDateTime
import java.util.*

/**
 * Service for managing texts
 */
@ApplicationScoped
class TextService {
    
    @Inject
    lateinit var textRepository: TextRepository
    
    @Inject
    lateinit var textWordRepository: TextWordRepository
    
    @Inject
    lateinit var annotationRepository: AnnotationRepository
    
    @Inject
    lateinit var wordService: WordService
    
    private val logger = Logger.getLogger(TextService::class.java)
    
    /**
     * Find all texts with pagination
     */
    fun findAll(page: Int, size: Int, sortField: String = "title"): List<Text> {
        logger.info("Finding all texts, page: $page, size: $size, sortField: $sortField")
        return textRepository.findAll(Sort.by(sortField)).page<Text>(Page.of(page, size)).list()
    }
    
    /**
     * Find a text by its ID
     */
    fun findById(id: UUID): Text {
        logger.info("Finding text by ID: $id")
        return textRepository.findByIdOptional(id)
            .orElseThrow { NotFoundException("Text with ID $id not found") }
    }
    
    /**
     * Find texts by title
     */
    fun findByTitle(title: String, page: Int, size: Int): List<Text> {
        logger.info("Finding texts by title: $title, page: $page, size: $size")
        return textRepository.findByTitle(title, Page.of(page, size))
    }
    
    /**
     * Find texts by dialect
     */
    fun findByDialect(dialect: Dialect, page: Int, size: Int): List<Text> {
        logger.info("Finding texts by dialect: $dialect, page: $page, size: $size")
        return textRepository.findByDialect(dialect, Page.of(page, size))
    }
    
    /**
     * Find texts by difficulty
     */
    fun findByDifficulty(difficulty: Difficulty, page: Int, size: Int): List<Text> {
        logger.info("Finding texts by difficulty: $difficulty, page: $page, size: $size")
        return textRepository.findByDifficulty(difficulty, Page.of(page, size))
    }
    
    /**
     * Find texts by tag
     */
    fun findByTag(tag: String, page: Int, size: Int): List<Text> {
        logger.info("Finding texts by tag: $tag, page: $page, size: $size")
        return textRepository.findByTag(tag, Page.of(page, size))
    }
    
    /**
     * Find public texts
     */
    fun findPublic(page: Int, size: Int): List<Text> {
        logger.info("Finding public texts, page: $page, size: $size")
        return textRepository.findPublic(Page.of(page, size))
    }
    
    /**
     * Search texts by content
     */
    fun searchByContent(query: String, page: Int, size: Int): List<Text> {
        logger.info("Searching texts by content: $query, page: $page, size: $size")
        return textRepository.searchByContent(query, Page.of(page, size))
    }
    
    /**
     * Create a new text
     */
    @Transactional
    fun create(text: Text): Text {
        logger.info("Creating new text: ${text.title}")
        
        // Set creation and update timestamps
        val now = LocalDateTime.now()
        text.createdAt = now
        text.updatedAt = now
        
        // Calculate word count
        text.wordCount = calculateWordCount(text.arabicContent)
        
        // Persist the text
        textRepository.persist(text)
        
        return text
    }
    
    /**
     * Update an existing text
     */
    @Transactional
    fun update(id: UUID, text: Text): Text {
        logger.info("Updating text with ID: $id")
        
        val existingText = findById(id)
        
        // Update fields
        existingText.title = text.title
        existingText.arabicContent = text.arabicContent
        existingText.transliteration = text.transliteration
        existingText.translation = text.translation
        existingText.tags = text.tags
        existingText.difficulty = text.difficulty
        existingText.dialect = text.dialect
        existingText.isPublic = text.isPublic
        
        // Update timestamp
        existingText.updatedAt = LocalDateTime.now()
        
        // Recalculate word count
        existingText.wordCount = calculateWordCount(existingText.arabicContent)
        
        // Persist the updated text
        textRepository.persist(existingText)
        
        return existingText
    }
    
    /**
     * Delete a text
     */
    @Transactional
    fun delete(id: UUID): Boolean {
        logger.info("Deleting text with ID: $id")
        
        // Delete related annotations
        annotationRepository.deleteByTextId(id)
        
        // Delete related text-word relationships
        textWordRepository.deleteByTextId(id)
        
        // Delete the text
        return textRepository.deleteById(id)
    }
    
    /**
     * Analyze a text and extract vocabulary
     */
    @Transactional
    fun analyzeText(id: UUID): Text {
        logger.info("Analyzing text with ID: $id")
        
        val text = findById(id)
        
        // Simple word extraction logic - split by whitespace
        val words = text.arabicContent.split("\\s+".toRegex())
        
        // Clear existing text-word relationships
        textWordRepository.deleteByTextId(id)
        
        // Process each word
        words.forEachIndexed { index, wordText ->
            // Clean the word (remove punctuation, etc.)
            val cleanWord = wordText.trim().replace(Regex("[^\\p{L}]"), "")
            
            if (cleanWord.isNotEmpty()) {
                // Find or create the word
                val word = wordService.findOrCreateByArabic(cleanWord)
                
                // Create text-word relationship
                val textWord = com.tonihacks.annahwi.entity.TextWord(
                    text = text,
                    word = word,
                    position = index,
                    context = getContext(words, index, 2)
                )
                
                textWordRepository.persist(textWord)
                
                // Increment word frequency
                wordService.incrementFrequency(word.id!!)
            }
        }
        
        return text
    }
    
    /**
     * Calculate word count in a text
     */
    private fun calculateWordCount(content: String): Int {
        return content.split("\\s+".toRegex()).filter { it.isNotEmpty() }.size
    }
    
    /**
     * Get context for a word in a text
     */
    private fun getContext(words: List<String>, position: Int, contextSize: Int): String {
        val start = maxOf(0, position - contextSize)
        val end = minOf(words.size - 1, position + contextSize)
        return words.subList(start, end + 1).joinToString(" ")
    }
}
