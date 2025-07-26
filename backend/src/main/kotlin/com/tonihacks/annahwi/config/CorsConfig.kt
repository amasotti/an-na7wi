package com.tonihacks.annahwi.config

import io.quarkus.runtime.StartupEvent
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.jboss.logging.Logger
import javax.enterprise.context.ApplicationScoped
import javax.enterprise.event.Observes
import javax.ws.rs.core.Feature
import javax.ws.rs.core.FeatureContext
import javax.ws.rs.ext.Provider

@Provider
@ApplicationScoped
class CorsConfig : Feature {
    
    private val logger = Logger.getLogger(CorsConfig::class.java)
    
    @ConfigProperty(name = "quarkus.http.cors", defaultValue = "true")
    var corsEnabled: Boolean = true
    
    @ConfigProperty(name = "quarkus.http.cors.origins", defaultValue = "*")
    lateinit var corsOrigins: String
    
    @ConfigProperty(name = "quarkus.http.cors.methods", defaultValue = "GET,POST,PUT,DELETE,OPTIONS")
    lateinit var corsMethods: String
    
    override fun configure(context: FeatureContext): Boolean {
        logger.info("CORS configuration initialized")
        return true
    }
    
    fun onStart(@Observes event: StartupEvent) {
        logger.info("CORS enabled: $corsEnabled")
        logger.info("CORS origins: $corsOrigins")
        logger.info("CORS methods: $corsMethods")
    }
}
