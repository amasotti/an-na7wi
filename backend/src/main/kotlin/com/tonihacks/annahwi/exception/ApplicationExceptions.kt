package com.tonihacks.annahwi.exception

/**
 * Base class for all application-specific exceptions
 */
abstract class ApplicationException(
    message: String,
    cause: Throwable? = null
) : RuntimeException(message, cause)

/**
 * Exception thrown when a requested resource is not found
 */
class NotFoundException(
    message: String,
    cause: Throwable? = null
) : ApplicationException(message, cause)

/**
 * Exception thrown when a request contains invalid data
 */
class BadRequestException(
    message: String,
    val field: String? = null,
    cause: Throwable? = null
) : ApplicationException(message, cause)

/**
 * Exception thrown when validation fails
 */
class ValidationException(
    message: String,
    val fieldErrors: Map<String, String> = emptyMap(),
    cause: Throwable? = null
) : ApplicationException(message, cause)

/**
 * Exception thrown when a business rule is violated
 */
class BusinessRuleException(
    message: String,
    val code: String? = null,
    cause: Throwable? = null
) : ApplicationException(message, cause)

/**
 * Exception thrown when a resource already exists (conflict)
 */
class ConflictException(
    message: String,
    cause: Throwable? = null
) : ApplicationException(message, cause)

/**
 * Exception thrown for internal server errors
 */
class InternalServerErrorException(
    message: String = "An internal server error occurred",
    cause: Throwable? = null
) : ApplicationException(message, cause)
