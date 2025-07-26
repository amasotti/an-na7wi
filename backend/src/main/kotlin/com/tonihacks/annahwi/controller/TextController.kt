package com.tonihacks.annahwi.controller

import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Difficulty
import com.tonihacks.annahwi.entity.Text
import com.tonihacks.annahwi.service.TextService
import org.eclipse.microprofile.openapi.annotations.Operation
import org.eclipse.microprofile.openapi.annotations.tags.Tag
import org.jboss.logging.Logger
import java.util.*
import javax.inject.Inject
import javax.ws.rs.*
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response

@Path("/api/v1/texts")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Text", description = "Text management endpoints")
class TextController {
    
    @Inject
    lateinit var textService: TextService
    
    private val logger = Logger.getLogger(TextController::class.java)
    
    @GET
    @Operation(summary = "Get all texts", description = "Returns a list of texts with pagination")
    fun getAllTexts(
        @QueryParam("page") @DefaultValue("0") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int,
        @QueryParam("sort") @DefaultValue("title") sort: String
    ): Response {
        logger.info("GET /api/v1/texts - page: $page, size: $size, sort: $sort")
        return Response.ok(textService.findAll(page, size, sort)).build()
    }
    
    @GET
    @Path("/{id}")
    @Operation(summary = "Get text by ID", description = "Returns a specific text by its ID")
    fun getTextById(@PathParam("id") id: UUID): Response {
        logger.info("GET /api/v1/texts/$id")
        return Response.ok(textService.findById(id)).build()
    }
    
    @POST
    @Operation(summary = "Create text", description = "Creates a new text")
    fun createText(text: Text): Response {
        logger.info("POST /api/v1/texts - title: ${text.title}")
        val createdText = textService.create(text)
        return Response.status(Response.Status.CREATED).entity(createdText).build()
    }
    
    @PUT
    @Path("/{id}")
    @Operation(summary = "Update text", description = "Updates an existing text")
    fun updateText(@PathParam("id") id: UUID, text: Text): Response {
        logger.info("PUT /api/v1/texts/$id")
        val updatedText = textService.update(id, text)
        return Response.ok(updatedText).build()
    }
    
    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete text", description = "Deletes a text")
    fun deleteText(@PathParam("id") id: UUID): Response {
        logger.info("DELETE /api/v1/texts/$id")
        textService.delete(id)
        return Response.noContent().build()
    }
    
    @GET
    @Path("/title/{title}")
    @Operation(summary = "Find texts by title", description = "Returns texts matching the given title")
    fun findByTitle(
        @PathParam("title") title: String,
        @QueryParam("page") @DefaultValue("0") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/texts/title/$title - page: $page, size: $size")
        return Response.ok(textService.findByTitle(title, page, size)).build()
    }
    
    @GET
    @Path("/dialect/{dialect}")
    @Operation(summary = "Find texts by dialect", description = "Returns texts with the given dialect")
    fun findByDialect(
        @PathParam("dialect") dialect: Dialect,
        @QueryParam("page") @DefaultValue("0") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/texts/dialect/$dialect - page: $page, size: $size")
        return Response.ok(textService.findByDialect(dialect, page, size)).build()
    }
    
    @GET
    @Path("/difficulty/{difficulty}")
    @Operation(summary = "Find texts by difficulty", description = "Returns texts with the given difficulty")
    fun findByDifficulty(
        @PathParam("difficulty") difficulty: Difficulty,
        @QueryParam("page") @DefaultValue("0") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/texts/difficulty/$difficulty - page: $page, size: $size")
        return Response.ok(textService.findByDifficulty(difficulty, page, size)).build()
    }
    
    @GET
    @Path("/tag/{tag}")
    @Operation(summary = "Find texts by tag", description = "Returns texts with the given tag")
    fun findByTag(
        @PathParam("tag") tag: String,
        @QueryParam("page") @DefaultValue("0") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/texts/tag/$tag - page: $page, size: $size")
        return Response.ok(textService.findByTag(tag, page, size)).build()
    }
    
    @GET
    @Path("/public")
    @Operation(summary = "Find public texts", description = "Returns public texts")
    fun findPublic(
        @QueryParam("page") @DefaultValue("0") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/texts/public - page: $page, size: $size")
        return Response.ok(textService.findPublic(page, size)).build()
    }
    
    @POST
    @Path("/{id}/analyze")
    @Operation(summary = "Analyze text", description = "Analyzes a text and extracts vocabulary")
    fun analyzeText(@PathParam("id") id: UUID): Response {
        logger.info("POST /api/v1/texts/$id/analyze")
        return Response.ok(textService.analyzeText(id)).build()
    }
}
