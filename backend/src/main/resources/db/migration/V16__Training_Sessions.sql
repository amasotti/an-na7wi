-- Create training sessions and progress tracking tables

-- Create training sessions table
CREATE TABLE training_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_type VARCHAR(50) NOT NULL DEFAULT 'FLASHCARD',
    review_mode VARCHAR(20) NOT NULL CHECK (review_mode IN ('NEW', 'LEARNING', 'KNOWN', 'MIXED')),
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    total_words INT NOT NULL,
    correct_answers INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create training session results table (without response_time_ms)
CREATE TABLE training_session_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
    word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    result VARCHAR(20) NOT NULL CHECK (result IN ('CORRECT', 'INCORRECT', 'SKIPPED')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create word progress tracking table
CREATE TABLE word_progress_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    consecutive_correct INT NOT NULL DEFAULT 0,
    total_attempts INT NOT NULL DEFAULT 0,
    total_correct INT NOT NULL DEFAULT 0,
    last_reviewed_at TIMESTAMP,
    mastery_level_updated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(word_id)
);

-- Create indexes for performance
CREATE INDEX idx_training_sessions_started_at ON training_sessions (started_at);
CREATE INDEX idx_training_sessions_review_mode ON training_sessions (review_mode);
CREATE INDEX idx_training_session_results_session_id ON training_session_results (session_id);
CREATE INDEX idx_training_session_results_word_id ON training_session_results (word_id);
CREATE INDEX idx_training_session_results_result ON training_session_results (result);
CREATE INDEX idx_word_progress_tracking_word_id ON word_progress_tracking (word_id);
CREATE INDEX idx_word_progress_tracking_last_reviewed ON word_progress_tracking (last_reviewed_at) WHERE last_reviewed_at IS NOT NULL;

-- Add comments
COMMENT ON TABLE training_sessions IS 'Stores training session metadata for flashcard learning';
COMMENT ON TABLE training_session_results IS 'Stores individual word results within training sessions';
COMMENT ON TABLE word_progress_tracking IS 'Tracks learning progress and mastery level progression for words';
COMMENT ON COLUMN training_sessions.review_mode IS 'Type of review: NEW, LEARNING, KNOWN, or MIXED words';
COMMENT ON COLUMN word_progress_tracking.consecutive_correct IS 'Consecutive correct answers (resets on incorrect)';
COMMENT ON COLUMN word_progress_tracking.total_attempts IS 'Total number of times this word was reviewed';
COMMENT ON COLUMN word_progress_tracking.total_correct IS 'Total number of correct answers for this word';