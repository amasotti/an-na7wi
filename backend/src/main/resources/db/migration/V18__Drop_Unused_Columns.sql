-- Drop unused columns from words table
DO $$
BEGIN
    -- Drop is_verified column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'words' AND column_name = 'is_verified') THEN
        ALTER TABLE words DROP COLUMN is_verified;
    END IF;
    
    -- Drop related_words column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'words' AND column_name = 'related_words') THEN
        ALTER TABLE words DROP COLUMN related_words;
    END IF;
END $$;

-- Drop unused columns from annotations table
DO $$
BEGIN
    -- Drop the index first if it exists
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_annotation_next_review_date') THEN
        DROP INDEX idx_annotation_next_review_date;
    END IF;
    
    -- Drop next_review_date column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'annotations' AND column_name = 'next_review_date') THEN
        ALTER TABLE annotations DROP COLUMN next_review_date;
    END IF;
END $$;