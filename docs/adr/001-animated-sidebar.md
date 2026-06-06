# ADR 001: Animated Sidebar Implementation

## Status

Approved and Implemented.

## Context

YTPlot requires a responsive, animated navigation sidebar to move between key sections of the application (Home, Courses, Import, Settings). The design must follow the Minimalist Vaporwave/Synthwave aesthetic guidelines described in `docs/ui-guidelines.md` (neon colors, monospaced fonts, and luminous borders).

## Evaluated Alternatives

1. **Defining the application structure (`src/app.tsx`) with CSS Modules**:

- _Pros_: Isolation of styles from the global container.
- _Cons_: Creates overloaded module files (`app.module.css`) for entry-level structures that permanently function as the app's outline.
- _Decision_: Discarded in favor of unifying the Shell Layout styles in `src/index.css` based on user recommendation and agreement.

2. **Controlling the Sidebar opening locally within the component itself**:

- _Pros_: Greater encapsulation.
- _Cons_: Complicates aligning the outer button position and dynamically adjusting the main content margin without resorting to global state.
- _Decision_: Discarded. Maintaining the state in `src/app.tsx` allows you to easily coordinate the three elements involved (Sidebar, Floating Button and Main Container) through props and CSS class selectors.

## Final Decision

Implement a modular `<Sidebar>` component in `src/components/Sidebar/` that:

1. Receives the `isOpen: boolean` property from the application's main layout.
2. Uses CSS transitions on the Sidebar's `width` property to achieve smooth animation (`cubic-bezier(0.4, 0, 0.2, 1)`).
3. Uses embedded links via `wouter-preact` for tab navigation within the app.
4. Elegantly hides the logo (`YTPlot`) and path text (`.linkText`) through opacity and transition widths when collapsed, leaving only the Material Symbols icons.
5. Position the toggle button (`toggleButton`) absolutely, sibling it to the Sidebar in the render tree, and transition its `left` property (changing from `240px` to `70px` when collapsed) to simulate it moving along the edge of the bar.

## Consequences

- **Performance**: Smooth animation at 60fps using efficient CSS properties.
- **Separation of Responsibilities**: The global structure and alignment reside in `src/index.css`, while the specific aesthetics of the navigation menu are encapsulated within `Sidebar.module.css`.
- **Scalability**: It's extremely easy to add or change routes by modifying the `ROUTES` constant in the component's file.
