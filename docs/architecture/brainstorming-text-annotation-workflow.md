# Text Learning System - Requirements Document

## Overview

The frontend has a page that allows me to interact with texts.
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

## Functional Requirements

### Text Operations
- Create new text (creates version 1)
- Edit existing text (creates new version, marks as current automatically in the backend)
- Delete text versions
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

## Frontend Requirements

### Mode Switching
- Clear mode indicators with toggle buttons/tabs
- State preservation when switching between modes
- Version selector available in View Mode only
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
- Version dropdown with date and version number
- Restore confirmation dialog
- Delete version confirmation with warnings

### Review Page
- Standalone page listing all annotations marked for review
- Filter controls: by text, by type, by mastery level, by due date
- Bulk operations: mark as reviewed, update mastery levels
- Quick edit functionality for each annotation

## Non-Requirements
- Real-time collaborative editing
- Advanced NLP or morphological analysis
- Mobile app optimization
- Complex permission systems or authentication
- Advanced spaced repetition algorithms (beyond simple date-based)
