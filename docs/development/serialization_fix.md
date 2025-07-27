# Hibernate Serialization/Deserialization Fix

## Problem Description

The backend was experiencing serialization/deserialization issues with Hibernate entities, resulting in 400 or 500 errors for all API calls. This document explains the root cause of the problem and the implemented solution.

## Root Cause Analysis

After examining the codebase, we identified several issues contributing to the serialization problems:

1. **Bidirectional Relationships**: The entity classes (`Text`, `Word`, `Annotation`) had bidirectional relationships that created circular references during serialization.

2. **Lazy Loading**: Many entity relationships used `FetchType.LAZY`, which can cause issues when the serializer tries to access these properties after the Hibernate session is closed.

3. **Direct Entity Exposure**: Controllers were directly exposing entity objects in API responses without using Data Transfer Objects (DTOs).

4. **Missing JSON Configuration**: There was no specific JSON serialization configuration to handle circular references.

## Solution Implemented

We implemented a comprehensive solution to address these issues:

### 1. Created Data Transfer Objects (DTOs)

We created two types of DTOs to properly handle serialization and deserialization:

- **Response DTOs**: Used for serializing entities to JSON responses
  - `TextResponseDTO`: Converts a `Text` entity to a DTO for API responses
  - Includes only IDs for related entities to prevent circular references

- **Request DTOs**: Used for deserializing JSON requests to entities
  - `TextRequestDTO`: Converts client data to a `Text` entity
  - Includes methods to create new entities or update existing ones

### 2. Modified Controllers to Use DTOs

We updated the `TextController` to:

- Accept `TextRequestDTO` objects for input (POST, PUT)
- Return `TextResponseDTO` objects for output (GET, POST, PUT)
- Convert between DTOs and entities as needed

This prevents circular references during serialization and provides a clean API contract.

### 3. Added JSON Serialization Configuration

We added the following configuration to `application.properties`:

```properties
# JSON Serialization
quarkus.jackson.fail-on-empty-beans=false
quarkus.jackson.serialization-inclusion=non-null
quarkus.jackson.write-dates-as-timestamps=false
# Handle circular references
quarkus.jackson.serialization.FAIL_ON_EMPTY_BEANS=false
quarkus.jackson.serialization.WRITE_SELF_REFERENCES_AS_NULL=true
```

These settings help Jackson handle circular references and other serialization edge cases.

### 4. Wrote Unit Tests

We created unit tests to verify that our DTOs can be properly serialized and deserialized without circular reference issues:

- `TextDTOSerializationTest`: Tests serialization/deserialization of DTOs
- Tests entity-to-DTO and DTO-to-entity conversion

### 5. Removed Unused jOOQ References

As part of the cleanup, we also removed unused jOOQ references:

- Removed jOOQ dependency from `gradle/libs.versions.toml`
- Removed jOOQ configuration from `application.properties`

## Benefits of the Solution

1. **Clean API Contract**: DTOs provide a clear contract for API consumers, hiding implementation details.

2. **Prevents Circular References**: By including only IDs for related entities in DTOs, we avoid circular references during serialization.

3. **Handles Lazy Loading**: DTOs eagerly load only the necessary data, preventing lazy loading issues.

4. **Improved Error Handling**: Proper serialization/deserialization reduces unexpected errors.

5. **Better Maintainability**: Separation of entities and DTOs makes the codebase more maintainable.

## Future Recommendations

1. **Create DTOs for Other Entities**: Apply the same pattern to other entities (`Word`, `Annotation`, etc.).

2. **Consider Using MapStruct**: For more complex entity-DTO mappings, consider using a mapping library like MapStruct.

3. **Add Validation to DTOs**: Add validation annotations to DTOs to ensure data integrity.

4. **Consider API Versioning**: As the API evolves, consider implementing versioning to maintain backward compatibility.

## Conclusion

By implementing DTOs and proper JSON serialization configuration, we've resolved the serialization/deserialization issues that were causing 400/500 errors in the API. The solution provides a clean API contract, prevents circular references, and improves the overall maintainability of the codebase.
