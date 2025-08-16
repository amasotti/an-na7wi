package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.dto.request.RootRequestDTO
import com.tonihacks.annahwi.dto.request.WordRequestDTO
import com.tonihacks.annahwi.dto.response.RootNormalizationResponseDTO
import com.tonihacks.annahwi.dto.response.WordResponseDTO
import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Difficulty
import com.tonihacks.annahwi.entity.MasteryLevel
import com.tonihacks.annahwi.entity.PartOfSpeech
import com.tonihacks.annahwi.entity.Word
import com.tonihacks.annahwi.repository.WordRepository
import io.quarkus.panache.common.Page
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import com.tonihacks.annahwi.exception.AppError
import com.tonihacks.annahwi.exception.AppException
import org.jboss.logging.Logger
import java.time.LocalDateTime
import java.util.*

/**
 * Service for managing words
 */
@ApplicationScoped
class WordService {
    
    @Inject
    private lateinit var wordRepository: WordRepository
    
    @Inject
    private lateinit var rootService: RootService
    
    private val logger = Logger.getLogger(WordService::class.java)
    
    /**
     * Find all words with pagination
     */
    fun findAll(page: Int, size: Int, sortField: String = "arabic"): List<WordResponseDTO> {
        logger.info("Finding all words, page: $page, size: $size, sortField: $sortField")
        val sortOption = Sort.by(sortField)
        val paginationOption = Page.of(page, size)
        val words = wordRepository
            .findAll(sortOption)
            .page(paginationOption)
            .list()
        return WordResponseDTO.fromEntities(words)
    }

    fun countAll(): Long {
        logger.info("Counting all words")
        return wordRepository.count()
    }

    /**
     * Find all words with optional filters and pagination
     */
    fun findAllWithFilters(
        page: Int, 
        size: Int, 
        sortField: String = "arabic",
        difficulty: Difficulty? = null,
        dialect: Dialect? = null,
        partOfSpeech: PartOfSpeech? = null,
        masteryLevel: MasteryLevel? = null,
        verified: Boolean? = null
    ): List<WordResponseDTO> {
        logger.info(
            "Finding words with filters - page: $page, size: $size, sort: $sortField, " +
            "difficulty: $difficulty, dialect: $dialect, partOfSpeech: $partOfSpeech, masteryLevel: $masteryLevel, verified: $verified"
        )
        val words = wordRepository.findAllWithFilters(Page.of(page, size), sortField, difficulty, dialect, partOfSpeech, masteryLevel, verified)
        return WordResponseDTO.fromEntities(words)
    }

    /**
     * Count words with optional filters
     */
    fun countWithFilters(
        difficulty: Difficulty? = null,
        dialect: Dialect? = null,
        partOfSpeech: PartOfSpeech? = null,
        masteryLevel: MasteryLevel? = null,
        verified: Boolean? = null
    ): Long {
        logger.info("Counting words with filters - difficulty: $difficulty, dialect: $dialect, " +
                "partOfSpeech: $partOfSpeech, masteryLevel: $masteryLevel, verified: $verified")
        return wordRepository.countWithFilters(difficulty, dialect, partOfSpeech, masteryLevel, verified)
    }
    
    /**
     * Find a word by its ID
     */
    fun findById(id: UUID): WordResponseDTO {
        logger.info("Finding word by ID: $id")
        val word = wordRepository.findById(id)
            ?: throw AppException(AppError.NotFound.Word(id.toString()))
        return WordResponseDTO.fromEntity(word)
    }
    
    /**
     * Find a word by Arabic text (exact match)
     */
    fun findByArabic(arabic: String): Optional<WordResponseDTO> {
        logger.info("Finding word by Arabic text: $arabic")
        return wordRepository.findByArabic(arabic)
            ?.let { Optional.of(WordResponseDTO.fromEntity(it)) }
            ?: Optional.empty()
    }
    
    /**
     * Search words by Arabic text (partial match)
     */
    fun searchByArabic(arabic: String, page: Int, size: Int): List<WordResponseDTO> {
        logger.info("Searching words by Arabic text: $arabic, page: $page, size: $size")
        val words = wordRepository.searchByArabic(arabic, Page.of(page, size))
        return WordResponseDTO.fromEntities(words)
    }
    
    /**
     * Find words by root
     */
    fun findByRoot(root: String, page: Int, size: Int): List<WordResponseDTO> {
        logger.info("Finding words by root: $root, page: $page, size: $size")
        val words = wordRepository.findByRoot(root, Page.of(page, size))
        return WordResponseDTO.fromEntities(words)
    }
    
    /**
     * Find words by part of speech
     */
    fun findByPartOfSpeech(partOfSpeech: PartOfSpeech, page: Int, size: Int): List<WordResponseDTO> {
        logger.info("Finding words by part of speech: $partOfSpeech, page: $page, size: $size")
        val words = wordRepository.findByPartOfSpeech(partOfSpeech, Page.of(page, size))
        return WordResponseDTO.fromEntities(words)
    }
    
    /**
     * Find words by dialect
     */
    fun findByDialect(dialect: Dialect, page: Int, size: Int): List<WordResponseDTO> {
        logger.info("Finding words by dialect: $dialect, page: $page, size: $size")
        val words = wordRepository.findByDialect(dialect, Page.of(page, size))
        return WordResponseDTO.fromEntities(words)
    }
    
    /**
     * Find words by difficulty
     */
    fun findByDifficulty(difficulty: Difficulty, page: Int, size: Int): List<WordResponseDTO> {
        logger.info("Finding words by difficulty: $difficulty, page: $page, size: $size")
        val words = wordRepository.findByDifficulty(difficulty, Page.of(page, size))
        return WordResponseDTO.fromEntities(words)
    }
    
    /**
     * Search words by translation or transliteration
     */
    fun searchByTranslation(query: String, page: Int, size: Int): List<WordResponseDTO> {
        logger.info("Searching words by translation or transliteration: $query, page: $page, size: $size")
        val words = wordRepository.searchByTranslation(query, Page.of(page, size))
        return WordResponseDTO.fromEntities(words)
    }
    
    /**
     * Create a new word from DTO
     */
    @Transactional
    fun create(wordDTO: WordRequestDTO): WordResponseDTO {
        logger.info("Creating new word: ${wordDTO.arabic}")
        
        val word = wordDTO.toEntity()
        word.createdAt = LocalDateTime.now()
        
        // Handle root assignment
        if (!wordDTO.root.isNullOrBlank()) {
            try {

                val rootDto = RootRequestDTO(
                    input = wordDTO.root,
                    meaning = ""
                )

                // see if the root already exists
                val normalizedRoot = rootService.normalizeRoot(wordDTO.root)?.let {
                    RootNormalizationResponseDTO(
                        input = wordDTO.root,
                        letters = it.letters,
                        normalizedForm = it.normalizedForm,
                        displayForm = it.displayForm,
                        letterCount = it.letterCount,
                        isValid = true
                    )
                } ?: RootNormalizationResponseDTO(
                    input = wordDTO.root,
                    letters = emptyList(),
                    normalizedForm = "",
                    displayForm = "",
                    letterCount = 0,
                    isValid = false
                )
                val existingRoot = rootService.findByNormalizedForm(normalizedRoot.normalizedForm)
                val root = when (existingRoot) {
                    null -> rootService.createRoot(rootDto)
                    else -> {
                        logger.debug("Root already exists: ${existingRoot.displayForm}")
                        existingRoot
                    }
                }

                word.arabicRoot = root
                logger.debug("Assigned root ${root.displayForm} to word ${word.arabic}")
            } catch (e: Exception) {
                logger.warn("Failed to create/find root for '${wordDTO.root}': ${e.message}")
                // Keep the original root string for backward compatibility
                word.root = wordDTO.root
            }
        }
        
        // Persist the word
        wordRepository.persist(word)
        
        return WordResponseDTO.fromEntity(word)
    }
    
    /**
     * Create a new word (legacy method for backward compatibility)
     */
    @Transactional
    fun create(word: Word): Word {
        logger.info("Creating new word: ${word.arabic}")
        
        // Set creation timestamp
        word.createdAt = LocalDateTime.now()
        
        // Persist the word
        wordRepository.persist(word)
        
        return word
    }
    
    /**
     * Update an existing word using DTO
     */
    @Transactional
    fun update(id: UUID, wordDTO: WordRequestDTO): WordResponseDTO {
        logger.info("Updating word with ID: $id")
        
        val existingWord = wordRepository.findById(id)
            ?: throw AppException(AppError.NotFound.Word(id.toString()))
        wordDTO.updateEntity(existingWord)
        
        // Handle root assignment
        if (!wordDTO.root.isNullOrBlank()) {
            try {
                val rootDto = RootRequestDTO(
                    input = wordDTO.root,
                    meaning = ""
                )

                // see if the root already exists
                val normalizedRoot = rootService.normalizeRoot(wordDTO.root)?.let {
                    RootNormalizationResponseDTO(
                        input = wordDTO.root,
                        letters = it.letters,
                        normalizedForm = it.normalizedForm,
                        displayForm = it.displayForm,
                        letterCount = it.letterCount,
                        isValid = true
                    )
                } ?: RootNormalizationResponseDTO(
                    input = wordDTO.root,
                    letters = emptyList(),
                    normalizedForm = "",
                    displayForm = "",
                    letterCount = 0,
                    isValid = false
                )
                val existingRoot = rootService.findByNormalizedForm(normalizedRoot.normalizedForm)
                val root = when (existingRoot) {
                    null -> rootService.createRoot(rootDto)
                    else -> {
                        logger.debug("Root already exists: ${existingRoot.displayForm}")
                        existingRoot
                    }
                }

                existingWord.arabicRoot = root
                logger.debug("Updated root to ${root.displayForm} for word ${existingWord.arabic}")
            } catch (e: Exception) {
                logger.warn("Failed to create/find root for '${wordDTO.root}': ${e.message}")
                // Keep the original root string for backward compatibility
                existingWord.root = wordDTO.root
                existingWord.arabicRoot = null
            }
        } else {
            // Clear root relationship if no root provided
            existingWord.arabicRoot = null
        }
        
        // Persist the updated word
        wordRepository.persistAndFlush(existingWord)
        
        return WordResponseDTO.fromEntity(existingWord)
    }
    
    /**
     * Update an existing word (legacy method for backward compatibility)
     */
    @Transactional
    fun update(id: UUID, word: Word): Word {
        logger.info("Updating word with ID: $id")
        
        val existingWord = wordRepository.findById(id)
            ?: throw AppException(AppError.NotFound.Word(id.toString()))
        
        // Update fields
        existingWord.arabic = word.arabic
        existingWord.transliteration = word.transliteration
        existingWord.translation = word.translation
        existingWord.root = word.root
        existingWord.partOfSpeech = word.partOfSpeech
        existingWord.notes = word.notes
        existingWord.difficulty = word.difficulty
        existingWord.dialect = word.dialect
        
        // Persist the updated word
        wordRepository.persist(existingWord)
        
        return existingWord
    }
    
    /**
     * Delete a word
     */
    @Transactional
    fun delete(id: UUID): Boolean {
        logger.info("Deleting word with ID: $id")
        
        // Delete the word
        return wordRepository.deleteById(id)
    }

}
