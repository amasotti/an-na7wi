-- Add text versioning support
-- Create text_versions table to store historical versions

CREATE TABLE text_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    arabic_content TEXT NOT NULL,
    transliteration TEXT,
    translation TEXT,
    comments TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_text_versions_text_id FOREIGN KEY (text_id) REFERENCES texts(id) ON DELETE CASCADE,
    CONSTRAINT unique_text_version UNIQUE (text_id, version_number)
);

-- Add versioning columns to texts table
ALTER TABLE texts ADD COLUMN version_number INTEGER DEFAULT 1;
ALTER TABLE texts ADD COLUMN is_current_version BOOLEAN DEFAULT TRUE;
ALTER TABLE texts ADD COLUMN parent_text_id UUID;
ALTER TABLE texts ADD COLUMN comments TEXT;

-- Create index for better performance on version queries
CREATE INDEX idx_text_versions_text_id ON text_versions(text_id);
CREATE INDEX idx_text_versions_version_number ON text_versions(text_id, version_number);
CREATE INDEX idx_texts_current_version ON texts(id, is_current_version) WHERE is_current_version = TRUE;

-- Create initial versions for existing texts
INSERT INTO text_versions (text_id, version_number, title, arabic_content, transliteration, translation, comments, created_at, updated_at)
SELECT id, 1, title, arabic_content, transliteration, translation, NULL, created_at, updated_at
FROM texts;
