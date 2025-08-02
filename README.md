# An-Nahwi (النحوي)

Arabic learning application for creating and managing learning materials with text analysis, vocabulary management, and annotations.

**Stack**: Kotlin/Quarkus backend, Nuxt 4/TypeScript frontend, PostgreSQL database

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

## Documentation

- [Requirements & Architecture](docs/architecture/)
- [Development Guide](docs/development/)
- [Database Management](docs/database/)


## Backup DB

```bash
 docker exec -i annahwi-postgres pg_dump -U annahwi_user -d annahwi --column-inserts --data-only > path.sql
```
