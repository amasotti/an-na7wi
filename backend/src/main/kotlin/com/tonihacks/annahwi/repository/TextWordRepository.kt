package com.tonihacks.annahwi.repository

import com.tonihacks.annahwi.entity.TextWord
import io.quarkus.hibernate.orm.panache.PanacheRepository
import io.quarkus.panache.common.Page
import io.quarkus.panache.common.Parameters
import io.quarkus.panache.common.Sort
import java.util.*
import javax.enterprise.context.ApplicationScoped

/**
 * Repository for TextWord entity
 */
@ApplicationScoped
class TextWordRepository : PanacheRepository<TextWord> {
    
    /**
     * Find a text-word relationship by its ID
     */
    fun findByIdOptional(id: UUID): Optional<TextWord> {
        return find("id", id).firstResultOptional()
    }
    
    /**
     * Find text-word relationships by text ID
     */
    fun findByTextId(textId: UUID, page: Page, sort: Sort = Sort.by("position")): List<TextWord> {
        return find("text.id", sort, textId)
            .page(page)
            .list()
    }
    
    /**
     * Find text-word relationships by word ID
     */
    fun findByWordId(wordId: UUID, page: Page, sort: Sort = Sort.by("position")): List<TextWord> {
        return find("word.id", sort, wordId)
            .page(page)
            .list()
    }
    
    /**
     * Find text-word relationships by text ID and word ID
     */
    fun findByTextIdAndWordId(textId: UUID, wordId: UUID): List<TextWord> {
        return find("text.id = :textId AND word.id = :wordId", 
            Parameters.with("textId", textId).and("wordId", wordId))
            .list()
    }
    
    /**
     * Find text-word relationships by position range
     */
    fun findByPositionRange(textId: UUID, startPosition: Int, endPosition: Int, page: Page): List<TextWord> {
        return find("text.id = :textId AND position >= :startPosition AND position <= :endPosition", 
            Parameters.with("textId", textId)
                .and("startPosition", startPosition)
                .and("endPosition", endPosition))
            .page(page)
            .list()
    }
    
    /**
     * Delete text-word relationships by text ID
     */
    fun deleteByTextId(textId: UUID): Long {
        return delete("text.id", textId)
    }
    
    /**
     * Delete text-word relationships by word ID
     */
    fun deleteByWordId(wordId: UUID): Long {
        return delete("word.id", wordId)
    }
}
