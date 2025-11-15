package com.tonihacks.annahwi.repository

import com.tonihacks.annahwi.entity.WordAlignment
import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import java.util.*

@ApplicationScoped
class WordAlignmentRepository : PanacheRepository<WordAlignment> {

    fun findById(id: UUID): WordAlignment? {
        return find("id", id).firstResult()
    }

    fun deleteById(id: UUID): Boolean {
        return delete("id", id) > 0
    }
}
