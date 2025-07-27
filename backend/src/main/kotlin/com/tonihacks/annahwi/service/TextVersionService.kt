package com.tonihacks.annahwi.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.tonihacks.annahwi.entity.Text
import com.tonihacks.annahwi.entity.TextVersion
import com.tonihacks.annahwi.exception.AppError
import com.tonihacks.annahwi.exception.AppException
import com.tonihacks.annahwi.repository.TextRepository
import com.tonihacks.annahwi.repository.TextVersionRepository
import com.tonihacks.annahwi.util.loggerFor
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import java.util.UUID

@ApplicationScoped
class TextVersionService {

    @Inject
    private lateinit var textVersionRepository: TextVersionRepository
    @Inject
    private lateinit var textRepository: TextRepository

    @Inject
    private lateinit var objectMapper: ObjectMapper

    private val logger = loggerFor(TextService::class.java)

    @Transactional
    fun createInitialVersion(text: Text) {
        val contentSnapshot = Text.toJsonObject(text, objectMapper)
        val version = TextVersion().apply {
            textId = text.id
            versionNumber = 1
            content = contentSnapshot
            createdAt = text.createdAt
            updatedAt = text.updatedAt
            isCurrent = true
        }

        textVersionRepository.persist(version)
            .also {
                logger.info("Initial version created with ID: ${version.id}")
            }
    }

    @Transactional
    fun migrateUnversionedTexts() {
        val textsWithoutVersion = textRepository.find("currentVersion IS NULL")
            .list()
            .also { logger.info("Found ${it.size} texts without versions") }

        textsWithoutVersion.forEach { text ->
            createInitialVersion(text)

            val createdVersion = textVersionRepository
                .find("textId = ?1", text.id)
                .firstResult()
                ?: throw AppException(AppError.NotFound.TextVersion(text.id.toString(), 1))
            text.currentVersion = createdVersion
            textRepository.persistAndFlush(text)
                    .also { logger.info("Text updated with new current version: ${createdVersion.id}") }
        }
        logger.info("Migration completed for ${textsWithoutVersion.size} texts without versions")
    }

    @Transactional
    fun createVersion(text: Text, setAsCurrent: Boolean = true) {
        checkNotNull(text.currentVersion) { "Text must have a current version - run migration" }

        val currentVersion = text.currentVersion!!
        val snapshot = Text.toJsonObject(text, objectMapper)

        val newVersion = TextVersion().apply {
            textId = text.id
            versionNumber = currentVersion.versionNumber + 1
            content = snapshot
            createdAt = text.createdAt
            updatedAt = text.updatedAt
            isCurrent = setAsCurrent
        }

        // If we're setting a new current version, mark the old one as not current
        if (setAsCurrent) {
            currentVersion.isCurrent = false
            textVersionRepository.persist(currentVersion)
                .also { logger.info("Previous version marked as not current: ${currentVersion.id}") }


            text.currentVersion = newVersion
            textRepository.persist(text)
                .also { logger.info("Text updated with new current version: ${text.id}") }
        }

        textVersionRepository.persist(newVersion)
            .also { logger.info("New version created with ID: ${newVersion.id}") }
    }


    fun getVersionForText(textId: UUID, versionNumber: Int): TextVersion {
        val version = textVersionRepository.findByTextIdAndVersionNumber(textId, versionNumber)
        if (version != null) return version

        throw AppException(AppError.NotFound.TextVersion(textId.toString(), versionNumber))
    }

    fun getVersionsForText(textId: UUID): List<TextVersion> =
        textVersionRepository.findByTextId(textId)

    @Transactional
    fun restoreVersion(textId: UUID, versionNumber: Int): Text {
        val text = textRepository.findById(textId)
            ?: throw AppException(AppError.NotFound.Text(textId.toString()))
        
        val versionToRestore = getVersionForText(textId, versionNumber)
        
        // Get the version content (already a JsonNode)
        val contentSnapshot = versionToRestore.content
        
        // Update text with version content
        text.apply {
            arabicContent = contentSnapshot.get("arabicContent")?.asText() ?: arabicContent
            transliteration = contentSnapshot.get("transliteration")?.asText()
            translation = contentSnapshot.get("translation")?.asText()
            comments = contentSnapshot.get("comments")?.asText()
            title = contentSnapshot.get("title")?.asText() ?: title
            // Keep current metadata like tags, difficulty, dialect unchanged
        }
        
        // Create a new version from the restored content and set it as current
        createVersion(text, setAsCurrent = true)
        
        textRepository.persistAndFlush(text)
            .also { logger.info("Text restored from version $versionNumber: ${text.id}") }
        
        return text
    }

}
