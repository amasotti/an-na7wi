package com.tonihacks.annahwi.controller

import com.tonihacks.annahwi.config.GlobalTestProfile
import com.tonihacks.annahwi.dto.request.TransliterationRequestDTO
import io.quarkus.test.junit.QuarkusTest
import io.quarkus.test.junit.TestProfile
import io.restassured.RestAssured.given
import io.restassured.http.ContentType
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test

@QuarkusTest
@TestProfile(GlobalTestProfile::class)
class TransliterationControllerTest {

    @Test
    fun `should transliterate Arabic text successfully`() {
        val request = TransliterationRequestDTO(arabicText = "مرحبا")

        given()
            .contentType(ContentType.JSON)
            .body(request)
            .`when`()
            .post("/api/v1/texts/transliterate")
            .then()
            .statusCode(200)
            .body("originalText", equalTo("مرحبا"))
            .body("transliteratedText", equalTo("mr7ba"))
    }

    @Test
    fun `should transliterate text with definite article`() {
        val request = TransliterationRequestDTO(arabicText = "البيت")

        given()
            .contentType(ContentType.JSON)
            .body(request)
            .`when`()
            .post("/api/v1/texts/transliterate")
            .then()
            .statusCode(200)
            .body("originalText", equalTo("البيت"))
            .body("transliteratedText", equalTo("el-bit"))
    }

    @Test
    fun `should handle empty Arabic text`() {
        val request = TransliterationRequestDTO(arabicText = "")

        given()
            .contentType(ContentType.JSON)
            .body(request)
            .`when`()
            .post("/api/v1/texts/transliterate")
            .then()
            .statusCode(200)
            .body("originalText", equalTo(""))
            .body("transliteratedText", equalTo(""))
    }

    @Test
    fun `should transliterate complex Arabic sentence`() {
        val request = TransliterationRequestDTO(arabicText = "أهلا وسهلا بك في بيتنا")

        given()
            .contentType(ContentType.JSON)
            .body(request)
            .`when`()
            .post("/api/v1/texts/transliterate")
            .then()
            .statusCode(200)
            .body("originalText", equalTo("أهلا وسهلا بك في بيتنا"))
            .body("transliteratedText", equalTo("ahla ushla bk fi bitna"))
    }


    @Test
    fun `should transliterate text with punctuation`() {
        val request = TransliterationRequestDTO(arabicText = "مرحبا، كيف الحال؟")

        given()
            .contentType(ContentType.JSON)
            .body(request)
            .`when`()
            .post("/api/v1/texts/transliterate")
            .then()
            .statusCode(200)
            .body("originalText", equalTo("مرحبا، كيف الحال؟"))
            .body("transliteratedText", equalTo("mr7ba, kif el-7el-?"))
    }
}
