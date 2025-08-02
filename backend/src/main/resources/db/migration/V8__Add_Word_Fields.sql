-- Add new columns to the words table for enhanced vocabulary learning
DO $$
BEGIN
    -- Add example column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'words' AND column_name = 'example') THEN
        ALTER TABLE words ADD COLUMN example TEXT;
        COMMENT ON COLUMN words.example IS 'Example sentence using the word';
    END IF;

    -- Add mastery_level column (using existing enum type from V3 migration)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'words' AND column_name = 'mastery_level') THEN
        ALTER TABLE words ADD COLUMN mastery_level mastery_level DEFAULT 'NEW';
        COMMENT ON COLUMN words.mastery_level IS 'Learning progress level for this word';
    END IF;

    -- Add dictionary_links column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'words' AND column_name = 'dictionary_links') THEN
        ALTER TABLE words ADD COLUMN dictionary_links TEXT;
        COMMENT ON COLUMN words.dictionary_links IS 'Links to third-party dictionaries (JSON format)';
    END IF;

    -- Add pronunciation_link column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'words' AND column_name = 'pronunciation_link') THEN
        ALTER TABLE words ADD COLUMN pronunciation_link VARCHAR(255);
        COMMENT ON COLUMN words.pronunciation_link IS 'Link to audio pronunciation';
    END IF;

    -- Add related_words column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'words' AND column_name = 'related_words') THEN
        ALTER TABLE words ADD COLUMN related_words TEXT;
        COMMENT ON COLUMN words.related_words IS 'Related words like synonyms and antonyms (JSON format)';
    END IF;

    -- Create index for mastery_level if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_word_mastery_level') THEN
        CREATE INDEX idx_word_mastery_level ON words (mastery_level);
    END IF;
END $$;
