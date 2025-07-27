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
     * Find an annotation by its ID with text data eagerly loaded
     */
    fun findByIdWithText(id: UUID): Annotation? {
        return getEntityManager()
            .createQuery(
                "SELECT a FROM Annotation a JOIN FETCH a.text t WHERE a.id = :id",
                Annotation::class.java
            )
            .setParameter("id", id)
            .resultStream
            .findFirst()
            .orElse(null)
    }

    /**
     * Find annotations by text ID with text data fetched to avoid N+1 queries
     */
    fun findByTextIdWithText(textId: UUID, page: Page): List<Annotation> {
        return getEntityManager()
            .createQuery(
                "SELECT a FROM Annotation a JOIN FETCH a.text t WHERE t.id = :textId ORDER BY a.createdAt DESC",
                Annotation::class.java
            )
            .setParameter("textId", textId)
            .setFirstResult(page.index * page.size)
            .setMaxResults(page.size)
            .resultList
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
     * Find annotations by needsReview flag with text data fetched
     */
    fun findByNeedsReviewWithText(needsReview: Boolean, page: Page): List<Annotation> {
        return getEntityManager()
            .createQuery(
                "SELECT a FROM Annotation a JOIN FETCH a.text t WHERE a.needsReview = :needsReview ORDER BY a.nextReviewDate, a.createdAt",
                Annotation::class.java
            )
            .setParameter("needsReview", needsReview)
            .setFirstResult(page.index * page.size)
            .setMaxResults(page.size)
            .resultList
    }

    /**
     * Find all annotations with text data fetched
     */
    fun findAllWithText(page: Page, sort: String): List<Annotation> {
        return getEntityManager()
            .createQuery(
                "SELECT a FROM Annotation a JOIN FETCH a.text t ORDER BY a.$sort",
                Annotation::class.java
            )
            .setFirstResult(page.index * page.size)
            .setMaxResults(page.size)
            .resultList
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
