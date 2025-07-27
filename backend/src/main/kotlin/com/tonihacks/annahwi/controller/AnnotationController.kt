package com.tonihacks.annahwi.controller

import com.tonihacks.annahwi.dto.request.MasteryUpdateRequest
import com.tonihacks.annahwi.dto.request.ReviewUpdateRequest
import com.tonihacks.annahwi.entity.Annotation
import com.tonihacks.annahwi.service.AnnotationService
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

@Path("/api/v1")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Annotation", description = "Annotation management endpoints")
class AnnotationController {
    
    @Inject
    lateinit var annotationService: AnnotationService
    
    private val logger = Logger.getLogger(AnnotationController::class.java)
    
    @GET
    @Path("/texts/{id}/annotations")
    @Operation(summary = "Get annotations for text", description = "Returns annotations for the given text (all versions)")
    fun getAnnotationsForText(
        @PathParam("id") textId: UUID,
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/texts/$textId/annotations - page: $page, size: $size")
        return Response.ok(annotationService.findByTextId(textId, PaginationUtil.toZeroBasedPage(page), size)).build()
    }
    
    
    @POST
    @Path("/texts/{id}/annotations")
    @Operation(summary = "Create annotation for text", description = "Creates a new annotation for the given text")
    fun createAnnotation(@PathParam("id") textId: UUID, annotation: Annotation): Response {
        logger.info("POST /api/v1/texts/$textId/annotations")
        val createdAnnotation = annotationService.create(annotation)
        return Response.status(Response.Status.CREATED).entity(createdAnnotation).build()
    }
    
    @PUT
    @Path("/annotations/{id}")
    @Operation(summary = "Update annotation", description = "Updates an existing annotation")
    fun updateAnnotation(@PathParam("id") id: UUID, annotation: Annotation): Response {
        logger.info("PUT /api/v1/annotations/$id")
        val updatedAnnotation = annotationService.update(id, annotation)
        return Response.ok(updatedAnnotation).build()
    }
    
    @DELETE
    @Path("/annotations/{id}")
    @Operation(summary = "Delete annotation", description = "Deletes an annotation")
    fun deleteAnnotation(@PathParam("id") id: UUID): Response {
        logger.info("DELETE /api/v1/annotations/$id")
        annotationService.delete(id)
        return Response.noContent().build()
    }
    
    
    
    
    @GET
    @Path("/annotations/review")
    @Operation(summary = "Get annotations for review", description = "Returns annotations marked for review")
    fun getAnnotationsForReview(
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/annotations/review - page: $page, size: $size")
        return Response.ok(annotationService.findAnnotationsForReview(PaginationUtil.toZeroBasedPage(page), size)).build()
    }
    
    @PUT
    @Path("/annotations/{id}/mastery")
    @Operation(summary = "Update mastery level", description = "Updates the mastery level of an annotation")
    fun updateMasteryLevel(@PathParam("id") id: UUID, request: MasteryUpdateRequest): Response {
        logger.info("PUT /api/v1/annotations/$id/mastery - masteryLevel: ${request.masteryLevel}")
        val updatedAnnotation = annotationService.updateMasteryLevel(id, request.masteryLevel)
        return Response.ok(updatedAnnotation).build()
    }
    
    @PUT
    @Path("/annotations/{id}/review")
    @Operation(summary = "Update review settings", description = "Updates review settings for an annotation")
    fun updateReviewSettings(@PathParam("id") id: UUID, request: ReviewUpdateRequest): Response {
        logger.info("PUT /api/v1/annotations/$id/review - needsReview: ${request.needsReview}")
        val updatedAnnotation = annotationService.updateReviewSettings(id, request.needsReview, request.nextReviewDate)
        return Response.ok(updatedAnnotation).build()
    }
    
    
}
