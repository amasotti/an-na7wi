# An-Nahwi (النحوي) - Arabic Learning Application

## Project Overview

An-Nahwi is a containerized fullstack application for learning Arabic dialects, specifically designed for creating and managing learning materials. The app allows users to write texts in Arabic with transliteration and translation, manage vocabulary, add annotations, and search through their learning materials with advanced linguistic features.

## Technology Stack

- **Backend**: Kotlin with Quarkus 
- **Frontend**: Vue.js 3 with Composition API and TypeScript
- **Database**: PostgreSQL 16 (containerized)
- **Build Tools**: Gradle with Kotlin DSL (backend), Vite with TypeScript (frontend)
- **Containerization**: Docker Compose with multi-stage builds

## Setup Instructions

### Prerequisites

- Docker and Docker Compose
- JDK 21 (for local development)
- Node.js 20+ (for local frontend development)

### Running with Docker Compose

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/an-na7wi.git
   cd an-na7wi
   ```

2. Start the application:
   ```
   docker-compose up
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/swagger-ui

### Local Development Setup

1. Start the database:
   ```
   docker-compose up postgres
   ```

2. Run the backend:
   ```
   cd backend
   ./gradlew quarkusDev
   ```

3. Run the frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```

## API Endpoints

The application provides the following main API endpoints:

### Texts
- `GET /api/v1/texts` - List texts with pagination & filtering
- `POST /api/v1/texts` - Create new text
- `GET /api/v1/texts/{id}` - Get specific text with annotations
- `PUT /api/v1/texts/{id}` - Update text
- `DELETE /api/v1/texts/{id}` - Delete text
- `POST /api/v1/texts/{id}/analyze` - Analyze text and extract vocabulary

### Words
- `GET /api/v1/words` - Search words with filters
- `POST /api/v1/words` - Create new word
- `GET /api/v1/words/{id}` - Get word details
- `PUT /api/v1/words/{id}` - Update word
- `DELETE /api/v1/words/{id}` - Delete word
- `GET /api/v1/words/roots/{root}` - Get words by Arabic root

### Annotations
- `GET /api/v1/annotations/text/{textId}` - Get annotations for text
- `POST /api/v1/annotations` - Create annotation
- `PUT /api/v1/annotations/{id}` - Update annotation
- `DELETE /api/v1/annotations/{id}` - Delete annotation

### Search
- `GET /api/v1/search/global` - Global search across texts and words
- `GET /api/v1/search/texts` - Advanced text search
- `GET /api/v1/search/suggestions` - Search suggestions/autocomplete

## Project Structure

The project follows a monorepo structure:

- `backend/` - Kotlin/Quarkus backend application
- `frontend/` - Vue.js frontend application
- `database/` - Database initialization scripts and migrations
- `docker-compose.yml` - Docker Compose configuration
- `docs/` - Project documentation

## License

This project is licensed under the MIT License - see the LICENSE file for details.
