package com.tonihacks.annahwi.controller.v1

import com.tonihacks.annahwi.dto.request.RootNormalizationRequestDTO
import com.tonihacks.annahwi.dto.request.RootRequestDTO
import com.tonihacks.annahwi.dto.response.PaginatedResponse
import com.tonihacks.annahwi.dto.response.RootNormalizationResponseDTO
import com.tonihacks.annahwi.dto.response.RootResponseDTO
import com.tonihacks.annahwi.exception.AppError
import com.tonihacks.annahwi.exception.AppException
import com.tonihacks.annahwi.service.RootService
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

@Path("/api/v1/roots")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Root", description = "Arabic root management endpoints")
class RootController {
    
    @Inject
    private lateinit var rootService: RootService
    
    private val logger = Logger.getLogger(RootController::class.java)
    
    @GET
    @Operation(summary = "Get all roots", description = "Returns a list of Arabic roots with pagination")
    fun getAllRoots(
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int,
        @QueryParam("pageSize") pageSize: Int?,
        @QueryParam("sort") @DefaultValue("displayForm") sort: String
    ): Response {
        // Validate pagination parameters
        PaginationUtil.validatePageSize(page)
        
        val actualSize = PaginationUtil.resolvePageSize(size, pageSize)
        val zeroBasedPage = PaginationUtil.toZeroBasedPage(page)
        logger.info("GET /api/v1/roots - page: $page (API) -> $zeroBasedPage (internal), size: $actualSize, sort: $sort")

        val roots = rootService.findAll(zeroBasedPage, actualSize, sort)
        val totalCount = rootService.countAll()
        
        val response = PaginatedResponse(
            items = roots,
            totalCount = totalCount,
            page = page,
            pageSize = actualSize
        )
        return Response.ok(response).build()
    }
    
    @GET
    @Path("/{id}")
    @Operation(summary = "Get root by ID", description = "Returns a specific root by its ID")
    fun getRootById(@PathParam("id") id: UUID): Response {
        logger.info("GET /api/v1/roots/$id")
        val root = rootService.findById(id)
        val wordCount = rootService.getWordCountForRoot(id)
        val rootDTO = RootResponseDTO.fromEntity(root, wordCount)
        return Response.ok(rootDTO).build()
    }
    
    @GET
    @Path("/{id}/words")
    @Operation(summary = "Get root with words", description = "Returns a root with all its associated words")
    fun getRootWithWords(@PathParam("id") id: UUID): Response {
        logger.info("GET /api/v1/roots/$id/words")
        val rootWithWords = rootService.getRootWithWords(id)
        return Response.ok(rootWithWords).build()
    }
    
    @GET
    @Path("/search")
    @Operation(summary = "Search roots", description = "Search roots by query string")
    fun searchRoots(
        @QueryParam("q") query: String?,
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int,
        @QueryParam("pageSize") pageSize: Int?,
        @QueryParam("sort") @DefaultValue("displayForm") sort: String
    ): Response {
        if (query.isNullOrBlank()) {
            throw AppException(AppError.ValidationError.InvalidRoot("Search query cannot be empty"))
        }
        
        // Validate pagination parameters
        PaginationUtil.validatePageSize(page)
        
        val actualSize = PaginationUtil.resolvePageSize(size, pageSize)
        val zeroBasedPage = PaginationUtil.toZeroBasedPage(page)
        logger.info("GET /api/v1/roots/search - query: '$query', page: $page -> $zeroBasedPage, size: $actualSize")

        val roots = rootService.searchRoots(query, zeroBasedPage, actualSize, sort)
        
        val response = PaginatedResponse(
            items = roots,
            totalCount = roots.size.toLong(), // Note: This is approximate for search results
            page = page,
            pageSize = actualSize
        )
        return Response.ok(response).build()
    }
    
    @GET
    @Path("/letter-count/{count}")
    @Operation(summary = "Get roots by letter count", description = "Returns roots with specific letter count")
    fun getRootsByLetterCount(
        @PathParam("count") letterCount: Int,
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int,
        @QueryParam("pageSize") pageSize: Int?,
        @QueryParam("sort") @DefaultValue("displayForm") sort: String
    ): Response {
        if (letterCount !in 2..5) {
            throw AppException(AppError.ValidationError.InvalidRoot("Letter count must be between 2 and 5"))
        }
        
        // Validate pagination parameters
        PaginationUtil.validatePageSize(page)
        
        val actualSize = PaginationUtil.resolvePageSize(size, pageSize)
        val zeroBasedPage = PaginationUtil.toZeroBasedPage(page)
        logger.info("GET /api/v1/roots/letter-count/$letterCount - page: $page -> $zeroBasedPage, size: $actualSize")

        val roots = rootService.findByLetterCount(letterCount, zeroBasedPage, actualSize, sort)
        
        val response = PaginatedResponse(
            items = roots,
            totalCount = roots.size.toLong(), // Approximate count
            page = page,
            pageSize = actualSize
        )
        return Response.ok(response).build()
    }
    
    
    @POST
    @Path("/normalize")
    @Operation(summary = "Normalize root input", description = "Validates and normalizes Arabic root input")
    fun normalizeRoot(request: RootNormalizationRequestDTO): Response {
        logger.info("POST /api/v1/roots/normalize - input: '${request.input}'")
      val result = rootService.normalizeRoot(request.input)
        ?: throw AppException(AppError.ValidationError.InvalidRoot("Invalid Arabic root input: '${request.input}'"))

      val responseDto = RootNormalizationResponseDTO.fromNormalizedRoot(request.input, result)
        return Response.ok(responseDto).build()
    }
    
    @GET
    @Path("/statistics")
    @Operation(summary = "Get root statistics", description = "Returns statistics about roots in the database")
    fun getRootStatistics(): Response {
        logger.info("GET /api/v1/roots/statistics")
        val statistics = rootService.getStatistics()
        return Response.ok(statistics).build()
    }
    
    @POST
    @Operation(summary = "Create root", description = "Creates a new Arabic root from input text")
    fun createRoot(request: RootRequestDTO): Response {
        logger.info("POST /api/v1/roots - input: '${request.input}'")
        try {
            val root = rootService.createRoot(request)
            val wordCount = rootService.getWordCountForRoot(root.id!!)
            return Response.status(Response.Status.CREATED).entity(RootResponseDTO.fromEntity(root, wordCount)).build()
        }  catch (e: AppException) {
            logger.debug("Error creating root: ${e.message}")
            return Response.status(Response.Status.BAD_REQUEST).entity(e.error).build()
        } catch (e: Exception) {
            logger.debug("Unexpected error creating root: ${e.message}")
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build()
        }

    }
    
    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete root", description = "Deletes an Arabic root by ID")
    fun deleteRoot(@PathParam("id") id: UUID): Response {
        logger.info("DELETE /api/v1/roots/$id")
        val deleted = rootService.deleteRoot(id)
        return if (deleted) {
            Response.noContent().build()
        } else {
            Response.status(Response.Status.NOT_FOUND).build()
        }
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Update root", description = "Updates an existing Arabic root")
    fun updateRoot(@PathParam("id") id: UUID, request: RootRequestDTO): Response {
        logger.info("PUT /api/v1/roots/$id - input: '${request.input}'")
        val updatedRootDTO = rootService.updateRoot(id, request)
        return Response.ok(updatedRootDTO).build()
    }
}
