package com.tonihacks.annahwi.controller

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.tonihacks.annahwi.config.GlobalTestProfile
import com.tonihacks.annahwi.dto.request.RootNormalizationRequestDTO
import com.tonihacks.annahwi.dto.request.RootRequestDTO
import com.tonihacks.annahwi.dto.response.RootNormalizationResponseDTO
import com.tonihacks.annahwi.dto.response.RootResponseDTO
import com.tonihacks.annahwi.dto.response.RootStatisticsDTO
import com.tonihacks.annahwi.dto.response.RootWithWordsDTO
import io.quarkus.test.junit.QuarkusTest
import io.quarkus.test.junit.TestProfile
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import java.util.UUID

@QuarkusTest
@TestProfile(GlobalTestProfile::class)
class RootControllerTest {

    private val objectMapper = ObjectMapper().findAndRegisterModules()
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)

    @Test
    fun testRootRequestDTOSerialization() {
        val requestDTO = RootRequestDTO(
            input = "ك-ت-ب",
            meaning = "to write"
        )

        val json = objectMapper.writeValueAsString(requestDTO)
        val deserializedDTO = objectMapper.readValue(json, RootRequestDTO::class.java)
        
        assertNotNull(deserializedDTO)
        assertEquals(requestDTO.input, deserializedDTO.input)
        assertEquals(requestDTO.meaning, deserializedDTO.meaning)
    }

    @Test
    fun testRootNormalizationRequestDTOSerialization() {
        val requestDTO = RootNormalizationRequestDTO(
            input = "ك-ت-ب"
        )

        val json = objectMapper.writeValueAsString(requestDTO)
        val deserializedDTO = objectMapper.readValue(json, RootNormalizationRequestDTO::class.java)
        
        assertNotNull(deserializedDTO)
        assertEquals(requestDTO.input, deserializedDTO.input)
    }

    @Test
    fun testRootResponseDTOSerialization() {
        val responseDTO = RootResponseDTO(
            id = UUID.randomUUID(),
            letters = listOf("ك", "ت", "ب"),
            normalizedForm = "كتب",
            displayForm = "ك-ت-ب",
            letterCount = 3,
            meaning = "to write",
            analysis = "Root related to writing and written materials",
            wordCount = 5,
            createdAt = java.time.LocalDateTime.now(),
            updatedAt = java.time.LocalDateTime.now()
        )

        val json = objectMapper.writeValueAsString(responseDTO)
        val deserializedDTO = objectMapper.readValue(json, RootResponseDTO::class.java)
        
        assertNotNull(deserializedDTO)
        assertEquals(responseDTO.id, deserializedDTO.id)
        assertEquals(responseDTO.letters, deserializedDTO.letters)
        assertEquals(responseDTO.normalizedForm, deserializedDTO.normalizedForm)
        assertEquals(responseDTO.displayForm, deserializedDTO.displayForm)
        assertEquals(responseDTO.letterCount, deserializedDTO.letterCount)
        assertEquals(responseDTO.meaning, deserializedDTO.meaning)
        assertEquals(responseDTO.wordCount, deserializedDTO.wordCount)
    }

    @Test
    fun testRootNormalizationResponseDTOSerialization() {
        val responseDTO = RootNormalizationResponseDTO(
            input = "ك-ت-ب",
            letters = listOf("ك", "ت", "ب"),
            normalizedForm = "كتب",
            displayForm = "ك-ت-ب",
            letterCount = 3,
            isValid = true
        )

        val json = objectMapper.writeValueAsString(responseDTO)
        val deserializedDTO = objectMapper.readValue(json, RootNormalizationResponseDTO::class.java)
        
        assertNotNull(deserializedDTO)
        assertEquals(responseDTO.input, deserializedDTO.input)
        assertEquals(responseDTO.letters, deserializedDTO.letters)
        assertEquals(responseDTO.normalizedForm, deserializedDTO.normalizedForm)
        assertEquals(responseDTO.displayForm, deserializedDTO.displayForm)
        assertEquals(responseDTO.letterCount, deserializedDTO.letterCount)
        assertEquals(responseDTO.isValid, deserializedDTO.isValid)
    }

    @Test
    fun testRootStatisticsDTOSerialization() {
        val statisticsDTO = RootStatisticsDTO(
            totalRoots = 100L,
            triLiteral = 80L,
            quadriLiteral = 15L,
            quinqueLiteral = 5L,
            otherCounts = mapOf(2 to 0L, 6 to 0L)
        )

        val json = objectMapper.writeValueAsString(statisticsDTO)
        val deserializedDTO = objectMapper.readValue(json, RootStatisticsDTO::class.java)
        
        assertNotNull(deserializedDTO)
        assertEquals(statisticsDTO.totalRoots, deserializedDTO.totalRoots)
        assertEquals(statisticsDTO.triLiteral, deserializedDTO.triLiteral)
        assertEquals(statisticsDTO.quadriLiteral, deserializedDTO.quadriLiteral)
        assertEquals(statisticsDTO.quinqueLiteral, deserializedDTO.quinqueLiteral)
        assertEquals(statisticsDTO.otherCounts, deserializedDTO.otherCounts)
    }

    @Test
    fun testRootWithWordsDTOSerialization() {
        val rootDTO = RootResponseDTO(
            id = UUID.randomUUID(),
            letters = listOf("ك", "ت", "ب"),
            normalizedForm = "كتب",
            displayForm = "ك-ت-ب",
            letterCount = 3,
            meaning = "to write",
            analysis = "Root related to writing and written materials",
            wordCount = 1,
            createdAt = java.time.LocalDateTime.now(),
            updatedAt = java.time.LocalDateTime.now()
        )

        val wordsDTO = listOf(
            com.tonihacks.annahwi.dto.response.WordSummaryDTO(
                id = UUID.randomUUID(),
                arabic = "كتب",
                transliteration = "kataba",
                translation = "to write",
                partOfSpeech = "VERB",
                difficulty = "BEGINNER",
                dialect = "MSA",
                derivedFromId = null
            )
        )

        val rootWithWordsDTO = RootWithWordsDTO(
            root = rootDTO,
            words = wordsDTO
        )

        val json = objectMapper.writeValueAsString(rootWithWordsDTO)
        val deserializedDTO = objectMapper.readValue(json, RootWithWordsDTO::class.java)
        
        assertNotNull(deserializedDTO)
        assertEquals(rootWithWordsDTO.root.id, deserializedDTO.root.id)
        assertEquals(rootWithWordsDTO.words.size, deserializedDTO.words.size)
        assertEquals(rootWithWordsDTO.words[0].id, deserializedDTO.words[0].id)
        assertEquals(rootWithWordsDTO.words[0].arabic, deserializedDTO.words[0].arabic)
    }
}
