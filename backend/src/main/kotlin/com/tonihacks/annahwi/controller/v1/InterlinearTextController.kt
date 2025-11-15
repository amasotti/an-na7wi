package com.tonihacks.annahwi.controller.v1

import com.tonihacks.annahwi.dto.request.InterlinearTextRequestDTO
import com.tonihacks.annahwi.dto.response.InterlinearTextDetailDTO
import com.tonihacks.annahwi.dto.response.InterlinearTextResponseDTO
import com.tonihacks.annahwi.dto.response.PaginatedResponse
import com.tonihacks.annahwi.exception.AppError
import com.tonihacks.annahwi.exception.AppException
import com.tonihacks.annahwi.service.InterlinearTextService
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

@Path("/api/v1/interlinear-texts")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Interlinear Text", description = "Interlinear text management endpoints")
class InterlinearTextController {

    @Inject
    private lateinit var interlinearTextService: InterlinearTextService

    private val logger = Logger.getLogger(InterlinearTextController::class.java)

    @GET
    @Operation(summary = "Get all interlinear texts", description = "Returns a list of interlinear texts with pagination")
    fun getAllTexts(
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int,
        @QueryParam("pageSize") pageSize: Int?,
        @QueryParam("sort") @DefaultValue("title") sort: String
    ): Response {
        if (page < 1) {
            throw AppException(AppError.ValidationError.InvalidPageNumber(page))
        }
        if (size < 1 || (pageSize != null && pageSize < 1)) {
            throw AppException(AppError.ValidationError.InvalidPageSize(
                size = if (pageSize != null) pageSize else size
            ))
        }

        val actualSize = PaginationUtil.resolvePageSize(size, pageSize)
        val zeroBasedPage = PaginationUtil.toZeroBasedPage(page)
        logger.info("GET /api/v1/interlinear-texts - page: $page (API) -> $zeroBasedPage (internal), size: $actualSize, sort: $sort")

        val texts = interlinearTextService.findAll(zeroBasedPage, actualSize, sort)
        val totalCount = interlinearTextService.countAll()
        val textDTOs = texts.map { InterlinearTextResponseDTO.fromEntity(it) }

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
    @Operation(summary = "Get interlinear text by ID", description = "Returns a specific interlinear text with all sentences and alignments")
    fun getTextById(@PathParam("id") id: UUID): Response {
        logger.info("GET /api/v1/interlinear-texts/$id")
        val text = interlinearTextService.findById(id)
        val textDTO = InterlinearTextDetailDTO.fromEntity(text)
        return Response.ok(textDTO).build()
    }

    @POST
    @Operation(summary = "Create interlinear text", description = "Creates a new interlinear text")
    fun createText(textDTO: InterlinearTextRequestDTO): Response {
        logger.info("POST /api/v1/interlinear-texts - title: ${textDTO.title}")
        val text = textDTO.toEntity()
        val createdText = interlinearTextService.create(text)
        return Response.status(Response.Status.CREATED)
            .entity(InterlinearTextResponseDTO.fromEntity(createdText))
            .build()
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Update interlinear text", description = "Updates an existing interlinear text metadata")
    fun updateText(@PathParam("id") id: UUID, textDTO: InterlinearTextRequestDTO): Response {
        logger.info("PUT /api/v1/interlinear-texts/$id")
        val existingText = interlinearTextService.findById(id)
        val updatedText = interlinearTextService.update(id, textDTO.updateEntity(existingText))
        return Response.ok(InterlinearTextResponseDTO.fromEntity(updatedText)).build()
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete interlinear text", description = "Deletes an interlinear text and all associated sentences and alignments")
    fun deleteText(@PathParam("id") id: UUID): Response {
        logger.info("DELETE /api/v1/interlinear-texts/$id")
        interlinearTextService.findById(id)  // Verify text exists first
        interlinearTextService.delete(id)
        return Response.noContent().build()
    }
}
