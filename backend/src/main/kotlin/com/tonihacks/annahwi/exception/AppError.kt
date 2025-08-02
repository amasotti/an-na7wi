package com.tonihacks.annahwi.exception

/**
 * Sealed class representing all possible application errors
 */
sealed class AppError(
    val code: String,
    val message: String,
    val details: String? = null
) {
    
    /**
     * Resource not found errors
     */
    sealed class NotFound(message: String) : AppError("RESOURCE_NOT_FOUND", message) {
        data class Text(val id: String) : NotFound("Text with ID '$id' not found")
        data class TextVersion(val textId: String, val versionNumber: Int) : 
            NotFound("Version $versionNumber not found for text '$textId'")
        data class Word(val id: String) : NotFound("Word with ID '$id' not found")
        data class Annotation(val id: String) : NotFound("Annotation with ID '$id' not found")
        data class Root(val id: String) : NotFound("Root with ID '$id' not found")
    }
    
    /**
     * Validation errors with field-specific information
     */
    sealed class ValidationError(
        message: String,
        val fieldName: String? = null,
        val rejectedValue: Any? = null
    ) : AppError("VALIDATION_ERROR", message) {
        
        data class InvalidDialect(val dialect: String) : ValidationError(
            message = "Invalid dialect '$dialect'. Valid dialects are: ${com.tonihacks.annahwi.entity.Dialect.entries.joinToString(", ")}",
            fieldName = "dialect",
            rejectedValue = dialect
        )
        
        data class InvalidPageNumber(val page: Int) : ValidationError(
            message = "Page number must be greater than 0",
            fieldName = "page",
            rejectedValue = page
        )
        
        data class InvalidPageSize(val size: Int) : ValidationError(
            message = "Page size must be greater than 0",
            fieldName = "size",
            rejectedValue = size
        )
        
        data class InvalidSortField(val field: String, val validFields: List<String>) : ValidationError(
            message = "Invalid sort field '$field'. Valid fields are: ${validFields.joinToString(", ")}",
            fieldName = "sort",
            rejectedValue = field
        )
        
        data class EmptyTitle(val title: String?) : ValidationError(
            message = "Title cannot be empty",
            fieldName = "title",
            rejectedValue = title
        )
        
        data class EmptyContent(val content: String?) : ValidationError(
            message = "Arabic content cannot be empty",
            fieldName = "arabicContent",
            rejectedValue = content
        )
        
        data class MultipleFields(val fieldErrors: Map<String, String>) : ValidationError(
            message = "Multiple validation errors occurred"
        )

        data class ExistingRoot(val rootInput: String) : ValidationError(
            message = "Root with input '$rootInput' already exists",
            fieldName = "root",
            rejectedValue = rootInput
        )
        
        data class InvalidRoot(val rootInput: String) : ValidationError(
            message = rootInput,
            fieldName = "root",
            rejectedValue = rootInput
        )
    }
    
    /**
     * Business rule violations
     */
    sealed class BusinessRule(message: String, code: String = "BUSINESS_RULE_VIOLATION") : AppError(code, message) {
        data class TextAlreadyExists(val title: String) : BusinessRule(
            "Text with title '$title' already exists",
            "TEXT_ALREADY_EXISTS"
        )
        
        data class VersionAlreadyExists(val textId: String, val versionNumber: Int) : BusinessRule(
            "Version $versionNumber already exists for text '$textId'",
            "VERSION_ALREADY_EXISTS"
        )
        
        data class CannotDeleteCurrentVersion(val textId: String, val versionNumber: Int) : BusinessRule(
            "Cannot delete current version $versionNumber of text '$textId'",
            "CANNOT_DELETE_CURRENT_VERSION"
        )
    }
    
    /**
     * Internal server errors
     */
    sealed class Internal(message: String = "An internal server error occurred") : AppError("INTERNAL_SERVER_ERROR", message) {
        object Database : Internal("Database operation failed")
        data class Unexpected(val cause: Throwable) : Internal("An unexpected error occurred: ${cause.message}")
    }
    
    /**
     * Conflict errors (409)
     */
    sealed class Conflict(message: String) : AppError("CONFLICT", message) {
        data class ResourceAlreadyExists(val resource: String, val identifier: String) : 
            Conflict("$resource with identifier '$identifier' already exists")
    }
}
