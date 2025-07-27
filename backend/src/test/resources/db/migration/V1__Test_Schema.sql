-- H2 compatible test schema
-- Note: H2 doesn't support all PostgreSQL features, so this is simplified

-- Create text_versions table
CREATE TABLE text_versions (
    id UUID DEFAULT RANDOM_UUID() PRIMARY KEY,
    text_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    content CLOB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_text_version UNIQUE (text_id, version_number)
);

-- Create texts table
CREATE TABLE texts (
    id UUID DEFAULT RANDOM_UUID() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    arabic_content CLOB NOT NULL,
    transliteration CLOB,
    translation CLOB,
    tags CLOB DEFAULT '[]',
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    dialect VARCHAR(20) NOT NULL CHECK (dialect IN ('TUNISIAN', 'MOROCCAN', 'EGYPTIAN', 'MSA')),
    word_count INT NOT NULL DEFAULT 0,
    is_current_version BOOLEAN NOT NULL DEFAULT TRUE,
    parent_text_id UUID,
    comments CLOB,
    version_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_texts_version FOREIGN KEY (version_id) REFERENCES text_versions(id)
);

-- Add FK constraint from text_versions to texts
ALTER TABLE text_versions ADD CONSTRAINT fk_text_versions_text_id FOREIGN KEY (text_id) REFERENCES texts(id) ON DELETE CASCADE;

-- Create words table
CREATE TABLE words (
    id UUID DEFAULT RANDOM_UUID() PRIMARY KEY,
    arabic VARCHAR(255) NOT NULL,
    transliteration VARCHAR(255),
    translation VARCHAR(500),
    root VARCHAR(100),
    part_of_speech VARCHAR(20) CHECK (part_of_speech IN ('NOUN', 'VERB', 'ADJECTIVE', 'ADVERB', 'PREPOSITION', 'PARTICLE')),
    notes CLOB,
    frequency INT NOT NULL DEFAULT 0,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    dialect VARCHAR(20) NOT NULL CHECK (dialect IN ('TUNISIAN', 'MOROCCAN', 'EGYPTIAN', 'MSA')),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create annotations table
CREATE TABLE annotations (
    id UUID DEFAULT RANDOM_UUID() PRIMARY KEY,
    text_id UUID NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
    anchor_text VARCHAR(255) NOT NULL DEFAULT '',
    content CLOB NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('GRAMMAR', 'VOCABULARY', 'CULTURAL', 'OTHER')),
    mastery_level VARCHAR(20) NOT NULL DEFAULT 'NEW' CHECK (mastery_level IN ('NEW', 'LEARNING', 'KNOWN', 'MASTERED')),
    needs_review BOOLEAN NOT NULL DEFAULT FALSE,
    next_review_date TIMESTAMP,
    color VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create text_words junction table
CREATE TABLE text_words (
    id UUID DEFAULT RANDOM_UUID() PRIMARY KEY,
    text_id UUID NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
    word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    position INT NOT NULL,
    context VARCHAR(255),
    UNIQUE (text_id, word_id, position)
);

-- Create indexes for performance
CREATE INDEX idx_word_arabic ON words (arabic);
CREATE INDEX idx_annotation_text_id ON annotations (text_id);
CREATE INDEX idx_annotation_anchor_text ON annotations (anchor_text);
CREATE INDEX idx_annotation_mastery_level ON annotations (mastery_level);
CREATE INDEX idx_annotation_needs_review ON annotations (needs_review);
CREATE INDEX idx_text_word_text_id ON text_words (text_id);
CREATE INDEX idx_text_word_word_id ON text_words (word_id);
CREATE INDEX idx_text_versions_text_id ON text_versions(text_id);
CREATE INDEX idx_text_versions_version_number ON text_versions(text_id, version_number);
CREATE INDEX idx_texts_version_id ON texts(version_id);
CREATE INDEX idx_texts_current_version ON texts(id, is_current_version);