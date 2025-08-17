package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.dto.request.AnnotationRequestDTO
import com.tonihacks.annahwi.dto.response.AnnotationResponseDTO
import com.tonihacks.annahwi.entity.Annotation
import com.tonihacks.annahwi.entity.MasteryLevel
import com.tonihacks.annahwi.entity.Word
import com.tonihacks.annahwi.repository.AnnotationRepository
import com.tonihacks.annahwi.repository.WordRepository
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
    private lateinit var annotationRepository: AnnotationRepository
    
    @Inject
    private lateinit var textService: TextService
    
    @Inject
    private lateinit var wordRepository: WordRepository
    
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
     * Find an annotation by its ID with text data eagerly loaded
     */
    fun findByIdWithText(id: UUID): Annotation {
        logger.info("Finding annotation by ID with text data: $id")
        return annotationRepository.findByIdWithText(id)
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
        // Use findByIdWithText to eagerly load the text data
        val annotation = findByIdWithText(id)
        annotation.masteryLevel = masteryLevel
        annotationRepository.persist(annotation)
        return annotation
    }
    
    /**
     * Update review settings
     */
    @Transactional
    fun updateReviewSettings(id: UUID, needsReview: Boolean): Annotation {
        logger.info("Updating review settings for annotation $id - needsReview: $needsReview")
        // Use findByIdWithText to eagerly load the text data
        val annotation = findByIdWithText(id)
        annotation.needsReview = needsReview
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
    fun createForText(textId: UUID, annotationDTO: AnnotationRequestDTO): AnnotationResponseDTO {
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
        
        // Persist the annotation first
        annotationRepository.persist(annotation)
        
        // Link words if provided
        if (!annotationDTO.linkedWordIds.isNullOrEmpty()) {
            val wordIds = annotationDTO.linkedWordIds
            logger.info("Linking ${wordIds.size} words to annotation ${annotation.id}")
            wordIds.forEach { wordId ->
                val word = wordRepository.findById(wordId)
                if (word !== null) {
                    annotation.linkWord(word)
                    logger.info("Successfully linked word $wordId to annotation ${annotation.id}")
                } else {
                    logger.warn("Word with ID $wordId not found, cannot link to annotation ${annotation.id}")
                }
            }

            // Persist the annotation again after linking words
            annotationRepository
              .persistAndFlush(annotation)
              .also {
                logger.info("Persisted annotation ${annotation.id} with linked words")
              }
        }
        
        // Get the annotation with linked words eagerly loaded
        val annotationWithLinkedWords = annotationRepository.findByIdWithTextAndWords(annotation.id!!)
            ?: throw AppException(AppError.NotFound.Annotation(annotation.id.toString()))
            
        // Convert to DTO while session is still active
        return AnnotationResponseDTO.fromEntity(annotationWithLinkedWords)
    }
    
    /**
     * Create a new annotation (legacy method for backward compatibility)
     */
    @Transactional
    fun create(annotation: Annotation): Annotation {
        logger.info("Creating new annotation for text ID: ${annotation.text.id}")
        
        // Verify that the text exists
        val text = textService.findById(annotation.text.id)
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
        
        // Use findByIdWithText to eagerly load the text data
        val existingAnnotation = findByIdWithText(id)
        
        // Update fields from DTO
        existingAnnotation.anchorText = annotationDTO.anchorText
        existingAnnotation.content = annotationDTO.content
        existingAnnotation.type = annotationDTO.type
        existingAnnotation.masteryLevel = annotationDTO.masteryLevel
        existingAnnotation.needsReview = annotationDTO.needsReview
        existingAnnotation.color = annotationDTO.color
        
        // Update linked words if provided (idempotent - won't create duplicates)
        if (annotationDTO.linkedWordIds != null) {
            // Get currently linked word IDs
            val currentLinkedWordIds = existingAnnotation.getLinkedWords().map { it.id }.toSet()
            val requestedWordIds = annotationDTO.linkedWordIds.toSet()
            
            // Remove words that are no longer in the requested list
            val wordsToRemove = currentLinkedWordIds - requestedWordIds
            wordsToRemove.forEach { wordId ->
                val word = wordRepository.findById(wordId!!)
                if (word != null) {
                    existingAnnotation.unlinkWord(word)
                }
            }
            
            // Add new word links (linkWord is idempotent - won't create duplicates)
            annotationDTO.linkedWordIds.forEach { wordId ->
                val word = wordRepository.findById(wordId)
                if (word != null) {
                    existingAnnotation.linkWord(word)  // This is idempotent
                }
            }
        }
        
        // Persist the updated annotation
        annotationRepository.persist(existingAnnotation)
        
        // Return the annotation with linked words eagerly loaded
        return annotationRepository.findByIdWithTextAndWords(id)
            ?: throw AppException(AppError.NotFound.Annotation(id.toString()))
    }
    
    /**
     * Update an existing annotation (legacy method for backward compatibility)
     */
    @Transactional
    fun update(id: UUID, annotation: Annotation): Annotation {
        logger.info("Updating annotation with ID: $id")
        
        // Use findByIdWithText to eagerly load the text data
        val existingAnnotation = findByIdWithText(id)
        
        // Update fields
        existingAnnotation.anchorText = annotation.anchorText
        existingAnnotation.content = annotation.content
        existingAnnotation.type = annotation.type
        existingAnnotation.masteryLevel = annotation.masteryLevel
        existingAnnotation.needsReview = annotation.needsReview
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
     * Link a word to an annotation
     */
    @Transactional
    fun linkWordToAnnotation(annotationId: UUID, wordId: UUID): Annotation {
        logger.info("Linking word $wordId to annotation $annotationId")

      val annotation = findById(annotationId)
      when (val word = wordRepository.findById(wordId)) {
          is Word -> {
              annotation.linkWord(word)
              annotationRepository.persist(annotation)
            }
          null -> logger.warn("Word with ID $wordId not found, cannot link to annotation $annotationId")
        }
        
        // Return annotation with linked words eagerly loaded
        return annotationRepository.findByIdWithTextAndWords(annotationId)
            ?: throw AppException(AppError.NotFound.Annotation(annotationId.toString()))
    }
    
    /**
     * Unlink a word from an annotation
     */
    @Transactional
    fun unlinkWordFromAnnotation(annotationId: UUID, wordId: UUID): Annotation {
      logger.info("Unlinking word $wordId from annotation $annotationId")

      val annotation = findById(annotationId)

      val word = wordRepository.findById(wordId) ?: run {
        logger.warn("Word $wordId not found, skipping unlink for annotation $annotationId")
        // Still return with eagerly loaded data
        return annotationRepository.findByIdWithTextAndWords(annotationId)
            ?: throw AppException(AppError.NotFound.Annotation(annotationId.toString()))
      }

      annotation.unlinkWord(word)
      annotationRepository.persist(annotation)

      // Return annotation with linked words eagerly loaded
      return annotationRepository.findByIdWithTextAndWords(annotationId)
          ?: throw AppException(AppError.NotFound.Annotation(annotationId.toString()))
    }
    
    /**
     * Get all words linked to an annotation
     */
    fun getLinkedWords(annotationId: UUID): List<Word> =
      findById(annotationId)
          .getLinkedWords()
          .also { logger.info("Getting linked words for annotation $annotationId") }

}
