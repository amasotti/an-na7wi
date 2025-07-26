package com.tonihacks.annahwi.entity

import io.quarkus.hibernate.orm.panache.kotlin.PanacheEntityBase
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Index
import jakarta.persistence.OneToMany
import jakarta.persistence.PrePersist
import jakarta.persistence.Table
import java.time.LocalDateTime
import java.util.UUID
/**
 * Represents a word in Arabic with transliteration, translation, and other linguistic information
 */
@Entity
@Table(name = "words", indexes = [
    Index(name = "idx_word_arabic", columnList = "arabic")
])
class Word : PanacheEntityBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null
    
    @Column(name = "arabic", nullable = false)
    lateinit var arabic: String
    
    @Column(name = "transliteration")
    var transliteration: String? = null
    
    @Column(name = "translation")
    var translation: String? = null
    
    @Column(name = "root")
    var root: String? = null
    
    @Enumerated(EnumType.STRING)
    @Column(name = "part_of_speech")
    var partOfSpeech: PartOfSpeech? = null
    
    @Column(name = "notes", columnDefinition = "TEXT")
    var notes: String? = null
    
    @Column(name = "frequency", nullable = false)
    var frequency: Int = 0
    
    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", nullable = false)
    lateinit var difficulty: Difficulty
    
    @Enumerated(EnumType.STRING)
    @Column(name = "dialect", nullable = false)
    lateinit var dialect: Dialect
    
    @Column(name = "is_verified", nullable = false)
    var isVerified: Boolean = false
    
    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now()
    
    @OneToMany(mappedBy = "word", cascade = [CascadeType.ALL], orphanRemoval = true)
    var textWords: MutableList<TextWord> = mutableListOf()
    
    @PrePersist
    fun prePersist() {
        createdAt = LocalDateTime.now()
    }
}
