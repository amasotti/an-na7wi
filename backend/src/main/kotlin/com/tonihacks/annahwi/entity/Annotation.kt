package com.tonihacks.annahwi.entity

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
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
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.PrePersist
import jakarta.persistence.Table
import java.time.LocalDateTime
import java.util.UUID


/**
 * Represents an annotation on a text
 */
@Entity
@Table(name = "annotations")
class Annotation : PanacheEntityBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "text_id", nullable = false)
    @JsonIgnoreProperties("annotations")
    lateinit var text: Text
    
    @Column(name = "anchor_text", nullable = false)
    lateinit var anchorText: String
    
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    lateinit var content: String
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    lateinit var type: AnnotationType
    
    @Enumerated(EnumType.STRING)
    @Column(name = "mastery_level", nullable = false)
    var masteryLevel: MasteryLevel = MasteryLevel.NEW
    
    @Column(name = "needs_review", nullable = false)
    var needsReview: Boolean = false
    
    
    @Column(name = "color")
    var color: String? = null
    
    @OneToMany(mappedBy = "annotation", fetch = FetchType.LAZY, cascade = [CascadeType.ALL], orphanRemoval = true)
    var annotationWords: MutableList<AnnotationWord> = mutableListOf()
    
    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now()
    
    @PrePersist
    fun prePersist() {
        createdAt = LocalDateTime.now()
    }
    
    fun getLinkedWords(): List<Word> {
        return annotationWords.map { it.word }
    }

  fun linkWord(word: Word) {
    // Check if word is not already linked
    if (annotationWords.none { it.word.id == word.id }) {
      val annotationWord = AnnotationWord().apply {
        annotation = this@Annotation
        this.word = word
        text = this@Annotation.text  // This ensures text_id is always set
      }
      annotationWords.add(annotationWord)
    }
  }
    
    fun unlinkWord(word: Word) {
        annotationWords.removeIf { it.word.id == word.id }
    }
}
