package com.tonihacks.annahwi.util

object StringUtil {

    fun getWordCount(text: String): Int  =
        when {
            text.isBlank() -> 0
            else -> text.trim().split("\\s+".toRegex()).size
        }
}


// --- Extension function to use the utility method directly on String objects
fun String.getWordCount(): Int =
    StringUtil.getWordCount(this)
