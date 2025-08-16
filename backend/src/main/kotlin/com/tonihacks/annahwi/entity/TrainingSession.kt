package com.tonihacks.annahwi.entity

import io.quarkus.hibernate.orm.panache.kotlin.PanacheEntityBase
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.PrePersist
import jakarta.persistence.Table
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "training_sessions")
class TrainingSession : PanacheEntityBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null
    
    @Column(name = "session_type", nullable = false)
    var sessionType: String = "FLASHCARD"
    
    @Enumerated(EnumType.STRING)
    @Column(name = "review_mode", nullable = false)
    lateinit var reviewMode: ReviewMode
    
    @Column(name = "started_at", nullable = false)
    var startedAt: LocalDateTime = LocalDateTime.now()
    
    @Column(name = "completed_at")
    var completedAt: LocalDateTime? = null
    
    @Column(name = "total_words", nullable = false)
    var totalWords: Int = 0
    
    @Column(name = "correct_answers", nullable = false)
    var correctAnswers: Int = 0
    
    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now()
    
    @OneToMany(mappedBy = "trainingSession", fetch = FetchType.LAZY, cascade = [CascadeType.ALL], orphanRemoval = true)
    var results: MutableList<TrainingSessionResult> = mutableListOf()
    
    @OneToMany(mappedBy = "trainingSession", fetch = FetchType.LAZY, cascade = [CascadeType.ALL], orphanRemoval = true)
    var sessionWords: MutableList<TrainingSessionWord> = mutableListOf()
    
    @PrePersist
    fun prePersist() {
        createdAt = LocalDateTime.now()
        startedAt = LocalDateTime.now()
    }
}
