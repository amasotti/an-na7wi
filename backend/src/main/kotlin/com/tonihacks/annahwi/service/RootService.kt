package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.dto.request.RootRequestDTO
import com.tonihacks.annahwi.dto.response.RootResponseDTO
import com.tonihacks.annahwi.dto.response.RootStatisticsDTO
import com.tonihacks.annahwi.dto.response.RootWithWordsDTO
import com.tonihacks.annahwi.dto.response.WordSummaryDTO
import com.tonihacks.annahwi.entity.ArabicRoot
import com.tonihacks.annahwi.exception.AppError
import com.tonihacks.annahwi.exception.AppException
import com.tonihacks.annahwi.repository.ArabicRootRepository
import com.tonihacks.annahwi.service.RootNormalizationService.NormalizedRoot
import com.tonihacks.annahwi.util.loggerFor
import io.quarkus.panache.common.Page
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import java.util.UUID

/**
 * Service for managing Arabic roots
 */
@ApplicationScoped
class RootService {

    @Inject
    internal lateinit var rootNormalizationService: RootNormalizationService

    @Inject
    internal lateinit var rootRepository: ArabicRootRepository
    
    @Inject
    private lateinit var normalizationService: RootNormalizationService
    
    private val logger = loggerFor(RootService::class.java)
    
    /**
     * Find all roots with pagination
     */
    @Transactional
    fun findAll(page: Int, size: Int, sortField: String = "displayForm"): List<RootResponseDTO> {
        logger.info("Finding all roots, page: $page, size: $size, sortField: $sortField")
        
        val sort = Sort.by(sortField)
        val pagination = Page.of(page, size)
        
        return rootRepository.findAllPaginated(pagination, sort)
            .map { root ->
                val wordCount = rootRepository.getWordCountForRoot(root.id!!)
                RootResponseDTO.fromEntity(root, wordCount)
            }
    }
    
    /**
     * Get total count of roots
     */
    fun countAll(): Long {
        return rootRepository.count()
    }
    
    /**
     * Find root by ID
     */
    @Transactional
    fun findById(id: UUID): ArabicRoot {
        logger.info("Finding root by ID: $id")
        return rootRepository.find("id", id).firstResult()
            ?: throw AppException(AppError.NotFound.Root(id.toString()))
    }
    
    /**
     * Find root by normalized form
     */
    @Transactional
    fun findByNormalizedForm(normalizedForm: String): ArabicRoot? {
        return rootRepository.findByNormalizedForm(normalizedForm)
    }
    
    /**
     * Search roots by query
     */
    @Transactional
    fun searchRoots(query: String, page: Int, size: Int, sortField: String = "displayForm"): List<RootResponseDTO> {
        logger.info("Searching roots with query: '$query', page: $page, size: $size")
        
        val sort = Sort.by(sortField)
        val pagination = Page.of(page, size)
        
        // Search in both display form and normalized form
        val displayResults = rootRepository.searchByDisplayForm(query, pagination, sort)
        val normalizedResults = rootRepository.searchByNormalizedForm(query, pagination, sort)
        
        // Combine and deduplicate results
        return (displayResults + normalizedResults).distinctBy { it.id }
            .map { root ->
                val wordCount = rootRepository.getWordCountForRoot(root.id!!)
                RootResponseDTO.fromEntity(root, wordCount)
            }
    }
    
    /**
     * Find roots by letter count
     */
    @Transactional
    fun findByLetterCount(letterCount: Int, page: Int, size: Int, sortField: String = "displayForm"): List<RootResponseDTO> {
        logger.info("Finding roots by letter count: $letterCount, page: $page, size: $size")
        
        val sort = Sort.by(sortField)
        val pagination = Page.of(page, size)
        
        return rootRepository.findByLetterCount(letterCount, pagination, sort)
            .map { root ->
                val wordCount = rootRepository.getWordCountForRoot(root.id!!)
                RootResponseDTO.fromEntity(root, wordCount)
            }
    }
    
    /**
     * Get root with associated words
     */
    @Transactional
    fun getRootWithWords(id: UUID): RootWithWordsDTO {
        logger.info("Getting root with words for ID: $id")
        
        val root = findById(id)
        val words = root.words.map { word ->
            WordSummaryDTO(
                id = word.id!!,
                arabic = word.arabic,
                transliteration = word.transliteration,
                translation = word.translation,
                partOfSpeech = word.partOfSpeech?.name,
                difficulty = word.difficulty.name,
                dialect = word.dialect.name
            )
        }
        
        return RootWithWordsDTO(
            root = RootResponseDTO.fromEntity(root),
            words = words
        )
    }
    
    /**
     * Normalize root input (validation endpoint)
     */
    fun normalizeRoot(input: String): NormalizedRoot? {
        logger.info("Normalizing root input: '$input'")

        return try {
            rootNormalizationService.normalize(input)
        } catch (e: AppException) {
            logger.debug("Invalid root input: '${input}' - ${e.message}")
            null
        }
    }
    
    /**
     * Get root statistics
     */
    fun getStatistics(): RootStatisticsDTO {
        logger.info("Getting root statistics")
        
        val stats = rootRepository.getRootStatistics()
        
        return RootStatisticsDTO(
            totalRoots = stats["totalRoots"] as Long,
            triLiteral = stats["triLiteral"] as Long,
            quadriLiteral = stats["quadriLiteral"] as Long,
            quinqueLiteral = stats["quinqueLiteral"] as Long
        )
    }
    
    /**
     * Create a new root from input
     */
    @Transactional
    fun createRoot(createDto: RootRequestDTO): ArabicRoot {
        logger.info("Creating new root from input: '${createDto.input}'")
        
        val normalized = normalizationService.normalize(createDto.input)
        
        // Check if root already exists
        val existing = findByNormalizedForm(normalized.normalizedForm)
        if (existing != null) {
            throw AppException(AppError.ValidationError.ExistingRoot(existing.displayForm))
        }
        
        // Create new root
        val newRoot = ArabicRoot.create(normalized.letters, createDto.meaning)
        newRoot.analysis = createDto.analysis.takeIf { it.isNotBlank() }
        rootRepository.persist(newRoot).also {
            logger.info("Created new root: ${newRoot.displayForm} with ID: ${newRoot.id}")
        }
        return newRoot
    }
    
    /**
     * Delete a root by ID
     */
    @Transactional
    fun deleteRoot(id: UUID): Boolean {
        logger.info("Deleting root with ID: $id")
        
        val root = findById(id)
        
        // Check if root has associated words
        if (root.words.isNotEmpty()) {
            val error = "Cannot delete root ${root.displayForm} because it has ${root.words.size} associated words"
            throw AppException(AppError.ValidationError.InvalidRoot(error))
        }
        
        rootRepository.delete(root)
        return true
    }

    @Transactional
    fun updateRoot(id: UUID, updateDto: RootRequestDTO): RootResponseDTO {
        logger.info("Updating root with ID: $id, input: '${updateDto.input}'")

        val root = findById(id)

        // Normalize the input
        val normalized = normalizationService.normalize(updateDto.input)

        // Check if normalized form already exists
        val existing = findByNormalizedForm(normalized.normalizedForm)
        if (existing != null && existing.id != id) {
            throw AppException(AppError.ValidationError.ExistingRoot(existing.displayForm))
        }

        // Update root properties
        root.apply {
            displayForm = normalized.displayForm
            normalizedForm = normalized.normalizedForm
            letters = normalized.letters
            meaning = updateDto.meaning
            analysis = updateDto.analysis.takeIf { it.isNotBlank() }
        }

        rootRepository.persistAndFlush(root).also {
            logger.info("Updated root: ${root.displayForm} with ID: ${root.id}")
        }

        // Get word count without triggering lazy initialization
        val wordCount = rootRepository.getWordCountForRoot(id)
        return RootResponseDTO.fromEntity(root, wordCount)
    }
}
