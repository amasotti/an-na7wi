package com.tonihacks.annahwi.config

import io.quarkus.test.common.QuarkusTestResourceLifecycleManager
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.containers.wait.strategy.Wait
import java.time.Duration

/**
 * TestResource to manage PostgreSQL TestContainer lifecycle for Quarkus tests.
 * This ensures the database container starts before Quarkus application context
 * and provides proper connection configuration.
 */
class PostgreSQLTestResource : QuarkusTestResourceLifecycleManager, AutoCloseable {
    
    private var postgreSQLContainer: PostgreSQLContainer<*>? = null
    
    override fun start(): Map<String, String> {
        postgreSQLContainer = PostgreSQLContainer("postgres:17")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass")
            .withReuse(false)
            .waitingFor(Wait.forListeningPort())
            .withStartupTimeout(Duration.ofMinutes(2))
        
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
