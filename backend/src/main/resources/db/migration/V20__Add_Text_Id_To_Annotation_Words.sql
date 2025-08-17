-- Add text_id column to annotation_words table for improved query performance
ALTER TABLE annotation_words 
ADD COLUMN text_id UUID;

-- Populate the text_id column with data from annotations table
UPDATE annotation_words 
SET text_id = (
    SELECT a.text_id 
    FROM annotations a 
    WHERE a.id = annotation_words.annotation_id
);

-- Make text_id not null after populating data
ALTER TABLE annotation_words 
ALTER COLUMN text_id SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE annotation_words 
ADD CONSTRAINT fk_annotation_words_text 
    FOREIGN KEY (text_id) REFERENCES texts(id) ON DELETE CASCADE;

-- Add index for performance on text_id queries
CREATE INDEX idx_annotation_words_text_id ON annotation_words(text_id);

-- Update unique constraint to include text_id for better data integrity
ALTER TABLE annotation_words 
DROP CONSTRAINT uk_annotation_words;

ALTER TABLE annotation_words 
ADD CONSTRAINT uk_annotation_words UNIQUE (annotation_id, word_id, text_id);
