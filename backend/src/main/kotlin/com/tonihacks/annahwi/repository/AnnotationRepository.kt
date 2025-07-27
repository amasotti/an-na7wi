package com.tonihacks.annahwi.repository

import com.tonihacks.annahwi.entity.Annotation
import com.tonihacks.annahwi.entity.AnnotationType
import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import io.quarkus.panache.common.Page
import io.quarkus.panache.common.Parameters
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped
import java.util.*

/**
 * Repository for Annotation entity
 */
@ApplicationScoped
class AnnotationRepository : PanacheRepository<Annotation> {
    
    /**
     * Find an annotation by its ID
     */
    fun findById(id: UUID): Annotation? {
        return find("id", id).firstResult()
    }
    
    /**
     * Find annotations by text ID
     */
    fun findByTextId(textId: UUID, page: Page): List<Annotation> {
        return find("text.id = :textId", Parameters.with("textId", textId))
            .page(page)
            .list()
    }
    
    /**
     * Find annotations by type
     */
    fun findByType(type: AnnotationType, page: Page, sort: String = "createdAt"): List<Annotation> {
        val sortOption = Sort.by(sort)
        return find("type", sortOption, type)
            .page(page)
            .list()
    }
    
    /**
     * Find annotations by text ID and type
     */
    fun findByTextIdAndType(textId: UUID, type: AnnotationType, page: Page): List<Annotation> {
        return find("text.id = :textId AND type = :type", 
            Parameters.with("textId", textId).and("type", type))
            .page(page)
            .list()
    }
    
    /**
     * Find annotations by needsReview flag
     */
    fun findByNeedsReview(needsReview: Boolean, page: Page): List<Annotation> {
        return find("needsReview", Sort.by("nextReviewDate", "createdAt"), needsReview)
            .page(page)
            .list()
    }
    
    /**
     * Search annotations by content (case-insensitive)
     */
    fun searchByContent(query: String, page: Page): List<Annotation> {
        return find("LOWER(content) LIKE LOWER(:query)", 
            Parameters.with("query", "%$query%"))
            .page(page)
            .list()
    }
    
    /**
     * Delete annotations by text ID
     */
    fun deleteByTextId(textId: UUID): Long {
        return delete("text.id", textId)
    }
    
    /**
     * Delete an annotation by its ID
     */
    fun deleteById(id: UUID): Boolean {
        return delete("id", id) > 0
    }
}
