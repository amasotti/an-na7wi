-- V1__Initial_Schema.sql
-- Initial database schema for An-Nahwi application

-- Create ENUMs
CREATE TYPE difficulty AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE dialect AS ENUM ('TUNISIAN', 'MOROCCAN', 'EGYPTIAN', 'MSA');
CREATE TYPE part_of_speech AS ENUM ('NOUN', 'VERB', 'ADJECTIVE', 'ADVERB', 'PREPOSITION', 'PARTICLE');
CREATE TYPE annotation_type AS ENUM ('GRAMMAR', 'VOCABULARY', 'CULTURAL', 'PRONUNCIATION');

-- Create Text table
CREATE TABLE text (
                      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                      title VARCHAR(255) NOT NULL,
                      arabic_content TEXT NOT NULL,
                      transliteration TEXT,
                      translation TEXT,
                      tags JSONB DEFAULT '[]'::jsonb,
                      difficulty difficulty NOT NULL,
                      dialect dialect NOT NULL,
                      is_public BOOLEAN DEFAULT FALSE,
                      word_count INTEGER DEFAULT 0,
                      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Word table
CREATE TABLE word (
                      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                      arabic VARCHAR(255) NOT NULL,
                      transliteration VARCHAR(255),
                      translation VARCHAR(255),
                      root VARCHAR(50),
                      part_of_speech part_of_speech,
                      notes TEXT,
                      frequency INTEGER DEFAULT 0,
                      difficulty difficulty NOT NULL,
                      dialect dialect NOT NULL,
                      is_verified BOOLEAN DEFAULT FALSE,
                      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Annotation table
CREATE TABLE annotation (
                            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                            text_id UUID NOT NULL REFERENCES text(id) ON DELETE CASCADE,
                            content TEXT NOT NULL,
                            position_start INTEGER NOT NULL,
                            position_end INTEGER NOT NULL,
                            type annotation_type NOT NULL,
                            color VARCHAR(7),
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create TextWord junction table
CREATE TABLE text_word (
                           text_id UUID NOT NULL REFERENCES text(id) ON DELETE CASCADE,
                           word_id UUID NOT NULL REFERENCES word(id) ON DELETE CASCADE,
                           position INTEGER NOT NULL,
                           context VARCHAR(255),
                           PRIMARY KEY (text_id, word_id, position)
);

-- Create indexes for performance
CREATE INDEX idx_text_title ON text(title);
CREATE INDEX idx_text_dialect ON text(dialect);
CREATE INDEX idx_text_difficulty ON text(difficulty);
CREATE INDEX idx_text_tags ON text USING GIN(tags);
CREATE INDEX idx_text_is_public ON text(is_public);

CREATE INDEX idx_word_arabic ON word(arabic);
CREATE INDEX idx_word_root ON word(root);
CREATE INDEX idx_word_part_of_speech ON word(part_of_speech);
CREATE INDEX idx_word_dialect ON word(dialect);
CREATE INDEX idx_word_difficulty ON word(difficulty);

CREATE INDEX idx_annotation_text_id ON annotation(text_id);
CREATE INDEX idx_annotation_type ON annotation(type);

CREATE INDEX idx_text_word_text_id ON text_word(text_id);
CREATE INDEX idx_text_word_word_id ON text_word(word_id);

-- Create GIN indexes for full-text search
CREATE INDEX idx_text_arabic_content_gin ON text USING GIN(arabic_content gin_trgm_ops);
CREATE INDEX idx_text_transliteration_gin ON text USING GIN(transliteration gin_trgm_ops);
CREATE INDEX idx_word_arabic_gin ON word USING GIN(arabic gin_trgm_ops);
CREATE INDEX idx_word_transliteration_gin ON word USING GIN(transliteration gin_trgm_ops);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp on text table
CREATE TRIGGER update_text_updated_at
    BEFORE UPDATE ON text
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments to tables and columns
COMMENT ON TABLE text IS 'Stores Arabic texts with translations and metadata';
COMMENT ON TABLE word IS 'Stores Arabic vocabulary with translations and metadata';
COMMENT ON TABLE annotation IS 'Stores annotations for specific parts of texts';
COMMENT ON TABLE text_word IS 'Junction table linking texts and words with position information';
