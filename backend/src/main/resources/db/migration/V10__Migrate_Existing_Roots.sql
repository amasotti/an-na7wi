-- Migration to extract and normalize existing roots from words table

-- Create a temporary function to safely extract root letters
CREATE OR REPLACE FUNCTION extract_root_letters(root_text TEXT) 
RETURNS JSONB AS $$
DECLARE
    cleaned_root TEXT;
    letters TEXT[];
    i INTEGER;
BEGIN
    -- Clean the root text to contain only Arabic letters
    cleaned_root := regexp_replace(root_text, '[^ء-ي]', '', 'g');
    
    -- Return empty array if no Arabic letters found
    IF cleaned_root = '' OR LENGTH(cleaned_root) < 2 OR LENGTH(cleaned_root) > 5 THEN
        RETURN '[]'::jsonb;
    END IF;
    
    -- Split into individual characters
    letters := string_to_array(cleaned_root, '');
    
    -- Convert to JSON array
    RETURN to_jsonb(letters);
END;
$$ LANGUAGE plpgsql;

-- Insert unique roots from existing words
INSERT INTO arabic_roots (letters, normalized_form, display_form, letter_count, created_at, updated_at)
SELECT DISTINCT
    extract_root_letters(root) as letters,
    regexp_replace(root, '[^ء-ي]', '', 'g') as normalized_form,
    CASE 
        WHEN root ~ '^[ء-ي]+-[ء-ي]+' THEN root -- Already in dash format
        WHEN root ~ '^[ء-ي]+ [ء-ي]+' THEN replace(root, ' ', '-') -- Space to dash
        ELSE 
            -- Convert letters to dash-separated format
            (
                SELECT string_agg(letter, '-')
                FROM unnest(string_to_array(regexp_replace(root, '[^ء-ي]', '', 'g'), '')) as letter
                WHERE letter != ''
            )
    END as display_form,
    LENGTH(regexp_replace(root, '[^ء-ي]', '', 'g')) as letter_count,
    CURRENT_TIMESTAMP as created_at,
    CURRENT_TIMESTAMP as updated_at
FROM words 
WHERE root IS NOT NULL 
  AND trim(root) != '' 
  AND root ~ '[ء-ي]' -- Contains at least one Arabic letter
  AND LENGTH(regexp_replace(root, '[^ء-ي]', '', 'g')) BETWEEN 2 AND 5 -- Valid letter count
  AND extract_root_letters(root) != '[]'::jsonb -- Valid extraction
ON CONFLICT (normalized_form) DO NOTHING;

-- Update words to reference the arabic_roots table
UPDATE words 
SET root_id = ar.id
FROM arabic_roots ar
WHERE words.root IS NOT NULL 
  AND trim(words.root) != ''
  AND ar.normalized_form = regexp_replace(words.root, '[^ء-ي]', '', 'g');

-- Create index on words.root for any remaining queries that might use it
CREATE INDEX IF NOT EXISTS idx_words_root ON words(root) WHERE root IS NOT NULL;

-- Drop the temporary function
DROP FUNCTION extract_root_letters(TEXT);