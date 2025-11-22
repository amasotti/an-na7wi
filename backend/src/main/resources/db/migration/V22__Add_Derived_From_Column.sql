-- Add derived_from_id column to words table
-- This allows tracking word derivations (e.g., a noun derived from a verb)
-- Self-referencing foreign key to support word derivation hierarchies

ALTER TABLE words
ADD COLUMN derived_from UUID;

-- Add foreign key constraint referencing words table itself
ALTER TABLE words
ADD CONSTRAINT fk_words_derived_from
FOREIGN KEY (derived_from)
REFERENCES words(id)
ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX idx_words_derived_from ON words(derived_from);

-- Add comment for documentation
COMMENT ON COLUMN words.derived_from IS 'References the word this word is derived from. NULL means derived directly from root.';
