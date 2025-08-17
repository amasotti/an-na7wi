package com.tonihacks.annahwi.entity

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import io.quarkus.hibernate.orm.panache.kotlin.PanacheEntityBase
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.PrePersist
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(
    name = "annotation_words",
    uniqueConstraints = [
        UniqueConstraint(name = "uk_annotation_words", columnNames = ["annotation_id", "word_id", "text_id"])
    ]
)
class AnnotationWord : PanacheEntityBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "annotation_id", nullable = false)
    @JsonIgnoreProperties("linkedWords")
    lateinit var annotation: Annotation
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "word_id", nullable = false)
    @JsonIgnoreProperties("annotations")
    lateinit var word: Word
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "text_id", nullable = false)
    @JsonIgnoreProperties("annotations")
    lateinit var text: Text
    
    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now()
    
    @PrePersist
    fun prePersist() {
        createdAt = LocalDateTime.now()
    }
}
