package com.tonihacks.annahwi.controller

import com.tonihacks.annahwi.config.GlobalTestProfile
import io.quarkus.test.junit.QuarkusTest
import io.quarkus.test.junit.TestProfile
import io.restassured.RestAssured.given
import org.hamcrest.Matchers.*
import org.junit.jupiter.api.Test
import jakarta.ws.rs.core.MediaType
import java.util.UUID

@QuarkusTest
@TestProfile(GlobalTestProfile::class)
class TextControllerErrorTest {

    @Test
    fun `should return 400 for invalid dialect`() {
        given()
            .`when`()
            .get("/api/v1/texts?dialect=INVALID_DIALECT")
            .then()
            .statusCode(400)
            .contentType(MediaType.APPLICATION_JSON)
            .body("error.code", equalTo("VALIDATION_ERROR"))
    }

    @Test
    fun `should return 400 for invalid page number`() {
        given()
            .`when`()
            .get("/api/v1/texts?page=0")
            .then()
            .statusCode(400)
            .contentType(MediaType.APPLICATION_JSON)
            .body("error.code", equalTo("VALIDATION_ERROR"))
            .body("error.message", equalTo("Page number must be greater than 0"))
    }

    @Test
    fun `should return 400 for negative page number`() {
        given()
            .`when`()
            .get("/api/v1/texts?page=-5")
            .then()
            .statusCode(400)
            .contentType(MediaType.APPLICATION_JSON)
            .body("error.code", equalTo("VALIDATION_ERROR"))
            .body("error.message", equalTo("Page number must be greater than 0"))
    }

    @Test
    fun `should return 400 for invalid page size`() {
        given()
            .`when`()
            .get("/api/v1/texts?size=0")
            .then()
            .statusCode(400)
            .contentType(MediaType.APPLICATION_JSON)
            .body("error.code", equalTo("VALIDATION_ERROR"))
            .body("error.message", equalTo("Page size must be greater than 0"))
    }

    @Test
    fun `should return 400 for negative page size`() {
        given()
            .`when`()
            .get("/api/v1/texts?size=-10")
            .then()
            .statusCode(400)
            .contentType(MediaType.APPLICATION_JSON)
            .body("error.code", equalTo("VALIDATION_ERROR"))
            .body("error.message", equalTo("Page size must be greater than 0"))
    }

    @Test
    fun `should return 400 for invalid pageSize parameter`() {
        given()
            .`when`()
            .get("/api/v1/texts?pageSize=-1")
            .then()
            .statusCode(400)
            .contentType(MediaType.APPLICATION_JSON)
            .body("error.code", equalTo("VALIDATION_ERROR"))
            .body("error.message", equalTo("Page size must be greater than 0"))
    }

    @Test
    fun `should return 404 for non-existent text ID`() {
        val nonExistentId = UUID.randomUUID()

        given()
            .`when`()
            .get("/api/v1/texts/{id}", nonExistentId)
            .then()
            .statusCode(404)
            .contentType(MediaType.APPLICATION_JSON)
            .body("error.code", equalTo("RESOURCE_NOT_FOUND"))
            .body("error.message", equalTo("Text with ID '$nonExistentId' not found"))
    }

    @Test
    fun `should return 400 for malformed UUID in path parameter`() {
        given()
            .`when`()
            .get("/api/v1/texts/invalid-uuid")
            .then()
            .statusCode(400)
    }

    @Test
    fun `should return 404 for non-existent text in PUT request`() {
        val nonExistentId = UUID.randomUUID()
        val validRequestBody = """
            {
                "title": "Updated Title",
                "arabicContent": "محتوى محدث",
                "transliteration": "muhtawan muhdath",
                "translation": "Updated content",
                "tags": [],
                "difficulty": "BEGINNER",
                "dialect": "MSA"
            }
        """.trimIndent()

        given()
            .contentType(MediaType.APPLICATION_JSON)
            .body(validRequestBody)
            .`when`()
            .put("/api/v1/texts/{id}", nonExistentId)
            .then()
            .statusCode(404)
            .contentType(MediaType.APPLICATION_JSON)
            .body("error.code", equalTo("RESOURCE_NOT_FOUND"))
            .body("error.message", equalTo("Text with ID '$nonExistentId' not found"))
    }

    @Test
    fun `should return 404 for non-existent text in DELETE request`() {
        val nonExistentId = UUID.randomUUID()

        given()
            .`when`()
            .delete("/api/v1/texts/{id}", nonExistentId)
            .then()
            .statusCode(404)
            .contentType(MediaType.APPLICATION_JSON)
            .body("error.code", equalTo("RESOURCE_NOT_FOUND"))
            .body("error.message", equalTo("Text with ID '$nonExistentId' not found"))
    }

    @Test
    fun `should return 404 for non-existent text versions`() {
        val nonExistentId = UUID.randomUUID()

        given()
            .`when`()
            .get("/api/v1/texts/{id}/versions", nonExistentId)
            .then()
            .statusCode(404)
            .contentType(MediaType.APPLICATION_JSON)
            .body("error.code", equalTo("RESOURCE_NOT_FOUND"))
            .body("error.message", equalTo("Text with ID '$nonExistentId' not found"))
    }

    @Test
    fun `should return 404 for non-existent text version`() {
        val nonExistentId = UUID.randomUUID()

        given()
            .`when`()
            .get("/api/v1/texts/{id}/versions/{versionNumber}", nonExistentId, 999)
            .then()
            .statusCode(404)
    }

    @Test
    fun `should handle multiple validation errors combined`() {
        given()
            .`when`()
            .get("/api/v1/texts?page=0&size=-1&dialect=INVALID")
            .then()
            .statusCode(400)
            .contentType(MediaType.APPLICATION_JSON)
            .body("error.code", equalTo("VALIDATION_ERROR"))
            .body("error.message", containsString("Page number must be greater than 0"))
    }

}
