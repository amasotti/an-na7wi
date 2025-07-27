package com.tonihacks.annahwi.entity

import com.fasterxml.jackson.databind.JsonNode
import io.quarkus.hibernate.orm.panache.kotlin.PanacheEntityBase
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
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

    @Column(name = "content", nullable = false)
    @JdbcTypeCode(SqlTypes.JSON)
    lateinit var content: JsonNode
    
    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now()
    
    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
    
    @Column(name = "is_current", nullable = false)
    var isCurrent: Boolean = false
    
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
