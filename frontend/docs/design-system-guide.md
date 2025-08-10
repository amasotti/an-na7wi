# An-Na7wi Design System Guide

## Part 1: Semantic HTML5 Recommendations

### Current Issues and Improvements

Based on the component analysis, here are key recommendations for better semantic HTML5 usage:

#### 1. Replace Generic Divs with Semantic Elements

**Current Pattern (TextCard.vue):**
```vue
<div class="absolute top-4 right-4 z-10">
  <button>Actions</button>
  <div class="dropdown">...</div>
</div>
```

**Improved Semantic Pattern:**
```vue
<aside class="card-actions" aria-label="Text actions">
  <button aria-haspopup="true" aria-expanded="false">Actions</button>
  <menu class="dropdown-menu" role="menu">...</menu>
</aside>
```

#### 2. Better Article Structure

**Current Pattern (RootCard.vue):**
```vue
<div @click="handleClick">
  <div class="p-4 space-y-3">
    <div class="text-center">Root content</div>
  </div>
</div>
```

**Improved Semantic Pattern:**
```vue
<article class="root-card card-interactive" tabindex="0" role="button">
  <header class="root-header">
    <h3 class="root-title">{{ root.displayForm }}</h3>
    <p class="root-meaning">{{ root.meaning }}</p>
  </header>
  <section class="root-details">
    <dl class="root-stats">
      <dt class="sr-only">Letter count</dt>
      <dd>{{ root.letterCount }} letters</dd>
      <dt class="sr-only">Word count</dt>
      <dd>{{ root.wordCount }} words</dd>
    </dl>
  </section>
</article>
```

#### 3. Navigation Improvements

**Current Pattern:**
```vue
<div class="nav-links">
  <NuxtLink to="/texts">Texts</NuxtLink>
</div>
```

**Improved Semantic Pattern:**
```vue
<nav aria-label="Main navigation">
  <ul class="nav-list">
    <li><a href="/texts" class="nav-link">Texts</a></li>
    <li><a href="/words" class="nav-link">Vocabulary</a></li>
    <li><a href="/roots" class="nav-link">Roots</a></li>
  </ul>
</nav>
```

#### 4. Form Structure Enhancements

**Recommended Pattern for forms:**
```vue
<form class="form-container">
  <fieldset class="form-group">
    <legend class="form-legend">Text Details</legend>
    <div class="form-field">
      <label for="title" class="form-label">Title</label>
      <input id="title" type="text" class="form-input" required>
      <small class="form-help">Enter a descriptive title</small>
    </div>
  </fieldset>
</form>
```

#### 5. Arabic Content Structure

**Current Pattern:**
```vue
<p class="arabic-base">{{ text.arabicContent }}</p>
```

**Improved Semantic Pattern:**
```vue
<blockquote class="arabic-content" lang="ar" dir="rtl">
  <p class="arabic-base">{{ text.arabicContent }}</p>
  <cite class="transliteration" lang="ar-Latn">{{ text.transliteration }}</cite>
</blockquote>
```

## Part 2: Design System Documentation

### Overview

The An-Na7wi design system provides a comprehensive set of semantic CSS classes that replace the need for inline Tailwind classes throughout components. These classes are organized by function and follow consistent naming conventions.

### Core Principles

1. **Semantic Naming**: Class names describe purpose, not appearance
2. **Consistent Hierarchy**: Predictable size/spacing scales (xs, sm, md, lg, xl)
3. **Component Variants**: Each component has logical variants (primary, secondary, outline, etc.)
4. **Responsive by Default**: Most layout classes include responsive breakpoints
5. **Arabic-First**: Special attention to RTL layouts and Arabic typography

### Class Categories

#### Layout Classes

**Container Systems:**
- `.container-page` - Full page container with padding
- `.container-section` - Section-level container
- `.section-spacing` - Consistent section vertical spacing
- `.content-area` - Content wrapper with vertical spacing

**Grid Layouts:**
- `.grid-responsive-2` - 1→2 column responsive grid
- `.grid-responsive-3` - 1→2→3 column responsive grid
- `.grid-responsive-4` - 2→4 column responsive grid
- `.grid-auto-fit` - Auto-fitting grid with min 280px columns

**Flexbox Utilities:**
- `.flex-center` - Center items horizontally and vertically
- `.flex-between` - Space items with space-between
- `.flex-start` - Align items to start
- `.flex-col-center` - Vertical flex with centered items
- `.flex-wrap-gap` - Flex wrap with consistent gaps

#### Card Components

**Base Cards:**
- `.card-base` - Standard card with glass morphism
- `.card-hover` - Adds hover lift effect
- `.card-elevated` - Enhanced shadow for important cards
- `.card-glass` - Transparent glass effect
- `.card-interactive` - Clickable card with hover states

**Card Structure:**
- `.card-padding` / `.card-padding-sm` / `.card-padding-lg` - Consistent internal spacing
- `.card-header` - Card header with border
- `.card-footer` - Card footer with border

#### Button Components

**Button Foundation:**
- `.button-base` - Core button styles
- `.button-hover-lift` - Hover scale effect

**Button Variants:**
- `.button-primary` - Primary action button
- `.button-secondary` - Secondary action button  
- `.button-outline` - Outlined button
- `.button-ghost` - Minimal text button
- `.button-danger` - Destructive action button

**Button Sizes:**
- `.button-sm` - Small button (mobile-friendly)
- `.button-md` - Standard button
- `.button-lg` - Large prominent button

#### Typography System

**Headings:**
- `.heading-hero` - Page hero title (5xl/6xl)
- `.heading-xl` - Major section heading (4xl/5xl)
- `.heading-lg` - Section heading (3xl)
- `.heading-md` - Subsection heading (2xl)
- `.heading-sm` - Minor heading (xl)

**Body Text:**
- `.text-lead` - Large introductory text
- `.text-body` - Standard body text
- `.text-small` - Small supplementary text
- `.text-muted` - De-emphasized text

**Text Utilities:**
- `.text-truncate` - Single line truncation
- `.text-clamp-2` / `.text-clamp-3` - Multi-line truncation

#### Arabic Typography

**Arabic Text Classes:**
- `.arabic-base` - Standard Arabic text with RTL and proper rendering
- `.arabic-large` - Larger Arabic text (2xl)
- `.arabic-display` - Display-size Arabic text (4xl/5xl)
- `.arabic-root` - Arabic root display styling

### Badge System

**Badge Foundation:**
- `.badge-base` - Core badge styling

**Badge Variants:**
- `.badge-primary` - Primary theme badge
- `.badge-secondary` - Secondary theme badge
- `.badge-success` - Success/positive badge (green)
- `.badge-warning` - Warning/attention badge (yellow)
- `.badge-error` - Error/negative badge (red)
- `.badge-neutral` - Neutral information badge (gray)

### Form Elements

**Form Structure:**
- `.form-group` - Form field grouping
- `.form-label` - Consistent label styling
- `.form-input` - Standard input field
- `.form-error` - Error message styling
- `.form-help` - Help text styling

### Interactive Elements

**Navigation:**
- `.nav-link` - Standard navigation link
- `.nav-link-active` - Active navigation state

**Action Elements:**
- `.action-button` - Small action button
- `.action-button-primary` - Primary action button
- `.dropdown-menu` - Dropdown container
- `.dropdown-item` - Dropdown menu item
- `.dropdown-item-danger` - Destructive dropdown item

### Content Sections

**Page Structure:**
- `.hero-section` - Hero section spacing
- `.feature-section` - Feature section spacing
- `.feature-grid` - Feature grid layout

### Utility Classes

**Animations:**
- `.fade-in` / `.slide-up` / `.scale-in` - Entrance animations
- `.transition-fast` / `.transition-medium` / `.transition-slow` - Transition speeds

**Effects:**
- `.glass-light` / `.glass-dark` - Glass morphism effects
- `.shadow-soft` / `.shadow-medium` / `.shadow-strong` / `.shadow-glow` - Shadow variations

**Spacing:**
- `.space-xs` through `.space-xl` - Vertical spacing (space-y)
- `.gap-xs` through `.gap-xl` - Gap spacing for flex/grid

### Usage Examples

#### Before (Raw Tailwind):
```vue
<div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 p-6">
  <h3 class="text-2xl font-semibold text-gray-800 mb-3">Title</h3>
  <p class="text-gray-700 leading-relaxed">Content</p>
</div>
```

#### After (Semantic Classes):
```vue
<div class="card-base card-hover card-padding">
  <h3 class="heading-md">Title</h3>
  <p class="text-body">Content</p>
</div>
```

#### Arabic Content Example:
```vue
<!-- Before -->
<p class="font-arabic text-right leading-loose text-gray-900 text-2xl" style="direction: rtl;">Arabic text</p>

<!-- After -->
<p class="arabic-large">Arabic text</p>
```

### Integration Steps

1. **Import the semantic classes** in your main CSS file:
```css
@import './semantic-classes.css';
```

2. **Replace component computed classes** with direct semantic class usage
3. **Update templates** to use semantic classes instead of raw Tailwind
4. **Remove duplicate styles** from component-classes.ts that now exist in CSS
5. **Test responsiveness** and Arabic RTL layouts

### Accessibility Notes

- All interactive elements include proper focus states
- Color combinations meet WCAG AA contrast requirements
- Semantic classes work well with screen readers
- Arabic text includes proper `dir="rtl"` and `lang="ar"` attributes
