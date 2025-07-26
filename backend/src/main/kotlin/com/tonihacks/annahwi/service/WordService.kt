package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Difficulty
import com.tonihacks.annahwi.entity.PartOfSpeech
import com.tonihacks.annahwi.entity.Word
import com.tonihacks.annahwi.repository.TextWordRepository
import com.tonihacks.annahwi.repository.WordRepository
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
 * Service for managing words
 */
@ApplicationScoped
class WordService {
    
    @Inject
    lateinit var wordRepository: WordRepository
    
    @Inject
    lateinit var textWordRepository: TextWordRepository
    
    private val logger = Logger.getLogger(WordService::class.java)
    
    /**
     * Find all words with pagination
     */
    fun findAll(page: Int, size: Int, sortField: String = "arabic"): List<Word> {
        logger.info("Finding all words, page: $page, size: $size, sortField: $sortField")
        return wordRepository.findAll(Sort.by(sortField)).page(Page.of(page, size)).list()
    }
    
    /**
     * Find a word by its ID
     */
    fun findById(id: UUID): Word {
        logger.info("Finding word by ID: $id")
        return wordRepository.findById(id)
            ?: throw NotFoundException("Word with ID $id not found")
    }
    
    /**
     * Find a word by Arabic text (exact match)
     */
    fun findByArabic(arabic: String): Optional<Word> {
        logger.info("Finding word by Arabic text: $arabic")
        return wordRepository.findByArabic(arabic)
            .let { Optional.ofNullable(it) }
    }
    
    /**
     * Find or create a word by Arabic text
     */
    @Transactional
    fun findOrCreateByArabic(arabic: String): Word {
        logger.info("Finding or creating word by Arabic text: $arabic")
        
        val existingWord = findByArabic(arabic)
        if (existingWord.isPresent) {
            return existingWord.get()
        }
        
        // Create a new word with default values
        val word = Word().apply {
            this.arabic = arabic
            this.difficulty = Difficulty.BEGINNER // Default difficulty
            this.dialect = Dialect.MSA // Default dialect (Modern Standard Arabic)
            this.frequency = 1 // Initial frequency
            this.createdAt = LocalDateTime.now()
        }
        
        wordRepository.persist(word)
        return word
    }
    
    /**
     * Search words by Arabic text (partial match)
     */
    fun searchByArabic(arabic: String, page: Int, size: Int): List<Word> {
        logger.info("Searching words by Arabic text: $arabic, page: $page, size: $size")
        return wordRepository.searchByArabic(arabic, Page.of(page, size))
    }
    
    /**
     * Find words by root
     */
    fun findByRoot(root: String, page: Int, size: Int): List<Word> {
        logger.info("Finding words by root: $root, page: $page, size: $size")
        return wordRepository.findByRoot(root, Page.of(page, size))
    }
    
    /**
     * Find words by part of speech
     */
    fun findByPartOfSpeech(partOfSpeech: PartOfSpeech, page: Int, size: Int): List<Word> {
        logger.info("Finding words by part of speech: $partOfSpeech, page: $page, size: $size")
        return wordRepository.findByPartOfSpeech(partOfSpeech, Page.of(page, size))
    }
    
    /**
     * Find words by dialect
     */
    fun findByDialect(dialect: Dialect, page: Int, size: Int): List<Word> {
        logger.info("Finding words by dialect: $dialect, page: $page, size: $size")
        return wordRepository.findByDialect(dialect, Page.of(page, size))
    }
    
    /**
     * Find words by difficulty
     */
    fun findByDifficulty(difficulty: Difficulty, page: Int, size: Int): List<Word> {
        logger.info("Finding words by difficulty: $difficulty, page: $page, size: $size")
        return wordRepository.findByDifficulty(difficulty, Page.of(page, size))
    }
    
    /**
     * Find verified words
     */
    fun findVerified(page: Int, size: Int): List<Word> {
        logger.info("Finding verified words, page: $page, size: $size")
        return wordRepository.findVerified(Page.of(page, size))
    }
    
    /**
     * Search words by translation or transliteration
     */
    fun searchByTranslation(query: String, page: Int, size: Int): List<Word> {
        logger.info("Searching words by translation or transliteration: $query, page: $page, size: $size")
        return wordRepository.searchByTranslation(query, Page.of(page, size))
    }
    
    /**
     * Find most frequent words
     */
    fun findMostFrequent(limit: Int): List<Word> {
        logger.info("Finding most frequent words, limit: $limit")
        return wordRepository.findMostFrequent(limit)
    }
    
    /**
     * Create a new word
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
     * Update an existing word
     */
    @Transactional
    fun update(id: UUID, word: Word): Word {
        logger.info("Updating word with ID: $id")
        
        val existingWord = findById(id)
        
        // Update fields
        existingWord.arabic = word.arabic
        existingWord.transliteration = word.transliteration
        existingWord.translation = word.translation
        existingWord.root = word.root
        existingWord.partOfSpeech = word.partOfSpeech
        existingWord.notes = word.notes
        existingWord.difficulty = word.difficulty
        existingWord.dialect = word.dialect
        existingWord.isVerified = word.isVerified
        
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
        
        // Delete related text-word relationships
        textWordRepository.deleteByWordId(id)
        
        // Delete the word
        return wordRepository.deleteById(id)
    }
    
    /**
     * Increment the frequency of a word
     */
    @Transactional
    fun incrementFrequency(id: UUID): Word {
        logger.info("Incrementing frequency of word with ID: $id")
        
        val word = findById(id)
        word.frequency++
        
        wordRepository.persist(word)
        
        return word
    }
}
