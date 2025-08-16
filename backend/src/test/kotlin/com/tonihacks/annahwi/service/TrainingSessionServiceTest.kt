package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.entity.MasteryLevel
import com.tonihacks.annahwi.entity.ReviewMode
import com.tonihacks.annahwi.entity.TrainingResult
import com.tonihacks.annahwi.entity.Word
import com.tonihacks.annahwi.entity.WordProgressTracking
import com.tonihacks.annahwi.repository.TrainingSessionRepository
import com.tonihacks.annahwi.repository.WordProgressTrackingRepository
import com.tonihacks.annahwi.repository.WordRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.util.UUID

class TrainingSessionServiceTest {

    private lateinit var trainingSessionService: TrainingSessionService
    private lateinit var mockTrainingSessionRepository: TrainingSessionRepository
    private lateinit var mockWordRepository: WordRepository
    private lateinit var mockProgressRepository: WordProgressTrackingRepository

    @BeforeEach
    fun setUp() {
        mockTrainingSessionRepository = mockk(relaxed = true)
        mockWordRepository = mockk(relaxed = true)
        mockProgressRepository = mockk(relaxed = true)
        
        trainingSessionService = TrainingSessionService().apply {
            trainingSessionRepository = mockTrainingSessionRepository
            wordRepository = mockWordRepository
            progressRepository = mockProgressRepository
        }
    }

    @Test
    fun `should update mastery level from NEW to LEARNING after 3 consecutive correct answers`() {
        // Given
        val word = createMockWord(MasteryLevel.NEW)
        val progress = WordProgressTracking().apply {
            this.word = word
            consecutiveCorrect = 2
            totalCorrect = 2
            totalAttempts = 2
        }
        
        every { mockProgressRepository.findOrCreateByWord(word) } returns progress

        // When
        trainingSessionService.updateWordProgress(word, TrainingResult.CORRECT)

        // Then
        assertEquals(MasteryLevel.LEARNING, word.masteryLevel)
        assertEquals(3, progress.consecutiveCorrect)
        assertEquals(3, progress.totalCorrect)
        assertEquals(3, progress.totalAttempts)
        assertNotNull(progress.masteryLevelUpdatedAt)
    }

    @Test
    fun `should update mastery level from LEARNING to KNOWN after 10 total correct answers`() {
        // Given
        val word = createMockWord(MasteryLevel.LEARNING)
        val progress = WordProgressTracking().apply {
            this.word = word
            consecutiveCorrect = 5
            totalCorrect = 9
            totalAttempts = 15
        }
        
        every { mockProgressRepository.findOrCreateByWord(word) } returns progress

        // When
        trainingSessionService.updateWordProgress(word, TrainingResult.CORRECT)

        // Then
        assertEquals(MasteryLevel.KNOWN, word.masteryLevel)
        assertEquals(6, progress.consecutiveCorrect)
        assertEquals(10, progress.totalCorrect)
        assertEquals(16, progress.totalAttempts)
        assertNotNull(progress.masteryLevelUpdatedAt)
    }

    @Test
    fun `should update mastery level from KNOWN to MASTERED after 15 total correct answers`() {
        // Given
        val word = createMockWord(MasteryLevel.KNOWN)
        val progress = WordProgressTracking().apply {
            this.word = word
            consecutiveCorrect = 3
            totalCorrect = 14
            totalAttempts = 20
        }
        
        every { mockProgressRepository.findOrCreateByWord(word) } returns progress

        // When
        trainingSessionService.updateWordProgress(word, TrainingResult.CORRECT)

        // Then
        assertEquals(MasteryLevel.MASTERED, word.masteryLevel)
        assertEquals(4, progress.consecutiveCorrect)
        assertEquals(15, progress.totalCorrect)
        assertEquals(21, progress.totalAttempts)
        assertNotNull(progress.masteryLevelUpdatedAt)
    }

    @Test
    fun `should reset consecutive correct on incorrect answer`() {
        // Given
        val word = createMockWord(MasteryLevel.LEARNING)
        val progress = WordProgressTracking().apply {
            this.word = word
            consecutiveCorrect = 5
            totalCorrect = 8
            totalAttempts = 12
        }
        
        every { mockProgressRepository.findOrCreateByWord(word) } returns progress

        // When
        trainingSessionService.updateWordProgress(word, TrainingResult.INCORRECT)

        // Then
        assertEquals(MasteryLevel.LEARNING, word.masteryLevel) // Should remain the same
        assertEquals(0, progress.consecutiveCorrect) // Should reset
        assertEquals(8, progress.totalCorrect) // Should remain the same
        assertEquals(13, progress.totalAttempts) // Should increment
    }

    @Test
    fun `should not change consecutive correct on skipped answer`() {
        // Given
        val word = createMockWord(MasteryLevel.LEARNING)
        val progress = WordProgressTracking().apply {
            this.word = word
            consecutiveCorrect = 3
            totalCorrect = 7
            totalAttempts = 10
        }
        
        every { mockProgressRepository.findOrCreateByWord(word) } returns progress

        // When
        trainingSessionService.updateWordProgress(word, TrainingResult.SKIPPED)

        // Then
        assertEquals(MasteryLevel.LEARNING, word.masteryLevel)
        assertEquals(3, progress.consecutiveCorrect) // Should remain the same
        assertEquals(7, progress.totalCorrect) // Should remain the same
        assertEquals(11, progress.totalAttempts) // Should increment
    }

    @Test
    fun `should select words by review mode NEW`() {
        // Given
        val newWords = listOf(
            createMockWord(MasteryLevel.NEW),
            createMockWord(MasteryLevel.NEW)
        )
        every { mockWordRepository.find("masteryLevel", MasteryLevel.NEW).list() } returns newWords

        // When
        val selectedWords = trainingSessionService.selectWordsForReview(ReviewMode.NEW, 10)

        // Then
        assertEquals(2, selectedWords.size)
        verify { mockWordRepository.find("masteryLevel", MasteryLevel.NEW) }
    }

    @Test
    fun `should select words by review mode MIXED with balanced distribution`() {
        // Given
        val newWords = (1..5).map { createMockWord(MasteryLevel.NEW) }
        val learningWords = (1..5).map { createMockWord(MasteryLevel.LEARNING) }
        val knownWords = (1..5).map { createMockWord(MasteryLevel.KNOWN) }
        
        every { mockWordRepository.find("masteryLevel", MasteryLevel.NEW).list() } returns newWords
        every { mockWordRepository.find("masteryLevel", MasteryLevel.LEARNING).list() } returns learningWords
        every { mockWordRepository.find("masteryLevel in (?1, ?2)", MasteryLevel.KNOWN, MasteryLevel.MASTERED).list() } returns knownWords

        // When
        val selectedWords = trainingSessionService.selectWordsForReview(ReviewMode.MIXED, 15)

        // Then
        assertEquals(15, selectedWords.size)
        // Should contain words from all levels
        verify { mockWordRepository.find("masteryLevel", MasteryLevel.NEW) }
        verify { mockWordRepository.find("masteryLevel", MasteryLevel.LEARNING) }
        verify { mockWordRepository.find("masteryLevel in (?1, ?2)", MasteryLevel.KNOWN, MasteryLevel.MASTERED) }
    }

    private fun createMockWord(masteryLevel: MasteryLevel = MasteryLevel.NEW): Word {
        return mockk<Word>(relaxed = true).apply {
            every { id } returns UUID.randomUUID()
            every { this@apply.masteryLevel } returns masteryLevel
            every { this@apply.masteryLevel = any() } answers { 
                every { this@apply.masteryLevel } returns firstArg()
            }
        }
    }
}
