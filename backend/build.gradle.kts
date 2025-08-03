plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.quarkus)
    alias(libs.plugins.detekt)
    alias(libs.plugins.kover)
    alias(libs.plugins.kotlinAllopen)
}

repositories {
    mavenCentral()
    mavenLocal()
}

val quarkusPlatformGroupId: String by project
val quarkusPlatformArtifactId: String by project
val quarkusPlatformVersion: String by project

dependencies {
    implementation(enforcedPlatform("${quarkusPlatformGroupId}:${quarkusPlatformArtifactId}:${quarkusPlatformVersion}"))
    implementation(libs.quarkus.arc)
    implementation(libs.quarkus.flyway)
    implementation(libs.quarkus.docker)
    implementation(libs.quarkus.hibernate.orm.panache)
    implementation(libs.quarkus.hibernate.validator)
    implementation(libs.quarkus.hibernate.orm)
    implementation(libs.quarkus.loggins.json)
    implementation(libs.quarkus.smallrye.health)
    implementation(libs.quarkus.jdbc.postgresql)
    implementation(libs.quarkus.micrometer)
    implementation(libs.quarkus.micrometer.registry.prometheus)
    implementation(libs.quarkus.resteasy)
    implementation(libs.quarkus.resteasy.jackson)
    implementation(libs.quarkus.smallrye.openapi)
    implementation(libs.quarkus.kotlin)
    implementation(libs.anthropic.java)

    testImplementation(libs.quarkus.junit5)
    testImplementation(libs.restassured)
    testImplementation(libs.testcontainers.postgresql)
    testImplementation(libs.testcontainers.junit.jupiter)
}

group = "com.tonihacks"
version = "0.5.1"

java {
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

tasks.withType<Test> {
    systemProperty("java.util.logging.manager", "org.jboss.logmanager.LogManager")
}
allOpen {
    annotation("jakarta.ws.rs.Path")
    annotation("jakarta.enterprise.context.ApplicationScoped")
    annotation("jakarta.persistence.Entity")
}

kotlin {
    compilerOptions {
        jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_21
        javaParameters = true
        freeCompilerArgs = listOf(
            "-Xannotation-default-target=param-property"
        )
    }
}

//tasks.named("quarkusDev") {
//    dependsOn("compileQuarkusGeneratedSourcesJava")
//}
