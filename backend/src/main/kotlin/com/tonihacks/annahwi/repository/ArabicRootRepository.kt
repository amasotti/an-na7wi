package com.tonihacks.annahwi.repository

import com.tonihacks.annahwi.entity.ArabicRoot
import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import io.quarkus.panache.common.Page
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped

/**
 * Repository for ArabicRoot entity operations
 */
@ApplicationScoped
class ArabicRootRepository : PanacheRepository<ArabicRoot> {
    
    /**
     * Find root by normalized form
     */
    fun findByNormalizedForm(normalizedForm: String): ArabicRoot? {
        return find("normalizedForm", normalizedForm).firstResult()
    }
    
    /**
     * Find roots by letter count with pagination
     */
    fun findByLetterCount(letterCount: Int, page: Page, sort: Sort = Sort.by("displayForm")): List<ArabicRoot> {
        return find("letterCount = ?1", sort, letterCount).page(page).list()
    }
    
    /**
     * Search roots by display form (partial match)
     */
    fun searchByDisplayForm(query: String, page: Page, sort: Sort = Sort.by("displayForm")): List<ArabicRoot> {
        return find("displayForm like ?1", sort, "%$query%").page(page).list()
    }
    
    /**
     * Search roots by normalized form (partial match)
     */
    fun searchByNormalizedForm(query: String, page: Page, sort: Sort = Sort.by("displayForm")): List<ArabicRoot> {
        return find("normalizedForm like ?1", sort, "%$query%").page(page).list()
    }

  fun searchByMeaning(query: String, page: Page, sort: Sort = Sort.by("displayForm")): List<ArabicRoot> {
        return find("meaning like ?1", sort, "%$query%").page(page).list()
    }
    
    /**
     * Find all roots with pagination and sorting
     */
    fun findAllPaginated(page: Page, sort: Sort = Sort.by("displayForm")): List<ArabicRoot> {
        return findAll(sort).page(page).list()
    }
    
    /**
     * Count roots by letter count
     */
    fun countByLetterCount(letterCount: Int): Long {
        return count("letterCount", letterCount)
    }
    
    /**
     * Find roots that contain specific letters (JSONB array search)
     */
    fun findRootsContainingLetters(letters: List<String>, page: Page, sort: Sort = Sort.by("displayForm")): List<ArabicRoot> {
        val letterQueries = letters.map { "letters @> '[\"$it\"]'" }
        val whereClause = letterQueries.joinToString(" AND ")
        return find(whereClause, sort).page(page).list()
    }
    
    
    /**
     * Get root statistics
     */
    fun getRootStatistics(): Map<String, Any> {
        val totalRoots = count()
        val triLiteralCount = count("letterCount", 3)
        val quadriLiteralCount = count("letterCount", 4)
        val quinqueLiteralCount = count("letterCount", 5)
        
        return mapOf(
            "totalRoots" to totalRoots,
            "triLiteral" to triLiteralCount,
            "quadriLiteral" to quadriLiteralCount,
            "quinqueLiteral" to quinqueLiteralCount
        )
    }
    
    /**
     * Check if a normalized form already exists
     */
    fun existsByNormalizedForm(normalizedForm: String): Boolean {
        return count("normalizedForm", normalizedForm) > 0
    }
    
    /**
     * Get word count for a specific root
     */
    fun getWordCountForRoot(rootId: java.util.UUID): Int {
        return getEntityManager()
            .createQuery("SELECT COUNT(w) FROM Word w WHERE w.arabicRoot.id = :rootId", Long::class.java)
            .setParameter("rootId", rootId)
            .singleResult.toInt()
    }
}
