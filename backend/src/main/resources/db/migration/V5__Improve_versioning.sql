DO $$
BEGIN
    -- Add is_current column to text_versions table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'text_versions' AND column_name = 'is_current'
    ) THEN
        ALTER TABLE text_versions
            ADD COLUMN is_current BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;

    -- Remove is_current column from text table
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'texts' AND column_name = 'is_current_version'
    ) THEN
        ALTER TABLE texts
            DROP COLUMN is_current_version;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'text_versions' AND column_name = 'content'
    ) THEN
        ALTER TABLE text_versions
            ALTER COLUMN content TYPE JSONB
                USING content::jsonb;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'texts' AND column_name = 'version_id'
    ) THEN
        ALTER TABLE texts
            RENAME COLUMN version_id TO current_version;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE tablename = 'texts' AND indexname = 'idx_texts_version_id'
    ) THEN
        ALTER INDEX idx_texts_version_id
            RENAME TO idx_texts_current_version;
    END IF;

    -- Update texts table removing parent_text_id
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'texts' AND column_name = 'parent_text_id'
    ) THEN
        ALTER TABLE texts
            DROP COLUMN parent_text_id;
    END IF;
END $$;

-- End of migration script
