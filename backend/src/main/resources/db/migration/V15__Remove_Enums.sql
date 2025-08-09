-- Convert enum columns to varchar to fix Hibernate compatibility issues
-- This solves the "operator does not exist: difficulty = character varying" error

-- Convert difficulty column from enum to varchar
ALTER TABLE words ALTER COLUMN difficulty TYPE VARCHAR(20) USING difficulty::text;

-- Convert dialect column from enum to varchar
ALTER TABLE words ALTER COLUMN dialect TYPE VARCHAR(20) USING dialect::text;

-- Convert mastery_level column from enum to varchar
ALTER TABLE words ALTER COLUMN mastery_level TYPE VARCHAR(20) USING mastery_level::text;

-- Convert part_of_speech column from enum to varchar
ALTER TABLE words ALTER COLUMN part_of_speech TYPE VARCHAR(30) USING part_of_speech::text;

-- Do the same for texts table
ALTER TABLE texts ALTER COLUMN difficulty TYPE VARCHAR(20) USING difficulty::text;
ALTER TABLE texts ALTER COLUMN dialect TYPE VARCHAR(20) USING dialect::text;

-- Convert annotation_type column from enum to varchar in annotations table
ALTER TABLE annotations ALTER COLUMN type TYPE VARCHAR(30) USING type::text;

-- Convert mastery_level column from enum to varchar in annotations table
ALTER TABLE annotations ALTER COLUMN mastery_level TYPE VARCHAR(20) USING mastery_level::text;

-- Drop the enum types (optional, but cleans up the schema)
DROP TYPE IF EXISTS difficulty CASCADE;
DROP TYPE IF EXISTS dialect CASCADE;
DROP TYPE IF EXISTS mastery_level CASCADE;
DROP TYPE IF EXISTS part_of_speech CASCADE;
DROP TYPE IF EXISTS annotation_type CASCADE;
