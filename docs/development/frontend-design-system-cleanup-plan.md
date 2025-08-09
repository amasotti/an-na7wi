# Frontend Design System Cleanup Plan

## Executive Summary

The An-Na7wi frontend has a good foundation with 70% test coverage and basic MVP functionality. However, the CSS/styling
approach is inconsistent, mixing direct Tailwind classes with a partially implemented design system. This plan outlines
a systematic cleanup to establish a cohesive design system and simplify component templates.

## Current State Analysis

### ✅ Strengths

- **Good foundation**: Component classes system exists in `/styles/component-classes.ts`
- **Consistent base components**: BaseButton, BaseCard, BaseInput, etc. are well-structured
- **Proper CSS layers**: Using Tailwind's `@layer` directive correctly
- **Arabic typography**: Good Arabic font handling and RTL support
- **High test coverage**: 70% coverage maintained

### ❌ Issues Identified

#### 1. **Inconsistent CSS Class Usage**

- **Mixed approaches**: Some components use `component-classes.ts`, others use raw Tailwind
- **Duplicate definitions**: Same styles defined in both CSS layers and TypeScript classes
- **Direct Tailwind in templates**: Many components bypass the design system entirely

**Examples:**

- `TextCard.vue`: Uses design system classes mixed with raw Tailwind
- `RootCard.vue`: Completely bypasses design system, uses computed Tailwind arrays
- `index.vue`: Mix of BaseButton component with raw Tailwind classes

#### 2. **Template Complexity**

- **Verbose computed properties**: Many components have 5-10 computed class properties
- **Repeated patterns**: Similar styling logic duplicated across components
- **Hard-to-maintain**: Changes require updates in multiple places

#### 3. **Design System Gaps**

- **Missing semantic tokens**: No spacing, color, or typography scales
- **Incomplete component variants**: Limited button/card/badge variations
- **No layout primitives**: Grid, flex, and container patterns scattered throughout

## Cleanup Strategy

### Phase 1: Design System Foundation 

#### 1.1 Create Semantic Design Tokens

**Proposed File**: `/styles/design-tokens.ts`

e.g. of content:

```typescript
export const spacing = {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px  
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
}

export const colors = {
    primary: {
        50: 'rgb(var(--color-primary-50) / <alpha-value>)',
        // ... continue pattern
    }
}

export const typography = {
    sizes: {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        // ...
    }
}
```

#### 1.2 Expand Component Classes System

**Enhance**: `/styles/component-classes.ts`

- Add missing component variants (info, warning, ghost buttons)
- Create layout primitive classes (containers, grids, flex patterns)
- Add surface/elevation classes for consistent depth
- Create semantic spacing classes

#### 1.3 Consolidate CSS Layers

**Clean up**: `/assets/css/main.css`

- Remove duplicate definitions that exist in component-classes.ts
- Keep only base styles and custom animations
- Ensure all component styles are in TypeScript system

### Phase 2: Component Refactoring

#### 2.1 High-Priority Components (2 hours)

**Order of refactoring:**

1. **BaseCard.vue** - Central to many layouts
2. **TextCard.vue** - Complex template, high usage
3. **RootCard.vue** - Bypasses design system entirely
4. **TheNavigation.vue** - Site-wide impact

**Refactoring approach:**

- Replace computed class arrays with simple design system lookups
- Reduce template complexity by 50-70%
- Eliminate raw Tailwind where design system exists

#### 2.2 Template Simplification Patterns

### Phase 3: Layout Standardization

#### 3.1 Page Layout Consistency

**Target files:**

- All pages in `/pages/`
- Layout components in `/components/layout/`

**Actions:**

- Replace repeated grid/flex patterns with layout classes
- Standardize container and spacing usage
- Create page layout templates

#### 3.2 Create Layout Primitives

**New classes in component-classes.ts:**

```typescript
export const layoutClasses = {
    page: 'container mx-auto px-4 py-8',
    section: 'mb-12',
    card: 'card p-6',
    gridAuto: 'grid grid-cols-auto gap-6',
    flexBetween: 'flex items-center justify-between',
    // ...
}
```
