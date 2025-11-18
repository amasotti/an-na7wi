# An-Na7wi Style Documentation

This directory contains the guides for using and maintaining the project's CSS architecture and design system.

## Documents

### [Design System Documentation](./design-system.md)

Complete reference guide for all available CSS classes and design tokens.
Refer to the above document when searching for the right class to use or building new compoents.

**Contents**:
- Component classes (buttons, cards, forms, badges, etc.)
- Layout utilities (containers, grids, flexbox)
- Typography (headings, body text, Arabic text)
- Utility classes (spacing, effects, interactions)
- TypeScript helper functions
- Design tokens (colors, spacing, shadows)
- Best practices and examples

---

### [Organization Guidelines](./organization-guidelines.md)

Guidelines for organizing, maintaining, and evolving the design system.

---

## Quick Start

### Using Existing Classes

1. **Search the design system** → [design-system.md](./design-system.md)
2. **Find the category** you need (e.g., buttons, layout, typography)
3. **Apply the semantic class** to your component

```vue
<!-- Instead of inline Tailwind -->
<button class="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600...">

<!-- Use semantic classes -->
<button class="button-base button-primary button-md">
```

### Adding New Styles

1. **Check for existing classes** first (search design-system.md or grep the CSS files)
2. **Follow naming conventions** → See [Organization Guidelines](./organization-guidelines.md#2-naming-conventions)
3. **Add to the correct file**:
   - Components → `frontend/assets/css/components/*.css`
   - Layout → `frontend/assets/css/layout/*.css`
   - Typography → `frontend/assets/css/typography/*.css`
   - Utilities → `frontend/assets/css/utilities/*.css`
4. **Document it** in this guide

### Using Base Components

For maximum reusability:

```vue
<BaseButton variant="primary" size="md">Save</BaseButton>
<BaseCard variant="elevated" padding="lg">Content</BaseCard>
```

See available components in `frontend/components/common/`

---

## File Locations

### CSS Classes

```
frontend/assets/css/
├── main.css              # Entry point
├── semantic/index.css    # Imports all categories
├── components/           # UI component styles
├── layout/               # Layout utilities
├── typography/           # Text styling
└── utilities/            # Utility classes
```

### TypeScript Classes

```
frontend/styles/
├── component-classes.ts  # TypeScript class definitions
└── components/
    └── cards.ts          # Type definitions
```

### Base Components

```
frontend/components/common/
├── BaseButton.vue
├── BaseCard.vue
├── BaseInput.vue
├── BaseCheckBox.vue
└── ...
```

---

## Design Philosophy

### Semantic Over Appearance

```css
✅ .button-primary     (describes purpose)
❌ .btn-blue          (describes appearance)

✅ .card-elevated     (describes visual effect)
❌ .card-shadow-2xl   (describes implementation)
```

### Consistency Over Flexibility

Use the design system classes rather than creating one-off inline styles. This ensures:
- Visual consistency across the app
- Easier maintenance and refactoring
- Better performance (reused classes)
- Clearer code intent


---

## Common Patterns

### Standard Page Layout

```vue
<div class="page-container">
  <header class="content-header">
    <h1 class="heading-xl">Page Title</h1>
    <p class="text-lead">Description</p>
  </header>

  <main class="content-area">
    <!-- Content -->
  </main>
</div>
```

### Card Grid

```vue
<div class="grid-responsive-3">
  <BaseCard v-for="item in items" :key="item.id">
    {{ item.content }}
  </BaseCard>
</div>
```

### Form Layout

```vue
<form class="form-section">
  <div class="form-group">
    <label class="form-label">Title</label>
    <input type="text" class="form-input-na7wi" />
  </div>

  <div class="form-actions">
    <BaseButton variant="outline">Cancel</BaseButton>
    <BaseButton variant="primary">Save</BaseButton>
  </div>
</form>
```

### Arabic Text Display

```vue
<div class="arabic-base">
  {{ arabicText }}
</div>

<p class="transliteration">
  {{ transliteration }}
</p>
```

---

## Related Documentation

- [Main README](../../README.md)
- [CSS Architecture](../../frontend/assets/css/README.md)
