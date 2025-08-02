package com.tonihacks.annahwi.service

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class TransliterationServiceTest {

    private lateinit var transliterationService: TransliterationService

    @BeforeEach
    fun setUp() {
        transliterationService = TransliterationService()
    }

    @Test
    fun `should transliterate basic Arabic letters`() {
        val arabicText = "سلام"
        val expected = "slam"
        val result = transliterationService.transliterate(arabicText)
        assertEquals(expected, result)
    }

    @Test
    fun `should transliterate definite article`() {
        val arabicText = "البيت"
        val expected = "el-bit"
        val result = transliterationService.transliterate(arabicText)
        assertEquals(expected, result)
    }

    @Test
    fun `should handle empty string`() {
        val arabicText = ""
        val expected = ""
        val result = transliterationService.transliterate(arabicText)
        assertEquals(expected, result)
    }

    @Test
    fun `should handle blank string`() {
        val arabicText = "   "
        val expected = "   "
        val result = transliterationService.transliterate(arabicText)
        assertEquals(expected, result)
    }

    @Test
    fun `should transliterate numbers and punctuation`() {
        val arabicText = "مرحبا، كيف الحال؟"
        val expected = "mr7ba, kif el-7el-?"
        val result = transliterationService.transliterate(arabicText)
        assertEquals(expected, result)
    }

    @Test
    fun `should handle mixed Arabic and Latin text`() {
        val arabicText = "Hello مرحبا"
        val expected = "Hello mr7ba"
        val result = transliterationService.transliterate(arabicText)
        assertEquals(expected, result)
    }

    @Test
    fun `should transliterate common greeting`() {
        val arabicText = "أهلا وسهلا"
        val expected = "ahla ushla"
        val result = transliterationService.transliterate(arabicText)
        assertEquals(expected, result)
    }

    @Test
    fun `should transliterate text with diacritics`() {
        val arabicText = "مَرْحَبًا"
        val expected = "mar7abana"
        val result = transliterationService.transliterate(arabicText)
        assertEquals(expected, result)
    }

    @Test
    fun `should handle Arabic emphatic consonants`() {
        val arabicText = "صوت ضوء طعم ظل"
        val expected = "Sut Du' T3m dhl"
        val result = transliterationService.transliterate(arabicText)
        assertEquals(expected, result)
    }

    @Test
    fun `should handle pharyngeal sounds`() {
        val arabicText = "عين حلم غروب"
        val expected = "3in 7lm ghrub"
        val result = transliterationService.transliterate(arabicText)
        assertEquals(expected, result)
    }
}
