# An-Na7wi Design System Documentation

## Overview

This project uses a modular, semantic design system built on Tailwind CSS. This design system provides
consistent, reusable styling patterns across the application with special considerations for Arabic text and RTL
layouts.

## Architecture

The design system is organized into two complementary approaches:

### 1. CSS Classes (`frontend/assets/css/`)

Semantic CSS classes organized by category, imported through `semantic/index.css`.

### 2. TypeScript Classes (`frontend/styles/`)

TypeScript-based class definitions with type safety, used with the `combineClasses()` helper.

---

## Components

### Badges

**Purpose**: Status indicators, tags, and labels

#### Classes

```css
.badge-base          /* Base badge styling */
.badge-primary       /* Primary brand color */
.badge-secondary     /* Secondary brand color */
.badge-success       /* Success/positive state */
.badge-warning       /* Warning/caution state */
.badge-error         /* Error/negative state */
.badge-neutral       /* Neutral/default state */
```

#### Usage Example

```vue
<span class="badge-base badge-primary">New</span>
<span class="badge-base badge-success">Active</span>
```

---

### Buttons

**Purpose**: Interactive elements for user actions

#### CSS Classes

```css
.button-base         /* Base button foundation */
.button-hover-lift   /* Subtle lift effect on hover */

/* Variants */
.button-primary      /* Primary actions */
.button-secondary    /* Secondary actions */
.button-outline      /* Outlined style */
.button-ghost        /* Minimal, text-only */
.button-danger       /* Destructive actions */

/* Sizes */
.button-sm           /* Small: px-4 py-2 text-sm rounded-lg */
.button-md           /* Medium: px-6 py-3 rounded-xl */
.button-lg           /* Large: px-8 py-4 text-lg rounded-2xl */

/* Icon positioning */
.button-icon         /* Icon spacing (mr-1.5) */
```

#### TypeScript Classes

```typescript
import { buttonClasses, combineClasses } from '@/styles/component-classes'

const classes = combineClasses(
  buttonClasses.base,
  buttonClasses.variants.primary,
  buttonClasses.sizes.md
)
```

#### Usage Example

```vue
<!-- CSS approach -->
<button class="button-base button-primary button-md">
  Save Changes
</button>

<!-- TypeScript approach -->
<BaseButton variant="primary" size="md">
  Save Changes
</BaseButton>
```

---

### Cards

**Purpose**: Content containers with consistent styling

#### CSS Classes

```css
.card-base           /* Base card foundation */
.card-hover          /* Hover elevation effect */
.card-elevated       /* Enhanced shadow, no border */
.card-glass          /* Glass-morphism effect */
.card-interactive    /* Interactive card with hover states */

/* Padding variants */
.card-padding        /* Standard padding (p-6) */
.card-padding-sm     /* Small padding (p-4) */
.card-padding-lg     /* Large padding (p-8) */

/* Sections */
.card-header         /* Card header section */
.card-footer         /* Card footer section */
```

#### TypeScript Classes

```typescript
import { cardClasses, combineClasses } from '@/styles/component-classes'

const classes = combineClasses(
  cardClasses.base,
  cardClasses.variants.elevated,
  cardClasses.hover,
  cardClasses.padding.md
)
```

#### Usage Example

```vue
<!-- CSS approach -->
<article class="card-base card-hover card-padding">
  <header class="card-header">Title</header>
  <div>Content</div>
  <footer class="card-footer">Actions</footer>
</article>

<!-- Component approach -->
<BaseCard variant="elevated" padding="md" :hover="true">
  <template #header>Title</template>
  Content
  <template #footer>Actions</template>
</BaseCard>
```

---

### Forms

**Purpose**: Input fields, textareas, and form layouts

#### Classes

```css
/* Input Elements */
.base-form-element       /* Base styling for all inputs */
.form-input-na7wi        /* Standard text input */
.form-textarea-na7wi     /* Textarea with resize */

/* Structure */
.form-label              /* Field labels */
.form-group              /* Single field group */
.form-section            /* Multiple field groups */
.form-row                /* Horizontal field layout */
.form-header             /* Form section header */
.form-actions            /* Form action buttons */

/* Feedback */
.form-error              /* Error messages */
.form-help               /* Help text */

/* Preview */
.form-preview            /* Preview container */
.form-preview-title      /* Preview section title */
.form-preview-content    /* Preview content area */

/* States */
.empty-state             /* Empty form state */
```

#### Usage Example

```vue
<div class="form-section">
  <div class="form-group">
    <label class="form-label">Title</label>
    <input type="text" class="form-input-na7wi" />
    <p class="form-help">Enter the title</p>
  </div>

  <div class="form-actions">
    <button class="button-base button-primary">Save</button>
  </div>
</div>
```

---

### Checkboxes

**Purpose**: Boolean input elements

#### Classes

```css
.checkbox-default    /* Standard checkbox styling */
.checkbox-label      /* Checkbox label text */
```

#### Usage Example

```vue
<label class="flex items-center">
  <input type="checkbox" class="checkbox-default" />
  <span class="checkbox-label">Remember me</span>
</label>
```

---

### Interlinear Components

**Purpose**: Specialized components for interlinear Arabic text display

#### Classes

```css
/* Containers */
.interlinear-sentence          /* Sentence wrapper */
.interlinear-sentence-actions  /* Action buttons */
.interlinear-word-grid         /* Word flow layout */

/* Gloss Components (Modern) */
.gloss-word                    /* Base gloss word unit */
.gloss-word-interactive        /* Interactive variant */
.gloss-word-selected           /* Selected state */
.vocab-accent                  /* Vocabulary link indicator */

/* Gloss Lines */
.gloss-line                    /* Base line styling */
.gloss-arabic                  /* Arabic text line */
.gloss-transliteration         /* Transliteration line */
.gloss-translation             /* Translation line */

/* Legacy (Read-only) */
.interlinear-word              /* Read-only word unit */
.interlinear-word-linked       /* Clickable word */
.interlinear-word-arabic       /* Arabic token display */
.interlinear-word-arabic-linked /* Linked Arabic text */
.interlinear-gloss             /* Gloss container */
.interlinear-transliteration   /* Transliteration text */
.interlinear-translation       /* Translation text */

/* Fallback */
.interlinear-fallback                  /* No alignment container */
.interlinear-fallback-transliteration  /* Fallback transliteration */
.interlinear-fallback-translation      /* Fallback translation */

/* Annotations */
.interlinear-annotations       /* Annotation container */
.interlinear-annotations-icon  /* Icon styling */
.interlinear-annotations-text  /* Annotation text */

/* Preview */
.interlinear-preview-container /* Preview wrapper */
.interlinear-preview-header    /* Preview header */
.interlinear-preview-title     /* Preview title */
.interlinear-preview-content   /* Preview content area */
.interlinear-preview-section   /* Preview section */
.interlinear-preview-label     /* Section label */
.interlinear-preview-text      /* Text display */

/* Dictionary Search */
.dictionary-search-button      /* Search button */
.dictionary-button-icon        /* Button icon */
.dictionary-button-text        /* Button text */
```

#### Usage Example

```vue
<!-- Modern interactive gloss -->
<div class="interlinear-sentence">
  <div class="interlinear-word-grid">
    <div class="gloss-word gloss-word-interactive">
      <div class="vocab-accent" />
      <span class="gloss-line gloss-arabic">الكتاب</span>
      <span class="gloss-line gloss-transliteration">al-kitāb</span>
      <span class="gloss-line gloss-translation">the book</span>
    </div>
  </div>
</div>
```

---

## Layout

### Containers

**Purpose**: Page and content structure

#### Classes

```css
/* Page Containers */
.container-page              /* Standard page container */
.container-header            /* Page header container */
.container-section           /* Section container */
.page-container              /* Full-width page */
.page-container-narrow       /* Narrow centered page */
.page-container-detail       /* Detail page layout */
.page-container-index        /* Index/list page layout */

/* Specialized */
.container-feature           /* Feature showcase */
.flashcard-container         /* Flashcard layout */
.stats-container             /* Statistics display */
.mode-selection-grid         /* Mode selection grid */

/* Content Areas */
.content-area                /* Main content wrapper */
.content-header              /* Content section header */
.content-footer              /* Content section footer */
.content-main                /* Main content with fade-in */
.content-filters             /* Filter controls layout */
.content-controls            /* Action controls */

/* Pagination */
.pagination-container        /* Pagination wrapper */
.pagination-info             /* Page info display */
.pagination-text             /* Pagination text */
.page-metadata               /* Page metadata */

/* Results */
.results-info                /* Results information */
.results-text                /* Results text */

/* Utilities */
.section-spacing             /* Standard section spacing */
.full-width                  /* Full width utility */
```

---

### Flexbox

**Purpose**: Flexible layout patterns

#### CSS Classes

```css
.flex-center         /* Center items horizontally and vertically */
.flex-between        /* Space between with vertical centering */
.flex-start          /* Align to start */
.flex-end            /* Align to end */
.flex-col-center     /* Centered column layout */
.flex-wrap-gap       /* Wrapping flex with gap */
```

#### TypeScript Classes

```typescript
layoutClasses.flex.center   // 'flex items-center justify-center'
layoutClasses.flex.between  // 'flex items-center justify-between'
layoutClasses.flex.col      // 'flex flex-col'
layoutClasses.flex.wrap     // 'flex flex-wrap'
```

---

### Grid

**Purpose**: Grid-based responsive layouts

#### CSS Classes

```css
/* Responsive Grids */
.grid-responsive-2       /* 1 col → 2 cols (md) */
.grid-responsive-3       /* 1 col → 2 cols (md) → 3 cols (lg) */
.grid-responsive-4       /* 2 cols → 4 cols (md) */
.grid-auto-fit           /* Auto-fit grid (min 280px) */

/* Detail Page Grids */
.content-grid-detail         /* 1 → 4 (xl) → 5 cols (2xl) */
.content-grid-detail-3col    /* 1 → 3 (xl) → 4 cols (2xl) */
.content-grid-detail-text    /* 1 → 6 (xl) → 8 cols (2xl) */

/* Column Spans */
.content-main-column         /* 3/4 span for main content */
.content-side-column         /* 1 span for sidebar */
.content-main-column-3col    /* 2/3 span variant */
.content-text-main           /* 4/6 span for text */
.content-text-side           /* 2 span for text sidebar */
```

#### TypeScript Classes

```typescript
layoutClasses.grid.cols1    // 'grid grid-cols-1 gap-6'
layoutClasses.grid.cols2    // 'grid grid-cols-1 md:grid-cols-2 gap-6'
layoutClasses.grid.cols3    // 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
layoutClasses.grid.cols4    // 'grid grid-cols-2 md:grid-cols-4 gap-6'
```

---

## Typography

### Headings

**Purpose**: Hierarchical heading styles

#### CSS Classes

```css
.heading-hero        /* Largest: text-5xl md:text-6xl */
.heading-xl          /* Extra large: text-4xl md:text-5xl */
.heading-lg          /* Large: text-3xl */
.heading-md          /* Medium: text-2xl */
.heading-sm          /* Small: text-xl */

.page-title          /* Page title styling */
.page-description    /* Page description text */
```

#### TypeScript Classes

```typescript
textClasses.heading.h1    // text-4xl md:text-5xl
textClasses.heading.h2    // text-3xl
textClasses.heading.h3    // text-2xl
textClasses.heading.h4    // text-xl
```

---

### Body Text

**Purpose**: Content and paragraph styling

#### CSS Classes

```css
.text-lead           /* Lead paragraph (text-xl md:text-2xl) */
.text-body           /* Standard body text */
.text-small          /* Small text (text-sm) */
.text-muted          /* Muted/subtle text */

/* Truncation */
.text-truncate       /* Single line truncation */
.text-clamp-2        /* 2-line clamp */
.text-clamp-3        /* 3-line clamp */
```

#### TypeScript Classes

```typescript
textClasses.body.large    // text-xl
textClasses.body.base     // text-gray-700 leading-relaxed
textClasses.body.small    // text-sm
```

---

### Arabic Text

**Purpose**: Specialized Arabic text rendering with RTL support

#### CSS Classes

```css
.arabic-base         /* Base Arabic styling with RTL */
.arabic-large        /* Large Arabic text (text-2xl) */
.arabic-display      /* Display Arabic (text-4xl md:text-5xl) */
.arabic-root         /* Root word styling (text-xl) */
```

#### TypeScript Classes

```typescript
textClasses.arabic.base     // font-arabic text-right leading-loose
textClasses.arabic.large    // + text-2xl
textClasses.arabic.rtl      // direction-rtl
```

#### Global Arabic Classes (from main.css)

```css
.arabic              /* Standard Arabic text */
.arabic-left         /* Arabic text, LTR direction */
.arabic-large        /* 2.5rem display size */
.arabic-xl           /* 3.5rem extra large */
.arabic-display      /* 4.5rem display heading */
.arabic-text         /* Noto Naskh Arabic font */
.transliteration     /* Transliteration styling */
```

---

### Text Effects

**Purpose**: Special text styling

#### Classes

```css
.required-marker     /* Required field indicator (red asterisk) */
```

---

## Utilities

### Spacing

**Purpose**: Consistent vertical and gap spacing

#### Classes

```css
/* Vertical Spacing (space-y) */
.space-xs            /* space-y-2 (0.5rem) */
.space-sm            /* space-y-3 (0.75rem) */
.space-md            /* space-y-4 (1rem) */
.space-lg            /* space-y-6 (1.5rem) */
.space-xl            /* space-y-8 (2rem) */

/* Gap Utilities */
.gap-xs              /* gap-2 */
.gap-sm              /* gap-3 */
.gap-md              /* gap-4 */
.gap-lg              /* gap-6 */
.gap-xl              /* gap-8 */

/* Margins */
.margin-bottom-sm    /* mb-3 */
.margin-bottom-md    /* mb-4 */
.margin-bottom-lg    /* mb-6 */
.margin-top-sm       /* mt-3 */
```

---

### Interactions

**Purpose**: Interactive elements and states

#### Classes

```css
/* Action Buttons */
.action-button           /* Standard action button */
.action-button-primary   /* Primary action */
.action-button-danger    /* Dangerous action */

/* Dropdowns */
.dropdown-menu           /* Dropdown container */
.dropdown-item           /* Dropdown menu item */
.dropdown-item-danger    /* Dangerous dropdown item */

/* Links */
.external-link           /* External link styling */
.external-link-icon      /* External link icon */

/* Navigation */
.nav-link                /* Navigation link */
.nav-link-active         /* Active navigation state */
```

---

### Effects

**Purpose**: Visual effects, animations, and transitions

#### Classes

```css
/* Transitions */
.transition-fast         /* 150ms transition */
.transition-medium       /* 300ms transition */
.transition-slow         /* 500ms transition */

/* Glass Effects */
.glass-light             /* Light glass-morphism */
.glass-dark              /* Dark glass-morphism */

/* Shadows */
.shadow-soft             /* shadow-lg */
.shadow-medium           /* shadow-xl */
.shadow-strong           /* shadow-2xl */
.shadow-glow             /* shadow-xl with primary glow */

/* Animations */
.fade-in                 /* Fade in animation */
.slide-up                /* Slide up animation */
.scale-in                /* Scale in animation */

/* Loading States */
.loading-container       /* Loading wrapper */
.loading-spinner         /* Spinning loader */
.loading-text            /* Loading message */

/* Empty States */
.empty-state-card        /* Empty state container */
.empty-state-icon        /* Empty state icon */
.empty-state-title       /* Empty state title */
.empty-state-message     /* Empty state message */
.empty-state-actions     /* Empty state actions */

/* Highlighting */
.annotation-highlight    /* Annotation highlight effect */
```

#### Global Effects (from main.css)

```css
.text-shadow             /* Subtle text shadow */
.text-shadow-lg          /* Large text shadow */
.glass                   /* Light glass effect */
.glass-dark              /* Dark glass effect */
.animate-fade-in         /* Fade in keyframe */
.animate-slide-up        /* Slide up keyframe */
.animate-scale-in        /* Scale in keyframe */
.animate-blob            /* Blob animation */
.animation-delay-2000    /* 2s delay */
.animation-delay-4000    /* 4s delay */
```

---

## TypeScript Helper Functions

### combineClasses

**Purpose**: Safely combine multiple class names

```typescript
import { combineClasses } from '@/styles/component-classes'

const classes = combineClasses(
  'base-class',
  condition && 'conditional-class',
  null,
  undefined,
  'final-class'
)
// Result: 'base-class conditional-class final-class'
```

---

## Design Tokens

### Colors

The design system uses Tailwind's color system with custom brand colors:

- **Primary**: Green shades (primary-50 through primary-900)
- **Secondary**: Complementary brand color
- **Neutrals**: Gray scale (gray-50 through gray-900)
- **Semantic**: Red (errors), Yellow (warnings), Green (success)

### Typography Scale

- **Hero**: 3.75rem / 4.5rem (mobile/desktop)
- **XL**: 3rem / 3.75rem
- **Large**: 2.25rem
- **Medium**: 1.5rem
- **Small**: 1.25rem
- **Body**: 1rem
- **Small**: 0.875rem

### Spacing Scale

- **xs**: 0.5rem (8px)
- **sm**: 0.75rem (12px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)

### Border Radius

- **sm**: 0.5rem (8px)
- **md**: 0.75rem (12px)
- **lg**: 1rem (16px)
- **xl**: 1.5rem (24px)
- **2xl**: 2rem (32px)
- **full**: 9999px (circular)

### Shadows

- **soft**: shadow-lg
- **medium**: shadow-xl
- **strong**: shadow-2xl
- **glow**: shadow-xl with primary-500/20 color

---

## Font Configuration

### Arabic Fonts

```css
font-arabic: 'Lateef', 'Noto Naskh Arabic', serif
font-arabic-display: 'Markazi Text', serif
font-arabic-text: 'Noto Naskh Arabic', serif
```

### Latin Fonts

```css
font-sans: 'Lato', sans-serif
font-display: 'Overlock', cursive
```

### Font Features

Arabic text uses OpenType features:

- `kern`: Kerning
- `liga`: Ligatures
- `calt`: Contextual alternates

---

## Dark Mode Support

Many classes include dark mode variants using Tailwind's `dark:` prefix:

```css
.text-gray-900 dark:text-gray-100
.bg-white dark:bg-gray-800
.border-gray-200 dark:border-gray-700
```

---

## RTL Support

Arabic text automatically receives RTL styling through:

```css
direction: rtl;
text-align: right;
```

Classes like `.arabic-base` and `.arabic-*` include built-in RTL support.

---

## Best Practices

### 1. Use Semantic Classes

```vue
<!-- Good -->
<button class="button-base button-primary button-md">Save</button>

<!-- Avoid -->
<button class="px-6 py-3 bg-gradient-to-r from-primary-600...">Save</button>
```

### 2. Combine Approaches Appropriately

- Use **CSS classes** for simple, static components
- Use **TypeScript classes** for dynamic, conditional styling
- Use **Base components** (BaseButton, BaseCard) for maximum reusability

### 3. Layer Responsibly

- Components should use component layer classes
- Layouts should use layout classes
- Avoid mixing raw Tailwind unless absolutely necessary

### 4. Maintain Consistency

- Check existing classes before creating new ones
- Follow the established naming convention
- Test in both LTR and RTL contexts for Arabic text

### 5. Test Responsiveness

All layouts should work across breakpoints:

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: 1024px - 1280px
- Large: 1280px+
- XL: 1536px+

---

## Migration Path

For components still using inline Tailwind:

1. **Identify** the component's styling needs
2. **Search** for existing semantic classes that match
3. **Apply** the semantic classes
4. **Remove** raw Tailwind classes
5. **Test** responsiveness and RTL support
6. **Document** any new classes created

### Example Migration

**Before:**

```vue
<button class="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white">
  Save
</button>
```

**After:**

```vue
<button class="button-base button-primary button-md">
  Save
</button>
```

Or better yet:

```vue
<BaseButton variant="primary" size="md">
  Save
</BaseButton>
```
