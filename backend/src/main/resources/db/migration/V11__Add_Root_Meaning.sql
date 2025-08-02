-- Add meaning field to arabic_roots table for better root understanding
ALTER TABLE arabic_roots ADD COLUMN IF NOT EXISTS meaning TEXT;

-- Create index for meaning searches
CREATE INDEX IF NOT EXISTS idx_arabic_roots_meaning ON arabic_roots(meaning) WHERE meaning IS NOT NULL;

-- Add some sample meanings for common roots (optional)
-- These can be updated by administrators later
UPDATE arabic_roots SET meaning = 'Writing, Book' WHERE normalized_form = 'كتب';
UPDATE arabic_roots SET meaning = 'Reading, Study' WHERE normalized_form = 'قرأ';
UPDATE arabic_roots SET meaning = 'Knowledge, Science' WHERE normalized_form = 'علم';
UPDATE arabic_roots SET meaning = 'Work, Action' WHERE normalized_form = 'عمل';
UPDATE arabic_roots SET meaning = 'House, Home' WHERE normalized_form = 'بيت';
UPDATE arabic_roots SET meaning = 'Going, Walking' WHERE normalized_form = 'ذهب';
UPDATE arabic_roots SET meaning = 'Coming, Arrival' WHERE normalized_form = 'جيء';
UPDATE arabic_roots SET meaning = 'Eating, Food' WHERE normalized_form = 'أكل';
UPDATE arabic_roots SET meaning = 'Drinking' WHERE normalized_form = 'شرب';
UPDATE arabic_roots SET meaning = 'Speaking, Saying' WHERE normalized_form = 'قول';