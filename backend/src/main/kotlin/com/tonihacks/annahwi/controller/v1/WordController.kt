package com.tonihacks.annahwi.controller.v1

import com.tonihacks.annahwi.dto.request.WordRequestDTO
import com.tonihacks.annahwi.dto.response.PaginatedResponse
import com.tonihacks.annahwi.entity.Dialect
import com.tonihacks.annahwi.entity.Difficulty
import com.tonihacks.annahwi.entity.MasteryLevel
import com.tonihacks.annahwi.entity.PartOfSpeech
import com.tonihacks.annahwi.service.WordService
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

@Path("/api/v1/words")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Word", description = "Word management endpoints")
class WordController {
    
    @Inject
    lateinit var wordService: WordService
    
    private val logger = Logger.getLogger(WordController::class.java)
    
    @GET
    @Operation(summary = "Get all words", description = "Returns a list of words with pagination and optional filtering")
    fun getAllWords(
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int,
        @QueryParam("sort") @DefaultValue("arabic") sort: String,
        @QueryParam("difficulty") difficulty: Difficulty?,
        @QueryParam("dialect") dialect: Dialect?,
        @QueryParam("partOfSpeech") partOfSpeech: PartOfSpeech?,
        @QueryParam("masteryLevel") masteryLevel: MasteryLevel?,
        @QueryParam("verified") verified: Boolean?
    ): Response {
        logger.info(
            "GET /api/v1/words - page: $page, size: $size, sort: $sort, " +
            "difficulty: $difficulty, dialect: $dialect, partOfSpeech: $partOfSpeech, masteryLevel: $masteryLevel, verified: $verified"
        )
        val pagination = PaginationUtil.toZeroBasedPage(page)
        val total = wordService.countWithFilters(difficulty, dialect, partOfSpeech, masteryLevel, verified)
        val words = wordService.findAllWithFilters(pagination, size, sort, difficulty, dialect, partOfSpeech, masteryLevel, verified)
        val paginatedResponse = PaginatedResponse(
            items = words,
            totalCount = total,
            page = page,
            pageSize = size
        )
        return Response.ok(paginatedResponse).build()
    }
    
    @GET
    @Path("/{id}")
    @Operation(summary = "Get word by ID", description = "Returns a specific word by its ID")
    fun getWordById(@PathParam("id") id: UUID): Response {
        logger.info("GET /api/v1/words/$id")
        return Response.ok(wordService.findById(id)).build()
    }
    
    @POST
    @Operation(summary = "Create word", description = "Creates a new word")
    fun createWord(wordDTO: WordRequestDTO): Response {
        logger.info("POST /api/v1/words - arabic: ${wordDTO.arabic}")
        val createdWord = wordService.create(wordDTO)
        return Response.status(Response.Status.CREATED).entity(createdWord).build()
    }
    
    @PUT
    @Path("/{id}")
    @Operation(summary = "Update word", description = "Updates an existing word")
    fun updateWord(@PathParam("id") id: UUID, wordDTO: WordRequestDTO): Response {
        logger.info("PUT /api/v1/words/$id")
        val updatedWord = wordService.update(id, wordDTO)
        return Response.ok(updatedWord).build()
    }
    
    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete word", description = "Deletes a word")
    fun deleteWord(@PathParam("id") id: UUID): Response {
        logger.info("DELETE /api/v1/words/$id")
        wordService.delete(id)
        return Response.noContent().build()
    }
    
    @GET
    @Path("/arabic/{arabic}")
    @Operation(summary = "Find word by Arabic text", description = "Returns a word matching the given Arabic text")
    fun findByArabic(@PathParam("arabic") arabic: String): Response {
        logger.info("GET /api/v1/words/arabic/$arabic")
        val word = wordService.findByArabic(arabic)
        return if (word.isPresent) {
            Response.ok(word.get()).build()
        } else {
            Response.status(Response.Status.NOT_FOUND).build()
        }
    }
    
    @GET
    @Path("/search/arabic/{arabic}")
    @Operation(summary = "Search words by Arabic text", description = "Returns words containing the given Arabic text")
    fun searchByArabic(
        @PathParam("arabic") arabic: String,
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/words/search/arabic/$arabic - page: $page, size: $size")
        val pagination = PaginationUtil.toZeroBasedPage(page)
        val total = wordService.countAll()
        val paginatedResponse = PaginatedResponse(
            items = wordService.searchByArabic(arabic, pagination, size),
            totalCount = total,
            page = page,
            pageSize = size
        )
        return Response.ok(paginatedResponse).build()
    }
    
    @GET
    @Path("/root/{root}")
    @Operation(summary = "Find words by root", description = "Returns words with the given root")
    fun findByRoot(
        @PathParam("root") root: String,
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/words/root/$root - page: $page, size: $size")
        val pagination = PaginationUtil.toZeroBasedPage(page)
        val total = wordService.countAll()
        val paginatedResponse = PaginatedResponse(
            items = wordService.findByRoot(root, pagination, size),
            totalCount = total,
            page = page,
            pageSize = size
        )
        return Response.ok(paginatedResponse).build()
    }
    
    @GET
    @Path("/part-of-speech/{partOfSpeech}")
    @Operation(summary = "Find words by part of speech", description = "Returns words with the given part of speech")
    fun findByPartOfSpeech(
        @PathParam("partOfSpeech") partOfSpeech: PartOfSpeech,
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/words/part-of-speech/$partOfSpeech - page: $page, size: $size")
        val pagination = PaginationUtil.toZeroBasedPage(page)
        val total = wordService.countAll()
        val paginatedResponse = PaginatedResponse(
            items = wordService.findByPartOfSpeech(partOfSpeech, pagination, size),
            totalCount = total,
            page = page,
            pageSize = size
        )
        return Response.ok(paginatedResponse).build()
    }
    
    @GET
    @Path("/dialect/{dialect}")
    @Operation(summary = "Find words by dialect", description = "Returns words with the given dialect")
    fun findByDialect(
        @PathParam("dialect") dialect: Dialect,
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/words/dialect/$dialect - page: $page, size: $size")
        val pagination = PaginationUtil.toZeroBasedPage(page)
        val total = wordService.countAll()
        val paginatedResponse = PaginatedResponse(
            items = wordService.findByDialect(dialect, pagination, size),
            totalCount = total,
            page = page,
            pageSize = size
        )
        return Response.ok(paginatedResponse).build()
    }
    
    @GET
    @Path("/difficulty/{difficulty}")
    @Operation(summary = "Find words by difficulty", description = "Returns words with the given difficulty")
    fun findByDifficulty(
        @PathParam("difficulty") difficulty: Difficulty,
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/words/difficulty/$difficulty - page: $page, size: $size")
        val pagination = PaginationUtil.toZeroBasedPage(page)
        val total = wordService.countAll()
        val paginatedResponse = PaginatedResponse(
            items = wordService.findByDifficulty(difficulty, pagination, size),
            totalCount = total,
            page = page,
            pageSize = size
        )
        return Response.ok(paginatedResponse).build()
    }
    
    @GET
    @Path("/verified")
    @Operation(summary = "Find verified words", description = "Returns verified words")
    fun findVerified(
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/words/verified - page: $page, size: $size")
        val pagination = PaginationUtil.toZeroBasedPage(page)
        val total = wordService.countAll()
        val paginatedResponse = PaginatedResponse(
            items = wordService.findVerified(pagination, size),
            totalCount = total,
            page = page,
            pageSize = size
        )
        return Response.ok(paginatedResponse).build()
    }
    
    @GET
    @Path("/search/translation/{query}")
    @Operation(summary = "Search words by translation", description = "Returns words containing the given text in translation or transliteration")
    fun searchByTranslation(
        @PathParam("query") query: String,
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int
    ): Response {
        logger.info("GET /api/v1/words/search/translation/$query - page: $page, size: $size")
        val pagination = PaginationUtil.toZeroBasedPage(page)
        val total = wordService.countAll()
        val paginatedResponse = PaginatedResponse(
            items = wordService.searchByTranslation(query, pagination, size),
            totalCount = total,
            page = page,
            pageSize = size
        )
        return Response.ok(paginatedResponse).build()
    }
}
