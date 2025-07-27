package com.tonihacks.annahwi.repository

import com.tonihacks.annahwi.entity.TextVersion
import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped
import java.util.UUID

@ApplicationScoped
class TextVersionRepository : PanacheRepository<TextVersion> {
    
    fun findByTextId(textId: UUID): List<TextVersion> {
        val sortingParam = Sort.by("versionNumber").descending()
        return list("textId = ?1", sortingParam, textId)
    }
    
    fun findByTextIdAndVersionNumber(textId: UUID, versionNumber: Int): TextVersion? {
        return find("textId = ?1 AND versionNumber = ?2", textId, versionNumber).firstResult()
    }

    fun findById(id: UUID): TextVersion? {
        return find("id", id)
            .firstResult()
    }
}
