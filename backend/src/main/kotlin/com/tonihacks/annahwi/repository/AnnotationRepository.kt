package com.tonihacks.annahwi.repository

import com.tonihacks.annahwi.entity.Annotation
import com.tonihacks.annahwi.entity.AnnotationType
import io.quarkus.hibernate.orm.panache.PanacheRepository
import io.quarkus.panache.common.Page
import io.quarkus.panache.common.Parameters
import io.quarkus.panache.common.Sort
import java.util.*
import javax.enterprise.context.ApplicationScoped

/**
 * Repository for Annotation entity
 */
@ApplicationScoped
class AnnotationRepository : PanacheRepository<Annotation> {
    
    /**
     * Find an annotation by its ID
     */
    fun findByIdOptional(id: UUID): Optional<Annotation> {
        return find("id", id).firstResultOptional()
    }
    
    /**
     * Find annotations by text ID
     */
    fun findByTextId(textId: UUID, page: Page, sort: Sort = Sort.by("positionStart")): List<Annotation> {
        return find("text.id", sort, textId)
            .page(page)
            .list()
    }
    
    /**
     * Find annotations by type
     */
    fun findByType(type: AnnotationType, page: Page, sort: Sort = Sort.by("positionStart")): List<Annotation> {
        return find("type", sort, type)
            .page(page)
            .list()
    }
    
    /**
     * Find annotations by text ID and type
     */
    fun findByTextIdAndType(textId: UUID, type: AnnotationType, page: Page, sort: Sort = Sort.by("positionStart")): List<Annotation> {
        return find("text.id = :textId AND type = :type", 
            Parameters.with("textId", textId).and("type", type))
            .page(page)
            .list()
    }
    
    /**
     * Find annotations by position range
     */
    fun findByPositionRange(textId: UUID, startPosition: Int, endPosition: Int, page: Page): List<Annotation> {
        return find("text.id = :textId AND ((positionStart >= :startPosition AND positionStart <= :endPosition) OR (positionEnd >= :startPosition AND positionEnd <= :endPosition))", 
            Parameters.with("textId", textId)
                .and("startPosition", startPosition)
                .and("endPosition", endPosition))
            .page(page)
            .list()
    }
    
    /**
     * Search annotations by content (case-insensitive)
     */
    fun searchByContent(query: String, page: Page, sort: Sort = Sort.by("positionStart")): List<Annotation> {
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
}
