# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
- **Start full stack with Docker**: `docker-compose up` or `make dev`
- **Build containers**: `docker-compose build` or `make build`
- **Clean environment**: `docker-compose down -v` and `make clean`

### Backend (Kotlin/Quarkus)
- **Development mode**: `cd backend && ./gradlew quarkusDev`
- **Build**: `cd backend && ./gradlew quarkusBuild`
- **Test**: `cd backend && ./gradlew test`

### Frontend (Vue.js/TypeScript)
- **Development**: `cd frontend && pnpm run dev`
- **Build**: `cd frontend && pnpm run build`
- **Test**: `cd frontend && pnpm run test`
- **Test (watch)**: `cd frontend && pnpm run test:watch`
- **Lint**: `cd frontend && pnpm run lint`
- **Format**: `cd frontend && pnpm run format`

### Database
- **Start only database**: `docker-compose up postgres`

## Architecture Overview

This is an Arabic learning application with a monorepo structure containing:

The file `docs/requirements.md` contains the detailed requirements and specifications for the application.

### Backend (Kotlin + Quarkus)
- **Framework**: Quarkus 3.24+ with Kotlin 2.2+, JDK 21
- **Database**: PostgreSQL with Flyway migrations
- **Architecture**: Standard layered architecture with controllers, services, repositories, and entities. Focus on clean code practices.
- **Package structure**: `com.tonihacks.annahwi.*`
- **Key features**: Full-text search for Arabic content, RESTful APIs, OpenAPI documentation

### Frontend (Vue.js 3 + TypeScript)
- **Framework**: Vue 3 with Composition API, TypeScript, Vite
- APIs: Axios for API communication
- **Styling**: Tailwind CSS
- **State management**: Pinia stores
- **Key features**: RTL support for Arabic text, text editor, vocabulary management, annotations

### Core Entities
- **Text**: Arabic content with transliteration, translation, tags, difficulty levels
- **Word**: Vocabulary entries with Arabic roots, part-of-speech, frequency data
- **Annotation**: Text annotations for grammar, vocabulary, cultural notes
- **TextWord**: Junction table linking texts and words with position context

### API Structure
All backend APIs are under `/api/v1/` with these main endpoints:
- `/texts` - Text CRUD and analysis
- `/words` - Vocabulary management and root-based searches
- `/annotations` - Text annotation management  
- `/search` - Global and advanced search functionality

### Database Features
- PostgreSQL extensions: uuid-ossp, pg_trgm (trigram search), unaccent
- GIN indexes for full-text search on Arabic content
- JSONB support for tags and metadata
- Custom Arabic dictionary for search optimization

## Key Development Patterns and Practices

- every file ends with a newline
- Make the relevant adjustments to the backend and frontend. Make sure to understand the project first and work smart, 
avoiding verbosity when not necessary and being kotlin and vuejs idiomatic. Verbosity is not desired and seen as a code smell.
- When possible and meaningful, always write unit tests for new features or changes

### Backend Patterns
- Use Panache repositories for database operations
- JAX-RS controllers with proper HTTP status codes
- Bean validation with Jakarta annotations
- Exception handling through global exception handler
- Quarkus dev mode for hot reload during development

### Frontend Patterns
- Composition API with TypeScript for all components
- Pinia stores for state management (textStore, wordStore, userStore, searchStore)
- Vue Router for navigation
- Axios for API communication through centralized services
- Tailwind utility classes for styling
- RTL-aware layouts for Arabic text display

### Testing
- Backend: JUnit 5 with Testcontainers for integration tests
- Frontend: Vitest for unit testing
- Aim for 70% code coverage

## Development Notes

### Database Migrations
- Flyway migrations in `backend/src/main/resources/db/migration/`
- Use meaningful versioning (V001, V002, etc.)
- Include rollback scripts where applicable

### Docker Development
- Multi-stage builds for optimized production images
- PostgreSQL 17 in container with persistent volumes
- Environment variables configured through docker-compose
- Health checks implemented for all services
