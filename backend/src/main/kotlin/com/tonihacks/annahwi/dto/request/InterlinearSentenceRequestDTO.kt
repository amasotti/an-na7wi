package com.tonihacks.annahwi.dto.request

import com.tonihacks.annahwi.entity.InterlinearSentence

data class InterlinearSentenceRequestDTO(
    val arabicText: String,
    val transliteration: String,
    val translation: String,
    val annotations: String? = null,
    val sentenceOrder: Int
) {
    fun toEntity(): InterlinearSentence {
        val sentence = InterlinearSentence()
        sentence.arabicText = arabicText
        sentence.transliteration = transliteration
        sentence.translation = translation
        sentence.annotations = annotations
        sentence.sentenceOrder = sentenceOrder
        return sentence
    }

    fun updateEntity(existingSentence: InterlinearSentence): InterlinearSentence {
        existingSentence.arabicText = arabicText
        existingSentence.transliteration = transliteration
        existingSentence.translation = translation
        existingSentence.annotations = annotations
        existingSentence.sentenceOrder = sentenceOrder
        return existingSentence
    }
}
