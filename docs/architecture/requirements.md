# An-Nahwi (النحوي) - Arabic Learning Application

## Project Overview

Build a containerized fullstack application for learning Arabic dialects, specifically designed for creating and
managing learning materials.
The app allows users to write texts in Arabic with transliteration and translation, manage vocabulary, add annotations,
and search through their learning materials with advanced linguistic features.

## Technology Stack

- **Backend**: Kotlin with Quarkus 
- **Frontend**: Vue.js 3 with Composition API and TypeScript
- **Database**: PostgreSQL 16 (containerized)
    - Migration tool: Flyway
    - File storage: PostgreSQL BYTEA for text blobs with optional filesystem fallback
- **Build Tools**:
    - Backend: Gradle with Kotlin DSL
    - Frontend: Vite with TypeScript
- **Containerization**: Docker Compose with multi-stage builds
- **Testing**: JUnit 5 + Testcontainers (backend), Vitest (frontend)

## Monorepo Structure

```
an-nahwi/
├── docker-compose.yml
├── .env.example
├── README.md
├── .gitignore
├── Makefile                          # Common development tasks
├── backend/
│   ├── gradle/
│   │   └── wrapper/
│   ├── gradle/
│   │   └── libs.versions.toml        # Centralized dependency versions
│   ├── src/
│   │   ├── main/
│   │   │   ├── kotlin/com/tonihacks/annahwi/
│   │   │   ├── resources/
│   │   │   │   ├── application.yml
│   │   │   │   ├── application-dev.yml
│   │   │   │   └── db/migration/     # Flyway migrations
│   │   │   └── docker/
│   │   └── test/
│   │       ├── kotlin/
│   │       └── resources/
│   ├── build.gradle.kts
│   ├── gradle.properties
│   ├── settings.gradle.kts
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── App.vue
│   │   ├── router/
│   │   │   └── index.ts
│   │   ├── stores/                   # Pinia stores
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── text/
│   │   │   │   ├── TextEditor.vue
│   │   │   │   ├── TextBrowser.vue
│   │   │   │   └── AnnotationPanel.vue
│   │   │   ├── word/
│   │   │   │   ├── WordPopup.vue
│   │   │   │   └── VocabularyManager.vue
│   │   │   └── common/
│   │   ├── views/
│   │   ├── types/                    # TypeScript definitions
│   │   ├── services/                 # API services
│   │   ├── composables/              # Vue 3 composables
│   │   ├── utils/
│   │   └── assets/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── .eslintrc.js
│   ├── .prettierrc
│   └── Dockerfile
├── database/
│   ├── init/
│   │   └── 01-extensions.sql        # PostgreSQL extensions
│   ├── migrations/                   # Additional Flyway migrations
│   └── backups/
├── docs/
│   ├── api.md
│   ├── setup.md
│   └── architecture.md
└── scripts/
├── dev-setup.sh
└── backup-db.sh
```

## Backend Requirements (Kotlin + Quarkus)

- Kotlin v. 2.2.0
- Quarkus v. 3.24.5
- JDK 21 (LTS)

### Core Dependencies:

```kotlin
// Quarkus BOM and core
quarkus - resteasy - jackson
quarkus - jdbc - postgresql
quarkus - flyway

// Development & Testing
quarkus - junit5
testcontainers - postgresql
quarkus - test 

// Utilities
quarkus - smallrye - openapi          # API documentation
quarkus - smallrye - health           # Health checks
quarkus - micrometer - registry - prometheus  # Metrics
quarkus - hibernate - validator       # Bean validation
```

### Package Structure:

```
com.tonihacks.annahwi/
├── AnnahwiApplication.kt
├── config/
│   ├── DatabaseConfig.kt
│   └── CorsConfig.kt
├── controller/
│   ├── TextController.kt
│   ├── WordController.kt
│   ├── AnnotationController.kt
│   └── SearchController.kt
├── service/
│   ├── TextService.kt
│   ├── WordService.kt
│   ├── AnnotationService.kt
│   └── SearchService.kt
├── repository/
│   ├── TextRepository.kt
│   ├── WordRepository.kt
│   └── AnnotationRepository.kt
├── entity/
│   ├── Text.kt
│   ├── Word.kt
│   ├── Annotation.kt
│   └── TextWord.kt
├── dto/
│   ├── request/
│   └── response/
├── exception/
│   ├── GlobalExceptionHandler.kt
│   └── custom/
└── util/
    ├── ArabicTextProcessor.kt
```

### Database Entities (JPA with Panache):

1. **Text Entity**
    - `id: UUID` (Primary Key)
    - `title: String` (max 255 chars)
    - `arabicContent: String` (TEXT/CLOB)
    - `transliteration: String?` (TEXT/CLOB, nullable)
    - `translation: String?` (TEXT/CLOB, nullable)
    - `tags: List<String>` (JSONB array)
    - `difficulty: Difficulty` (ENUM: BEGINNER, INTERMEDIATE, ADVANCED)
    - `dialect: Dialect` (ENUM: TUNISIAN, MOROCCAN, EGYPTIAN, MSA)
    - `isPublic: Boolean` (default false)
    - `wordCount: Int` (calculated field)
    - `createdAt: LocalDateTime`
    - `updatedAt: LocalDateTime`

2. **Word Entity**
    - `id: UUID`
    - `arabic: String` (indexed for search)
    - `transliteration: String?`
    - `translation: String?`
    - `root: String?` (Arabic root pattern)
    - `partOfSpeech: PartOfSpeech` (ENUM)
    - `notes: String?`
    - `frequency: Int` (usage frequency across texts)
    - `difficulty: Difficulty`
    - `dialect: Dialect`
    - `isVerified: Boolean`
    - `createdAt: LocalDateTime`

3. **Annotation Entity**
    - `id: UUID`
    - `textId: UUID` (Foreign Key)
    - `content: String`
    - `positionStart: Int`
    - `positionEnd: Int`
    - `type: AnnotationType` (ENUM: GRAMMAR, VOCABULARY, CULTURAL, PRONUNCIATION)
    - `color: String?` (hex color for UI)
    - `createdAt: LocalDateTime`

4. **TextWord Junction Table**
    - `textId: UUID`
    - `wordId: UUID`
    - `position: Int`
    - `context: String?` (surrounding words for context-aware learning)

### API Endpoints:

```
/api/v1/texts
  GET    /                    # List texts with pagination & filtering
  POST   /                    # Create new text
  GET    /{id}                # Get specific text with annotations
  PUT    /{id}                # Update text
  DELETE /{id}                # Delete text
  POST   /{id}/analyze        # Analyze text and extract vocabulary

/api/v1/words
  GET    /                    # Search words with filters
  POST   /                    # Create new word
  GET    /{id}                # Get word details
  PUT    /{id}                # Update word
  DELETE /{id}                # Delete word
  GET    /roots/{root}        # Get words by Arabic root

/api/v1/annotations
  GET    /text/{textId}       # Get annotations for text
  POST   /                    # Create annotation
  PUT    /{id}                # Update annotation
  DELETE /{id}                # Delete annotation

/api/v1/search
  GET    /global              # Global search across texts and words
  GET    /texts               # Advanced text search
  GET    /suggestions         # Search suggestions/autocomplete

/api/v1/analytics
  GET    /vocabulary-stats    # Personal vocabulary statistics
  GET    /learning-progress   # Learning progress metrics
```

## Frontend Requirements (Vue 3 + Composition API)

Language is TypeScript with Vite for fast development and build times.

### Core Dependencies:

- vue
- vue-router
- pinia
- axios
- tailwindcss


### Key Components & Features:

1. **TextEditor.vue**
    - Three-column responsive layout
    - Real-time character count and word detection
    - Auto-save functionality
    - Arabic text direction support (RTL)
    - Keyboard shortcuts for common actions
    - Drag-and-drop text import

2. **WordPopup.vue**
    - Context-aware word information
    - Etymology and root analysis
    - Audio pronunciation (future feature)
    - Add to personal vocabulary
    - Similar words suggestions

3. **TextBrowser.vue**
    - Grid/list view toggle
    - Advanced filtering (dialect, difficulty, tags)
    - Bulk operations (export, delete, tag management)
    - Reading progress tracking

4. **AnnotationPanel.vue**
    - Color-coded annotation types
    - Collaborative annotations (future)
    - Export annotations to study notes

### State Management (Pinia):

- `useTextStore()` - Text CRUD operations
- `useWordStore()` - Vocabulary management
- `useUserStore()` - User preferences and settings
- `useSearchStore()` - Search history and filters

## Database Schema & Features

### PostgreSQL Extensions:

```sql
CREATE
EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE
EXTENSION IF NOT EXISTS "pg_trgm";        -- Trigram search
CREATE
EXTENSION IF NOT EXISTS "unaccent";       -- Accent-insensitive search
```

### Advanced Features:

- **Full-Text Search**: GIN indexes on Arabic content with custom Arabic dictionary
- **Trigram Search**: For fuzzy matching on transliterations
- **JSONB Indexing**: On tags for efficient filtering
- **Partitioning**: Text table partitioned by creation date for performance
- **Materialized Views**: For complex analytics queries

### Sample Migration (V001__Initial_Schema.sql):

```sql
-- Enable extensions
CREATE
EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE
EXTENSION IF NOT EXISTS "pg_trgm";

-- Enums
CREATE TYPE difficulty AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE dialect AS ENUM ('TUNISIAN', 'MOROCCAN', 'EGYPTIAN', 'MSA');
CREATE TYPE part_of_speech AS ENUM ('NOUN', 'VERB', 'ADJECTIVE', 'ADVERB', 'PREPOSITION', 'PARTICLE');
CREATE TYPE annotation_type AS ENUM ('GRAMMAR', 'VOCABULARY', 'CULTURAL', 'PRONUNCIATION');

-- Tables with proper indexes and constraints
-- (Full schema details would be provided by the AI)
```

## Docker & Development

### Environment Variables:

```bash
# Database
POSTGRES_DB=annahwi
POSTGRES_USER=annahwi_user
POSTGRES_PASSWORD=dev_password

# Backend
QUARKUS_PROFILE=dev
QUARKUS_HTTP_PORT=8080
DATABASE_URL=postgresql://localhost:5432/annahwi

# Frontend
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_TITLE=An-Nahwi
```

### Development Commands (Makefile):

```makefile
.PHONY: dev build test clean

dev:
	docker-compose -f docker-compose.yml up

build:
	docker-compose build

test:
	cd backend && ./gradlew test
	cd frontend && npm run test

clean:
	docker-compose down -v
	docker system prune -f
```

## Quality & Standards

### Code Quality Tools:

- **Backend**: detekt, kover for coverage
- **Frontend**: ESLint, Prettier, TypeScript strict mode
- **Testing**: Minimum 70% code coverage requirement
- **Documentation**: OpenAPI 3.0 spec generation

### Internationalization:

- Vue i18n for UI localization
- Support for Arabic (RTL), English
- Date/time formatting based on locale

### Accessibility:

- WCAG 2.1 AA compliance
- Keyboard navigation support

## Security Considerations:

- Input sanitization for Arabic text
- XSS protection
