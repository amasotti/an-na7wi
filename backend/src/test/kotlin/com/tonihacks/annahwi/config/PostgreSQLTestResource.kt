package com.tonihacks.annahwi.config

import io.quarkus.test.common.QuarkusTestResourceLifecycleManager
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.containers.wait.strategy.Wait
import java.time.Duration

/**
 * Global TestResource to manage PostgreSQL TestContainer lifecycle for all Quarkus integration tests.
 * This ensures consistent database setup across all @QuarkusTest classes while avoiding
 * configuration conflicts with DevServices.
 */
class PostgreSQLTestResource : QuarkusTestResourceLifecycleManager, AutoCloseable {
    
    private var postgreSQLContainer: PostgreSQLContainer<*>? = null
    
    override fun start(): Map<String, String> {
        postgreSQLContainer = PostgreSQLContainer("postgres:17")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass")
            .withReuse(false) // Explicitly disable reuse to avoid CI issues
            .waitingFor(Wait.forListeningPort())
            .withStartupTimeout(Duration.ofMinutes(3)) // Increased timeout for CI
        
        postgreSQLContainer!!.start()
        
        // Return configuration that overrides application.properties for tests
        return mapOf(
            "quarkus.datasource.jdbc.url" to postgreSQLContainer!!.jdbcUrl,
            "quarkus.datasource.username" to postgreSQLContainer!!.username,
            "quarkus.datasource.password" to postgreSQLContainer!!.password,
            "quarkus.datasource.db-kind" to "postgresql",
            "quarkus.native.enabled" to "false" // Disable native mode for tests
        )
    }
    
    override fun stop() {
        postgreSQLContainer?.stop()
    }

    override fun close() {
        postgreSQLContainer?.close()
        postgreSQLContainer = null
    }
}
