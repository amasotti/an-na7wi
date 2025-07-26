package com.tonihacks.annahwi.controller

import com.tonihacks.annahwi.entity.Annotation
import com.tonihacks.annahwi.entity.AnnotationType
import com.tonihacks.annahwi.service.AnnotationService
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

@Path("/api/v1/annotations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Annotation", description = "Annotation management endpoints")
class AnnotationController {
    
    @Inject
    lateinit var annotationService: AnnotationService
    
    private val logger = Logger.getLogger(AnnotationController::class.java)
    
    @GET
    @Operation(summary = "Get all annotations", description = "Returns a list of annotations with pagination")
    fun getAllAnnotations(
        @QueryParam("page") @DefaultValue("0") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int,
        @QueryParam("sort") @DefaultValue("createdAt") sort: String
    ): Response {
        logger.info("GET /api/v1/annotations - page: $page, size: $size, sort: $sort")
        return Response.ok(annotationService.findAll(page, size, sort)).build()
    }
    
    @GET
    @Path("/{id}")
    @Operation(summary = "Get annotation by ID", description = "Returns a specific annotation by its ID")
    fun getAnnotationById(@PathParam("id") id: UUID): Response {
        logger.info("GET /api/v1/annotations/$id")
        return Response.ok(annotationService.findById(id)).build()
    }
    
    @POST
    @Operation(summary = "Create annotation", description = "Creates a new annotation")
    fun createAnnotation(annotation: Annotation): Response {
        logger.info("POST /api/v1/annotations - textId: ${annotation.text.id}")
        val createdAnnotation = annotationService.create(annotation)
        return Response.status(Response.Status.CREATED).entity(createdAnnotation).build()
    }
    
    @PUT
    @Path("/{id}")
    @Operation(summary = "Update annotation", description = "Updates an existing annotation")
    fun updateAnnotation(@PathParam("id") id: UUID, annotation: Annotation): Response {
        logger.info("PUT /api/v1/annotations/$id")
        val updatedAnnotation = annotationService.update(id, annotation)
        return Response.ok(updatedAnnotation).build()
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
    @Path("/text/{textId}")
    @Operation(summary = "Find annotations by text ID", description = "Returns annotations for the given text")
    fun findByTextId(
        @PathParam("textId") textId: UUID,
        @QueryParam("page") @DefaultValue("0") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/annotations/text/$textId - page: $page, size: $size")
        return Response.ok(annotationService.findByTextId(textId, page, size)).build()
    }
    
    @GET
    @Path("/type/{type}")
    @Operation(summary = "Find annotations by type", description = "Returns annotations with the given type")
    fun findByType(
        @PathParam("type") type: AnnotationType,
        @QueryParam("page") @DefaultValue("0") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/annotations/type/$type - page: $page, size: $size")
        return Response.ok(annotationService.findByType(type, page, size)).build()
    }
    
    @GET
    @Path("/text/{textId}/type/{type}")
    @Operation(summary = "Find annotations by text ID and type", description = "Returns annotations for the given text with the given type")
    fun findByTextIdAndType(
        @PathParam("textId") textId: UUID,
        @PathParam("type") type: AnnotationType,
        @QueryParam("page") @DefaultValue("0") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/annotations/text/$textId/type/$type - page: $page, size: $size")
        return Response.ok(annotationService.findByTextIdAndType(textId, type, page, size)).build()
    }
    
    @GET
    @Path("/text/{textId}/position")
    @Operation(summary = "Find annotations by position range", description = "Returns annotations within the given position range")
    fun findByPositionRange(
        @PathParam("textId") textId: UUID,
        @QueryParam("start") startPosition: Int,
        @QueryParam("end") endPosition: Int,
        @QueryParam("page") @DefaultValue("0") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/annotations/text/$textId/position - start: $startPosition, end: $endPosition, page: $page, size: $size")
        return Response.ok(annotationService.findByPositionRange(textId, startPosition, endPosition, page, size)).build()
    }
    
    @GET
    @Path("/search/{query}")
    @Operation(summary = "Search annotations by content", description = "Returns annotations containing the given text in content")
    fun searchByContent(
        @PathParam("query") query: String,
        @QueryParam("page") @DefaultValue("0") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/annotations/search/$query - page: $page, size: $size")
        return Response.ok(annotationService.searchByContent(query, page, size)).build()
    }
    
    @DELETE
    @Path("/text/{textId}")
    @Operation(summary = "Delete annotations by text ID", description = "Deletes all annotations for the given text")
    fun deleteByTextId(@PathParam("textId") textId: UUID): Response {
        logger.info("DELETE /api/v1/annotations/text/$textId")
        val count = annotationService.deleteByTextId(textId)
        return Response.ok(mapOf("deletedCount" to count)).build()
    }
}
