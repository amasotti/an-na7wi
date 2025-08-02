package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.exception.AppException
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class RootNormalizationServiceTest {

    private lateinit var normalizationService: RootNormalizationService

    @BeforeEach
    fun setUp() {
        normalizationService = RootNormalizationService()
    }

    @Test
    fun `should normalize dash-separated root`() {
        val input = "ر-ح-ب"
        val result = normalizationService.normalize(input)
        
        assertEquals(listOf("ر", "ح", "ب"), result.letters)
        assertEquals("رحب", result.normalizedForm)
        assertEquals("ر-ح-ب", result.displayForm)
        assertEquals(3, result.letterCount)
    }

    @Test
    fun `should normalize space-separated root`() {
        val input = "ر ح ب"
        val result = normalizationService.normalize(input)
        
        assertEquals(listOf("ر", "ح", "ب"), result.letters)
        assertEquals("رحب", result.normalizedForm)
        assertEquals("ر-ح-ب", result.displayForm)
        assertEquals(3, result.letterCount)
    }

    @Test
    fun `should normalize continuous letters root`() {
        val input = "رحب"
        val result = normalizationService.normalize(input)
        
        assertEquals(listOf("ر", "ح", "ب"), result.letters)
        assertEquals("رحب", result.normalizedForm)
        assertEquals("ر-ح-ب", result.displayForm)
        assertEquals(3, result.letterCount)
    }

    @Test
    fun `should normalize four-letter root`() {
        val input = "رحبة"
        val result = normalizationService.normalize(input)
        
        assertEquals(listOf("ر", "ح", "ب", "ة"), result.letters)
        assertEquals("رحبة", result.normalizedForm)
        assertEquals("ر-ح-ب-ة", result.displayForm)
        assertEquals(4, result.letterCount)
    }

    @Test
    fun `should handle messy input with extra separators`() {
        val input = " ر - ح - ب "
        val result = normalizationService.normalize(input)
        
        assertEquals(listOf("ر", "ح", "ب"), result.letters)
        assertEquals("رحب", result.normalizedForm)
        assertEquals("ر-ح-ب", result.displayForm)
        assertEquals(3, result.letterCount)
    }

    @Test
    fun `should throw exception for blank input`() {
        assertThrows(AppException::class.java) {
            normalizationService.normalize("")
        }
        
        assertThrows(AppException::class.java) {
            normalizationService.normalize("   ")
        }
    }

    @Test
    fun `should throw exception for too few letters`() {
        assertThrows(AppException::class.java) {
            normalizationService.normalize("ر")
        }
    }

    @Test
    fun `should throw exception for too many letters`() {
        val sevenLetters = "رحبتسعد"
        assertThrows(AppException::class.java) {
            normalizationService.normalize(sevenLetters)
        }
    }

    @Test
    fun `should throw exception for non-Arabic input`() {
        assertThrows(AppException::class.java) {
            normalizationService.normalize("abc")
        }
    }

}
