-- Remove is_public column from texts table since all texts are considered public
ALTER TABLE texts DROP COLUMN IF EXISTS is_public;