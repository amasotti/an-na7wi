package com.tonihacks.annahwi.service

import jakarta.enterprise.context.ApplicationScoped
import com.tonihacks.annahwi.util.loggerFor

@ApplicationScoped
class TransliterationService {
    
    private val logger = loggerFor(TransliterationService::class.java)
    
    private val arabicToLatinMap: Map<Char, String> = mapOf(
        'ا' to "a", 'أ' to "a", 'إ' to "i", 'آ' to "aa",
        'ب' to "b", 'ت' to "t", 'ث' to "th", 'ج' to "j",
        'ح' to "7", 'خ' to "kh", 'د' to "d", 'ذ' to "dh",
        'ر' to "r", 'ز' to "z", 'س' to "s", 'ش' to "sh",
        'ص' to "S", 'ض' to "D", 'ط' to "T", 'ظ' to "dh",
        'ع' to "3", 'غ' to "gh", 'ف' to "f", 'ق' to "q",
        'ك' to "k", 'ل' to "l", 'م' to "m", 'ن' to "n",
        'ه' to "h", 'و' to "u", 'ي' to "i", 'ى' to "a",
        'ة' to "a", 'ء' to "'", 'ؤ' to "w'", 'ئ' to "y'",
        'َ' to "a", 'ُ' to "u", 'ِ' to "i", 'ً' to "an",
        'ٌ' to "un", 'ٍ' to "in", 'ْ' to "", 'ّ' to "",
        ' ' to " ", '،' to ",", '.' to ".", '؟' to "?", '!' to "!",
        '0' to "0", '1' to "1", '2' to "2", '3' to "3",
        '4' to "4", '5' to "5", '6' to "6", '7' to "7",
        '8' to "8", '9' to "9"
    )
    
    fun transliterate(arabicText: String): String {
        logger.info("Transliterating Arabic text of length: ${arabicText.length}")
        
        if (arabicText.isBlank()) {
            return arabicText
        }
        
        val result = StringBuilder()
        var i = 0
        
        while (i < arabicText.length) {
            val currentChar = arabicText[i]
            
            // Check for "ال" (definite article)
            if (i < arabicText.length - 1 && currentChar == 'ا' && arabicText[i + 1] == 'ل') {
                result.append("el-")
                i += 2
                continue
            }
            
            // Check for individual character mapping
            val transliteration = arabicToLatinMap[currentChar]
            if (transliteration != null) {
                result.append(transliteration)
            } else {
                // If no mapping found, keep the original character
                result.append(currentChar)
            }
            
            i++
        }
        
        val transliteratedText = result.toString()
        logger.debug("Transliteration completed: '$arabicText' -> '$transliteratedText'")
        
        return transliteratedText
    }
}
