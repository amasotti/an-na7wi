package com.tonihacks.annahwi.repository

import com.tonihacks.annahwi.entity.TrainingSessionWord
import com.tonihacks.annahwi.entity.Word
import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import java.util.UUID

@ApplicationScoped
class TrainingSessionWordRepository : PanacheRepository<TrainingSessionWord> {
    
    fun findWordsBySessionId(sessionId: UUID): List<Word> {
        return find("trainingSession.id = ?1 order by wordOrder", sessionId)
            .list()
            .map { it.word }
    }
}
