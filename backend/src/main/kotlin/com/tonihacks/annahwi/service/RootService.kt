package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.dto.response.RootNormalizationResponseDTO
import com.tonihacks.annahwi.dto.response.RootResponseDTO
import com.tonihacks.annahwi.dto.response.RootStatisticsDTO
import com.tonihacks.annahwi.dto.response.RootWithWordsDTO
import com.tonihacks.annahwi.dto.response.WordSummaryDTO
import com.tonihacks.annahwi.entity.ArabicRoot
import com.tonihacks.annahwi.exception.AppError
import com.tonihacks.annahwi.exception.AppException
import com.tonihacks.annahwi.repository.ArabicRootRepository
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
    private lateinit var rootRepository: ArabicRootRepository
    
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
            .map { RootResponseDTO.fromEntity(it) }
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
        val allResults = (displayResults + normalizedResults).distinctBy { it.id }
        
        return allResults.map { RootResponseDTO.fromEntity(it) }
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
            .map { RootResponseDTO.fromEntity(it) }
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
     * Create or find existing root from input
     */
    @Transactional
    fun createOrFindRoot(input: String): ArabicRoot {
        logger.info("Creating or finding root from input: '$input'")
        
        val normalized = normalizationService.normalize(input)
        
        // Check if root already exists
        val existing = findByNormalizedForm(normalized.normalizedForm)
        if (existing != null) {
            logger.debug("Root already exists: ${existing.displayForm}")
            return existing
        }
        
        // Create new root
        val newRoot = ArabicRoot.create(normalized.letters)
        rootRepository.persist(newRoot)
        
        logger.info("Created new root: ${newRoot.displayForm}")
        return newRoot
    }
    
    /**
     * Normalize root input (validation endpoint)
     */
    fun normalizeRoot(input: String): RootNormalizationResponseDTO {
        logger.info("Normalizing root input: '$input'")
        
        return try {
            val normalized = normalizationService.normalize(input)
            RootNormalizationResponseDTO(
                input = input,
                letters = normalized.letters,
                normalizedForm = normalized.normalizedForm,
                displayForm = normalized.displayForm,
                letterCount = normalized.letterCount,
                isValid = true
            )
        } catch (_: AppException) {
            RootNormalizationResponseDTO(
                input = input,
                letters = emptyList(),
                normalizedForm = "",
                displayForm = "",
                letterCount = 0,
                isValid = false
            )
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
     * Find roots starting with specific letter
     */
    @Transactional
    fun findRootsStartingWith(letter: String, page: Int, size: Int, sortField: String = "displayForm"): List<RootResponseDTO> {
        logger.info("Finding roots starting with letter: '$letter', page: $page, size: $size")
        
        val sort = Sort.by(sortField)
        val pagination = Page.of(page, size)
        
        return rootRepository.findRootsStartingWith(letter, pagination, sort)
            .map { RootResponseDTO.fromEntity(it) }
    }
    
    /**
     * Find roots containing specific letters
     */
    @Transactional
    fun findRootsContainingLetters(letters: List<String>, page: Int, size: Int, sortField: String = "displayForm"): List<RootResponseDTO> {
        logger.info("Finding roots containing letters: $letters, page: $page, size: $size")
        
        val sort = Sort.by(sortField)
        val pagination = Page.of(page, size)
        
        return rootRepository.findRootsContainingLetters(letters, pagination, sort)
            .map { RootResponseDTO.fromEntity(it) }
    }
}
