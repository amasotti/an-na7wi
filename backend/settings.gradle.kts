rootProject.name = "annahwi-backend"

pluginManagement {
    val quarkusPluginVersion: String by settings
    val kotlinVersion: String by settings
    
    repositories {
        mavenCentral()
        gradlePluginPortal()
        mavenLocal()
    }
    
    plugins {
        id("io.quarkus") version quarkusPluginVersion
        id("org.jetbrains.kotlin.jvm") version kotlinVersion
        id("org.jetbrains.kotlin.kapt") version kotlinVersion
    }
}
