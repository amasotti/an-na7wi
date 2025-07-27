package com.tonihacks.annahwi.repository

import com.tonihacks.annahwi.entity.TextVersion
import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped
import java.util.UUID

@ApplicationScoped
class TextVersionRepository : PanacheRepository<TextVersion> {
    
    fun findByTextId(textId: UUID): List<TextVersion> {
        return list("textId = ?1", Sort.by("versionNumber").descending(), textId)
    }
    
    fun findByTextIdAndVersionNumber(textId: UUID, versionNumber: Int): TextVersion? {
        return find("textId = ?1 AND versionNumber = ?2", textId, versionNumber).firstResult()
    }
}
