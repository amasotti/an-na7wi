package com.tonihacks.annahwi.config

import io.quarkus.test.junit.QuarkusTestProfile

/**
 * Global test profile that applies PostgreSQL TestResource to all integration tests.
 * This ensures consistent database setup across all @QuarkusTest classes.
 */
class GlobalTestProfile : QuarkusTestProfile {
    
    override fun testResources(): List<QuarkusTestProfile.TestResourceEntry> {
        return listOf(
            QuarkusTestProfile.TestResourceEntry(PostgreSQLTestResource::class.java)
        )
    }
    
    override fun getConfigProfile(): String {
        return "test"
    }
}
