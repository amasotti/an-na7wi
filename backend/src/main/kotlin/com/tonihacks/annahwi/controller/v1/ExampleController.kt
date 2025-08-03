package com.tonihacks.annahwi.controller.v1

import com.tonihacks.annahwi.dto.request.ExampleGenerationRequestDTO
import com.tonihacks.annahwi.service.ExampleGenerationService
import jakarta.inject.Inject
import jakarta.validation.Valid
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.POST
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import org.eclipse.microprofile.openapi.annotations.Operation
import org.eclipse.microprofile.openapi.annotations.tags.Tag
import org.jboss.logging.Logger

@Path("/api/v1/examples")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Example", description = "Arabic example generation endpoints")
class ExampleController {

    @Inject
    lateinit var exampleGenerationService: ExampleGenerationService

    private val logger = Logger.getLogger(ExampleController::class.java)

    @POST
    @Path("/generate")
    @Operation(
        summary = "Generate Arabic examples", 
        description = "Generates short Arabic example sentences for a given word or expression using AI"
    )
    fun generateExamples(@Valid request: ExampleGenerationRequestDTO): Response {
        logger.info("POST /api/v1/examples/generate - arabic: ${request.arabic}")
        
        return try {
            val response = exampleGenerationService.generateExamples(request)
            Response.ok(response).build()
        } catch (e: Exception) {
            logger.error("Failed to generate examples for ${request.arabic}: ${e.message}", e)
            Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(mapOf("error" to "Failed to generate examples"))
                .build()
        }
    }
}
