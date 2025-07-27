package com.tonihacks.annahwi.controller.v1

import com.tonihacks.annahwi.dto.request.TextRequestDTO
import com.tonihacks.annahwi.dto.response.PaginatedResponse
import com.tonihacks.annahwi.dto.response.TextResponseDTO
import com.tonihacks.annahwi.exception.AppError
import com.tonihacks.annahwi.exception.AppException
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
        @QueryParam("sort") @DefaultValue("title") sort: String,
        @QueryParam("dialect") @DefaultValue("ALL") dialect: String
    ): Response {
        // Validate pagination parameters
        if (page < 1) {
            throw AppException(AppError.ValidationError.InvalidPageNumber(page))
        }
        if (size < 1 || (pageSize != null && pageSize < 1)) {
            throw AppException(AppError.ValidationError.InvalidPageSize(size))
        }
        
        val actualSize = PaginationUtil.resolvePageSize(size, pageSize)
        val zeroBasedPage = PaginationUtil.toZeroBasedPage(page)
        logger.info("GET /api/v1/texts - page: $page (API) -> $zeroBasedPage (internal), size: $actualSize, sort: $sort")

        val texts = when {
            dialect.isBlank() || dialect == "ALL" -> textService.findAll(zeroBasedPage, actualSize, sort)
            else -> textService.findAllByDialect(dialect, zeroBasedPage, actualSize, sort)
        }

        val totalCount = textService.countAll()
        val textDTOs = texts.map { TextResponseDTO.fromEntity(it) }
        val response = PaginatedResponse(
            items = textDTOs,
            totalCount = totalCount,
            page = page,
            pageSize = actualSize
        )
        return Response.ok(response).build()
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
        textService.findById(id)  // Verify text exists first
        textService.delete(id)
        return Response.noContent().build()
    }
    
    
    
    
    @GET
    @Path("/{id}/versions")
    @Operation(summary = "Get text versions", description = "Returns all versions of a text")
    fun getTextVersions(@PathParam("id") id: UUID): Response {
        logger.info("GET /api/v1/texts/$id/versions")
        textService.findById(id)  // Verify text exists first
        val versions = textService.getTextVersions(id)
        return Response.ok(versions).build()
    }
    
    @GET
    @Path("/{id}/versions/{versionNumber}")
    @Operation(summary = "Get specific version", description = "Returns a specific version of a text")
    fun getTextVersion(@PathParam("id") id: UUID, @PathParam("versionNumber") versionNumber: Int): Response {
        logger.info("GET /api/v1/texts/$id/versions/$versionNumber")
        val version = textService.getTextVersion(id, versionNumber)
        return Response.ok(version).build()
    }
    
    @POST
    @Path("/{id}/restore/{versionNumber}")
    @Operation(summary = "Restore version", description = "Restores a version as the current version")
    fun restoreVersion(@PathParam("id") id: UUID, @PathParam("versionNumber") versionNumber: Int): Response {
        logger.info("POST /api/v1/texts/$id/restore/$versionNumber")
        val restoredText = textService.restoreVersion(id, versionNumber)
        return Response.ok(TextResponseDTO.fromEntity(restoredText)).build()
    }
    
    @POST
    @Path("/migrate-versions")
    @Operation(summary = "Migrate versions", description = "Creates initial versions for texts that don't have any")
    fun migrateVersions(): Response {
        logger.info("POST /api/v1/texts/migrate-versions")
        textService.createMissingInitialVersions()
        return Response.ok(mapOf("message" to "Migration completed successfully")).build()
    }
}
