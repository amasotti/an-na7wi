package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.dto.request.AnnotationRequestDTO
import com.tonihacks.annahwi.entity.Annotation
import com.tonihacks.annahwi.entity.AnnotationType
import com.tonihacks.annahwi.entity.MasteryLevel
import com.tonihacks.annahwi.repository.AnnotationRepository
import io.quarkus.panache.common.Page
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import com.tonihacks.annahwi.exception.AppError
import com.tonihacks.annahwi.exception.AppException
import org.jboss.logging.Logger
import java.time.LocalDateTime
import java.util.*

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
        val paginationOption = Page.of(page, size)
        return annotationRepository.findAllWithText(paginationOption, sortField)
    }
    
    /**
     * Find an annotation by its ID
     */
    fun findById(id: UUID): Annotation {
        logger.info("Finding annotation by ID: $id")
        return annotationRepository.findById(id)
            ?: throw AppException(AppError.NotFound.Annotation(id.toString()))
    }
    
    /**
     * Find annotations by text ID
     */
    fun findByTextId(textId: UUID, page: Int, size: Int): List<Annotation> {
        logger.info("Finding annotations by text ID: $textId, page: $page, size: $size")
        return annotationRepository.findByTextIdWithText(textId, Page.of(page, size))
    }
    
    /**
     * Find annotations needing review
     */
    fun findAnnotationsForReview(page: Int, size: Int): List<Annotation> {
        logger.info("Finding annotations for review, page: $page, size: $size")
        return annotationRepository.findByNeedsReviewWithText(true, Page.of(page, size))
    }
    
    /**
     * Update mastery level
     */
    @Transactional
    fun updateMasteryLevel(id: UUID, masteryLevel: MasteryLevel): Annotation {
        logger.info("Updating mastery level for annotation $id to $masteryLevel")
        val annotation = findById(id)
        annotation.masteryLevel = masteryLevel
        annotationRepository.persist(annotation)
        return annotation
    }
    
    /**
     * Update review settings
     */
    @Transactional
    fun updateReviewSettings(id: UUID, needsReview: Boolean, nextReviewDate: LocalDateTime?): Annotation {
        logger.info("Updating review settings for annotation $id - needsReview: $needsReview")
        val annotation = findById(id)
        annotation.needsReview = needsReview
        annotation.nextReviewDate = nextReviewDate
        annotationRepository.persist(annotation)
        return annotation
    }
    
    /**
     * Search annotations by content
     */
    fun searchByContent(query: String, page: Int, size: Int): List<Annotation> {
        logger.info("Searching annotations by content: $query, page: $page, size: $size")
        return annotationRepository.searchByContent(query, Page.of(page, size))
    }
    
    /**
     * Create a new annotation for a specific text
     */
    @Transactional
    fun createForText(textId: UUID, annotationDTO: AnnotationRequestDTO): Annotation {
        logger.info("Creating new annotation for text ID: $textId")
        
        // Verify that the text exists
        val text = textService.findById(textId)
        
        // Create annotation entity from DTO
        val annotation = Annotation().apply {
            this.text = text
            anchorText = annotationDTO.anchorText
            content = annotationDTO.content
            type = annotationDTO.type
            masteryLevel = annotationDTO.masteryLevel
            needsReview = annotationDTO.needsReview
            color = annotationDTO.color
            createdAt = LocalDateTime.now()
        }
        
        // Persist the annotation
        annotationRepository.persist(annotation)
        
        return annotation
    }
    
    /**
     * Create a new annotation (legacy method for backward compatibility)
     */
    @Transactional
    fun create(annotation: Annotation): Annotation {
        logger.info("Creating new annotation for text ID: ${annotation.text.id}")
        
        // Verify that the text exists
        val text = textService.findById(annotation.text.id!!)
        annotation.text = text
        
        // Set creation timestamp
        annotation.createdAt = LocalDateTime.now()
        
        // Persist the annotation
        annotationRepository.persist(annotation)
        
        return annotation
    }
    
    /**
     * Update an existing annotation using DTO
     */
    @Transactional
    fun update(id: UUID, annotationDTO: AnnotationRequestDTO): Annotation {
        logger.info("Updating annotation with ID: $id")
        
        val existingAnnotation = findById(id)
        
        // Update fields from DTO
        existingAnnotation.anchorText = annotationDTO.anchorText
        existingAnnotation.content = annotationDTO.content
        existingAnnotation.type = annotationDTO.type
        existingAnnotation.masteryLevel = annotationDTO.masteryLevel
        existingAnnotation.needsReview = annotationDTO.needsReview
        existingAnnotation.color = annotationDTO.color
        
        // Persist the updated annotation
        annotationRepository.persist(existingAnnotation)
        
        return existingAnnotation
    }
    
    /**
     * Update an existing annotation (legacy method for backward compatibility)
     */
    @Transactional
    fun update(id: UUID, annotation: Annotation): Annotation {
        logger.info("Updating annotation with ID: $id")
        
        val existingAnnotation = findById(id)
        
        // Update fields
        existingAnnotation.anchorText = annotation.anchorText
        existingAnnotation.content = annotation.content
        existingAnnotation.type = annotation.type
        existingAnnotation.masteryLevel = annotation.masteryLevel
        existingAnnotation.needsReview = annotation.needsReview
        existingAnnotation.nextReviewDate = annotation.nextReviewDate
        existingAnnotation.color = annotation.color
        
        // Persist the updated annotation
        annotationRepository.persist(existingAnnotation)
        
        return existingAnnotation
    }
    
    /**
     * Delete an annotation
     */
    @Transactional
    fun delete(id: UUID): Boolean {
        logger.info("Deleting annotation with ID: $id")
        return annotationRepository.deleteById(id)
    }
    
    /**
     * Delete all annotations for a text
     */
    @Transactional
    fun deleteByTextId(textId: UUID): Long {
        logger.info("Deleting all annotations for text ID: $textId")
        return annotationRepository.deleteByTextId(textId)
    }
    
}
