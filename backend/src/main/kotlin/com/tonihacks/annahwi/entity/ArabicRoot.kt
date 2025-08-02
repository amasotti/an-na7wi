package com.tonihacks.annahwi.entity

import io.quarkus.hibernate.orm.panache.kotlin.PanacheEntityBase
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Index
import jakarta.persistence.OneToMany
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.LocalDateTime
import java.util.UUID

/**
 * Represents an Arabic root with normalized storage and display formats
 */
@Entity
@Table(name = "arabic_roots", indexes = [
    Index(name = "idx_arabic_roots_normalized", columnList = "normalized_form"),
    Index(name = "idx_arabic_roots_letter_count", columnList = "letter_count")
])
class ArabicRoot : PanacheEntityBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "letters", nullable = false, columnDefinition = "jsonb")
    lateinit var letters: List<String>
    
    @Column(name = "normalized_form", nullable = false, unique = true, length = 10)
    lateinit var normalizedForm: String
    
    @Column(name = "display_form", nullable = false, length = 20)
    lateinit var displayForm: String
    
    @Column(name = "letter_count", nullable = false)
    var letterCount: Int = 0
    
    @OneToMany(mappedBy = "arabicRoot")
    @com.fasterxml.jackson.annotation.JsonIgnore
    var words: MutableList<Word> = mutableListOf()
    
    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: LocalDateTime = LocalDateTime.now()
    
    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
    
    @PrePersist
    fun prePersist() {
        val now = LocalDateTime.now()
        createdAt = now
        updatedAt = now
        letterCount = letters.size
    }
    
    @PreUpdate
    fun preUpdate() {
        updatedAt = LocalDateTime.now()
        letterCount = letters.size
    }
    
    companion object {
        /**
         * Create a new ArabicRoot from normalized letters
         */
        fun create(letters: List<String>): ArabicRoot {
            val root = ArabicRoot()
            root.letters = letters
            root.normalizedForm = letters.joinToString("")
            root.displayForm = letters.joinToString("-")
            return root
        }
    }
}
