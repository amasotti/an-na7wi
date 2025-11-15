package com.tonihacks.annahwi.repository

import com.tonihacks.annahwi.entity.InterlinearText
import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import java.util.*

@ApplicationScoped
class InterlinearTextRepository : PanacheRepository<InterlinearText> {

    fun findById(id: UUID): InterlinearText? {
        return find("id", id).firstResult()
    }

    fun deleteById(id: UUID): Boolean {
        return delete("id", id) > 0
    }
}
