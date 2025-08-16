package com.tonihacks.annahwi.repository

import com.tonihacks.annahwi.entity.TrainingSession
import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import java.util.UUID

@ApplicationScoped
class TrainingSessionRepository : PanacheRepository<TrainingSession> {
    
    fun findById(id: UUID): TrainingSession? {
        return find("id", id).firstResult()
    }
}
