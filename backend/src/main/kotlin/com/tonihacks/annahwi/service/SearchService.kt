package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.entity.Annotation
import com.tonihacks.annahwi.entity.Text
import com.tonihacks.annahwi.entity.Word
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jboss.logging.Logger

/**
 * Service for searching across texts and words
 */
@ApplicationScoped
class SearchService {
    
    @Inject
    lateinit var textService: TextService
    
    @Inject
    lateinit var wordService: WordService
    
    @Inject
    lateinit var annotationService: AnnotationService
    
    private val logger = Logger.getLogger(SearchService::class.java)
    
    /**
     * Data class for global search results
     */
    data class GlobalSearchResult(
        val texts: List<Text>,
        val words: List<Word>,
        val annotations: List<Annotation>
    )
    
    /**
     * Data class for search suggestions
     */
    data class SearchSuggestion(
        val type: SuggestionType,
        val text: String,
        val id: String
    )
    
    /**
     * Enum for search suggestion types
     */
    enum class SuggestionType {
        TEXT,
        WORD,
        ANNOTATION
    }
    
    /**
     * Perform a global search across texts, words, and annotations
     */
    fun globalSearch(query: String, page: Int, size: Int): GlobalSearchResult {
        logger.info("Performing global search for: $query, page: $page, size: $size")
        
        // Search in texts
        val texts = textService.searchByContent(query, page, size)
        
        // Search in words
        val arabicWords = wordService.searchByArabic(query, page, size)
        val translationWords = wordService.searchByTranslation(query, page, size)
        val words = (arabicWords + translationWords).distinctBy { it.id }
        
        // Search in annotations
        val annotations = annotationService.searchByContent(query, page, size)
        
        return GlobalSearchResult(texts, words, annotations)
    }
    
    /**
     * Advanced text search with multiple criteria
     */
    fun advancedTextSearch(
        query: String?,
        title: String?,
        dialect: String?,
        difficulty: String?,
        tag: String?,
        isPublic: Boolean?,
        page: Int,
        size: Int
    ): List<Text> {
        logger.info("Performing advanced text search")
        
        // Start with all texts
        var results = textService.findAll(0, Int.MAX_VALUE)
        
        // Apply filters
        if (!query.isNullOrBlank()) {
            results = results.filter { text ->
                text.arabicContent.contains(query, ignoreCase = true) ||
                (text.transliteration?.contains(query, ignoreCase = true) ?: false) ||
                (text.translation?.contains(query, ignoreCase = true) ?: false)
            }
        }
        
        if (!title.isNullOrBlank()) {
            results = results.filter { it.title.contains(title, ignoreCase = true) }
        }
        
        if (!dialect.isNullOrBlank()) {
            results = results.filter { it.dialect.name.equals(dialect, ignoreCase = true) }
        }
        
        if (!difficulty.isNullOrBlank()) {
            results = results.filter { it.difficulty.name.equals(difficulty, ignoreCase = true) }
        }
        
        if (!tag.isNullOrBlank()) {
            results = results.filter { text -> text.tags.any { it.contains(tag, ignoreCase = true) } }
        }
        
        if (isPublic != null) {
            results = results.filter { it.isPublic == isPublic }
        }
        
        // Apply pagination
        val startIndex = page * size
        val endIndex = minOf(startIndex + size, results.size)
        
        return if (startIndex < results.size) {
            results.subList(startIndex, endIndex)
        } else {
            emptyList()
        }
    }
    
    /**
     * Get search suggestions for autocomplete
     */
    fun getSearchSuggestions(query: String, limit: Int): List<SearchSuggestion> {
        logger.info("Getting search suggestions for: $query, limit: $limit")
        
        val suggestions = mutableListOf<SearchSuggestion>()
        
        // Get text title suggestions
        val textSuggestions = textService.findByTitle(query, 0, limit / 3)
        suggestions.addAll(textSuggestions.map { 
            SearchSuggestion(SuggestionType.TEXT, it.title, it.id.toString()) 
        })
        
        // Get word suggestions
        val wordSuggestions = wordService.searchByArabic(query, 0, limit / 3)
        suggestions.addAll(wordSuggestions.map { 
            SearchSuggestion(SuggestionType.WORD, it.arabic, it.id.toString()) 
        })
        
        // Get annotation content suggestions
        val annotationSuggestions = annotationService.searchByContent(query, 0, limit / 3)
        suggestions.addAll(annotationSuggestions.map { 
            SearchSuggestion(SuggestionType.ANNOTATION, it.content, it.id.toString()) 
        })
        
        // Limit the total number of suggestions
        return suggestions.take(limit)
    }
}
