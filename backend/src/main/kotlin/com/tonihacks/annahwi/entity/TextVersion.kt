package com.tonihacks.annahwi.entity

import io.quarkus.hibernate.orm.panache.kotlin.PanacheEntityBase
import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "text_versions")
class TextVersion : PanacheEntityBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null
    
    @Column(name = "text_id", nullable = false)
    lateinit var textId: UUID
    
    @Column(name = "version_number", nullable = false)
    var versionNumber: Int = 1
    
    @Column(name = "title", length = 255, nullable = false)
    lateinit var title: String
    
    @Column(name = "arabic_content", columnDefinition = "TEXT", nullable = false)
    lateinit var arabicContent: String
    
    @Column(name = "transliteration", columnDefinition = "TEXT")
    var transliteration: String? = null
    
    @Column(name = "translation", columnDefinition = "TEXT")
    var translation: String? = null
    
    @Column(name = "comments", columnDefinition = "TEXT")
    var comments: String? = null
    
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
