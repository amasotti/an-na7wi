package com.tonihacks.annahwi.entity

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import io.quarkus.hibernate.orm.panache.kotlin.PanacheEntityBase
import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "word_alignments")
class WordAlignment : PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    lateinit var id: UUID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sentence_id", nullable = false)
    @JsonIgnoreProperties("alignments")
    lateinit var sentence: InterlinearSentence

    @Column(name = "arabic_tokens", columnDefinition = "TEXT", nullable = false)
    lateinit var arabicTokens: String

    @Column(name = "transliteration_tokens", columnDefinition = "TEXT", nullable = false)
    lateinit var transliterationTokens: String

    @Column(name = "translation_tokens", columnDefinition = "TEXT", nullable = false)
    lateinit var translationTokens: String

    @Column(name = "token_order", nullable = false)
    var tokenOrder: Int = 0

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vocabulary_word_id")
    var vocabularyWord: Word? = null

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
