package com.tonihacks.annahwi.repository

import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Difficulty
import com.tonihacks.annahwi.entity.Text
import io.quarkus.hibernate.orm.panache.PanacheRepository
import io.quarkus.panache.common.Page
import io.quarkus.panache.common.Parameters
import io.quarkus.panache.common.Sort
import java.util.*
import javax.enterprise.context.ApplicationScoped

/**
 * Repository for Text entity
 */
@ApplicationScoped
class TextRepository : PanacheRepository<Text> {
    
    /**
     * Find a text by its ID
     */
    fun findByIdOptional(id: UUID): Optional<Text> {
        return find("id", id).firstResultOptional()
    }
    
    /**
     * Find texts by title (case-insensitive)
     */
    fun findByTitle(title: String, page: Page, sort: Sort = Sort.by("title")): List<Text> {
        return find("LOWER(title) LIKE LOWER(:title)", 
            Parameters.with("title", "%$title%"))
            .page(page)
            .list()
    }
    
    /**
     * Find texts by dialect
     */
    fun findByDialect(dialect: Dialect, page: Page, sort: Sort = Sort.by("title")): List<Text> {
        return find("dialect", sort, dialect)
            .page(page)
            .list()
    }
    
    /**
     * Find texts by difficulty
     */
    fun findByDifficulty(difficulty: Difficulty, page: Page, sort: Sort = Sort.by("title")): List<Text> {
        return find("difficulty", sort, difficulty)
            .page(page)
            .list()
    }
    
    /**
     * Find texts by tag
     */
    fun findByTag(tag: String, page: Page, sort: Sort = Sort.by("title")): List<Text> {
        // Note: This is a simplified implementation. In a real application, you would use a JSONB query
        return find("tags LIKE :tag", 
            Parameters.with("tag", "%$tag%"))
            .page(page)
            .list()
    }
    
    /**
     * Find public texts
     */
    fun findPublic(page: Page, sort: Sort = Sort.by("title")): List<Text> {
        return find("isPublic = true", sort)
            .page(page)
            .list()
    }
    
    /**
     * Search texts by content (case-insensitive)
     */
    fun searchByContent(query: String, page: Page, sort: Sort = Sort.by("title")): List<Text> {
        return find("LOWER(arabicContent) LIKE LOWER(:query) OR LOWER(transliteration) LIKE LOWER(:query) OR LOWER(translation) LIKE LOWER(:query)", 
            Parameters.with("query", "%$query%"))
            .page(page)
            .list()
    }
}
