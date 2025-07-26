package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.entity.Annotation
import com.tonihacks.annahwi.entity.AnnotationType
import com.tonihacks.annahwi.repository.AnnotationRepository
import io.quarkus.panache.common.Page
import io.quarkus.panache.common.Sort
import org.jboss.logging.Logger
import java.time.LocalDateTime
import java.util.*
import javax.enterprise.context.ApplicationScoped
import javax.inject.Inject
import javax.transaction.Transactional
import javax.ws.rs.NotFoundException

/**
 * Service for managing annotations
 */
@ApplicationScoped
class AnnotationService {
    
    @Inject
    lateinit var annotationRepository: AnnotationRepository
    
    @Inject
    lateinit var textService: TextService
    
    private val logger = Logger.getLogger(AnnotationService::class.java)
    
    /**
     * Find all annotations with pagination
     */
    fun findAll(page: Int, size: Int, sortField: String = "createdAt"): List<Annotation> {
        logger.info("Finding all annotations, page: $page, size: $size, sortField: $sortField")
        return annotationRepository.findAll(Sort.by(sortField)).page(Page.of(page, size)).list()
    }
    
    /**
     * Find an annotation by its ID
     */
    fun findById(id: UUID): Annotation {
        logger.info("Finding annotation by ID: $id")
        return annotationRepository.findByIdOptional(id)
            .orElseThrow { NotFoundException("Annotation with ID $id not found") }
    }
    
    /**
     * Find annotations by text ID
     */
    fun findByTextId(textId: UUID, page: Int, size: Int): List<Annotation> {
        logger.info("Finding annotations by text ID: $textId, page: $page, size: $size")
        return annotationRepository.findByTextId(textId, Page.of(page, size))
    }
    
    /**
     * Find annotations by type
     */
    fun findByType(type: AnnotationType, page: Int, size: Int): List<Annotation> {
        logger.info("Finding annotations by type: $type, page: $page, size: $size")
        return annotationRepository.findByType(type, Page.of(page, size))
    }
    
    /**
     * Find annotations by text ID and type
     */
    fun findByTextIdAndType(textId: UUID, type: AnnotationType, page: Int, size: Int): List<Annotation> {
        logger.info("Finding annotations by text ID: $textId and type: $type, page: $page, size: $size")
        return annotationRepository.findByTextIdAndType(textId, type, Page.of(page, size))
    }
    
    /**
     * Find annotations by position range
     */
    fun findByPositionRange(textId: UUID, startPosition: Int, endPosition: Int, page: Int, size: Int): List<Annotation> {
        logger.info("Finding annotations by position range: $startPosition-$endPosition, page: $page, size: $size")
        return annotationRepository.findByPositionRange(textId, startPosition, endPosition, Page.of(page, size))
    }
    
    /**
     * Search annotations by content
     */
    fun searchByContent(query: String, page: Int, size: Int): List<Annotation> {
        logger.info("Searching annotations by content: $query, page: $page, size: $size")
        return annotationRepository.searchByContent(query, Page.of(page, size))
    }
    
    /**
     * Create a new annotation
     */
    @Transactional
    fun create(annotation: Annotation): Annotation {
        logger.info("Creating new annotation for text ID: ${annotation.text.id}")
        
        // Verify that the text exists
        val text = textService.findById(annotation.text.id!!)
        annotation.text = text
        
        // Set creation timestamp
        annotation.createdAt = LocalDateTime.now()
        
        // Validate position range
        validatePositionRange(annotation)
        
        // Persist the annotation
        annotationRepository.persist(annotation)
        
        return annotation
    }
    
    /**
     * Update an existing annotation
     */
    @Transactional
    fun update(id: UUID, annotation: Annotation): Annotation {
        logger.info("Updating annotation with ID: $id")
        
        val existingAnnotation = findById(id)
        
        // Update fields
        existingAnnotation.content = annotation.content
        existingAnnotation.positionStart = annotation.positionStart
        existingAnnotation.positionEnd = annotation.positionEnd
        existingAnnotation.type = annotation.type
        existingAnnotation.color = annotation.color
        
        // Validate position range
        validatePositionRange(existingAnnotation)
        
        // Persist the updated annotation
        annotationRepository.persist(existingAnnotation)
        
        return existingAnnotation
    }
    
    /**
     * Delete an annotation
     */
    @Transactional
    fun delete(id: UUID) {
        logger.info("Deleting annotation with ID: $id")
        annotationRepository.deleteById(id)
    }
    
    /**
     * Delete all annotations for a text
     */
    @Transactional
    fun deleteByTextId(textId: UUID): Long {
        logger.info("Deleting all annotations for text ID: $textId")
        return annotationRepository.deleteByTextId(textId)
    }
    
    /**
     * Validate that the annotation position range is valid
     */
    private fun validatePositionRange(annotation: Annotation) {
        if (annotation.positionStart < 0) {
            throw IllegalArgumentException("Position start must be non-negative")
        }
        
        if (annotation.positionEnd < annotation.positionStart) {
            throw IllegalArgumentException("Position end must be greater than or equal to position start")
        }
        
        val text = annotation.text
        val contentLength = text.arabicContent.length
        
        if (annotation.positionEnd > contentLength) {
            throw IllegalArgumentException("Position end must be less than or equal to the text length")
        }
    }
}
