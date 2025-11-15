-- Create interlinear_texts table
CREATE TABLE interlinear_texts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    dialect VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create interlinear_sentences table
CREATE TABLE interlinear_sentences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text_id UUID NOT NULL,
    arabic_text TEXT NOT NULL,
    transliteration TEXT NOT NULL,
    translation TEXT NOT NULL,
    annotations TEXT,
    sentence_order INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_interlinear_sentences_text
        FOREIGN KEY (text_id) REFERENCES interlinear_texts(id) ON DELETE CASCADE
);

-- Create word_alignments table
CREATE TABLE word_alignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sentence_id UUID NOT NULL,
    arabic_tokens TEXT NOT NULL,
    transliteration_tokens TEXT NOT NULL,
    translation_tokens TEXT NOT NULL,
    token_order INTEGER NOT NULL,
    vocabulary_word_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_word_alignments_sentence
        FOREIGN KEY (sentence_id) REFERENCES interlinear_sentences(id) ON DELETE CASCADE,
    CONSTRAINT fk_word_alignments_word
        FOREIGN KEY (vocabulary_word_id) REFERENCES words(id) ON DELETE SET NULL
);

-- Create indexes for foreign key lookups
CREATE INDEX idx_interlinear_sentences_text_id ON interlinear_sentences(text_id);
CREATE INDEX idx_word_alignments_sentence_id ON word_alignments(sentence_id);
CREATE INDEX idx_word_alignments_vocabulary_word_id ON word_alignments(vocabulary_word_id);

-- Create index for ordering sentences within a text
CREATE INDEX idx_interlinear_sentences_order ON interlinear_sentences(text_id, sentence_order);

-- Create index for ordering alignments within a sentence
CREATE INDEX idx_word_alignments_order ON word_alignments(sentence_id, token_order);

-- Add comments to explain token storage format
COMMENT ON COLUMN word_alignments.arabic_tokens IS 'Space-separated Arabic tokens that form a single alignment unit';
COMMENT ON COLUMN word_alignments.transliteration_tokens IS 'Space-separated transliteration tokens that form a single alignment unit';
COMMENT ON COLUMN word_alignments.translation_tokens IS 'Space-separated translation tokens that form a single alignment unit';
