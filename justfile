set shell := ["zsh", "-c"]

dev:
    docker compose -f docker-compose.yml up

monitoring:
    docker compose -f docker-compose.monitoring.yml up --build

build:
    docker compose build

test:
    cd backend && ./gradlew test
    cd frontend && pnpm run test

clean:
    docker compose down -v
    docker system prune -f

start-db:
    docker compose up postgres

start-fe:
    docker compose up frontend

start-be:
    docker compose up backend

local-be:
    cd backend && ./gradlew quarkusDev

build-be:
    cd backend && ./gradlew clean quarkusBuild
