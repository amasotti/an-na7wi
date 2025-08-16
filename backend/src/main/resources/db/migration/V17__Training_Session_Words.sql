CREATE TABLE training_session_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    training_session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
    word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    word_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(training_session_id, word_id),
    UNIQUE(training_session_id, word_order)
);

CREATE INDEX idx_training_session_words_session_id ON training_session_words(training_session_id);
CREATE INDEX idx_training_session_words_word_id ON training_session_words(word_id);