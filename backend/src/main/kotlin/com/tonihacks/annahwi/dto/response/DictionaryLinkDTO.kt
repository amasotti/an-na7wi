package com.tonihacks.annahwi.dto.response

import com.tonihacks.annahwi.entity.DictionaryLink
import com.tonihacks.annahwi.entity.DictionaryType
import java.util.UUID

/**
 * Response DTO for DictionaryLink entity
 */
data class DictionaryLinkDTO(
    val id: UUID?,
    val type: DictionaryType,
    val url: String,
    val displayName: String?
) {
    companion object {
        /**
         * Convert DictionaryLink entity to DictionaryLinkDTO
         */
        fun fromEntity(dictionaryLink: DictionaryLink): DictionaryLinkDTO {
            return DictionaryLinkDTO(
                id = dictionaryLink.id,
                type = dictionaryLink.type,
                url = dictionaryLink.url,
                displayName = dictionaryLink.displayName
            )
        }
        
        /**
         * Convert list of DictionaryLink entities to list of DictionaryLinkDTOs
         */
        fun fromEntities(dictionaryLinks: List<DictionaryLink>): List<DictionaryLinkDTO> {
            return dictionaryLinks.map { fromEntity(it) }
        }
    }
}
