package com.tonihacks.annahwi.controller

import com.tonihacks.annahwi.dto.request.TextRequestDTO
import com.tonihacks.annahwi.dto.response.TextResponseDTO
import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Difficulty
import com.tonihacks.annahwi.service.TextService
import com.tonihacks.annahwi.util.PaginationUtil
import jakarta.inject.Inject
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.DELETE
import jakarta.ws.rs.DefaultValue
import jakarta.ws.rs.GET
import jakarta.ws.rs.POST
import jakarta.ws.rs.PUT
import jakarta.ws.rs.Path
import jakarta.ws.rs.PathParam
import jakarta.ws.rs.Produces
import jakarta.ws.rs.QueryParam
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import org.eclipse.microprofile.openapi.annotations.Operation
import org.eclipse.microprofile.openapi.annotations.tags.Tag
import org.jboss.logging.Logger
import java.util.UUID

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
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int,
        @QueryParam("pageSize") pageSize: Int?,
        @QueryParam("sort") @DefaultValue("title") sort: String
    ): Response {
        val actualSize = PaginationUtil.resolvePageSize(size, pageSize)
        val zeroBasedPage = PaginationUtil.toZeroBasedPage(page)
        logger.info("GET /api/v1/texts - page: $page (API) -> $zeroBasedPage (internal), size: $actualSize, sort: $sort")
        val texts = textService.findAll(zeroBasedPage, actualSize, sort)
        val textDTOs = texts.map { TextResponseDTO.fromEntity(it) }
        return Response.ok(textDTOs).build()
    }
    
    @GET
    @Path("/{id}")
    @Operation(summary = "Get text by ID", description = "Returns a specific text by its ID")
    fun getTextById(@PathParam("id") id: UUID): Response {
        logger.info("GET /api/v1/texts/$id")
        val text = textService.findById(id)
        val textDTO = TextResponseDTO.fromEntity(text)
        return Response.ok(textDTO).build()
    }
    
    @POST
    @Operation(summary = "Create text", description = "Creates a new text")
    fun createText(textDTO: TextRequestDTO): Response {
        logger.info("POST /api/v1/texts - title: ${textDTO.title}")
        val text = textDTO.toEntity()
        val createdText = textService.create(text)
        return Response.status(Response.Status.CREATED).entity(TextResponseDTO.fromEntity(createdText)).build()
    }
    
    @PUT
    @Path("/{id}")
    @Operation(summary = "Update text", description = "Updates an existing text")
    fun updateText(@PathParam("id") id: UUID, textDTO: TextRequestDTO): Response {
        logger.info("PUT /api/v1/texts/$id")
        val existingText = textService.findById(id)
        val updatedText = textService.update(id, textDTO.updateEntity(existingText))
        return Response.ok(TextResponseDTO.fromEntity(updatedText)).build()
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
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        val zeroBasedPage = PaginationUtil.toZeroBasedPage(page)
        logger.info("GET /api/v1/texts/title/$title - page: $page, size: $size")
        val texts = textService.findByTitle(title, zeroBasedPage, size)
        val textDTOs = texts.map { TextResponseDTO.fromEntity(it) }
        return Response.ok(textDTOs).build()
    }
    
    @GET
    @Path("/dialect/{dialect}")
    @Operation(summary = "Find texts by dialect", description = "Returns texts with the given dialect")
    fun findByDialect(
        @PathParam("dialect") dialect: Dialect,
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        val zeroBasedPage = PaginationUtil.toZeroBasedPage(page)
        logger.info("GET /api/v1/texts/dialect/$dialect - page: $page, size: $size")
        val texts = textService.findByDialect(dialect, zeroBasedPage, size)
        val textDTOs = texts.map { TextResponseDTO.fromEntity(it) }
        return Response.ok(textDTOs).build()
    }
    
    @GET
    @Path("/difficulty/{difficulty}")
    @Operation(summary = "Find texts by difficulty", description = "Returns texts with the given difficulty")
    fun findByDifficulty(
        @PathParam("difficulty") difficulty: Difficulty,
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        val zeroBasedPage = PaginationUtil.toZeroBasedPage(page)
        logger.info("GET /api/v1/texts/difficulty/$difficulty - page: $page, size: $size")
        val texts = textService.findByDifficulty(difficulty, zeroBasedPage, size)
        val textDTOs = texts.map { TextResponseDTO.fromEntity(it) }
        return Response.ok(textDTOs).build()
    }
    
    @GET
    @Path("/tag/{tag}")
    @Operation(summary = "Find texts by tag", description = "Returns texts with the given tag")
    fun findByTag(
        @PathParam("tag") tag: String,
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        val zeroBasedPage = PaginationUtil.toZeroBasedPage(page)
        logger.info("GET /api/v1/texts/tag/$tag - page: $page, size: $size")
        val texts = textService.findByTag(tag, zeroBasedPage, size)
        val textDTOs = texts.map { TextResponseDTO.fromEntity(it) }
        return Response.ok(textDTOs).build()
    }
    
    @GET
    @Path("/public")
    @Operation(summary = "Find public texts", description = "Returns public texts")
    fun findPublic(
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        val zeroBasedPage = PaginationUtil.toZeroBasedPage(page)
        logger.info("GET /api/v1/texts/public - page: $page, size: $size")
        val texts = textService.findPublic(zeroBasedPage, size)
        val textDTOs = texts.map { TextResponseDTO.fromEntity(it) }
        return Response.ok(textDTOs).build()
    }
    
    @POST
    @Path("/{id}/analyze")
    @Operation(summary = "Analyze text", description = "Analyzes a text and extracts vocabulary")
    fun analyzeText(@PathParam("id") id: UUID): Response {
        logger.info("POST /api/v1/texts/$id/analyze")
        val analyzedText = textService.analyzeText(id)
        return Response.ok(TextResponseDTO.fromEntity(analyzedText)).build()
    }
}
