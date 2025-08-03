package com.tonihacks.annahwi.exception

import com.tonihacks.annahwi.dto.response.ErrorDetailDTO
import com.tonihacks.annahwi.dto.response.ErrorResponseDTO
import com.tonihacks.annahwi.dto.response.FieldErrorDTO
import com.tonihacks.annahwi.dto.response.ValidationErrorDetailDTO
import com.tonihacks.annahwi.dto.response.ValidationErrorResponseDTO
import jakarta.ws.rs.core.Response
import jakarta.ws.rs.ext.ExceptionMapper
import jakarta.ws.rs.ext.Provider
import org.jboss.logging.Logger
import jakarta.validation.ConstraintViolationException
import jakarta.ws.rs.NotFoundException
import com.fasterxml.jackson.databind.exc.ValueInstantiationException
import com.fasterxml.jackson.core.JsonParseException

/**
 * Global exception handler that maps exceptions to appropriate HTTP responses
 */
@Provider
class GlobalExceptionHandler : ExceptionMapper<Exception> {
    
    private val logger = Logger.getLogger(GlobalExceptionHandler::class.java)
    
    override fun toResponse(exception: Exception): Response {
        // Only log at debug level to avoid noise in tests
        logger.debug("Handling exception: ${exception.javaClass.simpleName}: ${exception.message}")
        
        return when (exception) {
            is AppException -> handleAppException(exception.error)
            is ConstraintViolationException -> handleConstraintViolationException(exception)
            is NotFoundException -> handleNotFoundFromFramework(exception)
            is ValueInstantiationException -> handleJsonDeserializationException(exception)
            is JsonParseException -> handleJsonParseException(exception)
            is IllegalArgumentException -> handleIllegalArgumentException(exception)
            is RuntimeException -> {
                // Check if this wraps a MissingKotlinParameterException
                val cause = exception.cause
                if (cause != null && cause.javaClass.simpleName == "MissingKotlinParameterException") {
                    handleMissingKotlinParameter(cause as Exception)
                } else {
                    handleGenericException(exception)
                }
            }
            else -> handleGenericException(exception)
        }
    }
    
    private fun handleAppException(error: AppError): Response {
        return when (error) {
            is AppError.NotFound -> createErrorResponse(error, Response.Status.NOT_FOUND)
            is AppError.ValidationError -> handleValidationError(error)
            is AppError.BusinessRule -> createErrorResponse(error, Response.Status.BAD_REQUEST)
            is AppError.Conflict -> createErrorResponse(error, Response.Status.CONFLICT)
            is AppError.Internal -> {
                // Log internal errors but avoid stack traces in tests
                logger.warn("Internal server error: ${error.message}")
                createErrorResponse(error, Response.Status.INTERNAL_SERVER_ERROR)
            }
        }
    }
    
    private fun handleValidationError(error: AppError.ValidationError): Response {
        return when (error) {
            is AppError.ValidationError.MultipleFields -> {
                val fieldErrors = error.fieldErrors.map { (field, message) ->
                    FieldErrorDTO(field = field, message = message)
                }
                
                val errorResponse = ValidationErrorResponseDTO(
                    error = ValidationErrorDetailDTO(fieldErrors = fieldErrors)
                )
                Response.status(Response.Status.BAD_REQUEST).entity(errorResponse).build()
            }
            else -> {
                val errorResponse = ErrorResponseDTO(
                    error = ErrorDetailDTO(
                        code = error.code,
                        message = error.message,
                        field = error.fieldName
                    )
                )
                Response.status(Response.Status.BAD_REQUEST).entity(errorResponse).build()
            }
        }
    }
    
    private fun createErrorResponse(error: AppError, status: Response.Status): Response {
        val errorResponse = ErrorResponseDTO(
            error = ErrorDetailDTO(
                code = error.code,
                message = error.message,
                details = error.details
            )
        )
        return Response.status(status).entity(errorResponse).build()
    }
    
    private fun handleConstraintViolationException(exception: ConstraintViolationException): Response {
        val fieldErrors = exception.constraintViolations.map { violation ->
            FieldErrorDTO(
                field = violation.propertyPath.toString(),
                message = violation.message,
                rejectedValue = violation.invalidValue
            )
        }
        
        val errorResponse = ValidationErrorResponseDTO(
            error = ValidationErrorDetailDTO(fieldErrors = fieldErrors)
        )
        return Response.status(Response.Status.BAD_REQUEST).entity(errorResponse).build()
    }
    
    private fun handleIllegalArgumentException(exception: IllegalArgumentException): Response {
        val errorResponse = ErrorResponseDTO(
            error = ErrorDetailDTO(
                code = "INVALID_ARGUMENT",
                message = exception.message ?: "Invalid argument provided"
            )
        )
        return Response.status(Response.Status.BAD_REQUEST).entity(errorResponse).build()
    }
    
    private fun handleNotFoundFromFramework(exception: NotFoundException): Response {
        // This handles cases like invalid UUID in path parameters
        val message = when {
            exception.message?.contains("Unable to extract parameter") == true -> "Invalid parameter format"
            exception.message?.contains("UUID") == true -> "Invalid UUID format"
            else -> "Resource not found"
        }
        
        val errorResponse = ErrorResponseDTO(
            error = ErrorDetailDTO(
                code = "BAD_REQUEST",
                message = message
            )
        )
        return Response.status(Response.Status.BAD_REQUEST).entity(errorResponse).build()
    }
    
    
    private fun handleJsonDeserializationException(exception: ValueInstantiationException): Response {
        // Extract field name from the exception message
        val fieldName = extractFieldNameFromException(exception.message)
        val message = when {
            exception.message?.contains("Parameter specified as non-null is null") == true ->
                "Required field '$fieldName' is missing or null"
            else -> "Invalid JSON format for field '$fieldName'"
        }
        
        val errorResponse = ErrorResponseDTO(
            error = ErrorDetailDTO(
                code = "VALIDATION_ERROR",
                message = message,
                field = fieldName
            )
        )
        return Response.status(Response.Status.BAD_REQUEST).entity(errorResponse).build()
    }
    
    private fun handleJsonParseException(exception: JsonParseException): Response {
        val errorResponse = ErrorResponseDTO(
            error = ErrorDetailDTO(
                code = "BAD_REQUEST",
                message = "Invalid JSON format: ${exception.originalMessage}"
            )
        )
        return Response.status(Response.Status.BAD_REQUEST).entity(errorResponse).build()
    }
    
    private fun extractFieldNameFromException(message: String?): String {
        return message?.let {
            val parameterRegex = "parameter (\\w+)".toRegex()
            parameterRegex.find(it)?.groupValues?.get(1)
        } ?: "unknown"
    }
    
    private fun handleGenericException(exception: Exception): Response {
        // Handle MissingKotlinParameterException by checking class name (avoid import issues)
        if (exception.javaClass.simpleName == "MissingKotlinParameterException") {
            return handleMissingKotlinParameter(exception)
        }
        
        // Use debug level for tests, error level for production
        if (logger.isDebugEnabled) {
            logger.debug("Unhandled exception: ${exception.javaClass.simpleName}: ${exception.message}", exception)
        } else {
            logger.error("Unhandled exception: ${exception.javaClass.simpleName}: ${exception.message}")
        }
        
        val errorResponse = ErrorResponseDTO(
            error = ErrorDetailDTO(
                code = "INTERNAL_SERVER_ERROR",
                message = "An unexpected error occurred"
            )
        )
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorResponse).build()
    }
    
    private fun handleMissingKotlinParameter(exception: Exception): Response {
        // Extract field name from message
        val message = exception.message ?: ""
        val fieldName = when {
            message.contains("parameter ") -> {
                val regex = "parameter (\\w+)".toRegex()
                regex.find(message)?.groupValues?.get(1) ?: "unknown"
            }
            else -> "unknown"
        }
        
        val errorResponse = ErrorResponseDTO(
            error = ErrorDetailDTO(
                code = "VALIDATION_ERROR",
                message = "Required field '$fieldName' is missing",
                field = fieldName
            )
        )
        return Response.status(Response.Status.BAD_REQUEST).entity(errorResponse).build()
    }
}
