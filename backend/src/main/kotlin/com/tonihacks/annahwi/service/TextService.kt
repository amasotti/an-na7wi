package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.dto.response.PaginatedResponse
import com.tonihacks.annahwi.dto.response.WordResponseDTO
import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Text
import com.tonihacks.annahwi.repository.AnnotationRepository
import com.tonihacks.annahwi.repository.TextRepository
import com.tonihacks.annahwi.repository.WordRepository
import com.tonihacks.annahwi.util.StringUtil
import io.quarkus.panache.common.Page
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import com.tonihacks.annahwi.exception.AppError
import com.tonihacks.annahwi.exception.AppException
import com.tonihacks.annahwi.util.getWordCount
import com.tonihacks.annahwi.util.loggerFor
import java.time.LocalDateTime
import java.util.*

/**
 * Service for managing texts
 */
@ApplicationScoped
class TextService {
    
    @Inject
    private lateinit var textRepository: TextRepository
    
    @Inject
    private lateinit var annotationRepository: AnnotationRepository

    @Inject
    private lateinit var textVersionService: TextVersionService

    @Inject
    private lateinit var wordRepository: WordRepository
    
    private val logger = loggerFor(TextService::class.java)
    
    /**
     * Find all texts with pagination
     */
    @Transactional
    fun findAll(page: Int, size: Int, sortField: String = "title"): List<Text> {
        logger.info("Finding all texts, page: $page, size: $size, sortField: $sortField")

        val sortOption = Sort.by(sortField)
        val paginationOption = Page.of(page, size)

        val texts = textRepository
            .findAll(sortOption)
            .page(paginationOption)
            .list()
        
        // Initialize lazy collections to prevent LazyInitializationException
        texts.forEach { text ->
            text.annotations.size
        }
        
        return texts
    }
    
    /**
     * Get total count of all texts
     */
    fun countAll(): Long {
        return textRepository.count()
    }
    
    /**
     * Find a text by its ID
     */
    @Transactional
    fun findById(id: UUID): Text {
        logger.info("Finding text by ID: $id")
        val text = textRepository.findById(id)
            ?: throw AppException(AppError.NotFound.Text(id.toString()))
        
        // Initialize lazy collections to prevent LazyInitializationException
        text.annotations.size
        
        return text
    }

    /**
     * Find texts by Dialect
     */
    @Transactional
    fun findAllByDialect(
        dialect: String,
        page: Int,
        size: Int,
        sortField: String = "title"
    ): List<Text> {
        logger.info("Finding texts by dialect: $dialect, page: $page, size: $size, sortField: $sortField")

        val dialectEnum = Dialect.fromString(dialect.uppercase())
            ?: throw AppException(AppError.ValidationError.InvalidDialect(dialect))

        val pagination = Page.of(page, size)
        val sortFilter = Sort.by(sortField)

        val texts = textRepository
            .findByDialect(dialectEnum, pagination, sortFilter)
            .also { texts ->
                logger.debug("Found ${texts.size} texts for dialect $dialectEnum")
            }
        
        // Initialize lazy collections to prevent LazyInitializationException
        texts.forEach { text ->
            text.annotations.size
        }
        
        return texts
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
        text.wordCount = text.arabicContent.getWordCount()
        
        // Persist the text first to get the ID
        textRepository.persist(text)
        
        // Create initial version (version 1)
        textVersionService.createInitialVersion(text)
        
        // Initialize lazy collections to prevent LazyInitializationException
        text.annotations.size
        
        return text
    }
    
    /**
     * Update an existing text - creates a new version
     */
    @Transactional
    fun update(id: UUID, text: Text): Text {
        logger.info("Updating text with ID: $id")
        
        val existingText = findById(id)

        // Create version snapshot before updating
        //textVersionService.createVersion(existingText, false)
        
        // Update fields
        existingText.title = text.title
        existingText.arabicContent = text.arabicContent
        existingText.transliteration = text.transliteration
        existingText.translation = text.translation
        existingText.comments = text.comments
        existingText.tags = text.tags
        existingText.difficulty = text.difficulty
        existingText.dialect = text.dialect
        
        // Update timestamp
        existingText.updatedAt = LocalDateTime.now()
        
        // Recalculate word count
        existingText.wordCount = existingText.arabicContent.getWordCount()
        
        // Create new version after updating
        textVersionService.createVersion(existingText)
        
        // Persist the updated text
        textRepository.persist(existingText)
        
        // Initialize lazy collections to prevent LazyInitializationException
        existingText.annotations.size
        
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
        
        // Delete the text
        return textRepository.deleteById(id)
    }

    /**
     * Tokenize text and find matching words in the database
     */
    @Transactional
    fun tokenizeAndFindWords(id: UUID, page: Int, size: Int): PaginatedResponse<WordResponseDTO> {
        logger.info("Tokenizing text with ID: $id, page: $page, size: $size")
        
        val text = findById(id)
        val tokens = StringUtil.tokenizeArabicText(text.arabicContent)
        
        if (tokens.isEmpty()) {
            return PaginatedResponse(
                items = emptyList(),
                totalCount = 0,
                page = page,
                pageSize = size
            )
        }
        
        // Find words that match any of the tokens
        val matchingWords = mutableListOf<WordResponseDTO>()
        
        tokens.forEach { token ->
            // Only do exact matches for tokenization to avoid false positives
            val exactMatch = wordRepository.findByArabic(token)
            if (exactMatch != null) {
                val wordDto = WordResponseDTO.fromEntity(exactMatch)
                if (!matchingWords.any { it.id == wordDto.id }) {
                    matchingWords.add(wordDto)
                }
            }
        }
        
        // Sort by Arabic text
        val sortedWords = matchingWords.sortedBy { it.arabic }
        
        // Apply pagination
        val totalCount = sortedWords.size.toLong()
        val startIndex = page * size
        val endIndex = minOf(startIndex + size, sortedWords.size)
        val paginatedWords = if (startIndex < sortedWords.size) {
            sortedWords.subList(startIndex, endIndex)
        } else {
            emptyList()
        }
        
        return PaginatedResponse(
            items = paginatedWords,
            totalCount = totalCount,
            page = page,
            pageSize = size
        )
    }

}
