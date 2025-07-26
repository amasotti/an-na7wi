package com.tonihacks.annahwi.util

/**
 * Utility functions for pagination handling
 */
object PaginationUtil {
    
    /**
     * Converts 1-based API page number to 0-based internal page number
     * @param apiPage 1-based page number from API
     * @return 0-based page number for internal use
     */
    fun toZeroBasedPage(apiPage: Int): Int = maxOf(0, apiPage - 1)
    
    /**
     * Resolves page size from multiple possible parameter names
     * @param size primary size parameter
     * @param pageSize alternative pageSize parameter
     * @return resolved page size
     */
    fun resolvePageSize(size: Int, pageSize: Int?): Int = pageSize ?: size
}

