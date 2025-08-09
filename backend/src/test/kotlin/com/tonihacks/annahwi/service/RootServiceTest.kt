package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.config.GlobalTestProfile
import com.tonihacks.annahwi.dto.request.RootRequestDTO
import com.tonihacks.annahwi.dto.response.RootResponseDTO
import com.tonihacks.annahwi.exception.AppException
import com.tonihacks.annahwi.repository.ArabicRootRepository
import io.quarkus.test.junit.QuarkusTest
import io.quarkus.test.junit.TestProfile
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.util.UUID

@QuarkusTest
@TestProfile(GlobalTestProfile::class)
class RootServiceTest {

    @Inject
    lateinit var rootService: RootService
    
    @Inject
    lateinit var rootRepository: ArabicRootRepository

    @BeforeEach
    @Transactional
    fun setUp() {
        rootRepository.deleteAll()
    }

    @Test
    @Transactional
    fun testCreateRoot() {
        val requestDTO = RootRequestDTO(
            input = "ك-ت-ب",
            meaning = "to write"
        )
        
        val createdRoot = rootService.createRoot(requestDTO)
        
        assertNotNull(createdRoot)
        assertNotNull(createdRoot.id)
        assertEquals("كتب", createdRoot.normalizedForm)
        assertEquals("ك-ت-ب", createdRoot.displayForm)
        assertEquals(listOf("ك", "ت", "ب"), createdRoot.letters)
        assertEquals("to write", createdRoot.meaning)
        assertEquals(3, createdRoot.letterCount)
    }

    @Test
    @Transactional
    fun testCreateDuplicateRootThrowsException() {
        val requestDTO = RootRequestDTO(
            input = "ك-ت-ب",
            meaning = "to write"
        )
        
        rootService.createRoot(requestDTO)
        
        assertThrows(AppException::class.java) {
            rootService.createRoot(requestDTO)
        }
    }

    @Test
    @Transactional
    fun testFindById() {
        val requestDTO = RootRequestDTO(
            input = "ك-ت-ب",
            meaning = "to write"
        )
        val createdRoot = rootService.createRoot(requestDTO)
        
        val foundRoot = rootService.findById(createdRoot.id!!)
        
        assertNotNull(foundRoot)
        assertEquals(createdRoot.id, foundRoot.id)
        assertEquals(createdRoot.normalizedForm, foundRoot.normalizedForm)
        assertEquals(createdRoot.displayForm, foundRoot.displayForm)
    }

    @Test
    @Transactional
    fun testFindByIdNonExistentThrowsException() {
        val nonExistentId = UUID.randomUUID()
        
        assertThrows(AppException::class.java) {
            rootService.findById(nonExistentId)
        }
    }

    @Test
    @Transactional
    fun testFindByNormalizedForm() {
        val requestDTO = RootRequestDTO(
            input = "ك-ت-ب",
            meaning = "to write"
        )
        rootService.createRoot(requestDTO)
        
        val foundRoot = rootService.findByNormalizedForm("كتب")
        
        assertNotNull(foundRoot)
        assertEquals("كتب", foundRoot!!.normalizedForm)
        assertEquals("ك-ت-ب", foundRoot.displayForm)
    }

    @Test
    @Transactional
    fun testUpdateRoot() {
        val createDTO = RootRequestDTO(
            input = "ك-ت-ب",
            meaning = "to write"
        )
        val createdRoot = rootService.createRoot(createDTO)
        
        val updateDTO = RootRequestDTO(
            input = "ك-ت-ب",
            meaning = "writing, inscription"
        )
        
        val updatedRoot = rootService.updateRoot(createdRoot.id!!, updateDTO)
        
        assertNotNull(updatedRoot)
        assertEquals(createdRoot.id, updatedRoot.id)
        assertEquals("كتب", updatedRoot.normalizedForm)
        assertEquals("ك-ت-ب", updatedRoot.displayForm)
        assertEquals("writing, inscription", updatedRoot.meaning)
    }

    @Test
    @Transactional
    fun testUpdateRootWithDifferentInput() {
        val createDTO = RootRequestDTO(
            input = "ك-ت-ب",
            meaning = "to write"
        )
        val createdRoot = rootService.createRoot(createDTO)
        
        val updateDTO = RootRequestDTO(
            input = "ق-ر-أ",
            meaning = "to read"
        )
        
        val updatedRoot = rootService.updateRoot(createdRoot.id!!, updateDTO)
        
        assertNotNull(updatedRoot)
        assertEquals(createdRoot.id, updatedRoot.id)
        assertEquals("قرأ", updatedRoot.normalizedForm)
        assertEquals("ق-ر-أ", updatedRoot.displayForm)
        assertEquals(listOf("ق", "ر", "أ"), updatedRoot.letters)
        assertEquals("to read", updatedRoot.meaning)
    }

    @Test
    @Transactional
    fun testUpdateRootToExistingFormThrowsException() {
        val firstRoot = rootService.createRoot(RootRequestDTO("ك-ت-ب", "to write"))
        val secondRoot = rootService.createRoot(RootRequestDTO("ق-ر-أ", "to read"))
        
        assertThrows(AppException::class.java) {
            rootService.updateRoot(secondRoot.id!!, RootRequestDTO(firstRoot.normalizedForm, firstRoot.meaning!!))
        }
    }

    @Test
    @Transactional
    fun testDeleteRoot() {
        val createDTO = RootRequestDTO(
            input = "ك-ت-ب",
            meaning = "to write"
        )
        val createdRoot = rootService.createRoot(createDTO)
        val rootId = createdRoot.id!!
        
        val deleted = rootService.deleteRoot(rootId)
        
        assertTrue(deleted)
        assertThrows(AppException::class.java) {
            rootService.findById(rootId)
        }
    }

    @Test
    @Transactional
    fun testDeleteNonExistentRootThrowsException() {
        val nonExistentId = UUID.randomUUID()
        
        assertThrows(AppException::class.java) {
            rootService.deleteRoot(nonExistentId)
        }
    }

    @Test
    @Transactional
    fun testFindAll() {
        rootService.createRoot(RootRequestDTO("ك-ت-ب", "to write"))
        rootService.createRoot(RootRequestDTO("ق-ر-أ", "to read"))
        rootService.createRoot(RootRequestDTO("د-ر-س", "to study"))
        
        val roots = rootService.findAll(0, 10)
        
        assertEquals(3, roots.size)
    }

    @Test
    @Transactional
    fun testFindAllWithPagination() {
        rootService.createRoot(RootRequestDTO("ك-ت-ب", "to write"))
        rootService.createRoot(RootRequestDTO("ق-ر-أ", "to read"))
        rootService.createRoot(RootRequestDTO("د-ر-س", "to study"))
        
        val firstPage = rootService.findAll(0, 2)
        val secondPage = rootService.findAll(1, 2)
        
        assertEquals(2, firstPage.size)
        assertEquals(1, secondPage.size)
    }

    @Test
    @Transactional
    fun testCountAll() {
        assertEquals(0, rootService.countAll())
        
        rootService.createRoot(RootRequestDTO("ك-ت-ب", "to write"))
        assertEquals(1, rootService.countAll())
        
        rootService.createRoot(RootRequestDTO("ق-ر-أ", "to read"))
        assertEquals(2, rootService.countAll())
    }

    @Test
    @Transactional
    fun testSearchRoots() {
        rootService.createRoot(RootRequestDTO("ك-ت-ب", "to write"))
        rootService.createRoot(RootRequestDTO("ق-ر-أ", "to read"))
        rootService.createRoot(RootRequestDTO("ك-ر-م", "generosity"))
        
        val results = rootService.searchRoots("ك", 0, 10)
        
        assertEquals(2, results.size)
        assertTrue(results.any { it.displayForm == "ك-ت-ب" })
        assertTrue(results.any { it.displayForm == "ك-ر-م" })
    }

    @Test
    @Transactional
    fun testFindByLetterCount() {
        rootService.createRoot(RootRequestDTO("ك-ت-ب", "to write"))
        rootService.createRoot(RootRequestDTO("د-ر-س", "to study"))
        rootService.createRoot(RootRequestDTO("س-ت-د-ر", "four letter root"))
        
        val triLiteralRoots = rootService.findByLetterCount(3, 0, 10)
        val quadriLiteralRoots = rootService.findByLetterCount(4, 0, 10)
        
        assertEquals(2, triLiteralRoots.size)
        assertEquals(1, quadriLiteralRoots.size)
        assertEquals("س-ت-د-ر", quadriLiteralRoots[0].displayForm)
    }

    @Test
    @Transactional
    fun testGetRootWithWords() {
        val root = rootService.createRoot(RootRequestDTO("ك-ت-ب", "to write"))
        
        val rootWithWords = rootService.getRootWithWords(root.id!!)
        
        assertNotNull(rootWithWords)
        assertEquals(root.id, rootWithWords.root.id)
        assertEquals("ك-ت-ب", rootWithWords.root.displayForm)
        assertTrue(rootWithWords.words.isEmpty())
    }

    @Test
    fun testNormalizeRoot() {
        val result = rootService.normalizeRoot("ك-ت-ب")
        
        assertNotNull(result)
        assertEquals(listOf("ك", "ت", "ب"), result!!.letters)
        assertEquals("كتب", result.normalizedForm)
        assertEquals("ك-ت-ب", result.displayForm)
        assertEquals(3, result.letterCount)
    }

    @Test
    fun testNormalizeInvalidRootReturnsNull() {
        val result = rootService.normalizeRoot("abc")
        
        assertEquals(null, result)
    }

    @Test
    @Transactional
    fun testGetStatistics() {
        rootService.createRoot(RootRequestDTO("ك-ت-ب", "to write"))
        rootService.createRoot(RootRequestDTO("ق-ر-أ", "to read"))
        rootService.createRoot(RootRequestDTO("س-ت-د-ر", "four letter root"))
        
        val statistics = rootService.getStatistics()
        
        assertNotNull(statistics)
        assertEquals(3L, statistics.totalRoots)
        assertEquals(2L, statistics.triLiteral)
        assertEquals(1L, statistics.quadriLiteral)
        assertEquals(0L, statistics.quinqueLiteral)
    }
}
