-- Update annotation type enum to match new requirements
ALTER TYPE annotation_type RENAME TO annotation_type_old;
CREATE TYPE annotation_type AS ENUM ('GRAMMAR', 'VOCABULARY', 'CULTURAL', 'OTHER');

-- Create mastery level enum
CREATE TYPE mastery_level AS ENUM ('NEW', 'LEARNING', 'KNOWN', 'MASTERED');

-- Update annotations table structure - Add columns only if they don't exist
DO $$ 
BEGIN
    -- Remove position-based columns if they exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'annotations' AND column_name = 'position_start') THEN
        ALTER TABLE annotations DROP COLUMN position_start;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'annotations' AND column_name = 'position_end') THEN
        ALTER TABLE annotations DROP COLUMN position_end;
    END IF;
    
    -- Add new columns only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'annotations' AND column_name = 'anchor_text') THEN
        ALTER TABLE annotations ADD COLUMN anchor_text VARCHAR(255) NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'annotations' AND column_name = 'mastery_level') THEN
        ALTER TABLE annotations ADD COLUMN mastery_level mastery_level NOT NULL DEFAULT 'NEW';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'annotations' AND column_name = 'needs_review') THEN
        ALTER TABLE annotations ADD COLUMN needs_review BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'annotations' AND column_name = 'next_review_date') THEN
        ALTER TABLE annotations ADD COLUMN next_review_date TIMESTAMP;
    END IF;
END $$;

-- Update type column to use new enum
ALTER TABLE annotations ALTER COLUMN type TYPE annotation_type USING type::text::annotation_type;

-- Drop old enum type
DROP TYPE annotation_type_old;

-- Create indexes for new columns (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_annotation_anchor_text') THEN
        CREATE INDEX idx_annotation_anchor_text ON annotations (anchor_text);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_annotation_mastery_level') THEN
        CREATE INDEX idx_annotation_mastery_level ON annotations (mastery_level);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_annotation_needs_review') THEN
        CREATE INDEX idx_annotation_needs_review ON annotations (needs_review);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_annotation_next_review_date') THEN
        CREATE INDEX idx_annotation_next_review_date ON annotations (next_review_date) WHERE next_review_date IS NOT NULL;
    END IF;
END $$;

-- Update comments
COMMENT ON TABLE annotations IS 'Stores loosely-coupled annotations for texts with anchor text matching';
COMMENT ON COLUMN annotations.anchor_text IS 'The Arabic text this annotation refers to (used for frontend matching)';
COMMENT ON COLUMN annotations.mastery_level IS 'Learning progress level for this annotation';
COMMENT ON COLUMN annotations.needs_review IS 'Whether this annotation needs review';
COMMENT ON COLUMN annotations.next_review_date IS 'When this annotation should be reviewed next';