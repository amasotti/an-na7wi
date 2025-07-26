-- Enable PostgreSQL extensions required for the application

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Trigram search for fuzzy matching
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Accent-insensitive search
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Comment on extensions
COMMENT ON EXTENSION "uuid-ossp" IS 'UUID generation functions';
COMMENT ON EXTENSION "pg_trgm" IS 'Trigram matching for fuzzy text search';
COMMENT ON EXTENSION "unaccent" IS 'Accent-insensitive text search';
