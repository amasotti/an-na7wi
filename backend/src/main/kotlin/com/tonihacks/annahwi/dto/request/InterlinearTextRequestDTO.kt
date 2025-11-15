package com.tonihacks.annahwi.dto.request

import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.InterlinearText

data class InterlinearTextRequestDTO(
    val title: String,
    val description: String? = null,
    val dialect: Dialect
) {
    fun toEntity(): InterlinearText {
        val text = InterlinearText()
        text.title = title
        text.description = description
        text.dialect = dialect
        return text
    }

    fun updateEntity(existingText: InterlinearText): InterlinearText {
        existingText.title = title
        existingText.description = description
        existingText.dialect = dialect
        return existingText
    }
}
