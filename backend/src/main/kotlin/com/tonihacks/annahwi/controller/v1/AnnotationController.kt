package com.tonihacks.annahwi.controller.v1

import com.tonihacks.annahwi.dto.request.AnnotationRequestDTO
import com.tonihacks.annahwi.dto.request.MasteryUpdateRequest
import com.tonihacks.annahwi.dto.request.ReviewUpdateRequest
import com.tonihacks.annahwi.dto.response.AnnotationResponseDTO
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
import jakarta.enterprise.context.ApplicationScoped
import java.util.UUID

@ApplicationScoped
@Path("/api/v1/annotations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Annotation", description = "Annotation management endpoints")
class AnnotationController {
    
    @Inject
    lateinit var annotationService: AnnotationService
    
    private val logger = Logger.getLogger(AnnotationController::class.java)


    @GET
    @Path("/{id}")
    @Operation(summary = "Get annotation by ID", description = "Returns a specific annotation by its ID")
    fun getAnnotationById(@PathParam("id") id: UUID): Response
    {
        logger.info("GET /api/v1/annotations/$id")
        val annotation = annotationService.findById(id)
        val result = AnnotationResponseDTO.fromEntity(annotation)
        logger.info("Found annotation with ID $id")
        return Response.ok(result).build()
    }

    @GET
    @Path("/")
    @Operation(summary = "Get all annotations", description = "Returns all annotations with pagination")
    fun getAllAnnotations(
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int,
        @QueryParam("sort") @DefaultValue("createdAt") sort: String
    ): Response {
        logger.info("GET /api/v1/annotations - page: $page, size: $size, sort: $sort")
        val paginationOption = PaginationUtil.toZeroBasedPage(page)
        val annotations = annotationService.findAll(paginationOption, size, sort)
        val result = annotations.map { AnnotationResponseDTO.fromEntity(it) }
        logger.info("Found ${result.size} annotations on page $page with size $size sorted by $sort")
        return Response.ok(result).build()
    }
    
    @GET
    @Path("/text/{id}")
    @Operation(summary = "Get annotations for text", description = "Returns annotations for the given text (all versions)")
    fun getAnnotationsForText(
        @PathParam("id") textId: UUID,
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/annotations/text/$textId - page: $page, size: $size")
        val paginationOption = PaginationUtil.toZeroBasedPage(page)
        val annotations = annotationService.findByTextId(textId, paginationOption, size)
        val result = annotations.map { AnnotationResponseDTO.fromEntity(it) }
        logger.info("Found ${result.size} annotations for text $textId on page $page with size $size")
        return Response.ok(result).build()
    }
    
    
    @POST
    @Path("/text/{id}")
    @Operation(summary = "Create annotation for text", description = "Creates a new annotation for the given text")
    fun createAnnotation(@PathParam("id") textId: UUID, annotationDTO: AnnotationRequestDTO): Response {
        logger.info("POST /api/v1/annotations/text/$textId")
        val createdAnnotation = annotationService.createForText(textId, annotationDTO)
        val result = AnnotationResponseDTO.fromEntity(createdAnnotation)
        return Response.status(Response.Status.CREATED).entity(result).build()
    }
    
    @PUT
    @Path("/{id}")
    @Operation(summary = "Update annotation", description = "Updates an existing annotation")
    fun updateAnnotation(@PathParam("id") id: UUID, annotationDTO: AnnotationRequestDTO): Response {
        logger.info("PUT /api/v1/annotations/$id")
        val updatedAnnotation = annotationService.update(id, annotationDTO)
        val result = AnnotationResponseDTO.fromEntity(updatedAnnotation)
        return Response.ok(result).build()
    }
    
    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete annotation", description = "Deletes an annotation")
    fun deleteAnnotation(@PathParam("id") id: UUID): Response {
        logger.info("DELETE /api/v1/annotations/$id")
        annotationService.delete(id)
        return Response.noContent().build()
    }
    
    
    
    
    @GET
    @Path("/review")
    @Operation(summary = "Get annotations for review", description = "Returns annotations marked for review")
    fun getAnnotationsForReview(
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/annotations/review - page: $page, size: $size")
        val annotations = annotationService.findAnnotationsForReview(PaginationUtil.toZeroBasedPage(page), size)
        val result = annotations.map { AnnotationResponseDTO.fromEntity(it) }
        return Response.ok(result).build()
    }
    
    @PUT
    @Path("/{id}/mastery")
    @Operation(summary = "Update mastery level", description = "Updates the mastery level of an annotation")
    fun updateMasteryLevel(@PathParam("id") id: UUID, request: MasteryUpdateRequest): Response {
        logger.info("PUT /api/v1/annotations/$id/mastery - masteryLevel: ${request.masteryLevel}")
        val updatedAnnotation = annotationService.updateMasteryLevel(id, request.masteryLevel)
        val result = AnnotationResponseDTO.fromEntity(updatedAnnotation)
        return Response.ok(result).build()
    }
    
    @PUT
    @Path("/{id}/review")
    @Operation(summary = "Update review settings", description = "Updates review settings for an annotation")
    fun updateReviewSettings(@PathParam("id") id: UUID, request: ReviewUpdateRequest): Response {
        logger.info("PUT /api/v1/annotations/$id/review - needsReview: ${request.needsReview}")
        val updatedAnnotation = annotationService.updateReviewSettings(id, request.needsReview)
        val result = AnnotationResponseDTO.fromEntity(updatedAnnotation)
        return Response.ok(result).build()
    }
    
    
}
