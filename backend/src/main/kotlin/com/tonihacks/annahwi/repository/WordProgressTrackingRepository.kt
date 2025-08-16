package com.tonihacks.annahwi.repository

import com.tonihacks.annahwi.entity.Word
import com.tonihacks.annahwi.entity.WordProgressTracking
import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import java.util.UUID

@ApplicationScoped
class WordProgressTrackingRepository : PanacheRepository<WordProgressTracking> {
    
    fun findByWordId(wordId: UUID): WordProgressTracking? {
        return find("word.id", wordId).firstResult()
    }
    
    fun findOrCreateByWord(word: Word): WordProgressTracking {
        return findByWordId(word.id!!) ?: WordProgressTracking().apply {
            this.word = word
            persist()
        }
    }
}
