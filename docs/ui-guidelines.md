---
name: 'ui-guidelines'
description: This document is the sole source of truth for the YTPlot visual interface. It defines the Minimalist Vaporwave/Synthwave aesthetic, global design tokens, and strict implementation rules for components using CSS Modules.
metadata:
  scope: ['ui']
---

# Visual Identity & Theme (Vaporwave / Synthwave)

YTPlot's aesthetic combines a dark and technical development environment (grids and monospaced typography) with vibrant neon accents from retro-futuristic culture.

## Color Tokens

All these tokens are declared globally in `:root` within [/src/index.css](../src/index.css). Hardcoding HEX values ​​in individual files is prohibited.

- **`--deep-space`** (`#050505`): Absolute system background.
- **`--bg-sidebar`** (`#060606`): Background for side panels, navigation bars, and cards.
- **`--border-sidebar`** (`#101010`): Subtle interface borders.
- **`--grid-color`** (`rgba(255, 113, 206, 0.03)`): Background grid lines (retouched to a subtle magenta tone for the Cyber ​​effect).
- **`--magenta-prime`** (`#ff71ce`): Primary neon color (Brand, accents, active states, primary buttons).
- **`--cyan-flux`** (`#01cdfe`): Secondary neon color (Links, hover states, progress, metrics).
- **`--text-main`** (`#f0f0f0`): High-contrast text for reading content.
- **`--text-muted`** (`#808080`): Secondary text, subheadings, and placeholders.

## Vaporwave Shadows & Glows (Sunset Effect)

To add neon volume, use the following shader tokens:

- **`--glow-magenta`**: `0 0 10px rgba(255, 113, 206, 0.4), 0 0 20px rgba(255, 113, 206, 0.2)`
- **`--glow-cyan`**: `0 0 10px rgba(1, 205, 254, 0.4), 0 0 20px rgba(1, 205, 254, 0.2)`
- **`--sunset-gradient`**: `linear-gradient(135deg, var(--magenta-prime) 0%, var(--cyan-flux) 100%)`

## Typography & Iconography

The project uses `@fontsource-variable` for optimal local font loading.

### Font Families

1. **`"Space Grotesk Variable"`**: Used exclusively for **Main Titles (H1, H2)** and section headings due to its futuristic, geometric nature.
2. **`"JetBrains Mono Variable"`**: Used for **Body text, UI, tables, menus, and data**, reinforcing the clean, technical look of the course platform.
3. **`"Mr Dafoe"`**: A retro 80s script/cursive font. Used **only for branding or very specific decorative details** (e.g., the YTPlot logo or special badges).
4. **`"Inter Variable"`**: Fallback font used if extreme readability is required in dense blocks of plain text (extensive internal documentation).

### Icons

- **Google Material Symbols Outlined** is used via the global class `.material-symbols-outlined`.
- When used within a component, they will inherit the `color` and `fontSize` of the parent container.

## CSS Architecture & Scope Rules

To avoid style clashes and keep your codebase clean, you must strictly follow these two distribution rules:

### Global Styles [/src/index.css](../src/index.css)

This contains only settings that affect the entire application:

- Font imports (`@import "./assets/css/fonts.css"`).
- Universal resets (`* { box-sizing: border-box; margin: 0; padding: 0; }`).
- Declaration of `:root` with layout tokens and breakpoints (`--breakpoint-sm`, etc.).
- Base styles for the `body` element (including the animation or the `linear-gradient` pattern of the `20px 20px` background grid).
- Absolute global utilities (such as the `.material-symbols-outlined` class).

### Component Styles (`*.module.css`)

Any particular style of a page (e.g., `Dashboard.tsx`) or component (e.g., `CourseCard.tsx`) **MUST** reside in a CSS Module file (`Dashboard.module.css`).

- **Total Isolation:** The CSS Module belongs solely and exclusively to its component. It is forbidden to directly affect global selectors (`div`, `h1`, `button`) from within a module; use classes (`.card`, `.title`, `.btn`).
- **Token Consumption:** Within modules, always reference global variables using `var(--property-name)`.

## Responsive Breakpoints

Use media queries based on `:root` tokens to ensure responsive behavior on mobile devices while consuming offline courses:

- **Mobile First / Base:** Default styles for small screens.
- **Desktop & Layouts:** `@media (min-width: 768px)` (Use `--breakpoint-md`) to display the side navigation bar next to the course viewer in a fixed position.
