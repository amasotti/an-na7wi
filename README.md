# An-Nahwi (النحوي)

[![🚀 CI Pipeline](https://github.com/amasotti/an-na7wi/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/amasotti/an-na7wi/actions/workflows/ci.yml)
[![🚀 Release Pipeline](https://github.com/amasotti/an-na7wi/actions/workflows/release.yml/badge.svg)](https://github.com/amasotti/an-na7wi/actions/workflows/release.yml)

An-Nahwi (النحوي - "The Grammarian") is a learning project I started because I couldn't find a good Arabic learning app
that combined text management, roots in-depth study, vocabulary learning and some analytics and flashcards learning
tools.

<img src="docs/assets/homepage.png" alt="An-Nahwi homepage" style="width: 100%; max-width: 800px;">

**What it does**: Manage Arabic texts, explore word roots, build vocabulary, and track learning progress. Nothing
revolutionary, just tools that I needed and thought others might find useful too.

**Stack**: Kotlin/Quarkus backend, Nuxt 4/TypeScript frontend, PostgreSQL database

**Reality check**: This is a personal project, not a polished product. The database starts mostly empty - you'll need to
add your own texts and vocabulary as you learn. There are scripts included to backup, restore, and populate the database
with some sample data, syncing them to a S3 bucket. 
Some features are incomplete, bugs are not excluded. But the core functionality works, and if you're learning Arabic 
and like to tinker with code, you might find it helpful.

## What you need to run it

### Prerequisites

- **Docker & Docker Compose** (easiest way to get started)
- **Java 21+** (if you want to hack on the backend)
- **Node.js 22+** and **pnpm** (for frontend development)
- **PostgreSQL 17+** (if you prefer running locally)

### Build Tools

- Backend uses Gradle wrapper for Quarkus/Kotlin builds
- Frontend uses pnpm for Node.js dependencies and Nuxt development

## What's in here

The app has these main parts:

- **Text management**: Add Arabic texts, mark difficult words, take notes
- **Root exploration**: Browse Arabic roots and see related vocabulary
- **Vocabulary building**: Track words you're learning with translations and examples
- **Flashcard system**: Basic spaced repetition for vocabulary practice
- **Simple analytics**: See what you've been working on

<img src="docs/assets/root_detail.png" style="width: 100%; max-width: 600px;" alt="Arabic root detail page">

> 📸 [More screenshots](docs/screenshots.md)

## Quick Start

### Full Stack (Docker)

```bash
make dev          # Start all services
# or
docker-compose up
```

### Development Mode

**Database only:**

```bash
make start-db     # Start PostgreSQL container
```

**Backend (local):**

```bash
make local-be     # Start in dev mode with hot reload
# or
cd backend && ./gradlew quarkusDev
```

**Frontend (local):**

```bash
cd frontend && pnpm install && pnpm run dev
```

## Available Commands

- `make dev` - Start full stack
- `make build` - Build all containers
- `make test` - Run all tests
- `make clean` - Clean containers and volumes
- `make start-db` - Database only
- `make local-be` - Backend dev mode
- Backend build: `cd backend && ./gradlew build`
- Frontend dev: `cd frontend && pnpm run dev`

## Access Points

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- API Docs: http://localhost:8080/swagger-ui

## More info

- [Screenshots and features](docs/screenshots.md)
- API documentation available at http://localhost:8080/swagger-ui when running

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
