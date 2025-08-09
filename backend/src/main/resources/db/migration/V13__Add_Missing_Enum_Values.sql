-- Add missing enum values to synchronize with frontend

-- Add IRAQI to dialect enum
ALTER TYPE dialect ADD VALUE IF NOT EXISTS 'IRAQI';

-- Add missing values to part_of_speech enum
ALTER TYPE part_of_speech ADD VALUE IF NOT EXISTS 'UNKNOWN';
ALTER TYPE part_of_speech ADD VALUE IF NOT EXISTS 'INTERJECTION';
ALTER TYPE part_of_speech ADD VALUE IF NOT EXISTS 'CONJUNCTION'; 
ALTER TYPE part_of_speech ADD VALUE IF NOT EXISTS 'PRONOUN';

-- Update enum order comments for documentation
COMMENT ON TYPE dialect IS 'Arabic dialect types: TUNISIAN, MOROCCAN, EGYPTIAN, MSA, LEVANTINE, GULF, IRAQI';
COMMENT ON TYPE part_of_speech IS 'Parts of speech: UNKNOWN, NOUN, VERB, ADJECTIVE, ADVERB, PREPOSITION, PARTICLE, INTERJECTION, CONJUNCTION, PRONOUN';