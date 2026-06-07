# ADR 004: Responsive Sidebar (Mobile Bottom Nav)

## Status

Approved and Implemented.

## Context

YTPlot required a responsive navigation system that adapts to mobile viewports. The previous sidebar was designed exclusively for desktop: a collapsible vertical panel with a toggle button. On mobile screens, this pattern is unusable — it consumes too much horizontal space and the collapse/expand paradigm doesn't translate well to small viewports.

## Evaluated Alternatives

1. **Media query listeners in JS (window.matchMedia)**:
   - _Pros_: Allows dynamic component behavior changes (e.g., hiding the toggle button, changing layout).
   - _Cons_: Adds runtime overhead, hydration complexity, and breaks the SSR-friendly nature of CSS media queries.
   - _Decision_: Discarded. CSS-only approach is simpler and more performant.

2. **Separate mobile nav component**:
   - _Pros_: Complete isolation of mobile and desktop logic.
   - _Cons_: Duplicates route definitions and link rendering logic; two components to maintain.
   - _Decision_: Discarded. A single component with CSS media queries keeps the code DRY.

3. **CSS-only mobile-first approach (chosen)**:
   - _Pros_: Zero runtime cost, single source of truth for routes, backward compatible, clean separation via `@media (min-width: 768px)`.
   - _Cons_: Requires careful CSS override management for the desktop variant.
   - _Decision_: Implemented.

## Final Decision

Refactor `Sidebar.module.css` to a mobile-first approach:

- **Mobile (base)**: The sidebar renders as a fixed bottom navigation bar with horizontal layout, always-visible labels, and no header/divider. The active indicator shifts to a top bar.
- **Desktop (`>=768px`)**: The original vertical sidebar behavior is restored via media query overrides, including open/collapsed states, transitions, header, and divider.
- The toggle button in `App.tsx` is hidden on mobile via CSS (`display: none`), and `mainContent` gains `padding-bottom: 72px` to avoid content being clipped by the fixed bottom nav.

## Consequences

- **No JavaScript changes** to `Sidebar.tsx` or `App.tsx` were needed — all responsiveness is CSS-driven.
- **Backward compatible**: Desktop layout and behavior remain identical.
- **Performance**: Zero runtime cost; media queries are evaluated natively by the browser.
- **Maintainability**: Route additions and styling changes remain in one component and one CSS module.
