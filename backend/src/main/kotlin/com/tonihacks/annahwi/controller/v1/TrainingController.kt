package com.tonihacks.annahwi.controller.v1

import com.tonihacks.annahwi.dto.request.RecordResultRequestDTO
import com.tonihacks.annahwi.dto.request.StartTrainingSessionRequestDTO
import com.tonihacks.annahwi.dto.response.RecentSessionDTO
import com.tonihacks.annahwi.dto.response.TrainingSessionResponseDTO
import com.tonihacks.annahwi.dto.response.TrainingStatsResponseDTO
import com.tonihacks.annahwi.dto.response.WordResponseDTO
import com.tonihacks.annahwi.service.TrainingSessionService
import jakarta.inject.Inject
import jakarta.validation.Valid
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.DELETE
import jakarta.ws.rs.GET
import jakarta.ws.rs.POST
import jakarta.ws.rs.PUT
import jakarta.ws.rs.Path
import jakarta.ws.rs.PathParam
import jakarta.ws.rs.Produces
import jakarta.ws.rs.QueryParam
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import org.eclipse.microprofile.openapi.annotations.tags.Tag
import java.util.UUID

@Path("/api/v1/training")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Training", description = "APIs for managing training sessions")
class TrainingController {
    
    @Inject
    private lateinit var trainingSessionService: TrainingSessionService
    
    @POST
    @Path("/sessions/start")
    fun startSession(@Valid request: StartTrainingSessionRequestDTO): Response {
        val session = trainingSessionService.startTrainingSession(
            request.reviewMode, 
            request.sessionLength
        )
        val words = trainingSessionService.getWordsForSession(session.id!!)
        
        val responseDTO = TrainingSessionResponseDTO(
            id = session.id!!,
            sessionType = session.sessionType,
            reviewMode = session.reviewMode,
            startedAt = session.startedAt,
            completedAt = session.completedAt,
            totalWords = session.totalWords,
            correctAnswers = session.correctAnswers,
            words = words.map { word -> WordResponseDTO.fromEntity(word) }
        )
        
        return Response.ok(responseDTO).build()
    }
    
    @POST
    @Path("/sessions/{sessionId}/results")
    fun recordResult(
        @PathParam("sessionId") sessionId: UUID,
        @Valid request: RecordResultRequestDTO
    ): Response {
        trainingSessionService.recordResult(sessionId, request.wordId, request.result)
        return Response.ok().build()
    }
    
    @PUT
    @Path("/sessions/{sessionId}/complete")
    fun completeSession(@PathParam("sessionId") sessionId: UUID): Response {
        val session = trainingSessionService.completeSession(sessionId)
        val words = trainingSessionService.getWordsForSession(sessionId)
        
        val responseDTO = TrainingSessionResponseDTO(
            id = session.id!!,
            sessionType = session.sessionType,
            reviewMode = session.reviewMode,
            startedAt = session.startedAt,
            completedAt = session.completedAt,
            totalWords = session.totalWords,
            correctAnswers = session.correctAnswers,
            words = words.map { word -> WordResponseDTO.fromEntity(word) }
        )
        
        return Response.ok(responseDTO).build()
    }
    
    @GET
    @Path("/sessions/{sessionId}")
    fun getSession(@PathParam("sessionId") sessionId: UUID): Response {
        val session = trainingSessionService.getSession(sessionId)
            ?: return Response.status(Response.Status.NOT_FOUND).build()
            
        val words = trainingSessionService.getWordsForSession(sessionId)
        
        val responseDTO = TrainingSessionResponseDTO(
            id = session.id!!,
            sessionType = session.sessionType,
            reviewMode = session.reviewMode,
            startedAt = session.startedAt,
            completedAt = session.completedAt,
            totalWords = session.totalWords,
            correctAnswers = session.correctAnswers,
            words = words.map { word -> WordResponseDTO.fromEntity(word) }
        )
        
        return Response.ok(responseDTO).build()
    }
    
    @GET
    @Path("/stats")
    fun getTrainingStats(): Response {
        val stats = trainingSessionService.getTrainingStats()
        
        val responseDTO = TrainingStatsResponseDTO(
            totalSessions = stats.totalSessions,
            totalWordsReviewed = stats.totalWordsReviewed,
            averageAccuracy = stats.averageAccuracy,
            recentSessions = stats.recentSessions.map { session ->
                RecentSessionDTO(
                    id = session.id!!.toString(),
                    completedAt = session.completedAt!!,
                    reviewMode = session.reviewMode.name,
                    totalWords = session.totalWords,
                    correctAnswers = session.correctAnswers,
                    accuracy = if (session.totalWords > 0) session.correctAnswers.toDouble() / session.totalWords * 100 else 0.0
                )
            },
            accuracyByReviewMode = stats.accuracyByReviewMode.mapKeys { it.key.name }
        )
        
        return Response.ok(responseDTO).build()
    }
    
    @DELETE
    @Path("/cleanup")
    fun cleanupOldSessions(@QueryParam("count") count: Int = 10): Response {
        if (count <= 0 || count > 100) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(mapOf("error" to "Count must be between 1 and 100"))
                .build()
        }
        
        val deletedCount = trainingSessionService.cleanOldestSessions(count)
        return Response.ok(mapOf("deleted" to deletedCount)).build()
    }
}
