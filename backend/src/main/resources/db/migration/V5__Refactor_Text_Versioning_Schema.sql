-- Refactor text versioning to match requirements document
-- Text entity stores current content with reference to current version
-- TextVersion entity stores historical snapshots

-- First, let's clean up the current versioning approach
DROP TABLE IF EXISTS text_versions;

-- Recreate text_versions table according to requirements
CREATE TABLE text_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    content TEXT NOT NULL, -- Full snapshot of text content at this version (as JSON)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_text_versions_text_id FOREIGN KEY (text_id) REFERENCES texts(id) ON DELETE CASCADE,
    CONSTRAINT unique_text_version UNIQUE (text_id, version_number)
);

-- Update texts table to reference current version
ALTER TABLE texts DROP COLUMN IF EXISTS version_number;
ALTER TABLE texts ADD COLUMN version_id UUID;

-- Add foreign key constraint to current version
-- Note: We'll populate this after creating initial versions

-- Create indexes for performance
CREATE INDEX idx_text_versions_text_id ON text_versions(text_id);
CREATE INDEX idx_text_versions_version_number ON text_versions(text_id, version_number);
CREATE INDEX idx_texts_version_id ON texts(version_id);