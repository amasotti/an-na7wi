# Panache: Simplifying Persistence in Quarkus

## Introduction

Panache is a persistence library designed to simplify the data access layer in Quarkus applications. It builds on top of
Hibernate ORM and provides a more streamlined, developer-friendly approach to working with databases. The name "Panache"
suggests adding flair or style, which is exactly what it does for your data access code - making it more elegant and
concise.

## Core Concepts

### The Problem Panache Solves

Traditional JPA/Hibernate implementations often require a significant amount of boilerplate code:

- Entity classes with numerous annotations
- Repository/DAO classes with repetitive CRUD methods
- Custom query methods that often repeat similar patterns

Panache addresses these issues by providing:

1. Simplified entity definitions
2. Built-in repository patterns
3. Intuitive query methods
4. Active Record pattern support

## Panache Approaches

Panache offers two main approaches to persistence:

### 1. The Entity Approach (Active Record Pattern)

In this approach, entities themselves contain the methods to perform database operations. This follows the Active Record
pattern, where the entity class has methods like `findById()`, `persist()`, `delete()`, etc.

```kotlin
@Entity
class Person : PanacheEntity() {
    lateinit var name: String
    var birth: LocalDate? = null
    var status: Status? = null

    companion object : PanacheCompanion<Person> {
        fun findByName(name: String) = find("name", name).firstResult()
        fun findAlive() = list("status", Status.ALIVE)
        fun deleteStefs() = delete("name", "Stef")
    }
}

// Usage
val person = Person()
person.name = "John"
person.birth = LocalDate.of(1990, 10, 15)
person.persist() // Directly on the entity

val persons = Person.listAll() // Static method from companion object
val john = Person.findByName("John") // Custom query method
```

### 2. The Repository Approach

This approach is more traditional and separates entities from repositories. It's similar to Spring Data's repository
pattern.

```kotlin
@Entity
class Person {
    @Id
    @GeneratedValue
    var id: Long? = null
    lateinit var name: String
    var birth: LocalDate? = null
    var status: Status? = null
}

@ApplicationScoped
class PersonRepository : PanacheRepository<Person> {
    fun findByName(name: String) = find("name", name).firstResult()
    fun findAlive() = list("status", Status.ALIVE)
    fun deleteStefs() = delete("name", "Stef")
}

// Usage
@Inject
lateinit var personRepository: PersonRepository

// Then in your business methods
val person = Person()
person.name = "John"
personRepository.persist(person)

val persons = personRepository.listAll()
val john = personRepository.findByName("John")
```

## Key Features

### 1. Simplified Entity Definitions

Panache entities can extend `PanacheEntity` (for the Active Record pattern) or `PanacheEntityBase` (when using
repositories or when you need a custom ID), which provides:

- An ID field (when using `PanacheEntity`)
- Basic CRUD operations
- Query methods

### 2. Intuitive Query Methods

Panache provides a fluent API for queries:

```kotlin
// Find by ID
Person.findById(1)

// Find all
Person.findAll().list()

// Pagination
Person.findAll().page(Page.of(0, 25))

// Sorting
Person.findAll().sort("name").list()

// Filtering with query parameters
Person.find("status = ?1 and name = ?2", Status.ALIVE, "John").list()

// Named parameters
Person.find(
    "status = :status and name = :name",
    Parameters.with("status", Status.ALIVE).and("name", "John")
).list()

// Count
Person.count()
```

### 3. Transaction Management

Panache integrates with Quarkus' transaction management:

```kotlin
@Transactional
fun createPerson(name: String) {
    val person = Person()
    person.name = name
    person.persist()
}
```

### 4. Projection Queries

You can project query results to specific fields:

```kotlin
data class PersonName(val name: String)

// Project only the name field
val names = Person.findAll().project(PersonName::class.java).list()
```

## Advantages of Panache

### 1. Reduced Boilerplate

Panache significantly reduces the amount of code needed for database operations. Common operations like CRUD,
pagination, and sorting are built-in.

### 2. Developer Productivity

The intuitive API and reduced boilerplate lead to faster development and fewer bugs.

### 3. Quarkus Integration

Panache is designed specifically for Quarkus, ensuring optimal performance and compatibility with Quarkus features like:

- Fast startup time
- Low memory footprint
- Developer-friendly experience
- Hot reload during development

### 4. Type Safety

Panache leverages Kotlin's type system to provide type-safe queries and operations.

### 5. Performance

Despite the higher-level abstractions, Panache maintains excellent performance by generating efficient SQL queries.

## Best Practices

### 1. Choose the Right Approach

- Use the **Entity Approach** (Active Record) for simpler applications or when you prefer having all database operations
  close to your entity definition.
- Use the **Repository Approach** for more complex applications, better separation of concerns, or when following DDD
  principles.

### 2. Handle Relationships Carefully

Be mindful of bidirectional relationships and lazy loading, as they can cause serialization issues if not handled
properly:

- Use DTOs for API responses instead of directly returning entities
- Configure JSON serialization to handle circular references
- Consider using eager loading for frequently accessed relationships

### 3. Use Transactions Appropriately

Always use `@Transactional` for methods that modify the database to ensure data consistency.

### 4. Leverage Panache Query Methods

Take advantage of Panache's query methods to write concise and readable data access code.

### 5. Consider Performance Implications

- Use pagination for large result sets
- Be mindful of N+1 query problems
- Use projections when you only need specific fields

## Conclusion

Panache brings elegance and simplicity to database operations in Quarkus applications. By reducing boilerplate and
providing intuitive APIs, it allows developers to focus on business logic rather than persistence code. Whether you
prefer the Active Record pattern or the Repository approach, Panache offers a streamlined experience that maintains the
power and flexibility of Hibernate ORM while significantly improving developer productivity.

For applications with complex database requirements, Panache strikes an excellent balance between simplicity and power,
making it a compelling choice for Quarkus developers.
