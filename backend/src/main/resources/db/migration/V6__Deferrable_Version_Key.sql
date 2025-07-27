-- V20250727__make_current_version_fk_deferrable.sql

-- Drop the existing FK constraint
ALTER TABLE public.texts
    DROP CONSTRAINT fk_texts_version;

-- Recreate it as DEFERRABLE INITIALLY DEFERRED
ALTER TABLE public.texts
    ADD CONSTRAINT fk_texts_version
        FOREIGN KEY (current_version)
            REFERENCES public.text_versions(id)
            DEFERRABLE INITIALLY DEFERRED;
