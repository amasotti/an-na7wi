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
- **IMPORTANT**: Never run `gradlew build` for checking for errors or compilation. Always use "gradlew test" or "gradlew quarkusBuild". The `gradlew build` task will always also attempt to build the native image, using 16 processors and taking 30min to complete**

### Frontend (Nuxt 4/TypeScript)
- **Development**: `cd frontend && pnpm run dev`
- **Build**: `cd frontend && pnpm run build`
- **Test**: `cd frontend && pnpm run test`
- **Test (watch)**: `cd frontend && pnpm run test:watch`
- **Lint**: `cd frontend && pnpm run lint`
- **Format**: `cd frontend && pnpm run format`

### Database
- **Start only database**: `docker-compose up postgres` or `make start-db`
- **Clean Database**: `make clean-db`

## Architecture Overview

This is an Arabic learning application with a monorepo structure containing:

The file `docs/requirements.md` contains the detailed requirements and specifications for the application.

### Backend (Kotlin + Quarkus)
- **Framework**: Quarkus 3.24+ with Kotlin 2.2+, JDK 21
- **Database**: PostgreSQL with Flyway migrations
- **Architecture**: Standard layered architecture with controllers, services, repositories, and entities. Focus on clean code practices.
- **Package structure**: `com.tonihacks.annahwi.*`
- **Key features**: Full-text search for Arabic content, RESTful APIs, OpenAPI documentation

### Frontend (Nuxt 4 + TypeScript)
- **Framework**: Nuxt 4.0.2 with Vue 3 Composition API, TypeScript, file-based routing
- **APIs**: Axios via Nuxt plugin for API communication
- **Styling**: Tailwind CSS with PostCSS
- **State management**: Pinia stores (textStore, wordStore, userStore, searchStore)
- **Key features**: RTL support for Arabic text, auto-imports, SSR-ready, vocabulary management

### Core Entities
- **Text**: Arabic content with transliteration, translation, tags, difficulty levels
- **Word**: Vocabulary entries with Arabic roots, part-of-speech, frequency data
- **Annotation**: Text annotations for grammar, vocabulary, cultural notes

### API Structure
All backend APIs are under `/api/v1/` with these main endpoints:
- `/texts` - Text CRUD and analysis
- `/words` - Vocabulary management and root-based searches
- `/annotations` - Text annotation management  

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

### Frontend Patterns (Nuxt)
- Composition API with TypeScript for all components
- File-based routing in `pages/` directory with dynamic routes
- Pinia stores for state management (textStore, wordStore, userStore, searchStore)
- Pages (under `frontend/pages/`) for routing structure, components (under `components/`) for reusable UI
- Nuxt auto-imports for Vue/Nuxt composables, no need to import useRouter, useState, etc.
- API communication via Nuxt plugin (`plugins/api.client.ts`) with Axios
- Tailwind utility classes for styling grouped in readable css classes
- RTL-aware layouts for Arabic text display using `layouts/default.vue`
- Mobile friendly, responsive design principles
- Line length max 200 characters, prefer shorter when possible
- Import of components in Nuxt is always done with the tilde or hashtag syntax. Tilde syntax refers to src directory for file import and hashtag syntax (e.g. #components) reads the exposed components from .nuxt folder. Before creating mocks, always check the declaration of the types to ensure correct mapping.

### Testing
- Backend: JUnit 5 with Testcontainers for integration tests
- Frontend: Vitest for unit testing
- Aim for 70% code coverage

## Database Migrations
- Flyway migrations in `backend/src/main/resources/db/migration/`
- Use meaningful versioning (V001, V002, etc.)

## Claude Interaction Patterns
- When I ask you to make a plan, you always create a Markdown with the proposal and steps 
