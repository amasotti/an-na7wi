package com.tonihacks.annahwi.dto.response

data class PaginatedResponse<T>(
    val items: List<T>,
    val totalCount: Long,
    val page: Int,
    val pageSize: Int
)