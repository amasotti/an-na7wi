package com.tonihacks.annahwi.controller.v1

import com.tonihacks.annahwi.dto.request.RootNormalizationRequestDTO
import com.tonihacks.annahwi.dto.response.PaginatedResponse
import com.tonihacks.annahwi.dto.response.RootResponseDTO
import com.tonihacks.annahwi.exception.AppError
import com.tonihacks.annahwi.exception.AppException
import com.tonihacks.annahwi.service.RootService
import com.tonihacks.annahwi.util.PaginationUtil
import jakarta.inject.Inject
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.DefaultValue
import jakarta.ws.rs.GET
import jakarta.ws.rs.POST
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
        val rootDTO = RootResponseDTO.fromEntity(root)
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
        if (letterCount < 2 || letterCount > 5) {
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
    
    @GET
    @Path("/starting-with/{letter}")
    @Operation(summary = "Get roots starting with letter", description = "Returns roots that start with specific Arabic letter")
    fun getRootsStartingWith(
        @PathParam("letter") letter: String,
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int,
        @QueryParam("pageSize") pageSize: Int?,
        @QueryParam("sort") @DefaultValue("displayForm") sort: String
    ): Response {
        if (letter.length != 1) {
            throw AppException(AppError.ValidationError.InvalidRoot("Letter must be a single Arabic character"))
        }
        
        // Validate pagination parameters
        PaginationUtil.validatePageSize(page)
        
        val actualSize = PaginationUtil.resolvePageSize(size, pageSize)
        val zeroBasedPage = PaginationUtil.toZeroBasedPage(page)
        logger.info("GET /api/v1/roots/starting-with/$letter - page: $page -> $zeroBasedPage, size: $actualSize")

        val roots = rootService.findRootsStartingWith(letter, zeroBasedPage, actualSize, sort)
        
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
        return Response.ok(result).build()
    }
    
    @GET
    @Path("/statistics")
    @Operation(summary = "Get root statistics", description = "Returns statistics about roots in the database")
    fun getRootStatistics(): Response {
        logger.info("GET /api/v1/roots/statistics")
        val statistics = rootService.getStatistics()
        return Response.ok(statistics).build()
    }
}
