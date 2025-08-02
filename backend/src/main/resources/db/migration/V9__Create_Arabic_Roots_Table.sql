-- Create arabic_roots table for robust root handling
CREATE TABLE IF NOT EXISTS arabic_roots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    letters JSONB NOT NULL,
    normalized_form VARCHAR(10) NOT NULL UNIQUE,
    display_form VARCHAR(20) NOT NULL,
    letter_count INTEGER NOT NULL CHECK (letter_count BETWEEN 2 AND 5),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_arabic_roots_normalized ON arabic_roots(normalized_form);
CREATE INDEX IF NOT EXISTS idx_arabic_roots_letters ON arabic_roots USING GIN(letters);

-- Add root_id foreign key to words table
ALTER TABLE words ADD COLUMN IF NOT EXISTS root_id UUID;
ALTER TABLE words ADD CONSTRAINT fk_words_root_id 
    FOREIGN KEY (root_id) REFERENCES arabic_roots(id) ON DELETE SET NULL;

-- Create index on root_id for efficient lookups
CREATE INDEX IF NOT EXISTS idx_words_root_id ON words(root_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_arabic_roots_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_arabic_roots_updated_at_trigger
    BEFORE UPDATE ON arabic_roots
    FOR EACH ROW
    EXECUTE FUNCTION update_arabic_roots_updated_at();
