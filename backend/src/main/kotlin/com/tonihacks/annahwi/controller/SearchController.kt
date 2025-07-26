package com.tonihacks.annahwi.controller

import com.tonihacks.annahwi.service.SearchService
import jakarta.inject.Inject
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.DefaultValue
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.QueryParam
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import org.eclipse.microprofile.openapi.annotations.Operation
import org.eclipse.microprofile.openapi.annotations.tags.Tag
import org.jboss.logging.Logger


@Path("/api/v1/search")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Search", description = "Search endpoints")
class SearchController {
    
    @Inject
    lateinit var searchService: SearchService
    
    private val logger = Logger.getLogger(SearchController::class.java)
    
    @GET
    @Path("/global")
    @Operation(summary = "Global search", description = "Searches across texts, words, and annotations")
    fun globalSearch(
        @QueryParam("query") query: String,
        @QueryParam("page") @DefaultValue("0") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/search/global - query: $query, page: $page, size: $size")
        return Response.ok(searchService.globalSearch(query, page, size)).build()
    }
    
    @GET
    @Path("/texts")
    @Operation(summary = "Advanced text search", description = "Searches texts with multiple criteria")
    fun advancedTextSearch(
        @QueryParam("query") query: String?,
        @QueryParam("title") title: String?,
        @QueryParam("dialect") dialect: String?,
        @QueryParam("difficulty") difficulty: String?,
        @QueryParam("tag") tag: String?,
        @QueryParam("public") isPublic: Boolean?,
        @QueryParam("page") @DefaultValue("0") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/search/texts - query: $query, " +
                "title: $title, dialect: $dialect, difficulty: $difficulty, " +
                "tag: $tag, public: $isPublic, page: $page, size: $size")
        return Response.ok(searchService.advancedTextSearch(query, title, dialect, difficulty, tag, isPublic, page, size)).build()
    }
    
    @GET
    @Path("/suggestions")
    @Operation(summary = "Search suggestions", description = "Returns search suggestions for autocomplete")
    fun getSearchSuggestions(
        @QueryParam("query") query: String,
        @QueryParam("limit") @DefaultValue("10") limit: Int
    ): Response {
        logger.info("GET /api/v1/search/suggestions - query: $query, limit: $limit")
        return Response.ok(searchService.getSearchSuggestions(query, limit)).build()
    }
}
