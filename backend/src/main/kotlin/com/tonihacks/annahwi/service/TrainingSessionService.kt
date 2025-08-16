package com.tonihacks.annahwi.service

import com.tonihacks.annahwi.entity.MasteryLevel
import com.tonihacks.annahwi.entity.ReviewMode
import com.tonihacks.annahwi.entity.TrainingResult
import com.tonihacks.annahwi.entity.TrainingSession
import com.tonihacks.annahwi.entity.TrainingSessionResult
import com.tonihacks.annahwi.entity.TrainingSessionWord
import com.tonihacks.annahwi.entity.Word
import com.tonihacks.annahwi.entity.WordProgressTracking
import com.tonihacks.annahwi.repository.TrainingSessionRepository
import com.tonihacks.annahwi.repository.TrainingSessionWordRepository
import com.tonihacks.annahwi.repository.WordProgressTrackingRepository
import com.tonihacks.annahwi.repository.WordRepository
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import java.time.LocalDateTime
import java.util.UUID

@ApplicationScoped
class TrainingSessionService {
    
    @Inject
    lateinit var trainingSessionRepository: TrainingSessionRepository
    
    @Inject
    lateinit var wordRepository: WordRepository
    
    @Inject
    lateinit var progressRepository: WordProgressTrackingRepository
    
    @Inject
    lateinit var sessionWordRepository: TrainingSessionWordRepository

    private val logger = org.jboss.logging.Logger.getLogger(TrainingSessionService::class.java)
    
    @Transactional
    fun startTrainingSession(reviewMode: ReviewMode, sessionLength: Int = 15): TrainingSession {
        val words = selectWordsForReview(reviewMode, sessionLength)
        
        val session = TrainingSession().apply {
            this.reviewMode = reviewMode
            this.totalWords = words.size
        }
        
        trainingSessionRepository.persist(session)
        
        // Store the selected words for this session
        words.forEachIndexed { index, word ->
            val sessionWord = TrainingSessionWord().apply {
                this.trainingSession = session
                this.word = word
                this.wordOrder = index
            }
            sessionWord.persist()
        }
        
        return session
    }
    
    @Transactional
    fun recordResult(sessionId: UUID, wordId: UUID, result: TrainingResult): TrainingSessionResult {
        val session = trainingSessionRepository.findById(sessionId)
            ?: throw IllegalArgumentException("Session not found: $sessionId")
        
        val word = wordRepository.findById(wordId)
            ?: throw IllegalArgumentException("Word not found: $wordId")
        
        val sessionResult = TrainingSessionResult().apply {
            this.trainingSession = session
            this.word = word
            this.result = result
        }
        sessionResult.persist()
        
        // Update word progress
        updateWordProgress(word, result)
        
        // Update session stats
        if (result == TrainingResult.CORRECT) {
            session.correctAnswers++
        }
        
        return sessionResult
    }
    
    @Transactional
    fun completeSession(sessionId: UUID): TrainingSession {
        val session = trainingSessionRepository.findById(sessionId)
            ?: throw IllegalArgumentException("Session not found: $sessionId")
        
        session.completedAt = LocalDateTime.now()
        return session
    }
    
    fun getSession(sessionId: UUID): TrainingSession? {
        return trainingSessionRepository.findById(sessionId)
    }
    
    fun getWordsForSession(sessionId: UUID): List<Word> {
        // Use the repository to get the words in the correct order
        return sessionWordRepository.findWordsBySessionId(sessionId)
          .also { logger.info("Retrieved ${it.size} words for session $sessionId") }
    }
    
    internal fun selectWordsForReview(reviewMode: ReviewMode, sessionLength: Int): List<Word> {
        return when (reviewMode) {
            ReviewMode.NEW -> wordRepository.find("masteryLevel", MasteryLevel.NEW)
                .list()
                .shuffled()
                .take(sessionLength)
            
            ReviewMode.LEARNING -> wordRepository.find("masteryLevel", MasteryLevel.LEARNING)
                .list()
                .shuffled()
                .take(sessionLength)
            
            ReviewMode.KNOWN -> wordRepository.find("masteryLevel in (?1, ?2)", MasteryLevel.KNOWN, MasteryLevel.MASTERED)
                .list()
                .shuffled()
                .take(sessionLength)
            
            ReviewMode.MIXED -> {
                val newWords = wordRepository.find("masteryLevel", MasteryLevel.NEW).list().shuffled().take(sessionLength / 3)
                val learningWords = wordRepository.find("masteryLevel", MasteryLevel.LEARNING).list().shuffled().take(sessionLength / 3)
                val knownWords = wordRepository.find("masteryLevel in (?1, ?2)", MasteryLevel.KNOWN, MasteryLevel.MASTERED)
                    .list().shuffled().take(sessionLength - newWords.size - learningWords.size)
                
                (newWords + learningWords + knownWords).shuffled()
            }
        }
    }
    
    internal fun updateWordProgress(word: Word, result: TrainingResult) {
        val progress = progressRepository.findOrCreateByWord(word)
        
        progress.totalAttempts++
        progress.lastReviewedAt = LocalDateTime.now()
        
        when (result) {
            TrainingResult.CORRECT -> {
                progress.totalCorrect++
                progress.consecutiveCorrect++
                updateMasteryLevel(word, progress)
            }
            TrainingResult.INCORRECT -> {
                progress.consecutiveCorrect = 0
            }
            TrainingResult.SKIPPED -> {
                // No change to consecutive correct
            }
        }
    }
    
    private fun updateMasteryLevel(word: Word, progress: WordProgressTracking) {
        val currentLevel = word.masteryLevel ?: MasteryLevel.NEW
        var newLevel = currentLevel
        
        when (currentLevel) {
            MasteryLevel.NEW -> {
                if (progress.consecutiveCorrect >= 3) {
                    newLevel = MasteryLevel.LEARNING
                }
            }
            MasteryLevel.LEARNING -> {
                if (progress.totalCorrect >= 10) {
                    newLevel = MasteryLevel.KNOWN
                }
            }
            MasteryLevel.KNOWN -> {
                if (progress.totalCorrect >= 15) {
                    newLevel = MasteryLevel.MASTERED
                }
            }
            MasteryLevel.MASTERED -> {
                // Already at max level
            }
        }
        
        if (newLevel != currentLevel) {
            word.masteryLevel = newLevel
            progress.masteryLevelUpdatedAt = LocalDateTime.now()
        }
    }
    
    fun getTrainingStats(): TrainingStatsData {
        val totalSessions = trainingSessionRepository.count("completedAt IS NOT NULL")
        val completedSessions = trainingSessionRepository.list("completedAt IS NOT NULL")
        
        val totalWordsReviewed = completedSessions.sumOf { it.totalWords }.toLong()
        val totalCorrectAnswers = completedSessions.sumOf { it.correctAnswers }
        val averageAccuracy = if (totalWordsReviewed > 0) totalCorrectAnswers.toDouble() / totalWordsReviewed * 100 else 0.0
        
        val recentSessions = completedSessions
            .sortedByDescending { it.completedAt }
            .take(10)
        
        val accuracyByMode = completedSessions
            .groupBy { it.reviewMode }
            .mapValues { (_, sessions) ->
                val totalWords = sessions.sumOf { it.totalWords }
                val correctWords = sessions.sumOf { it.correctAnswers }
                if (totalWords > 0) correctWords.toDouble() / totalWords * 100 else 0.0
            }
        
        return TrainingStatsData(
            totalSessions = totalSessions,
            totalWordsReviewed = totalWordsReviewed,
            averageAccuracy = averageAccuracy,
            recentSessions = recentSessions,
            accuracyByReviewMode = accuracyByMode
        )
    }
    
    @Transactional
    fun cleanOldestSessions(count: Int): Int {
        val oldestSessions = trainingSessionRepository.list("ORDER BY createdAt ASC")
            .take(count)
        
        oldestSessions.forEach { session ->
            trainingSessionRepository.delete(session)
        }
        
        return oldestSessions.size
    }
}

data class TrainingStatsData(
    val totalSessions: Long,
    val totalWordsReviewed: Long,
    val averageAccuracy: Double,
    val recentSessions: List<TrainingSession>,
    val accuracyByReviewMode: Map<ReviewMode, Double>
)
