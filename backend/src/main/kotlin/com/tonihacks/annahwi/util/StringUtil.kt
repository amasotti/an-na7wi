package com.tonihacks.annahwi.util

object StringUtil {

    fun getWordCount(text: String): Int  =
        when {
            text.isBlank() -> 0
            else -> text.trim().split("\\s+".toRegex()).size
        }

    fun tokenizeArabicText(text: String): List<String> =
        when {
            text.isBlank() -> emptyList()
            else -> text.trim()
                .split("\\s+".toRegex())
                .map { it.trim() }
                .filter { it.isNotBlank() }
                .map { cleanArabicWord(it) }
                .filter { it.isNotBlank() && it.length >= 2 } // Filter out single characters
                .distinct()
        }

    private fun cleanArabicWord(word: String): String =
        word.replace("[\\p{P}\\p{S}]".toRegex(), "")
            .replace("[0-9]".toRegex(), "")
            .trim()
}


// --- Extension function to use the utility method directly on String objects
fun String.getWordCount(): Int =
    StringUtil.getWordCount(this)
