package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.dto.request.WordAlignmentRequestDTO
import com.tonihacks.annahwi.entity.InterlinearSentence
import com.tonihacks.annahwi.entity.InterlinearText
import com.tonihacks.annahwi.entity.WordAlignment
import com.tonihacks.annahwi.exception.AppError
import com.tonihacks.annahwi.exception.AppException
import com.tonihacks.annahwi.repository.InterlinearSentenceRepository
import com.tonihacks.annahwi.repository.InterlinearTextRepository
import com.tonihacks.annahwi.repository.WordAlignmentRepository
import com.tonihacks.annahwi.repository.WordRepository
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

    @Inject
    private lateinit var wordAlignmentRepository: WordAlignmentRepository

    @Inject
    private lateinit var wordRepository: WordRepository

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

  @Transactional
  fun tokenize(textId: UUID, sentenceId: UUID) {
    logger.info("Tokenizing sentence $sentenceId in text $textId")

    val sentence = interlinearSentenceRepository.findById(sentenceId)
      ?: throw AppException(AppError.NotFound.InterlinearSentence(sentenceId.toString()))

    require(sentence.text.id == textId) {
      "Sentence $sentenceId does not belong to text $textId"
    }

    logger.warn("This will delete existing alignments for sentence $sentenceId")
    cleanAlignements(textId, sentenceId)

    val arabicTokens = sentence.arabicText.tokenize()
    val transliterationTokens = sentence.transliteration.tokenize().map { it.convertDashes() }
    val translationTokens = sentence.translation.tokenize().map { it.convertDashes() }

    val now = LocalDateTime.now()

    val alignments = arabicTokens.indices.map { i ->
      WordAlignmentRequestDTO(
        arabicTokens = arabicTokens[i],
        transliterationTokens = transliterationTokens.getOrElse(i) { "" },
        translationTokens = translationTokens.getOrElse(i) { "" },
        tokenOrder = i
      ).toEntity().apply {
        this.sentence = sentence
        createdAt = now
        updatedAt = now
      }
    }

    alignments.forEach { it.persist() }
  }

    @Transactional
    fun addAlignment(
      textId: UUID,
      sentenceId: UUID,
      alignment: WordAlignment,
      vocabularyWordId: UUID?): WordAlignment
    {
        logger.info("Adding alignment to sentence $sentenceId in text $textId")

        val sentence = interlinearSentenceRepository.findById(sentenceId)
            ?: throw AppException(AppError.NotFound.InterlinearSentence(sentenceId.toString()))

        if (sentence.text.id != textId) {
            throw AppException(AppError.NotFound.InterlinearSentence(sentenceId.toString()))
        }

        alignment.sentence = sentence
        alignment.createdAt = LocalDateTime.now()
        alignment.updatedAt = LocalDateTime.now()

        if (vocabularyWordId != null) {
            val word = wordRepository.findById(vocabularyWordId)
            if (word != null) {
                alignment.vocabularyWord = word
            } else {
                logger.warn("Word with ID $vocabularyWordId not found, creating alignment without vocabulary link")
            }
        }

        wordAlignmentRepository.persist(alignment)

        return alignment
    }

    @Transactional
    fun updateAlignment(
      textId: UUID,
      sentenceId: UUID,
      alignmentId: UUID,
      alignment: WordAlignment,
      vocabularyWordId: UUID?,
      updateTokenOrder: Boolean = true): WordAlignment
    {
        logger.info("Updating alignment $alignmentId in sentence $sentenceId")

        val existingAlignment = wordAlignmentRepository.findById(alignmentId)
            ?: throw AppException(AppError.NotFound.WordAlignment(alignmentId.toString()))

        if (existingAlignment.sentence.id != sentenceId || existingAlignment.sentence.text.id != textId) {
            throw AppException(AppError.NotFound.WordAlignment(alignmentId.toString()))
        }

        existingAlignment.arabicTokens = alignment.arabicTokens
        existingAlignment.transliterationTokens = alignment.transliterationTokens
        existingAlignment.translationTokens = alignment.translationTokens
        // Only update tokenOrder if explicitly requested
        if (updateTokenOrder) {
            existingAlignment.tokenOrder = alignment.tokenOrder
        }
        existingAlignment.updatedAt = LocalDateTime.now()

        if (vocabularyWordId != null) {
            val word = wordRepository.findById(vocabularyWordId)
            existingAlignment.vocabularyWord = word
        } else {
            existingAlignment.vocabularyWord = null
        }

        wordAlignmentRepository.persist(existingAlignment)

        return existingAlignment
    }

    @Transactional
    fun deleteAlignment(textId: UUID, sentenceId: UUID, alignmentId: UUID): Boolean {
        logger.info("Deleting alignment $alignmentId from sentence $sentenceId")

        val alignment = wordAlignmentRepository.findById(alignmentId)
            ?: throw AppException(AppError.NotFound.WordAlignment(alignmentId.toString()))

        if (alignment.sentence.id != sentenceId || alignment.sentence.text.id != textId) {
            throw AppException(AppError.NotFound.WordAlignment(alignmentId.toString()))
        }

        return wordAlignmentRepository.deleteById(alignmentId)
    }

    @Transactional
    @Suppress("ThrowsCount")
    fun reorderAlignments(textId: UUID, sentenceId: UUID, alignmentIds: List<UUID>) {
        logger.info("Reordering ${alignmentIds.size} alignments in sentence $sentenceId")

        val sentence = interlinearSentenceRepository.findById(sentenceId)
            ?: throw AppException(AppError.NotFound.InterlinearSentence(sentenceId.toString()))

        if (sentence.text.id != textId) {
            throw AppException(AppError.NotFound.InterlinearSentence(sentenceId.toString()))
        }

        alignmentIds.forEachIndexed { index, alignmentId ->
            val alignment = wordAlignmentRepository.findById(alignmentId)
                ?: throw AppException(AppError.NotFound.WordAlignment(alignmentId.toString()))

            if (alignment.sentence.id != sentenceId) {
                throw AppException(AppError.NotFound.WordAlignment(alignmentId.toString()))
            }

            alignment.tokenOrder = index
            alignment.updatedAt = LocalDateTime.now()
            wordAlignmentRepository.persist(alignment)
        }
    }

  @Transactional
  fun cleanAlignements(textId: UUID, sentenceId: UUID) {

    logger.info("Cleaning alignments in sentence $sentenceId of text $textId")

    val sentence = interlinearSentenceRepository.findById(sentenceId)
      ?: throw AppException(AppError.NotFound.InterlinearSentence(sentenceId.toString()))

    require(sentence.text.id == textId) {
      "Sentence $sentenceId does not belong to text $textId"
    }

    val alignments = wordAlignmentRepository.find("sentence", sentence).list()

    alignments.forEach { it.delete() }

    wordAlignmentRepository.flush()
  }

  private fun String.tokenize(): List<String> =
    split(Regex("\\s+")).filter(String::isNotBlank)

  private fun String.convertDashes(): String =
    replace(Regex("(?<!^el)(?<!^al)-"), " ")
}
