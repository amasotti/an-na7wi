package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Text
import com.tonihacks.annahwi.entity.TextVersion
import com.tonihacks.annahwi.repository.AnnotationRepository
import com.tonihacks.annahwi.repository.TextRepository
import com.tonihacks.annahwi.repository.TextVersionRepository
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
    lateinit var textVersionRepository: TextVersionRepository
    
    @Inject
    lateinit var wordService: WordService
    
    private val logger = Logger.getLogger(TextService::class.java)
    
    /**
     * Find all texts with pagination
     */
    fun findAll(page: Int, size: Int, sortField: String = "title"): List<Text> {
        logger.info("Finding all texts, page: $page, size: $size, sortField: $sortField")
        return textRepository.findAll(Sort.by(sortField)).page(Page.of(page, size)).list()
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
    fun findById(id: UUID): Text {
        logger.info("Finding text by ID: $id")
        return textRepository.findById(id)
            ?: throw NotFoundException("Text with ID $id not found")

    }

    /**
     * Find texts by Dialect
     */
    fun findAllByDialect(
        dialect: String,
        page: Int,
        size: Int,
        sortField: String = "title"
    ): List<Text> {
        logger.info("Finding texts by dialect: $dialect, page: $page, size: $size, sortField: $sortField")

        val dialectEnum = Dialect.fromString(dialect.uppercase())
        requireNotNull(dialectEnum) { "Invalid dialect: $dialect" }

        val pagination = Page.of(page, size)
        val sortFilter = Sort.by(sortField)

        return textRepository
            .findByDialect(dialectEnum, pagination, sortFilter)
            .also { texts ->
                logger.debug("Found ${texts.size} texts for dialect $dialectEnum")
            }
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
     * Update an existing text - creates a new version
     */
    @Transactional
    fun update(id: UUID, text: Text): Text {
        logger.info("Updating text with ID: $id")
        
        val existingText = findById(id)
        
        // Create a version snapshot before updating
        createVersion(existingText)
        
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
     * Calculate word count in a text
     */
    private fun calculateWordCount(content: String): Int {
        return content.split("\\s+".toRegex()).filter { it.isNotEmpty() }.size
    }
    
    
    /**
     * Create a version from current text state
     */
    private fun createVersion(text: Text) {
        // Count existing versions to get next version number
        val existingVersions = textVersionRepository.findByTextId(text.id!!)
        val nextVersionNumber = (existingVersions.maxOfOrNull { it.versionNumber } ?: 0) + 1
        
        // Create content snapshot as JSON
        val contentSnapshot = mapOf(
            "title" to text.title,
            "arabicContent" to text.arabicContent,
            "transliteration" to text.transliteration,
            "translation" to text.translation,
            "comments" to text.comments,
            "tags" to text.tags,
            "difficulty" to text.difficulty.name,
            "dialect" to text.dialect.name
        )
        
        val version = TextVersion().apply {
            textId = text.id!!
            versionNumber = nextVersionNumber
            content = contentSnapshot.toString() // Simple JSON representation
            createdAt = text.updatedAt
            updatedAt = text.updatedAt
        }
        
        textVersionRepository.persist(version)
        
        // Update text to reference this version
        text.version = version
    }
    
    /**
     * Get all versions of a text
     */
    fun getTextVersions(textId: UUID): List<TextVersion> {
        logger.info("Getting versions for text ID: $textId")
        return textVersionRepository.findByTextId(textId)
    }
    
    /**
     * Get a specific version of a text
     */
    fun getTextVersion(textId: UUID, versionNumber: Int): TextVersion {
        logger.info("Getting version $versionNumber for text ID: $textId")
        return textVersionRepository.findByTextIdAndVersionNumber(textId, versionNumber)
            ?: throw NotFoundException("Version $versionNumber not found for text $textId")
    }
    
    /**
     * Restore a version as the current version
     */
    @Transactional
    fun restoreVersion(textId: UUID, versionNumber: Int): Text {
        logger.info("Restoring version $versionNumber for text ID: $textId")
        
        val version = getTextVersion(textId, versionNumber)
        val currentText = findById(textId)
        
        // Create a version of the current state before restoring
        createVersion(currentText)
        
        // Parse the version content (simple approach for now)
        val contentMap = parseVersionContent(version.content)
        
        // Restore the version content
        currentText.title = contentMap["title"] ?: currentText.title
        currentText.arabicContent = contentMap["arabicContent"] ?: currentText.arabicContent
        currentText.transliteration = contentMap["transliteration"]
        currentText.translation = contentMap["translation"]
        currentText.comments = contentMap["comments"]
        currentText.updatedAt = LocalDateTime.now()
        currentText.wordCount = calculateWordCount(currentText.arabicContent)
        
        textRepository.persist(currentText)
        
        return currentText
    }
    
    /**
     * Simple content parser for version snapshots
     * TODO: Replace with proper JSON parsing library
     */
    private fun parseVersionContent(content: String): Map<String, String?> {
        // Very simple parsing - in production use Jackson or similar
        return mapOf(
            "title" to "Restored Text",
            "arabicContent" to content,
            "transliteration" to null,
            "translation" to null,
            "comments" to null
        )
    }
}
