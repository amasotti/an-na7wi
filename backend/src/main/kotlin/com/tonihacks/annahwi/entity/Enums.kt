package com.tonihacks.annahwi.entity

/**
 * Represents the difficulty level of a text or word
 */
enum class Difficulty {
    BEGINNER,
    INTERMEDIATE,
    ADVANCED
}

/**
 * Represents the dialect of Arabic
 */
enum class Dialect {
    TUNISIAN,
    MOROCCAN,
    EGYPTIAN,
    MSA; // Modern Standard Arabic

    companion object {
        fun fromString(value: String): Dialect? =
            entries.firstOrNull { it.name.equals(value.trim(), ignoreCase = true) }
    }
}

/**
 * Represents the part of speech of a word
 */
enum class PartOfSpeech {
    NOUN,
    VERB,
    ADJECTIVE,
    ADVERB,
    PREPOSITION,
    PARTICLE
}

/**
 * Represents the type of annotation
 */
enum class AnnotationType {
    GRAMMAR,
    VOCABULARY,
    CULTURAL,
    PRONUNCIATION
}
