-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Create enum types
CREATE TYPE difficulty AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE dialect AS ENUM ('TUNISIAN', 'MOROCCAN', 'EGYPTIAN', 'MSA');
CREATE TYPE part_of_speech AS ENUM ('NOUN', 'VERB', 'ADJECTIVE', 'ADVERB', 'PREPOSITION', 'PARTICLE');
CREATE TYPE annotation_type AS ENUM ('GRAMMAR', 'VOCABULARY', 'CULTURAL', 'PRONUNCIATION');

-- Create texts table
CREATE TABLE texts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    arabic_content TEXT NOT NULL,
    transliteration TEXT,
    translation TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    difficulty difficulty NOT NULL,
    dialect dialect NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    word_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create words table
CREATE TABLE words (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    arabic VARCHAR(255) NOT NULL,
    transliteration VARCHAR(255),
    translation VARCHAR(255),
    root VARCHAR(50),
    part_of_speech part_of_speech,
    notes TEXT,
    frequency INT NOT NULL DEFAULT 0,
    difficulty difficulty NOT NULL,
    dialect dialect NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index on arabic column for word search
CREATE INDEX idx_word_arabic ON words (arabic);

-- Create annotations table
CREATE TABLE annotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text_id UUID NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    position_start INT NOT NULL,
    position_end INT NOT NULL,
    type annotation_type NOT NULL,
    color VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create text_words junction table
CREATE TABLE text_words (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text_id UUID NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
    word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    position INT NOT NULL,
    context VARCHAR(255),
    UNIQUE (text_id, word_id, position)
);

-- Create indexes for foreign keys
CREATE INDEX idx_annotation_text_id ON annotations (text_id);
CREATE INDEX idx_text_word_text_id ON text_words (text_id);
CREATE INDEX idx_text_word_word_id ON text_words (word_id);

-- Add comments
COMMENT ON TABLE texts IS 'Stores Arabic texts with transliteration and translation';
COMMENT ON TABLE words IS 'Stores Arabic vocabulary with linguistic information';
COMMENT ON TABLE annotations IS 'Stores annotations for texts';
COMMENT ON TABLE text_words IS 'Junction table linking texts and words with position information';
