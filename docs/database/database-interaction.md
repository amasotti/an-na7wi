# Database Interaction in An-Nahwi

This document explains how database interaction works in the An-Nahwi application, including the role of Flyway for
database migrations and the general database architecture.

## Database Architecture

An-Nahwi uses PostgreSQL as its relational database management system. The database is designed to store and manage
Arabic texts, words, annotations, and their relationships.

### Database Schema

The database schema consists of the following main tables:

1. **texts** - Stores Arabic texts with transliteration and translation
    - Contains fields for title, content, difficulty level, dialect, etc.
    - Supports tagging with JSONB data type

2. **words** - Stores Arabic vocabulary with linguistic information
    - Contains fields for the word in Arabic, transliteration, translation, root, etc.
    - Includes linguistic metadata like part of speech, difficulty level, and dialect

3. **annotations** - Stores annotations for texts
    - Links to specific texts and positions within those texts
    - Categorizes annotations by type (grammar, vocabulary, cultural, pronunciation)

4. **text_words** - Junction table linking texts and words
    - Tracks the position of each word in a text
    - Provides context for context-aware learning

### Database Extensions

The application uses several PostgreSQL extensions:

- **uuid-ossp** - For UUID generation
- **pg_trgm** - For trigram-based text search and similarity
- **unaccent** - For accent-insensitive text search

### Custom Enum Types

The database uses custom enum types to ensure data consistency:

- **difficulty** - BEGINNER, INTERMEDIATE, ADVANCED
- **dialect** - TUNISIAN, MOROCCAN, EGYPTIAN, MSA
- **part_of_speech** - NOUN, VERB, ADJECTIVE, ADVERB, PREPOSITION, PARTICLE
- **annotation_type** - GRAMMAR, VOCABULARY, CULTURAL, PRONUNCIATION

## Database Interaction in the Application

### ORM with Hibernate and Panache

The application uses Hibernate ORM with Panache for simplified database access. Panache is a Quarkus extension that
provides an active record pattern for Hibernate ORM, making database operations more concise and readable.

Key aspects of the ORM setup:

1. **Entity Classes** - Java/Kotlin classes annotated with `@Entity` that map to database tables
    - Each entity class extends `PanacheEntityBase` for simplified CRUD operations
    - Relationships between entities are defined using JPA annotations (`@OneToMany`, `@ManyToOne`, etc.)

2. **Physical Naming Strategy** - The application uses `CamelCaseToUnderscoresNamingStrategy` to automatically convert
   camelCase entity property names to snake_case database column names

3. **Lifecycle Methods** - Entity classes use `@PrePersist` and `@PreUpdate` annotations to automatically manage
   timestamps

### Database Configuration

The database connection is configured in `application.properties`:

```properties
# Datasource
quarkus.datasource.db-kind=postgresql
quarkus.datasource.username=${QUARKUS_DATASOURCE_USERNAME:annahwi_user}
quarkus.datasource.password=${QUARKUS_DATASOURCE_PASSWORD:dev_password}
quarkus.datasource.jdbc.url=${QUARKUS_DATASOURCE_JDBC_URL:jdbc:postgresql://localhost:5432/annahwi}
quarkus.datasource.jdbc.max-size=16
# Hibernate
quarkus.hibernate-orm.database.generation=update
quarkus.hibernate-orm.log.sql=true
quarkus.hibernate-orm.physical-naming-strategy=org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy
```

The application supports environment variable overrides for database connection parameters, making it easy to configure
in different environments.

## Flyway Database Migrations

### What is Flyway?

Flyway is a database migration tool that allows for version-controlled, incremental changes to the database schema. It
tracks which migrations have been applied to the database and applies new migrations automatically.

Key benefits of using Flyway:

1. **Version Control** - Database schema changes are versioned and tracked
2. **Repeatable Migrations** - Ensures consistent database setup across all environments
3. **Incremental Changes** - Allows for small, manageable changes to the database schema
4. **Automated Application** - Migrations can be applied automatically at application startup

### How Flyway Works

Flyway works by scanning for migration scripts in a specified location and applying them in order based on their version
numbers. Each migration script is executed exactly once.

The migration process:

1. Flyway checks the migration history table (`flyway_schema_history`) to see which migrations have already been applied
2. It scans for migration scripts in the configured locations
3. It sorts the scripts by version number
4. It applies any new migrations that haven't been applied yet
5. It updates the migration history table with the newly applied migrations

### Flyway Configuration in An-Nahwi

Flyway is configured in `application.properties`:

```properties
# Flyway
quarkus.flyway.migrate-at-start=true
quarkus.flyway.baseline-on-migrate=true
quarkus.flyway.locations=db/migration
quarkus.flyway.validate-on-migrate=true
```

- **migrate-at-start=true** - Migrations are applied automatically when the application starts
- **baseline-on-migrate=true** - Allows Flyway to work with existing databases
- **locations=db/migration** - Migration scripts are stored in the `db/migration` directory
- **validate-on-migrate=true** - Validates migrations before applying them

### Migration Scripts

Migration scripts follow a specific naming convention:

```
V<version>__<description>.sql
```

For example:

- `V1__Initial_Schema.sql` - Creates the initial database schema
- `V2__Sample_Data.sql` - Adds sample data to the database

The version number is used to determine the order in which migrations are applied. The description is for human
readability.

## Database Operations in Docker Environment

The application is designed to run in a Docker environment, with the database running in a separate container. The
Docker Compose configuration includes:

1. **PostgreSQL Container** - Runs the PostgreSQL database
    - Initializes the database with scripts in the `database/init` directory
    - Stores data in a persistent volume
    - Exposes port 5432 for database connections

2. **Backend Container** - Runs the Quarkus application
    - Connects to the PostgreSQL container
    - Applies Flyway migrations at startup
    - Depends on the PostgreSQL container being healthy

## Best Practices for Database Changes

When making changes to the database:

1. **Create a New Migration Script** - Don't modify existing migration scripts
2. **Follow the Naming Convention** - Use the `V<version>__<description>.sql` format
3. **Test Migrations** - Ensure migrations work correctly before deploying
4. **Keep Migrations Small** - Each migration should make a small, focused change
5. **Include Rollback Logic** - Consider how changes can be rolled back if needed

## Conclusion

The An-Nahwi application uses a PostgreSQL database with Hibernate ORM and Panache for database access. Flyway is used
for database migrations, ensuring consistent database setup across all environments. The database schema is designed to
store and manage Arabic texts, words, annotations, and their relationships, supporting the application's language
learning features.
