package com.tonihacks.annahwi.entity


import io.quarkus.hibernate.orm.panache.PanacheEntityBase
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.PrePersist
import jakarta.persistence.Table
import java.time.LocalDateTime
import java.util.UUID


/**
 * Represents an annotation on a text
 */
@Entity
@Table(name = "annotations")
class Annotation : PanacheEntityBase() {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "text_id", nullable = false)
    lateinit var text: Text
    
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    lateinit var content: String
    
    @Column(name = "position_start", nullable = false)
    var positionStart: Int = 0
    
    @Column(name = "position_end", nullable = false)
    var positionEnd: Int = 0
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    lateinit var type: AnnotationType
    
    @Column(name = "color")
    var color: String? = null
    
    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now()
    
    @PrePersist
    fun prePersist() {
        createdAt = LocalDateTime.now()
    }
}
