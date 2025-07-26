package com.tonihacks.annahwi.repository

import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Difficulty
import com.tonihacks.annahwi.entity.PartOfSpeech
import com.tonihacks.annahwi.entity.Word
import io.quarkus.hibernate.orm.panache.PanacheRepository
import io.quarkus.panache.common.Page
import io.quarkus.panache.common.Parameters
import io.quarkus.panache.common.Sort
import java.util.*
import javax.enterprise.context.ApplicationScoped

/**
 * Repository for Word entity
 */
@ApplicationScoped
class WordRepository : PanacheRepository<Word> {
    
    /**
     * Find a word by its ID
     */
    fun findByIdOptional(id: UUID): Optional<Word> {
        return find("id", id).firstResultOptional()
    }
    
    /**
     * Find words by Arabic text (exact match)
     */
    fun findByArabic(arabic: String): Optional<Word> {
        return find("arabic", arabic).firstResultOptional()
    }
    
    /**
     * Find words by Arabic text (case-insensitive, partial match)
     */
    fun searchByArabic(arabic: String, page: Page, sort: Sort = Sort.by("arabic")): List<Word> {
        return find("LOWER(arabic) LIKE LOWER(:arabic)", 
            Parameters.with("arabic", "%$arabic%"))
            .page(page)
            .list()
    }
    
    /**
     * Find words by root
     */
    fun findByRoot(root: String, page: Page, sort: Sort = Sort.by("arabic")): List<Word> {
        return find("root = :root", 
            Parameters.with("root", root))
            .page(page)
            .list()
    }
    
    /**
     * Find words by part of speech
     */
    fun findByPartOfSpeech(partOfSpeech: PartOfSpeech, page: Page, sort: Sort = Sort.by("arabic")): List<Word> {
        return find("partOfSpeech", sort, partOfSpeech)
            .page(page)
            .list()
    }
    
    /**
     * Find words by dialect
     */
    fun findByDialect(dialect: Dialect, page: Page, sort: Sort = Sort.by("arabic")): List<Word> {
        return find("dialect", sort, dialect)
            .page(page)
            .list()
    }
    
    /**
     * Find words by difficulty
     */
    fun findByDifficulty(difficulty: Difficulty, page: Page, sort: Sort = Sort.by("arabic")): List<Word> {
        return find("difficulty", sort, difficulty)
            .page(page)
            .list()
    }
    
    /**
     * Find verified words
     */
    fun findVerified(page: Page, sort: Sort = Sort.by("arabic")): List<Word> {
        return find("isVerified = true", sort)
            .page(page)
            .list()
    }
    
    /**
     * Search words by translation or transliteration (case-insensitive)
     */
    fun searchByTranslation(query: String, page: Page, sort: Sort = Sort.by("arabic")): List<Word> {
        return find("LOWER(translation) LIKE LOWER(:query) OR LOWER(transliteration) LIKE LOWER(:query)", 
            Parameters.with("query", "%$query%"))
            .page(page)
            .list()
    }
    
    /**
     * Find words with highest frequency
     */
    fun findMostFrequent(limit: Int): List<Word> {
        return find("ORDER BY frequency DESC")
            .page(0, limit)
            .list()
    }
}
