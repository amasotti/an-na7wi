-- Add analysis field to arabic_roots table for detailed linguistic commentary
ALTER TABLE arabic_roots ADD COLUMN IF NOT EXISTS analysis TEXT;

-- Create index for analysis searches
CREATE INDEX IF NOT EXISTS idx_arabic_roots_analysis ON arabic_roots USING gin(to_tsvector('arabic', COALESCE(analysis, ''))) WHERE analysis IS NOT NULL;

-- Add comment explaining the new field
COMMENT ON COLUMN arabic_roots.analysis IS 'Detailed linguistic analysis and commentary about the root, including cognitive metaphors, grammatical explanations, verb forms, and semantic relationships';