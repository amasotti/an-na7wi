package com.tonihacks.annahwi.entity

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import io.quarkus.hibernate.orm.panache.kotlin.PanacheEntityBase
import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "interlinear_sentences")
class InterlinearSentence : PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    lateinit var id: UUID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "text_id", nullable = false)
    @JsonIgnoreProperties("sentences")
    lateinit var text: InterlinearText

    @Column(name = "arabic_text", columnDefinition = "TEXT", nullable = false)
    lateinit var arabicText: String

    @Column(name = "transliteration", columnDefinition = "TEXT", nullable = false)
    lateinit var transliteration: String

    @Column(name = "translation", columnDefinition = "TEXT", nullable = false)
    lateinit var translation: String

    @Column(name = "annotations", columnDefinition = "TEXT")
    var annotations: String? = null

    @Column(name = "sentence_order", nullable = false)
    var sentenceOrder: Int = 0

    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now()

    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()

    @OneToMany(mappedBy = "sentence", cascade = [CascadeType.ALL], orphanRemoval = true)
    var alignments: MutableList<WordAlignment> = mutableListOf()

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
