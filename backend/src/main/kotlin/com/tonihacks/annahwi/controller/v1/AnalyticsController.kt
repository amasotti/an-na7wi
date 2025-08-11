package com.tonihacks.annahwi.controller.v1

import com.tonihacks.annahwi.dto.response.AnalyticsResponseDTO
import com.tonihacks.annahwi.service.AnalyticsService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.eclipse.microprofile.openapi.annotations.Operation
import org.eclipse.microprofile.openapi.annotations.media.Content
import org.eclipse.microprofile.openapi.annotations.media.Schema
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse
import org.eclipse.microprofile.openapi.annotations.tags.Tag

@ApplicationScoped
@Path("/api/v1/analytics")
@Tag(name = "Analytics", description = "Learning analytics and statistics")
class AnalyticsController {

    @Inject
    private lateinit var analyticsService: AnalyticsService

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(
        summary = "Get comprehensive learning analytics",
        description = "Returns detailed analytics and study patterns"
    )
    @APIResponse(
        responseCode = "200",
        description = "Analytics data retrieved successfully",
        content = [Content(
            mediaType = MediaType.APPLICATION_JSON,
            schema = Schema(implementation = AnalyticsResponseDTO::class)
        )]
    )
    fun getAnalytics(): AnalyticsResponseDTO {
        return analyticsService.getAnalytics()
    }
}
