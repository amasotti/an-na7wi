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
import jakarta.persistence.Table
import java.util.UUID

/**
 * Represents the junction table between Text and Word entities
 * Stores the position of each word in a text and provides context for context-aware learning
 */
@Entity
@Table(name = "text_words")
class TextWord : PanacheEntityBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "text_id", nullable = false)
    @JsonIgnoreProperties("annotations", "textWords")
    lateinit var text: Text
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "word_id", nullable = false)
    @JsonIgnoreProperties("textWords")
    lateinit var word: Word
    
    @Column(name = "position", nullable = false)
    var position: Int = 0
    
    @Column(name = "context")
    var context: String? = null
    
    /**
     * Creates a TextWord with the given text, word, position, and context
     */
    constructor()
    
    constructor(text: Text, word: Word, position: Int, context: String? = null) {
        this.text = text
        this.word = word
        this.position = position
        this.context = context
    }
}
