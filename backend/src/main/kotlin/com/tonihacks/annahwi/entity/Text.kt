package com.tonihacks.annahwi.entity

import io.quarkus.hibernate.orm.panache.PanacheEntityBase
import java.time.LocalDateTime
import java.util.*
import javax.persistence.*

/**
 * Represents a text in Arabic with transliteration and translation
 */
@Entity
@Table(name = "texts")
class Text : PanacheEntityBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null
    
    @Column(name = "title", length = 255, nullable = false)
    lateinit var title: String
    
    @Column(name = "arabic_content", columnDefinition = "TEXT", nullable = false)
    lateinit var arabicContent: String
    
    @Column(name = "transliteration", columnDefinition = "TEXT")
    var transliteration: String? = null
    
    @Column(name = "translation", columnDefinition = "TEXT")
    var translation: String? = null
    
    @Column(name = "tags", columnDefinition = "jsonb")
    var tags: List<String> = listOf()
    
    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", nullable = false)
    lateinit var difficulty: Difficulty
    
    @Enumerated(EnumType.STRING)
    @Column(name = "dialect", nullable = false)
    lateinit var dialect: Dialect
    
    @Column(name = "is_public", nullable = false)
    var isPublic: Boolean = false
    
    @Column(name = "word_count", nullable = false)
    var wordCount: Int = 0
    
    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now()
    
    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
    
    @OneToMany(mappedBy = "text", cascade = [CascadeType.ALL], orphanRemoval = true)
    var annotations: MutableList<Annotation> = mutableListOf()
    
    @OneToMany(mappedBy = "text", cascade = [CascadeType.ALL], orphanRemoval = true)
    var textWords: MutableList<TextWord> = mutableListOf()
    
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
