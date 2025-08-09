package com.tonihacks.annahwi.entity

import io.quarkus.hibernate.orm.panache.kotlin.PanacheEntityBase
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
import jakarta.persistence.Table
import java.util.UUID

/**
 * Represents a dictionary link associated with a word
 */
@Entity
@Table(name = "dictionary_links")
class DictionaryLink : PanacheEntityBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "word_id", nullable = false)
    lateinit var word: Word
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    lateinit var type: DictionaryType
    
    @Column(name = "url", nullable = false)
    lateinit var url: String
    
    @Column(name = "display_name")
    var displayName: String? = null
}
