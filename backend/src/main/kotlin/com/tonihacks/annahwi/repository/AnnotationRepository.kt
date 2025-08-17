package com.tonihacks.annahwi.repository

import com.tonihacks.annahwi.entity.Annotation
import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import io.quarkus.panache.common.Page
import io.quarkus.panache.common.Parameters
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
     * Find an annotation by its ID with text and linked words eagerly loaded
     */
    fun findByIdWithTextAndWords(id: UUID): Annotation? {
        val annotation = getEntityManager()
            .createQuery(
                """SELECT DISTINCT a FROM Annotation a 
                   JOIN FETCH a.text t 
                   LEFT JOIN FETCH a.annotationWords aw 
                   LEFT JOIN FETCH aw.word w 
                   LEFT JOIN FETCH w.arabicRoot ar 
                   WHERE a.id = :id""",
                Annotation::class.java
            )
            .setParameter("id", id)
            .resultStream
            .findFirst()
            .orElse(null)
            
        // If annotation found, fetch dictionary links for linked words
        if (annotation != null && annotation.annotationWords.isNotEmpty()) {
            val wordIds = annotation.annotationWords.map { it.word.id!! }
            getEntityManager()
                .createQuery(
                    """SELECT DISTINCT w FROM Word w 
                       LEFT JOIN FETCH w.dictionaryLinks dl 
                       WHERE w.id IN :wordIds""",
                    com.tonihacks.annahwi.entity.Word::class.java
                )
                .setParameter("wordIds", wordIds)
                .resultList
        }
        
        return annotation
    }

    /**
     * Find annotations by text ID with text data fetched to avoid N+1 queries
     */
    fun findByTextIdWithText(textId: UUID, page: Page): List<Annotation> {
        val annotations = getEntityManager()
            .createQuery(
                """SELECT DISTINCT a FROM Annotation a 
                   JOIN FETCH a.text t 
                   LEFT JOIN FETCH a.annotationWords aw 
                   LEFT JOIN FETCH aw.word w 
                   LEFT JOIN FETCH w.arabicRoot ar 
                   WHERE t.id = :textId 
                   ORDER BY a.createdAt DESC""",
                Annotation::class.java
            )
            .setParameter("textId", textId)
            .setFirstResult(page.index * page.size)
            .setMaxResults(page.size)
            .resultList
            
        // Fetch dictionary links for all linked words in a separate query
        val allWordIds = annotations.flatMap { annotation -> 
            annotation.annotationWords.map { it.word.id!! } 
        }.distinct()
        
        if (allWordIds.isNotEmpty()) {
            getEntityManager()
                .createQuery(
                    """SELECT DISTINCT w FROM Word w 
                       LEFT JOIN FETCH w.dictionaryLinks dl 
                       WHERE w.id IN :wordIds""",
                    com.tonihacks.annahwi.entity.Word::class.java
                )
                .setParameter("wordIds", allWordIds)
                .resultList
        }
        
        return annotations
    }

    /**
     * Find annotations by needsReview flag with text data fetched
     */
    fun findByNeedsReviewWithText(needsReview: Boolean, page: Page): List<Annotation> {
        val annotations = getEntityManager()
            .createQuery(
                """SELECT DISTINCT a FROM Annotation a 
                   JOIN FETCH a.text t 
                   LEFT JOIN FETCH a.annotationWords aw 
                   LEFT JOIN FETCH aw.word w 
                   LEFT JOIN FETCH w.arabicRoot ar 
                   WHERE a.needsReview = :needsReview 
                   ORDER BY a.createdAt""",
                Annotation::class.java
            )
            .setParameter("needsReview", needsReview)
            .setFirstResult(page.index * page.size)
            .setMaxResults(page.size)
            .resultList
            
        // Fetch dictionary links for all linked words in a separate query
        val allWordIds = annotations.flatMap { annotation -> 
            annotation.annotationWords.map { it.word.id!! } 
        }.distinct()
        
        if (allWordIds.isNotEmpty()) {
            getEntityManager()
                .createQuery(
                    """SELECT DISTINCT w FROM Word w 
                       LEFT JOIN FETCH w.dictionaryLinks dl 
                       WHERE w.id IN :wordIds""",
                    com.tonihacks.annahwi.entity.Word::class.java
                )
                .setParameter("wordIds", allWordIds)
                .resultList
        }
        
        return annotations
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
     * Find all annotations with text data and linked words fetched
     */
    fun findAllWithTextAndWords(page: Page, sort: String): List<Annotation> {
        val annotations = getEntityManager()
            .createQuery(
                """SELECT DISTINCT a FROM Annotation a 
                   JOIN FETCH a.text t 
                   LEFT JOIN FETCH a.annotationWords aw 
                   LEFT JOIN FETCH aw.word w 
                   LEFT JOIN FETCH w.arabicRoot ar 
                   ORDER BY a.$sort""",
                Annotation::class.java
            )
            .setFirstResult(page.index * page.size)
            .setMaxResults(page.size)
            .resultList
            
        // Fetch dictionary links for all linked words in a separate query
        val allWordIds = annotations.flatMap { annotation -> 
            annotation.annotationWords.map { it.word.id!! } 
        }.distinct()
        
        if (allWordIds.isNotEmpty()) {
            getEntityManager()
                .createQuery(
                    """SELECT DISTINCT w FROM Word w 
                       LEFT JOIN FETCH w.dictionaryLinks dl 
                       WHERE w.id IN :wordIds""",
                    com.tonihacks.annahwi.entity.Word::class.java
                )
                .setParameter("wordIds", allWordIds)
                .resultList
        }
        
        return annotations
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
