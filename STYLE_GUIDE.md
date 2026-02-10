# Tailux Style Guide

This document provides a comprehensive overview of the project's design system, including colors, typography, spacing, borders, buttons, form elements, and component styles.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Colors](#colors)
3. [Typography](#typography)
4. [Spacing & Paddings](#spacing--paddings)
5. [Borders](#borders)
6. [Shadows](#shadows)
7. [Buttons](#buttons)
8. [Form Elements](#form-elements)
9. [Components](#components)
10. [Layout System](#layout-system)
11. [Utilities](#utilities)
12. [Animations](#animations)

---

## Architecture

The CSS is organized using CSS layers for proper cascade control:

```css
@layer theme, base, vendor, components, utilities;
```

### File Structure

| File | Layer | Purpose |
|------|-------|---------|
| `colors.css` | base | Theme color definitions |
| `variants.css` | base | Color variant classes |
| `layouts.css` | base | Layout-specific styles |
| `base.css` | base | Base element styles |
| `app/index.css` | components | Component styles |

---

## Colors

### Primary Colors (Default: Indigo)

| Token | Value |
|-------|-------|
| `--color-primary-50` | `var(--color-indigo-50)` |
| `--color-primary-100` | `var(--color-indigo-100)` |
| `--color-primary-200` | `var(--color-indigo-200)` |
| `--color-primary-300` | `var(--color-indigo-300)` |
| `--color-primary-400` | `var(--color-indigo-400)` |
| `--color-primary-500` | `var(--color-indigo-500)` |
| `--color-primary-600` | `var(--color-indigo-600)` |
| `--color-primary-700` | `var(--color-indigo-700)` |
| `--color-primary-800` | `var(--color-indigo-800)` |
| `--color-primary-900` | `var(--color-indigo-900)` |
| `--color-primary-950` | `var(--color-indigo-950)` |

**Available Primary Themes:** `indigo`, `blue`, `green`, `amber`, `purple`, `rose`

### Secondary Colors (Pink/Magenta)

| Token | Hex Value |
|-------|-----------|
| `--color-secondary-lighter` | `#ff75df` |
| `--color-secondary-light` | `#ff2ecf` |
| `--color-secondary` | `#e000ad` |
| `--color-secondary-darker` | `#b8008c` |

### Semantic Colors

#### Info (Sky)
| Token | Value |
|-------|-------|
| `--color-info-lighter` | `var(--color-sky-400)` |
| `--color-info-light` | `var(--color-sky-500)` |
| `--color-info` | `var(--color-sky-600)` |
| `--color-info-darker` | `var(--color-sky-700)` |

#### Success (Emerald)
| Token | Value |
|-------|-------|
| `--color-success-lighter` | `var(--color-emerald-400)` |
| `--color-success-light` | `var(--color-emerald-500)` |
| `--color-success` | `var(--color-emerald-600)` |
| `--color-success-darker` | `var(--color-emerald-700)` |

#### Warning (Orange)
| Token | Hex Value |
|-------|-----------|
| `--color-warning-lighter` | `#ffba42` |
| `--color-warning-light` | `#ffa71a` |
| `--color-warning` | `#f59200` |
| `--color-warning-darker` | `#db7c00` |

#### Error (Red/Orange)
| Token | Hex Value |
|-------|-----------|
| `--color-error-lighter` | `#ff8a5c` |
| `--color-error-light` | `#ff6933` |
| `--color-error` | `#ff4f1a` |
| `--color-error-darker` | `#e52e00` |

### Gray Scale (Default: Slate)

| Token | Value |
|-------|-------|
| `--color-gray-50` | `var(--color-slate-50)` |
| `--color-gray-100` | `var(--color-slate-100)` |
| `--color-gray-150` | `#e9eef5` |
| `--color-gray-200` | `var(--color-slate-200)` |
| `--color-gray-300` | `var(--color-slate-300)` |
| `--color-gray-400` | `var(--color-slate-400)` |
| `--color-gray-500` | `var(--color-slate-500)` |
| `--color-gray-600` | `var(--color-slate-600)` |
| `--color-gray-700` | `var(--color-slate-700)` |
| `--color-gray-800` | `var(--color-slate-800)` |
| `--color-gray-900` | `var(--color-slate-900)` |
| `--color-gray-950` | `var(--color-slate-950)` |

**Available Light Themes:** `slate`, `gray`, `neutral`

### Dark Mode Colors (Default: Cinder)

| Token | Hex Value |
|-------|-----------|
| `--color-dark-50` | `#e6e7eb` |
| `--color-dark-100` | `#d0d2db` |
| `--color-dark-200` | `#b7bac4` |
| `--color-dark-300` | `#838794` |
| `--color-dark-400` | `#4c4f57` |
| `--color-dark-450` | `#383a41` |
| `--color-dark-500` | `#2a2c32` |
| `--color-dark-600` | `#232429` |
| `--color-dark-700` | `#1c1d21` |
| `--color-dark-750` | `#1a1b1f` |
| `--color-dark-800` | `#15161a` |
| `--color-dark-900` | `#0e0f11` |

**Available Dark Themes:** `navy`, `mirage`, `mint`, `black`, `cinder`

### Surface Colors (Dark Mode)

| Token | Default Value |
|-------|---------------|
| `--surface-1` | `var(--color-dark-450)` |
| `--surface-2` | `var(--color-dark-500)` |
| `--surface-3` | `var(--color-dark-600)` |

### Color Variants (Contextual "this" colors)

Use these classes to set contextual colors:

| Class | Description |
|-------|-------------|
| `.this:primary` | Primary color variant |
| `.this:secondary` | Secondary color variant |
| `.this:info` | Info color variant |
| `.this:success` | Success color variant |
| `.this:warning` | Warning color variant |
| `.this:error` | Error color variant |

---

## Typography

### Font Family

```css
--font-sans: Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
```

### Font Sizes

| Token | Size | Line Height |
|-------|------|-------------|
| `--text-tiny` | `0.625rem` (10px) | `0.8125rem` (13px) |
| `--text-tiny-plus` | `0.6875rem` (11px) | `0.875rem` (14px) |
| `--text-xs-plus` | `0.8125rem` (13px) | `1.125rem` (18px) |
| `--text-sm-plus` | `0.9375rem` (15px) | `1.375rem` (22px) |

### Body Text

```css
body {
  font-size: 0.875rem (14px);
  line-height: 1.25rem (20px);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
```

---

## Spacing & Paddings

### Component Paddings

| Component | Padding |
|-----------|---------|
| **Button (`.btn`)** | `px-5 py-2` (20px horizontal, 8px vertical) |
| **Input (`.form-input`)** | `px-3 py-2` (12px horizontal, 8px vertical) |
| **Textarea (`.form-textarea`)** | `px-3 py-2` (12px horizontal, 8px vertical) |
| **Select (`.form-select`)** | `px-3 py-2` (12px horizontal, 8px vertical) |
| **Badge (`.badge`)** | `px-2 py-1` (8px horizontal, 4px vertical) |
| **Table Cell (`.table-td`)** | `px-4 py-3` / `sm:px-5` |
| **Table Header (`.table-th`)** | `px-4 py-3` / `sm:px-5` |
| **Table Dense Cell** | `px-2 py-1.5` |
| **Pagination Control** | `px-2.5` (10px horizontal), `h-8 min-w-[2rem]` |

### Layout Margins

| Layout | Margin-X Variable |
|--------|-------------------|
| **Main Layout** | `--margin-x: 1rem` (md: `1.5rem`, xl: `4rem`) |
| **Sideblock** | `--margin-x: 1rem` (md: `1.5rem`, 2xl: `3rem`) |
| **Horizontal Nav** | `--margin-x: 1rem` (md: `1.5rem`, 2xl: `3rem`) |

### Inline Spacing

```css
.inline-space > :not([hidden]) {
  margin-bottom: 0.625rem;
  margin-right: 0.625rem;
}
```

---

## Borders

### Default Border Color

```css
border-color: var(--color-gray-200, currentColor);
```

### Border Radius

| Component | Border Radius |
|-----------|---------------|
| **Button (`.btn`)** | `rounded-lg` (0.5rem / 8px) |
| **Input (`.form-input`)** | `rounded-lg` (0.5rem / 8px) |
| **Textarea (`.form-textarea`)** | `rounded-lg` (0.5rem / 8px) |
| **Select (`.form-select`)** | `rounded-lg` (0.5rem / 8px) |
| **Badge (`.badge`)** | `rounded-sm` (0.125rem / 2px) |
| **Avatar (`.avatar-display`)** | `rounded-full` |
| **Checkbox (`.form-checkbox`)** | `rounded-sm` (0.125rem / 2px) |
| **Radio (`.form-radio`)** | `rounded-full` |
| **Switch (`.form-switch`)** | `rounded-full` |
| **Pagination (`.pagination`)** | `rounded-lg` (0.5rem / 8px) |
| **Progress (`.progress-rail`)** | `rounded-full` |
| **Inline Code** | `rounded-sm` |

### Border Width

| Token | Value |
|-------|-------|
| `--border-width-3` | `3px` |

### Input Borders

```css
.form-input, .form-textarea {
  border: 1px solid transparent;
}
```

### Avatar Dot Border

```css
.avatar-dot {
  border: 2px solid white;
  /* dark mode: border-color: var(--color-dark-700) */
}
```

---

## Shadows

### Soft Shadow (Light Mode)

```css
--shadow-soft:
  rgba(145, 158, 171, 0.2) 0px 0px 2px 0px,
  rgba(145, 158, 171, 0.12) 0px 12px 24px -4px;
```

### Soft Shadow (Dark Mode)

```css
--shadow-soft-dark: 0 3px 10px 0 rgb(25 25 25 / 30%);
```

---

## Buttons

### Base Button Class

```css
.btn-base {
  display: inline-flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 500; /* medium */
  letter-spacing: 0.025em; /* tracking-wide */
  outline: none;
  transition: all 200ms;
}

/* Disabled state */
.btn-base:disabled {
  pointer-events: none;
  user-select: none;
}
```

### Standard Button

```css
.btn {
  border-radius: 0.5rem; /* rounded-lg */
  padding: 0.5rem 1.25rem; /* py-2 px-5 */
}

.btn:disabled {
  opacity: 0.7;
  /* dark mode: opacity: 0.6 */
}
```

### Sidebar Toggle Button

```css
.sidebar-toggle-btn span {
  height: 2px;
  width: 1.25rem; /* 20px */
  transition: all 250ms ease-in-out;
}

.sidebar-toggle-btn span:nth-child(2) {
  width: 0.75rem; /* 12px */
}
```

---

## Form Elements

### Input & Textarea

```css
.form-input-base, .form-textarea-base {
  display: block;
  width: 100%;
  appearance: none;
  background: transparent;
  letter-spacing: 0.025em;
  outline: none;
  transition: colors 200ms ease-in-out;
}

.form-input, .form-textarea {
  border-radius: 0.5rem;
  border: 1px solid transparent;
  padding: 0.5rem 0.75rem;
  text-align: start;
  color: var(--color-gray-800);
  /* dark: color: var(--color-dark-100) */
}

/* Placeholder */
placeholder {
  font-weight: 300; /* light */
  color: var(--color-gray-600);
  /* dark: color: var(--color-dark-200) */
}

.form-textarea {
  resize: none;
}
```

### Select

```css
.form-select, .form-multiselect {
  border-radius: 0.5rem;
  border: 1px solid transparent;
  padding: 0.5rem 0.75rem;
  text-align: start;
  color: var(--color-gray-800);
  /* dark: color: var(--color-dark-100) */
}
```

### Checkbox

```css
.form-checkbox {
  width: 1.125rem; /* 18px */
  height: 1.125rem; /* 18px */
  border-radius: 0.125rem; /* rounded-sm */
  cursor: pointer;
  border: 1px solid;
  transition: all 200ms ease-out;
}

/* Check mark appears with scale animation */
.form-checkbox:checked::before {
  transform: scale(1);
}
```

### Radio Button

```css
.form-radio {
  width: 1.125rem; /* 18px */
  height: 1.125rem; /* 18px */
  border-radius: 9999px; /* fully round */
  cursor: pointer;
  border: 1px solid;
  transition: all 200ms ease-out;
}
```

### Switch/Toggle

```css
.form-switch {
  height: 1.25rem; /* 20px */
  width: 2.5rem; /* 40px */
  border-radius: 9999px; /* fully round */
  cursor: pointer;
  transition: all 200ms ease-in-out;
  --thumb-border: 2px;
}

/* Thumb dimensions */
thumb::before {
  height: calc(100% - 4px); /* minus border */
  width: calc(50% - 4px);
  border-radius: 9999px;
}
```

### Range Slider

```css
.form-range {
  --thumb-size: 1.125rem; /* 18px */
  --track-h: 0.375rem; /* 6px */
}

/* Thumb */
.form-range::-webkit-slider-thumb {
  height: var(--thumb-size);
  width: var(--thumb-size);
  border-radius: 9999px;
  cursor: pointer;
}

/* Active state: scale 125% */
.form-range::-webkit-slider-thumb:active {
  transform: scale(1.25);
}

/* Track */
.form-range::-webkit-slider-runnable-track {
  height: var(--track-h);
  border-radius: 9999px;
  background: var(--color-gray-150);
  /* dark: background: var(--color-dark-500) */
}
```

---

## Components

### Badge/Tag

```css
.badge-base, .tag-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: baseline;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.025em;
}

.badge, .tag {
  border-radius: 0.125rem; /* 2px */
  padding: 0.25rem 0.5rem; /* py-1 px-2 */
  font-size: 0.75rem; /* 12px */
}
```

### Avatar

```css
.avatar-display {
  border-radius: 9999px;
  font-size: 1rem;
}

.avatar-image {
  object-fit: cover;
  object-position: center;
}

.avatar-dot {
  width: 0.875rem; /* 14px */
  height: 0.875rem; /* 14px */
  border: 2px solid white;
  /* dark: border-color: var(--color-dark-700) */
}
```

### Spinner

```css
.spinner-base {
  display: inline-flex;
  width: 1.75rem; /* 28px */
  height: 1.75rem; /* 28px */
}

.spinner {
  border-width: 3px;
}

.spinner.is-elastic {
  animation-timing-function: var(--ease-elastic);
}
```

### Progress Bar

```css
.progress-rail {
  height: 0.5rem; /* 8px */
  width: 100%;
  border-radius: 9999px;
  overflow: hidden;
}

/* Indeterminate animation: 1.5s */
.progress.is-indeterminate {
  animation-duration: 1.5s;
  animation-timing-function: cubic-bezier(0.53, 0.21, 0.29, 0.67);
}

/* Active state animation: 2s */
.progress.is-active::before {
  animation: progress-active 2s cubic-bezier(0.55, 0.2, 0.3, 0.67) infinite;
}
```

### Circlebar (Circular Progress)

```css
.circlebar-active-path {
  animation: circlebar-active 2s var(--ease-elastic) infinite;
}

.circlebar-indeterminate-wrapper {
  animation: 2s linear infinite;
}

.circlebar-indeterminate {
  animation: 1.5s linear infinite;
}
```

### Table

```css
.table-td, .table-th {
  white-space: nowrap;
  padding: 0.75rem 1rem; /* py-3 px-4 */
  /* sm: padding-x: 1.25rem */
}

.table-th {
  text-transform: uppercase;
}

/* Hoverable rows */
.table.is-hoverable > .table-tbody > .table-tr:hover > .table-td {
  background: var(--color-gray-100);
  /* dark: background: var(--surface-2) at 50% opacity */
}

/* Zebra striping */
.table.is-zebra > .table-tbody > .table-tr:nth-child(even) > .table-td {
  background: var(--color-gray-100);
}

/* Dense table */
.table.is-dense .table-td {
  padding: 0.375rem 0.5rem; /* py-1.5 px-2 */
}

/* Sticky header */
.table.is-sticky .table-thead {
  position: sticky;
  top: 0;
  z-index: 3;
}
```

### Pagination

```css
.pagination {
  display: inline-flex;
  border-radius: 0.5rem;
  font-weight: 500;
  background: var(--color-gray-150);
  color: var(--color-gray-700);
  /* dark: background: var(--surface-2), color: var(--color-dark-100) */
}

.pagination-control {
  height: 2rem; /* 32px */
  min-width: 2rem;
  padding: 0 0.625rem;
  border-radius: 0.5rem;
}

.pagination-icon {
  width: 1.125rem;
  height: 1.125rem;
}
```

### Steps

```css
.steps {
  display: flex;
  align-items: flex-start;
  --line: 0.25rem; /* 4px line thickness */
  --size: 2rem; /* 32px step indicator size */
}

.steps.line-space {
  --space: 0.5rem; /* 8px gap between step and line */
}

.steps .step .step-header {
  width: var(--size);
  height: var(--size);
}

/* Connecting line */
.steps .step:not(:last-child)::before {
  height: var(--line);
  border-radius: 9999px;
}
```

### Timeline

```css
.timeline {
  --timeline-line-width: 1px;
  --timeline-point-size: 0.75rem; /* 12px */
}

.timeline.line-space {
  --timeline-line-space: 0.75rem;
}

.timeline-item {
  padding-bottom: 2rem;
}

.timeline-item-content-wrapper {
  padding-left: 1rem; /* sm: 2rem */
}

/* Connecting line */
.timeline-item::before {
  width: var(--timeline-line-width);
  background: var(--color-gray-300);
  /* dark: background: var(--color-dark-400) */
}

/* Last item: gradient fade */
.timeline-item:last-child::before {
  background: linear-gradient(to bottom, var(--color-gray-300), transparent);
}
```

### Skeleton

```css
.skeleton {
  background: var(--color-gray-150);
  /* dark: background: var(--color-dark-600) */
  --sk-color: #fff9;
  /* dark: --sk-color: var(--color-dark-400) */
}

/* Wave animation */
.skeleton.animate-wave::before {
  background-image: linear-gradient(90deg, transparent, var(--sk-color), transparent);
  animation: skeleton-wave 1.5s var(--ease-elastic) infinite;
}
```

### Masks (CSS Shapes)

Available mask shapes:

| Class | Shape |
|-------|-------|
| `.mask.is-squircle` | Rounded square |
| `.mask.is-reuleaux-triangle` | Curved triangle |
| `.mask.is-diamond` | Diamond/rhombus |
| `.mask.is-hexagon` | Hexagon (vertical) |
| `.mask.is-hexagon-2` | Hexagon (horizontal) |
| `.mask.is-octagon` | Octagon |
| `.mask.is-star` | 10-point star |
| `.mask.is-star-2` | 8-point star |
| `.mask.is-heart` | Heart shape |

---

## Layout System

### Main Layout

```css
[data-layout="main-layout"] {
  --main-panel-width: 4.5rem; /* lg: 5rem */
  --prime-panel-width: 230px; /* lg: 240px */
  --prime-panel-min-width: 64px;
  --margin-x: 1rem; /* md: 1.5rem, xl: 4rem */
}

/* When sidebar open on xl screens */
[data-layout="main-layout"].is-sidebar-open {
  --margin-x: 1.5rem;
}
```

### Sideblock Layout

```css
[data-layout="sideblock"] {
  --sidebar-panel-width: 17.5rem; /* 280px */
  --margin-x: 1rem; /* md: 1.5rem, 2xl: 3rem */
}
```

### Horizontal Nav Layout

```css
[data-layout="horizontal-nav"] {
  --margin-x: 1rem; /* md: 1.5rem, 2xl: 3rem */
}
```

### Card Skin Variants

```css
/* Default (soft) */
html {
  --surface-1: var(--color-dark-450);
  --surface-2: var(--color-dark-500);
  --surface-3: var(--color-dark-600);
}

/* Bordered */
html[data-card-skin="bordered"] {
  --surface-1: var(--color-dark-500);
  --surface-2: var(--color-dark-600);
  --surface-3: var(--color-dark-700);
}
```

---

## Utilities

### Scrollbar

```css
/* Hide scrollbar */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Custom scrollbar */
.custom-scrollbar {
  --margin-scroll: 0px;
  --scrollbar-size: 0.25rem; /* 4px */
}

.custom-scrollbar::-webkit-scrollbar {
  width: var(--scrollbar-size);
  height: var(--scrollbar-size);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(var(--color-gray-300), 0.8);
  /* dark: background: var(--color-dark-400) */
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--color-gray-400);
  /* dark: background: var(--color-dark-300) */
}
```

### Hide Number Input Arrows

```css
input.hide-number-arrow::-webkit-outer-spin-button,
input.hide-number-arrow::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"].hide-number-arrow {
  -moz-appearance: textfield;
}
```

### Inline Code

```css
.inline-code code {
  border-radius: 0.125rem;
  background: var(--color-gray-100);
  padding: 0.125rem 0.25rem;
  font-size: 0.8125rem; /* text-xs-plus */
  color: var(--color-secondary);
  /* dark: background: var(--color-dark-800), color: var(--color-secondary-lighter) */
}
```

### Min Height 100vh (with dvh support)

```css
.min-h-100vh {
  min-height: 100vh;
}

@supports (height: 100dvh) {
  .min-h-100vh {
    min-height: 100dvh;
  }
}
```

### Monochrome Mode

```css
body.is-monochrome::before {
  position: fixed;
  inset: 0;
  z-index: 999999;
  margin: -5rem;
  width: calc(100% + 10rem);
  height: calc(100% + 10rem);
  backdrop-filter: grayscale(1) opacity(0.92);
  pointer-events: none;
}
```

---

## Animations

### Easing Functions

```css
--ease-elastic: cubic-bezier(0.53, 0.21, 0.29, 0.67);
```

### Shimmer Animation

```css
--animate-shimmer: shimmer 2s linear infinite;

@keyframes shimmer {
  from { background-position: 0 0; }
  to { background-position: -200% 0; }
}
```

### Skeleton Wave

```css
@keyframes skeleton-wave {
  0% { transform: translateX(-100%); }
  50%, 100% { transform: translateX(100%); }
}
/* Duration: 1.5s, Easing: var(--ease-elastic) */
```

### Progress Animations

```css
/* Indeterminate progress */
@keyframes progress-increase {
  from { transform: translateX(-100%) scaleX(0.1); }
  to { transform: translateX(100%) scaleX(1); }
}
/* Duration: 1.5s */

/* Active progress */
@keyframes progress-active {
  0% { opacity: 0.5; transform: translateX(-100%); }
  100% { opacity: 0; transform: translateX(0); }
}
/* Duration: 2s */
```

### Circular Progress Animations

```css
/* Active circlebar */
@keyframes circlebar-active {
  0% { opacity: 0.5; stroke-dashoffset: var(--dashoffset); }
  100% { opacity: 0; stroke-dashoffset: 0; }
}
/* Duration: 2s */

/* Indeterminate wrapper rotation */
@keyframes circlebar-indeterminate-wrapper {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
/* Duration: 2s */

/* Indeterminate stroke */
@keyframes circlebar-indeterminate {
  0% { stroke-dasharray: 1, 800; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 800, 800; stroke-dashoffset: -130; }
  100% { stroke-dasharray: 800, 800; stroke-dashoffset: -312; }
}
/* Duration: 1.5s */
```

### Transition Defaults

| Property | Duration | Easing |
|----------|----------|--------|
| General transitions | `200ms` | default |
| Content transitions | `250ms` | `ease-in` / `ease-out` |
| Sidebar toggle | `250ms` | `ease-in-out` |
| Form elements | `200ms` | `ease-in-out` |
| Sidebar panel | `250ms` | `ease-in` / `ease-out` |

---

## Z-Index Scale

| Token | Value |
|-------|-------|
| `--z-index-1` | `1` |
| `--z-index-2` | `2` |
| `--z-index-3` | `3` |
| `--z-index-4` | `4` |
| `--z-index-5` | `5` |

### Layout Z-Index Values

| Element | Z-Index |
|---------|---------|
| Sticky table header | `3` |
| Prime panel | `30` |
| Sidebar panel | `30` |
| Main panel | `40` (md: `60`) |
| Monochrome overlay | `999999` |

---

## Theme Configuration

### Setting Themes via Data Attributes

```html
<!-- Light theme -->
<html data-theme-light="slate">  <!-- or: gray, neutral -->

<!-- Dark theme -->
<html data-theme-dark="cinder">  <!-- or: navy, mirage, mint, black -->

<!-- Primary color -->
<html data-theme-primary="indigo">  <!-- or: blue, green, amber, purple, rose -->

<!-- Card skin -->
<html data-card-skin="bordered">  <!-- or: default (soft) -->

<!-- Layout -->
<body data-layout="main-layout">  <!-- or: sideblock, horizontal-nav -->
```

### Dark Mode

```html
<html class="dark">
```

```css
html.dark {
  color-scheme: dark;
}
```
