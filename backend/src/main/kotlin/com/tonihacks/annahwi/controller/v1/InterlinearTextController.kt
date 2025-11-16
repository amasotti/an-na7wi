package com.tonihacks.annahwi.controller.v1

import com.tonihacks.annahwi.dto.request.InterlinearSentenceRequestDTO
import com.tonihacks.annahwi.dto.request.InterlinearTextRequestDTO
import com.tonihacks.annahwi.dto.request.WordAlignmentRequestDTO
import com.tonihacks.annahwi.dto.response.*
import com.tonihacks.annahwi.exception.AppError
import com.tonihacks.annahwi.exception.AppException
import com.tonihacks.annahwi.service.InterlinearTextService
import com.tonihacks.annahwi.util.PaginationUtil
import jakarta.inject.Inject
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import org.eclipse.microprofile.openapi.annotations.Operation
import org.eclipse.microprofile.openapi.annotations.tags.Tag
import org.jboss.logging.Logger
import java.util.*

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
      throw AppException(
        AppError.ValidationError.InvalidPageSize(
          size = if (pageSize != null) pageSize else size
        )
      )
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
  @Operation(
    summary = "Get interlinear text by ID",
    description = "Returns a specific interlinear text with all sentences and alignments"
  )
  fun getTextById(@PathParam("id") id: UUID): Response {
    logger.info("GET /api/v1/interlinear-texts/$id")
    val text = interlinearTextService.findById(id)
    val textDTO = InterlinearTextDetailDTO.fromEntity(text)
    return Response.ok(textDTO).build()
  }

  @GET
  @Path("/search")
  @Operation(
    summary = "Search interlinear texts",
    description = "Searches interlinear texts by title with pagination"
  )
  fun searchTexts(
    @QueryParam("query") query: String,
    @QueryParam("page") @DefaultValue("1") page: Int,
    @QueryParam("size") @DefaultValue("10") size: Int,
    @QueryParam("pageSize") pageSize: Int?,
    @QueryParam("sort") @DefaultValue("title") sort: String
  ): Response {
    if (page < 1) {
      throw AppException(AppError.ValidationError.InvalidPageNumber(page))
    }
    if (size < 1 || (pageSize != null && pageSize < 1)) {
      throw AppException(
        AppError.ValidationError.InvalidPageSize(
          size = if (pageSize != null) pageSize else size
        )
      )
    }

    val actualSize = PaginationUtil.resolvePageSize(size, pageSize)
    val zeroBasedPage = PaginationUtil.toZeroBasedPage(page)
    logger.info("GET /api/v1/interlinear-texts/search - query: $query")

    val texts = interlinearTextService.searchTexts(query, zeroBasedPage, actualSize, sort)
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
  @Operation(
    summary = "Delete interlinear text",
    description = "Deletes an interlinear text and all associated sentences and alignments"
  )
  fun deleteText(@PathParam("id") id: UUID): Response {
    logger.info("DELETE /api/v1/interlinear-texts/$id")
    interlinearTextService.findById(id)  // Verify text exists first
    interlinearTextService.delete(id)
    return Response.noContent().build()
  }

  @POST
  @Path("/{textId}/sentences")
  @Operation(summary = "Add sentence", description = "Adds a new sentence to an interlinear text")
  fun addSentence(
    @PathParam("textId") textId: UUID,
    sentenceDTO: InterlinearSentenceRequestDTO
  ): Response {
    logger.info("POST /api/v1/interlinear-texts/$textId/sentences")
    val sentence = sentenceDTO.toEntity()
    val createdSentence = interlinearTextService.addSentence(textId, sentence)
    return Response.status(Response.Status.CREATED)
      .entity(InterlinearSentenceResponseDTO.fromEntity(createdSentence))
      .build()
  }

  @PUT
  @Path("/{textId}/sentences/{sentenceId}")
  @Operation(summary = "Update sentence", description = "Updates an existing sentence")
  fun updateSentence(
    @PathParam("textId") textId: UUID,
    @PathParam("sentenceId") sentenceId: UUID,
    sentenceDTO: InterlinearSentenceRequestDTO
  ): Response {
    logger.info("PUT /api/v1/interlinear-texts/$textId/sentences/$sentenceId")
    val sentence = sentenceDTO.toEntity()
    val updatedSentence = interlinearTextService.updateSentence(textId, sentenceId, sentence)
    return Response.ok(InterlinearSentenceResponseDTO.fromEntity(updatedSentence)).build()
  }

  @DELETE
  @Path("/{textId}/sentences/{sentenceId}")
  @Operation(summary = "Delete sentence", description = "Deletes a sentence from an interlinear text")
  fun deleteSentence(
    @PathParam("textId") textId: UUID,
    @PathParam("sentenceId") sentenceId: UUID
  ): Response {
    logger.info("DELETE /api/v1/interlinear-texts/$textId/sentences/$sentenceId")
    interlinearTextService.deleteSentence(textId, sentenceId)
    return Response.noContent().build()
  }

  @PUT
  @Path("/{textId}/sentences/reorder")
  @Operation(summary = "Reorder sentences", description = "Updates the order of sentences in an interlinear text")
  fun reorderSentences(
    @PathParam("textId") textId: UUID,
    request: ReorderSentencesRequest
  ): Response {
    logger.info("PUT /api/v1/interlinear-texts/$textId/sentences/reorder - ${request.sentenceIds.size} sentences")
    interlinearTextService.reorderSentences(textId, request.sentenceIds)
    return Response.noContent().build()
  }

  @POST
  @Path("/{textId}/sentences/{sentenceId}/autolignment")
  @Operation(summary = "Add word alignment", description = "Adds a new word alignment to a sentence")
  fun autocreateAlignment(
    @PathParam("textId") textId: UUID,
    @PathParam("sentenceId") sentenceId: UUID,
  ): Response {
    logger.info("POST /api/v1/interlinear-texts/$textId/sentences/$sentenceId/autolignment")
    interlinearTextService.tokenize(textId, sentenceId)
    return Response.noContent().build()
  }

  @POST
  @Path("/{textId}/sentences/{sentenceId}/alignments")
  @Operation(summary = "Add word alignment", description = "Adds a new word alignment to a sentence")
  fun addAlignment(
    @PathParam("textId") textId: UUID,
    @PathParam("sentenceId") sentenceId: UUID,
    alignmentDTO: WordAlignmentRequestDTO
  ): Response {
    logger.info("POST /api/v1/interlinear-texts/$textId/sentences/$sentenceId/alignments")
    val alignment = alignmentDTO.toEntity()
    val createdAlignment =
      interlinearTextService.addAlignment(textId, sentenceId, alignment, alignmentDTO.vocabularyWordId)
    return Response.status(Response.Status.CREATED)
      .entity(WordAlignmentResponseDTO.fromEntity(createdAlignment))
      .build()
  }

  @PUT
  @Path("/{textId}/sentences/{sentenceId}/alignments/{alignmentId}")
  @Operation(summary = "Update word alignment", description = "Updates an existing word alignment")
  fun updateAlignment(
    @PathParam("textId") textId: UUID,
    @PathParam("sentenceId") sentenceId: UUID,
    @PathParam("alignmentId") alignmentId: UUID,
    alignmentDTO: WordAlignmentRequestDTO
  ): Response {
    logger.info("PUT /api/v1/interlinear-texts/$textId/sentences/$sentenceId/alignments/$alignmentId")
    val alignment = alignmentDTO.toEntity()
    // Only update tokenOrder if it was explicitly provided in the request
    val shouldUpdateTokenOrder = alignmentDTO.tokenOrder != null
    val updatedAlignment = interlinearTextService.updateAlignment(
      textId,
      sentenceId,
      alignmentId,
      alignment,
      alignmentDTO.vocabularyWordId,
      shouldUpdateTokenOrder
    )
    return Response.ok(WordAlignmentResponseDTO.fromEntity(updatedAlignment)).build()
  }

  @DELETE
  @Path("/{textId}/sentences/{sentenceId}/alignments")
  @Operation(summary = "Clear all word alignments", description = "Deletes all word alignments from a sentence")
  fun clearAlignment(
    @PathParam("textId") textId: UUID,
    @PathParam("sentenceId") sentenceId: UUID,
  ): Response {
    logger.info("DELETE /api/v1/interlinear-texts/$textId/sentences/$sentenceId/alignments")
    interlinearTextService.cleanAlignements(textId, sentenceId)
    return Response.noContent().build()
  }

  @DELETE
  @Path("/{textId}/sentences/{sentenceId}/alignments/{alignmentId}")
  @Operation(summary = "Delete word alignment", description = "Deletes a word alignment from a sentence")
  fun deleteAlignment(
    @PathParam("textId") textId: UUID,
    @PathParam("sentenceId") sentenceId: UUID,
    @PathParam("alignmentId") alignmentId: UUID
  ): Response {
    logger.info("DELETE /api/v1/interlinear-texts/$textId/sentences/$sentenceId/alignments/$alignmentId")
    interlinearTextService.deleteAlignment(textId, sentenceId, alignmentId)
    return Response.noContent().build()
  }

  @PUT
  @Path("/{textId}/sentences/{sentenceId}/alignments/reorder")
  @Operation(summary = "Reorder word alignments", description = "Updates the order of word alignments in a sentence")
  fun reorderAlignments(
    @PathParam("textId") textId: UUID,
    @PathParam("sentenceId") sentenceId: UUID,
    request: ReorderAlignmentsRequest
  ): Response {
    logger.info("PUT /api/v1/interlinear-texts/$textId/sentences/$sentenceId/alignments/reorder - ${request.alignmentIds.size} alignments")
    interlinearTextService.reorderAlignments(textId, sentenceId, request.alignmentIds)
    return Response.noContent().build()
  }
}

data class ReorderSentencesRequest(
  val sentenceIds: List<UUID>
)

data class ReorderAlignmentsRequest(
  val alignmentIds: List<UUID>
)
