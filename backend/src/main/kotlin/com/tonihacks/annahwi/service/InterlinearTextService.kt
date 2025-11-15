package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.entity.InterlinearSentence
import com.tonihacks.annahwi.entity.InterlinearText
import com.tonihacks.annahwi.exception.AppError
import com.tonihacks.annahwi.exception.AppException
import com.tonihacks.annahwi.repository.InterlinearSentenceRepository
import com.tonihacks.annahwi.repository.InterlinearTextRepository
import com.tonihacks.annahwi.util.loggerFor
import io.quarkus.panache.common.Page
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import java.time.LocalDateTime
import java.util.*

@ApplicationScoped
class InterlinearTextService {

    @Inject
    private lateinit var interlinearTextRepository: InterlinearTextRepository

    @Inject
    private lateinit var interlinearSentenceRepository: InterlinearSentenceRepository

    private val logger = loggerFor(InterlinearTextService::class.java)

    @Transactional
    fun findAll(page: Int, size: Int, sortField: String = "title"): List<InterlinearText> {
        logger.info("Finding all interlinear texts, page: $page, size: $size, sortField: $sortField")

        val sortOption = Sort.by(sortField)
        val paginationOption = Page.of(page, size)

        val texts = interlinearTextRepository
            .findAll(sortOption)
            .page(paginationOption)
            .list()

        // Initialize lazy collections to prevent LazyInitializationException
        texts.forEach { text ->
            text.sentences.size
        }

        return texts
    }

    fun countAll(): Long {
        return interlinearTextRepository.count()
    }

    @Transactional
    fun findById(id: UUID): InterlinearText {
        logger.info("Finding interlinear text by ID: $id")
        val text = interlinearTextRepository.findById(id)
            ?: throw AppException(AppError.NotFound.InterlinearText(id.toString()))

        // Initialize lazy collections to prevent LazyInitializationException
        text.sentences.size
        text.sentences.forEach { sentence ->
            sentence.alignments.size
        }

        return text
    }

    @Transactional
    fun create(text: InterlinearText): InterlinearText {
        logger.info("Creating new interlinear text: ${text.title}")

        val now = LocalDateTime.now()
        text.createdAt = now
        text.updatedAt = now

        interlinearTextRepository.persist(text)

        // Initialize lazy collections to prevent LazyInitializationException
        text.sentences.size

        return text
    }

    @Transactional
    fun update(id: UUID, text: InterlinearText): InterlinearText {
        logger.info("Updating interlinear text with ID: $id")

        val existingText = findById(id)

        existingText.title = text.title
        existingText.description = text.description
        existingText.dialect = text.dialect
        existingText.updatedAt = LocalDateTime.now()

        interlinearTextRepository.persist(existingText)

        // Initialize lazy collections to prevent LazyInitializationException
        existingText.sentences.size

        return existingText
    }

    @Transactional
    fun delete(id: UUID): Boolean {
        logger.info("Deleting interlinear text with ID: $id")
        return interlinearTextRepository.deleteById(id)
    }

    @Transactional
    fun addSentence(textId: UUID, sentence: InterlinearSentence): InterlinearSentence {
        logger.info("Adding sentence to interlinear text with ID: $textId")

        val text = findById(textId)
        sentence.text = text
        sentence.createdAt = LocalDateTime.now()
        sentence.updatedAt = LocalDateTime.now()

        interlinearSentenceRepository.persist(sentence)

        // Initialize lazy collections
        sentence.alignments.size

        return sentence
    }

    @Transactional
    fun updateSentence(textId: UUID, sentenceId: UUID, sentence: InterlinearSentence): InterlinearSentence {
        logger.info("Updating sentence $sentenceId in text $textId")

        val existingSentence = interlinearSentenceRepository.findById(sentenceId)
            ?: throw AppException(AppError.NotFound.InterlinearSentence(sentenceId.toString()))

        if (existingSentence.text.id != textId) {
            throw AppException(AppError.NotFound.InterlinearSentence(sentenceId.toString()))
        }

        existingSentence.arabicText = sentence.arabicText
        existingSentence.transliteration = sentence.transliteration
        existingSentence.translation = sentence.translation
        existingSentence.annotations = sentence.annotations
        existingSentence.sentenceOrder = sentence.sentenceOrder
        existingSentence.updatedAt = LocalDateTime.now()

        interlinearSentenceRepository.persist(existingSentence)

        // Initialize lazy collections
        existingSentence.alignments.size

        return existingSentence
    }

    @Transactional
    fun deleteSentence(textId: UUID, sentenceId: UUID): Boolean {
        logger.info("Deleting sentence $sentenceId from text $textId")

        val sentence = interlinearSentenceRepository.findById(sentenceId)
            ?: throw AppException(AppError.NotFound.InterlinearSentence(sentenceId.toString()))

        if (sentence.text.id != textId) {
            throw AppException(AppError.NotFound.InterlinearSentence(sentenceId.toString()))
        }

        return interlinearSentenceRepository.deleteById(sentenceId)
    }

    @Transactional
    fun reorderSentences(textId: UUID, sentenceIds: List<UUID>) {
        logger.info("Reordering ${sentenceIds.size} sentences in text $textId")

        findById(textId) // Verify text exists

        sentenceIds.forEachIndexed { index, sentenceId ->
            val sentence = interlinearSentenceRepository.findById(sentenceId)
                ?: throw AppException(AppError.NotFound.InterlinearSentence(sentenceId.toString()))

            if (sentence.text.id != textId) {
                throw AppException(AppError.NotFound.InterlinearSentence(sentenceId.toString()))
            }

            sentence.sentenceOrder = index
            sentence.updatedAt = LocalDateTime.now()
            interlinearSentenceRepository.persist(sentence)
        }
    }
}
