package com.tonihacks.annahwi.entity

/**
 * Represents the difficulty level of a text or word
 */
enum class Difficulty {
    BEGINNER,
    INTERMEDIATE,
    ADVANCED;

    companion object {
        fun fromString(value: String): Difficulty? =
            entries.firstOrNull { it.name.equals(value.trim(), ignoreCase = true) }

        fun allToJoinedString(): String =
            entries.joinToString(", ")

        fun isValid(value: String): Boolean =
            entries.any { it.name.equals(value.trim(), ignoreCase = true) }
    }
}

/**
 * Represents the dialect of Arabic
 */
enum class Dialect {
    TUNISIAN,
    MOROCCAN,
    EGYPTIAN,
    GULF,
    LEVANTINE,
    MSA, // Modern Standard Arabic
    IRAQI;

    companion object {
        fun fromString(value: String): Dialect? =
            entries.firstOrNull { it.name.equals(value.trim(), ignoreCase = true) }

        fun allToJoinedString(): String =
            entries.joinToString(", ")

        fun isValid(value: String): Boolean =
            entries.any { it.name.equals(value.trim(), ignoreCase = true) }
    }
}

/**
 * Represents the part of speech of a word
 */
enum class PartOfSpeech {
    UNKNOWN,
    NOUN,
    VERB,
    ADJECTIVE,
    ADVERB,
    PREPOSITION,
    PARTICLE,
    INTERJECTION,
    CONJUNCTION,
    PRONOUN;

  companion object {
        fun isValid(value: String): Boolean =
            entries.any { it.name.equals(value.trim(), ignoreCase = true) }
    }
}

/**
 * Represents the type of annotation
 */
enum class AnnotationType {
    GRAMMAR,
    VOCABULARY,
    CULTURAL,
    OTHER
}

/**
 * Represents the mastery level of an annotation
 */
enum class MasteryLevel {
    NEW,
    LEARNING,
    KNOWN,
    MASTERED
}

/**
 * Represents the type of dictionary
 */
enum class DictionaryType {
    ALMANY,
    LIVING_ARABIC,
    DERJA_NINJA,
    REVERSO,
    WIKTIONARY,
    ARABIC_STUDENT_DICTIONARY,
    LANGENSCHEIDT,
    CUSTOM
}
