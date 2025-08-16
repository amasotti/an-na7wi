package com.tonihacks.annahwi.repository

import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Difficulty
import com.tonihacks.annahwi.entity.MasteryLevel
import com.tonihacks.annahwi.entity.PartOfSpeech
import com.tonihacks.annahwi.entity.Word
import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import io.quarkus.panache.common.Page
import io.quarkus.panache.common.Parameters
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped
import java.util.*

/**
 * Repository for Word entity
 */
@ApplicationScoped
class WordRepository : PanacheRepository<Word> {
    
    /**
     * Find a word by its ID
     */
    fun findById(id: UUID): Word? {
        return find("id", id).firstResult()
    }
    
    /**
     * Find words by Arabic text (exact match)
     */
    fun findByArabic(arabic: String): Word? {
        return find("arabic", arabic)
            .firstResult()
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
     * Search words by translation or transliteration (case-insensitive)
     */
    fun searchByTranslation(query: String, page: Page, sort: Sort = Sort.by("arabic")): List<Word> {
        return find("LOWER(translation) LIKE LOWER(:query) OR LOWER(transliteration) LIKE LOWER(:query)", 
            Parameters.with("query", "%$query%"))
            .page(page)
            .list()
    }
    
    /**
     * Find all words with optional filters
     */
    fun findAllWithFilters(
        page: Page,
        sortField: String = "arabic",
        difficulty: Difficulty? = null,
        dialect: Dialect? = null,
        partOfSpeech: PartOfSpeech? = null,
        masteryLevel: MasteryLevel? = null,
        verified: Boolean? = null
    ): List<Word> {
        val conditions = mutableListOf<String>()
        val params = Parameters()
        
        difficulty?.let {
            conditions.add("difficulty = :difficulty")
            params.and("difficulty", it)
        }
        
        dialect?.let {
            conditions.add("dialect = :dialect")
            params.and("dialect", it)
        }
        
        partOfSpeech?.let {
            conditions.add("partOfSpeech = :partOfSpeech")
            params.and("partOfSpeech", it)
        }
        
        masteryLevel?.let {
            conditions.add("masteryLevel = :masteryLevel")
            params.and("masteryLevel", it)
        }
        
        verified?.let {
            conditions.add("isVerified = :verified")
            params.and("verified", it)
        }
        
        val query = if (conditions.isNotEmpty()) {
            conditions.joinToString(" AND ")
        } else {
            "" // No conditions means return all
        }
        
        val sort = Sort.by(sortField)
        
        return if (query.isEmpty()) {
            findAll(sort).page(page).list()
        } else {
            find(query, sort, params).page(page).list()
        }
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
        val conditions = mutableListOf<String>()
        val params = Parameters()
        
        difficulty?.let {
            conditions.add("difficulty = :difficulty")
            params.and("difficulty", it)
        }
        
        dialect?.let {
            conditions.add("dialect = :dialect")
            params.and("dialect", it)
        }
        
        partOfSpeech?.let {
            conditions.add("partOfSpeech = :partOfSpeech")
            params.and("partOfSpeech", it)
        }
        
        masteryLevel?.let {
            conditions.add("masteryLevel = :masteryLevel")
            params.and("masteryLevel", it)
        }
        
        verified?.let {
            conditions.add("isVerified = :verified")
            params.and("verified", it)
        }
        
        val query = if (conditions.isNotEmpty()) {
            conditions.joinToString(" AND ")
        } else {
            "" // No conditions means count all
        }
        
        return if (query.isEmpty()) {
            count()
        } else {
            count(query, params)
        }
    }

    /**
     * Delete a word by its ID
     */
    fun deleteById(id: UUID): Boolean {
        return delete("id", id) > 0
    }
}
