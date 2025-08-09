-- V12__Dictionary_Links_Migration.sql
-- Migration to replace comma-separated dictionary_links string with separate dictionary_links table

-- Create the new dictionary_links table
CREATE TABLE dictionary_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    word_id UUID NOT NULL,
    type VARCHAR(255) NOT NULL CHECK (type IN ('ALMANY', 'LIVING_ARABIC', 'AL_LUGHATUNA', 'DERJA_NINJA', 'REVERSO', 'WIKTIONARY', 'CUSTOM')),
    url VARCHAR(2048) NOT NULL,
    display_name VARCHAR(255),
    FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE
);

-- Create index for performance
CREATE INDEX idx_dictionary_links_word_id ON dictionary_links(word_id);
CREATE INDEX idx_dictionary_links_type ON dictionary_links(type);

-- Function to detect dictionary type from URL
CREATE OR REPLACE FUNCTION detect_dictionary_type(url TEXT) RETURNS TEXT AS $$
BEGIN
    IF url ILIKE '%almaany.com%' THEN
        RETURN 'ALMANY';
    ELSIF url ILIKE '%al-lughatuna.com%' THEN
        RETURN 'AL_LUGHATUNA';
    ELSIF url ILIKE '%livingarabic.com%' THEN
        RETURN 'LIVING_ARABIC';
    ELSIF url ILIKE '%derja.ninja%' THEN
        RETURN 'DERJA_NINJA';
    ELSIF url ILIKE '%reverso.net%' OR url ILIKE '%reverso.com%' THEN
        RETURN 'REVERSO';
    ELSIF url ILIKE '%wiktionary.org%' THEN
        RETURN 'WIKTIONARY';
    ELSE
        RETURN 'CUSTOM';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to extract domain name for custom dictionary display name
CREATE OR REPLACE FUNCTION extract_domain_name(url TEXT) RETURNS TEXT AS $$
DECLARE
    domain_name TEXT;
BEGIN
    -- Extract hostname from URL
    domain_name := regexp_replace(url, '^https?://(?:www\.)?([^/]+).*', '\1', 'i');
    RETURN COALESCE(domain_name, 'Custom Dictionary');
END;
$$ LANGUAGE plpgsql;

-- Migrate existing comma-separated dictionary_links to the new table
INSERT INTO dictionary_links (word_id, type, url, display_name)
SELECT 
    w.id as word_id,
    detect_dictionary_type(TRIM(link_url)) as type,
    TRIM(link_url) as url,
    CASE 
        WHEN detect_dictionary_type(TRIM(link_url)) = 'CUSTOM' THEN extract_domain_name(TRIM(link_url))
        ELSE NULL 
    END as display_name
FROM words w
CROSS JOIN LATERAL unnest(string_to_array(w.dictionary_links, ',')) as link_url
WHERE w.dictionary_links IS NOT NULL 
  AND w.dictionary_links != ''
  AND TRIM(link_url) != '';

-- Drop the old dictionary_links column from words table
ALTER TABLE words DROP COLUMN IF EXISTS dictionary_links;

-- Clean up temporary functions (optional, keep them if they might be useful for future migrations)
-- DROP FUNCTION IF EXISTS detect_dictionary_type(TEXT);
-- DROP FUNCTION IF EXISTS extract_domain_name(TEXT);

-- Add comments for documentation
COMMENT ON TABLE dictionary_links IS 'Dictionary links associated with Arabic words';
COMMENT ON COLUMN dictionary_links.type IS 'Type of dictionary (ALMANY, LIVING_ARABIC, AL_LUGHATUNA, DERJA_NINJA, REVERSO, WIKTIONARY, CUSTOM)';
COMMENT ON COLUMN dictionary_links.url IS 'URL to the dictionary entry';
COMMENT ON COLUMN dictionary_links.display_name IS 'Custom display name for the dictionary (mainly used for CUSTOM type)';