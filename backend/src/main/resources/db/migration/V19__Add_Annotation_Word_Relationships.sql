-- Create junction table for annotation-word relationships
CREATE TABLE annotation_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    annotation_id UUID NOT NULL,
    word_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_annotation_words_annotation 
        FOREIGN KEY (annotation_id) REFERENCES annotations(id) ON DELETE CASCADE,
    CONSTRAINT fk_annotation_words_word 
        FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
    CONSTRAINT uk_annotation_words UNIQUE (annotation_id, word_id)
);

-- Add indexes for performance
CREATE INDEX idx_annotation_words_annotation_id ON annotation_words(annotation_id);
CREATE INDEX idx_annotation_words_word_id ON annotation_words(word_id);