package com.tonihacks.annahwi.repository

import com.tonihacks.annahwi.entity.InterlinearSentence
import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import java.util.*

@ApplicationScoped
class InterlinearSentenceRepository : PanacheRepository<InterlinearSentence> {

    fun findById(id: UUID): InterlinearSentence? {
        return find("id", id).firstResult()
    }

    fun deleteById(id: UUID): Boolean {
        return delete("id", id) > 0
    }
}
