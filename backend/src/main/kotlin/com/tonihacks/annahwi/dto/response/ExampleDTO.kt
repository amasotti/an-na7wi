package com.tonihacks.annahwi.dto.response

data class ExampleDTO(
  val arabic: String,
  val transliteration: String = "",
  val english: String
) {
    companion object {

        /**
         * Converts an Anthropic context block to an ExampleDTO.
         *
         * @see com.tonihacks.annahwi.service.ExampleGenerationService
         *
         * The response is in the Format:
         * ```
         *              هذا كتاب مفيد
         * This is a useful book
         */
        fun fromAntrhopicWordExampleResponse(example: List<String>): ExampleDTO {
            if (example.isEmpty()) {
                return ExampleDTO(arabic = "", english = "")
            }
            return ExampleDTO(
                arabic = example[0].trim(),
                transliteration = example.getOrElse(1) { "" }.trim(),
                english = example.getOrElse(2) { "" }.trim()
            )
        }
    }
}
