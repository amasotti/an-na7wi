package com.tonihacks.annahwi.entity

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import io.quarkus.hibernate.orm.panache.kotlin.PanacheEntityBase
import jakarta.persistence.*
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
    lateinit var id: UUID
    
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
    
    @Column(name = "word_count", nullable = false)
    var wordCount: Int = 0
    
    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now()
    
    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
    
    @Column(name = "comments", columnDefinition = "TEXT")
    var comments: String? = null
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_version")
    var currentVersion: TextVersion? = null
    
    @OneToMany(mappedBy = "text", cascade = [CascadeType.ALL], orphanRemoval = true)
    @JsonIgnoreProperties("text")
    var annotations: MutableList<Annotation> = mutableListOf()
    
    @PrePersist
    fun prePersist() {
        createdAt = LocalDateTime.now()
        updatedAt = LocalDateTime.now()
    }
    
    @PreUpdate
    fun preUpdate() {
        updatedAt = LocalDateTime.now()
    }

    companion object {
        fun toJsonObject(text: Text, objectMapper: ObjectMapper): JsonNode {
            val filtered = mapOf(
                "title" to text.title,
                "arabicContent" to text.arabicContent,
                "transliteration" to text.transliteration,
                "translation" to text.translation,
                "tags" to text.tags,
                "difficulty" to text.difficulty,
                "dialect" to text.dialect,
                "wordCount" to text.wordCount,
                "comments" to text.comments,
            )
            return objectMapper.valueToTree(filtered)
        }
    }
}
