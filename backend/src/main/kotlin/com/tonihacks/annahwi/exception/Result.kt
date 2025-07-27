package com.tonihacks.annahwi.exception

/**
 * Functional error handling with Result type
 */
sealed class Result<out T, out E> {
    data class Success<out T>(val value: T) : Result<T, Nothing>()
    data class Failure<out E>(val error: E) : Result<Nothing, E>()
    
    /**
     * Returns true if this is a Success result
     */
    val isSuccess: Boolean get() = this is Success
    
    /**
     * Returns true if this is a Failure result
     */
    val isFailure: Boolean get() = this is Failure
    
    /**
     * Returns the value if Success, or null if Failure
     */
    fun getOrNull(): T? = when (this) {
        is Success -> value
        is Failure -> null
    }
    
    /**
     * Returns the error if Failure, or null if Success
     */
    fun errorOrNull(): E? = when (this) {
        is Success -> null
        is Failure -> error
    }
    
    /**
     * Returns the value if Success, or throws if Failure
     */
    fun getOrThrow(): T = when (this) {
        is Success -> value
        is Failure -> throw AppException(error as AppError)
    }
    
    /**
     * Maps the success value using the provided function
     */
    inline fun <R> map(transform: (T) -> R): Result<R, E> = when (this) {
        is Success -> Success(transform(value))
        is Failure -> this
    }
    
    /**
     * Flat maps the success value using the provided function
     */
    inline fun <R> flatMap(transform: (T) -> Result<R, @UnsafeVariance E>): Result<R, E> = when (this) {
        is Success -> transform(value)
        is Failure -> this
    }
    
    /**
     * Maps the error using the provided function
     */
    inline fun <R> mapError(transform: (E) -> R): Result<T, R> = when (this) {
        is Success -> this
        is Failure -> Failure(transform(error))
    }
    
    /**
     * Executes the provided function if this is a Success
     */
    inline fun onSuccess(action: (T) -> Unit): Result<T, E> {
        if (this is Success) action(value)
        return this
    }
    
    /**
     * Executes the provided function if this is a Failure
     */
    inline fun onFailure(action: (E) -> Unit): Result<T, E> {
        if (this is Failure) action(error)
        return this
    }
    
    /**
     * Returns the value if Success, or the default value if Failure
     */
    fun getOrElse(default: @UnsafeVariance T): T = when (this) {
        is Success -> value
        is Failure -> default
    }
}

/**
 * Creates a successful result
 */
fun <T> success(value: T): Result<T, AppError> = Result.Success(value)

/**
 * Creates a failure result
 */
fun <T> failure(error: AppError): Result<T, AppError> = Result.Failure(error)

/**
 * Catches exceptions and converts them to Result
 */
inline fun <T> catching(block: () -> T): Result<T, AppError> = try {
    success(block())
} catch (e: AppException) {
    failure(e.error)
} catch (e: Exception) {
    failure(AppError.Internal.Unexpected(e))
}

/**
 * Exception class that wraps AppError
 */
class AppException(val error: AppError) : RuntimeException(error.message)
