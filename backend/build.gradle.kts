import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.kapt)
    alias(libs.plugins.quarkus)
    alias(libs.plugins.detekt)
    alias(libs.plugins.kover)
    alias(libs.plugins.kotlinAllopen)
}

group = "com.tonihacks"
version = "1.0.0-SNAPSHOT"

repositories {
    mavenCentral()
    gradlePluginPortal()
    mavenLocal()
}

dependencies {
    implementation(enforcedPlatform(libs.quarkus.bom))
    
    // Quarkus Core
    implementation(libs.quarkus.resteasy.jackson)
    implementation(libs.quarkus.jdbc.postgresql)
    implementation(libs.quarkus.flyway)
    implementation(libs.quarkus.hibernate.orm.panache)
    implementation(libs.quarkus.hibernate.validator)
    
    // Utilities
    implementation(libs.quarkus.smallrye.openapi)
    implementation(libs.quarkus.smallrye.health)
    implementation(libs.quarkus.micrometer.registry.prometheus)
    
    // Testing
    testImplementation(libs.quarkus.junit5)
    testImplementation(libs.testcontainers.postgresql)
    testImplementation(libs.quarkus.test.h2)
}

java {
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

tasks.compileKotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_21)
        freeCompilerArgs.add("-Xcontext-parameters")
        freeCompilerArgs.add("-Xannotation-default-target=param-property")
    }
}

tasks.withType<Test> {
    systemProperty("java.util.logging.manager", "org.jboss.logmanager.LogManager")
}
