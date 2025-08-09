# An-Na7wi CSS Architecture

## Structure Overview

```
assets/css/
├── main.css              # Main CSS entry point
├── semantic/             # Design system entry
│   └── index.css        # Imports all semantic classes
├── components/          # UI component styles
│   ├── cards.css        # Card components
│   ├── buttons.css      # Button variants
│   ├── badges.css       # Badge components
│   └── forms.css        # Form elements
├── layout/              # Layout utilities
│   ├── containers.css   # Page/section containers
│   ├── grid.css         # CSS Grid layouts
│   └── flexbox.css      # Flexbox utilities
├── typography/          # Text styling
│   ├── headings.css     # Heading hierarchy
│   ├── body-text.css    # Body text utilities
│   └── arabic.css       # Arabic text styling
└── utilities/           # Utility classes
    ├── spacing.css      # Spacing/gap utilities
    ├── interactions.css # Interactive elements
    └── effects.css      # Animations/transitions
```

## Usage

The design system is automatically imported via `main.css`:

```css
@import './semantic/index.css';
```

## Benefits

- **Modular**: Each category is in its own file
- **Maintainable**: Easy to find and update specific styles
- **Performance**: Smaller files for better build optimization
- **Developer Experience**: Clear organization and imports
- **Semantic**: Class names describe purpose, not appearance

## Working with Components

When refactoring components:

1. Replace raw Tailwind with semantic classes
2. Check the appropriate CSS file (e.g., `components/cards.css` for card styles)
3. Add new classes to the correct category file
4. Test responsiveness and Arabic RTL layouts

## Adding New Styles

1. Choose the appropriate category folder
2. Add classes to the relevant file
3. Follow the naming convention: `category-variant-size`
4. Use `@apply` with Tailwind utilities
5. Test in both LTR and RTL contexts