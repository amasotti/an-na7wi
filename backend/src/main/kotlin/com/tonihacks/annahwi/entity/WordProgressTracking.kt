package com.tonihacks.annahwi.entity

import io.quarkus.hibernate.orm.panache.kotlin.PanacheEntityBase
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToOne
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "word_progress_tracking")
class WordProgressTracking : PanacheEntityBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "word_id", nullable = false, unique = true)
    lateinit var word: Word
    
    @Column(name = "consecutive_correct", nullable = false)
    var consecutiveCorrect: Int = 0
    
    @Column(name = "total_attempts", nullable = false)
    var totalAttempts: Int = 0
    
    @Column(name = "total_correct", nullable = false)
    var totalCorrect: Int = 0
    
    @Column(name = "last_reviewed_at")
    var lastReviewedAt: LocalDateTime? = null
    
    @Column(name = "mastery_level_updated_at")
    var masteryLevelUpdatedAt: LocalDateTime? = null
    
    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now()
    
    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
    
    @PrePersist
    fun prePersist() {
        createdAt = LocalDateTime.now()
        updatedAt = LocalDateTime.now()
    }
    
    @PreUpdate
    fun preUpdate() {
        updatedAt = LocalDateTime.now()
    }
}
