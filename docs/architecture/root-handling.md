# Plan: Robust Arabic Root System Implementation

## Current State Analysis:

- Roots are stored as strings (VARCHAR(50)) in format like "ر-ح-ب"
- Basic search by exact root match exists
- No normalization or validation
- Prone to inconsistencies (spaces, dashes, different formats)

## Proposed Solution:

1. Backend Changes:

A. Database Schema Enhancement:
- Add new table arabic_roots with:
    - id (UUID, primary key)
    - letters (JSON array of root letters, e.g. ["ر", "ح", "ب"])
    - normalized_form (string, e.g. "رحب" - letters only)
    - display_form (string, e.g. "ر-ح-ب" - formatted for display)
    - letter_count (integer: 3, 4, or 5)
    - created_at, updated_at

B. Word Entity Modification:
- Keep existing root field for backward compatibility
- Add root_id foreign key to arabic_roots table
- Add migration to normalize existing roots

C. New Services:
- RootService for root management
- RootNormalizationService for cleaning/parsing roots
- Enhanced WordService with root-based queries

D. New Endpoints:
- GET /api/v1/roots - List all roots with word counts
- GET /api/v1/roots/{id}/words - Words by root ID
- POST /api/v1/roots/normalize - Normalize root input
- GET /api/v1/roots/search?q={query} - Search roots

2. Frontend Changes:

A. Root Input Component:
- Input field that accepts raw Arabic letters
- Real-time normalization and preview
- Format: User types "رحب" → Display shows "ر-ح-ب"
- Root is shown in the overview table as "ر-ح-ب"

B. Root Study Section:
- New route /roots
- Root browser with search/filter
- Root detail pages showing all derived words
- Visual root patterns and relationships

C. Enhanced Word Forms:
- Link to root study from word details
- If the field root is not empty, display a section with related words with the same root and a link to the root study page

3. Implementation Strategy:

Phase 1: Backend Foundation
1. Create arabic_roots table and entity
2. Implement RootNormalizationService
3. Create RootService and endpoints
4. Add migration to extract/normalize existing roots

Phase 2: Enhanced Word Management
1. Update WordService to use root relationships
2. Enhance word search by root
3. Add root validation to word forms

Phase 3: Frontend Root System
1. Improve root input component in VocabularyView / VocabularyContent
   - Add root normalization and validation on submit of the word form
   - Display formatted root
   - Add a section below with a delay of 1 second to avoid excessive API calls, that shows related words with the same root
   - Displayed related words should be clickable and lead to the word detail page
2. 
2. Implement root study section
3. Integrate root picker in word forms
4. Add root-based navigation

4. Root Normalization Logic:

// Proposed normalization rules:
// Input: "ر ح ب", "ر-ح-ب", "رحب", " ر - ح - ب "
// Output: letters=["ر", "ح", "ب"], normalized="رحب", display="ر-ح-ب"
