# Text Learning System - Requirements Document

## Overview

One component / page of the frontend allows me to interact with texts.
The text view is modular and clean and has three-mode text workflow: Create/Edit, Annotate, and Learn modes. Simple
architecture with loose coupling between annotations and text positions.

## Core Requirements

### Three-Mode System

#### 1. Create/Edit Mode

- **Create/Edit Mode**: Form-based text entry: A title, then 3 text areas (arabic, transliteration, translation) and
  an optional comments field for note about the text.
- **Auto-save**: Persist changes on blur/timer
- Versioned. Texts are versioned, so that I can go back to previous versions of the text.
- The frontend displays a dropdown to select the version of the text to display, restore or delete a version.
- A simple diff view to compare the current version with a previous version is available.
- **Simple CRUD**: Create, read, update, delete texts
- Clean interface without annotation interference

#### 2. Annotate Mode

- Text display only (non-editable)
- "New Annotation" button to create annotations
- Manual annotation entry (not click on the word to annotate)
- Dynamic highlighting of annotation matches in text
- In the backend we don't save the position of the annotation in the text, but rather the anchor text

Annotation are in some sense loosely coupled to the text, meaning that if the text changes, the annotation may not be
valid anymore. It's up to the user to delete the annotation if the anchor text is no longer present in the text.
The frontend has some matching logic to highlight the anchor text in the text and make the relevant annotations visible
or more prominent.

#### 3. Learn Mode

- Translation/transliteration blurred by default
- Hover to reveal content
- Annotations hidden unless explicitly toggled by hovering or clicking on an indicator (matched anchor text, see above)
- Focus on comprehension testing

## Data Model

### Text Entity
```
- id: UUID
- title: String
- arabic_content: Text
- transliteration: Text (nullable)
- translation: Text (nullable) 
- comments: Text (nullable)
- version: UUID (foreign key to version entity)
- created_at: DateTime
- updated_at: DateTime
```

### Version Entity
```
- id: UUID
- text_id: UUID (foreign key to parent text)
- version_number: Integer (incrementing version number)
- content: Text (full text content at this version)
- created_at: DateTime
- updated_at: DateTime
```

### Annotation Entity
```
- id: UUID
- text_id: UUID (foreign key to parent text, not specific version)
- anchor_text: String (the Arabic text being annotated)
- content: Text (annotation content/notes)
- type: Enum (GRAMMAR, VOCABULARY, CULTURAL, OTHER)
- mastery_level: Enum (NEW, LEARNING, KNOWN, MASTERED)
- needs_review: Boolean (default false)
- next_review_date: Date (nullable)
- created_at: DateTime
- updated_at: DateTime
```

### Annotation Types
- **GRAMMAR**: Grammatical constructions, syntax rules, verb conjugations
- **VOCABULARY**: Word meanings, etymology, synonyms
- **CULTURAL**: Cultural context, idioms, expressions
- **OTHER**: General notes, personal observations

### Mastery Levels
- **NEW**: Just created, not yet studied
- **LEARNING**: Actively studying, requires frequent review
- **KNOWN**: Understood but may need occasional review
- **MASTERED**: Fully learned, confident understanding

## Functional Requirements

### Text Operations
- Create new text (creates version 1)
- Edit existing text (creates new version, marks as current)
- Delete text versions (current version only, or specific versions)
- Restore previous version (makes it the current version)
- View text version history with metadata
- Compare versions using simple diff view

### Annotation Operations
- Create annotation linked to parent text (not specific version)
- Edit annotation content, type, and metadata
- Delete annotations permanently
- Update mastery level and review settings
- View all annotations for a text across all versions

### Text-Annotation Matching
- Frontend searches for `annotation.anchor_text` within current text version
- Highlight all exact matches found in the displayed text
- Handle multiple occurrences of same anchor text
- Show annotation indicators even when anchor text not found (orphaned state)
- Color-code highlights by annotation type or mastery level

### Review System
- Mark annotations for review using `needs_review` boolean
- Set optional `next_review_date` for spaced repetition
- Global review page showing all reviewable annotations
- Filter review items by mastery level, type, or urgency

## API Specification

### Text Endpoints
```
GET    /api/v1/texts                    # List all texts (current versions only)
POST   /api/v1/texts                    # Create new text
GET    /api/v1/texts/{id}               # Get current version of text
PUT    /api/v1/texts/{id}               # Update text (creates new version)
DELETE /api/v1/texts/{id}               # Delete text and all versions

GET    /api/v1/texts/{id}/versions      # Get all versions of text
GET    /api/v1/texts/{id}/versions/{v}  # Get specific version
POST   /api/v1/texts/{id}/restore/{v}   # Restore version as current
DELETE /api/v1/texts/{id}/versions/{v}  # Delete specific version
GET    /api/v1/texts/{id}/diff/{v1}/{v2} # Compare two versions
```

### Annotation Endpoints
```
GET    /api/v1/texts/{id}/annotations     # Get annotations for text (all versions)
POST   /api/v1/texts/{id}/annotations     # Create annotation for text
PUT    /api/v1/annotations/{id}           # Update annotation
DELETE /api/v1/annotations/{id}           # Delete annotation
GET    /api/v1/annotations/review         # Get all annotations needing review
PUT    /api/v1/annotations/{id}/mastery   # Update mastery level
PUT    /api/v1/annotations/{id}/review    # Update review settings
```

## Frontend Requirements

### Mode Switching
- Clear mode indicators with toggle buttons/tabs
- State preservation when switching between modes
- Version selector available in all modes
- No data loss during mode transitions

### Create/Edit Mode
- Form layout: title, three text areas (RTL for Arabic), comments field
- Auto-save with visual feedback (saving indicator)
- Version dropdown showing creation dates and version numbers
- "Save as new version" button for major changes

### Annotate Mode
- Read-only text display with highlighting
- "New Annotation" button opens annotation form
- Annotation form: anchor text field, content textarea, type selector, mastery/review options
- Sidebar or panel showing existing annotations for current text
- Edit/delete buttons for each annotation

### Learn Mode
- CSS blur effects on translation/transliteration areas
- Hover or click to reveal blurred content
- Annotation indicators (subtle underlining or colored dots)
- Click annotation indicator to show content in tooltip/popup
- Toggle to show/hide all annotation indicators

### Text Highlighting Logic
- Real-time search for annotation anchor texts in displayed content
- Multiple highlighting colors: by type (grammar=blue, vocab=green, etc.)
- Handle overlapping matches with layered highlighting
- Show orphaned annotation indicators when anchor text not found

### Version Management
- Version dropdown with timestamps and change descriptions
- Diff view showing added/removed/modified content
- Restore confirmation dialog
- Delete version confirmation with warnings

### Review Page
- Standalone page listing all annotations marked for review
- Filter controls: by text, by type, by mastery level, by due date
- Bulk operations: mark as reviewed, update mastery levels
- Quick edit functionality for each annotation

## Technical Implementation

### Backend (Kotlin + Quarkus)
- JPA entities with proper relationships
- Versioning logic: copy-on-write for text updates
- Simple REST controllers with validation
- Flyway migrations for schema evolution

### Frontend (Vue 3 + TypeScript)
- Pinia stores for text and annotation state management
- Composables for text matching and highlighting logic
- CSS-in-JS or SCSS for RTL text support and blur effects
- Component library: reusable annotation forms, text displays

### Database (PostgreSQL)
- Indexes on text_id, version, is_current_version
- Text search capabilities for anchor text matching (optional)
- Foreign key constraints with proper cascade rules

## Non-Requirements
- Real-time collaborative editing
- Advanced NLP or morphological analysis
- Mobile app optimization
- Complex permission systems
- Integration with external translation services
- Advanced spaced repetition algorithms (beyond simple date-based)

## Implementation Phases

### Phase 1: Core Infrastructure
- Text CRUD with basic versioning
- Simple annotation system
- Three-mode UI foundation

### Phase 2: Advanced Features
- Text highlighting and matching
- Learn mode with blur/reveal
- Version comparison and management

### Phase 3: Learning Enhancements
- Review system implementation
- Advanced filtering and search
- UI/UX polish and performance optimization

## Success Criteria
- Seamless workflow from text creation to annotation to learning
- Reliable version management without data loss
- Effective text-annotation matching and visual feedback
- Simple, maintainable codebase suitable for personal use
