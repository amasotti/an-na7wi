package com.tonihacks.annahwi.config

import io.quarkus.runtime.StartupEvent
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.event.Observes
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.jboss.logging.Logger

@ApplicationScoped
class DatabaseConfig {
    
    private val logger = Logger.getLogger(DatabaseConfig::class.java)
    
    @ConfigProperty(name = "quarkus.datasource.jdbc.url")
    lateinit var datasourceUrl: String
    
    @ConfigProperty(name = "quarkus.datasource.username")
    lateinit var datasourceUsername: String
    
    fun onStart(@Observes event: StartupEvent) {
        logger.info("Database configuration initialized")
        logger.info("Database URL: $datasourceUrl")
        logger.info("Database User: $datasourceUsername")
    }
}
