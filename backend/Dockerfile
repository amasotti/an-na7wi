FROM gradle:8.14-jdk21 AS build

WORKDIR /app

# Copy gradle configuration files
COPY gradle/ gradle/
COPY build.gradle.kts settings.gradle.kts gradle.properties ./

# Download dependencies
RUN gradle dependencies --no-daemon

# Copy source code
COPY src/ src/

# Build the application
RUN gradle build -x test --no-daemon

# Runtime stage
FROM registry.access.redhat.com/ubi8/openjdk-21:latest

WORKDIR /app

# Copy the built application
COPY --from=build /app/build/quarkus-app/lib/ /app/lib/
COPY --from=build /app/build/quarkus-app/*.jar /app/
COPY --from=build /app/build/quarkus-app/app/ /app/app/
COPY --from=build /app/build/quarkus-app/quarkus/ /app/quarkus/

# Set the entrypoint
ENTRYPOINT ["java", "-jar", "/app/quarkus-run.jar"]

# Expose the application port
EXPOSE 8080

# Set health check
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:8080/q/health || exit 1
