package com.tonihacks.annahwi.entity

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import io.quarkus.hibernate.orm.panache.kotlin.PanacheEntityBase
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import java.time.LocalDateTime
import java.util.UUID
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes

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
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "tags")
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
    @JsonIgnoreProperties("text")
    var annotations: MutableList<Annotation> = mutableListOf()
    
    @OneToMany(mappedBy = "text", cascade = [CascadeType.ALL], orphanRemoval = true) 
    @JsonIgnoreProperties("text")
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
