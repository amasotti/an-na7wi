package com.tonihacks.annahwi.dto.request

import com.tonihacks.annahwi.entity.DictionaryLink
import com.tonihacks.annahwi.entity.DictionaryType
import com.tonihacks.annahwi.entity.Word

/**
 * Request DTO for DictionaryLink creation and update
 */
data class DictionaryLinkRequestDTO(
    val type: DictionaryType,
    val url: String,
    val displayName: String? = null
) {
    fun toEntity(word: Word): DictionaryLink {
        return DictionaryLink().apply {
            this.word = word
            type = this@DictionaryLinkRequestDTO.type
            url = this@DictionaryLinkRequestDTO.url
            displayName = this@DictionaryLinkRequestDTO.displayName
        }
    }
}
