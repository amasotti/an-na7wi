-- Sample test data for H2 database

-- Insert sample texts
INSERT INTO texts (id, title, arabic_content, transliteration, translation, tags, difficulty, dialect, word_count, is_current_version, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sample Arabic Text', 'مرحبا بك في عالم اللغة العربية', 'marhaban bik fi alam al-lugha al-arabiya', 'Welcome to the world of Arabic language', '["greeting", "language"]', 'BEGINNER', 'MSA', 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440002', 'Advanced Text', 'هذا نص متقدم يحتوي على مفردات معقدة', 'hadha nass mutaqaddim yahtawi ala mufradat muaqqada', 'This is an advanced text containing complex vocabulary', '["advanced", "vocabulary"]', 'ADVANCED', 'MSA', 8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample words
INSERT INTO words (id, arabic, transliteration, translation, root, part_of_speech, frequency, difficulty, dialect, is_verified, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'مرحبا', 'marhaban', 'hello, welcome', 'ر-ح-ب', 'NOUN', 100, 'BEGINNER', 'MSA', true, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440011', 'بك', 'bik', 'with you', null, 'PREPOSITION', 80, 'BEGINNER', 'MSA', true, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440012', 'عالم', 'alam', 'world', 'ع-ل-م', 'NOUN', 90, 'BEGINNER', 'MSA', true, CURRENT_TIMESTAMP);

-- Insert sample annotations
INSERT INTO annotations (id, text_id, anchor_text, content, type, mastery_level, needs_review, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 'مرحبا', 'This is a common greeting in Arabic, literally meaning "welcome"', 'VOCABULARY', 'LEARNING', true, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440001', 'اللغة العربية', 'Arabic language - note the definite article "al" before both words', 'GRAMMAR', 'NEW', false, CURRENT_TIMESTAMP);