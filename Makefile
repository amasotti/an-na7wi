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
