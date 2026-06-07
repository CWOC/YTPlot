# ADR 005: Dashboard Layout with Stats, Manual Form, and Course Carousel

## Status

Approved and Implemented.

## Context

`DashboardPage.tsx` was a stub with placeholder text. The user requested a complete dashboard layout with three functional areas:

1. **Basic statistics** (total courses, total videos, average progress).
2. **Manual course creation form** — differentiated visually from the HeroSection YouTube input.
3. **Horizontal carousel** showing all courses, with prev/next buttons disabled at boundaries.

The existing `courseStore` only loaded the 3 most recent courses, insufficient for the dashboard.

## Evaluated Alternatives

1. **Use a third-party carousel library** (e.g., `embla-carousel`, `splide`):
   - _Pros_: Accessible, touch-ready, well-tested.
   - _Cons_: Adds a dependency for a component with narrow usage; bundle size impact; the app's stack philosophy is lightweight.
   - _Decision_: Discarded. A vanilla carousel with CSS `translateX` and `gap` is simpler and sufficient.

2. **Recalculate carousel step on ResizeObserver**:
   - _Pros_: Fully reactive to container width changes.
   - _Cons_: More complex; the `resize` event listener on `window` covers the common case.
   - _Decision_: Discarded in favor of a lighter `window.resize` listener.

3. **Load all courses on demand via separate store action**:
   - _Pros_: Keeps `recentCourses` (3-item limit) intact for the home page; dashboard loads full list independently.
   - _Cons_: Two methods to maintain.
   - _Decision_: Implemented. `loadAllCourses` populates `allCourses`; `addCourse` refreshes both arrays.

4. **Manual form identical to HeroSection**:
   - _Pros_: Reuses `useYoutubeInput` hook.
   - _Cons_: The user explicitly requested visual differentiation; HeroSection is for YouTube URLs, dashboard is for manual course creation.
   - _Decision_: Implemented as a vertical form with text inputs and cyan-themed accent (vs. magenta in Hero).

## Final Decision

### `src/stores/courseStore.ts`

- Added `allCourses: Course[]` and `loadAllCourses()`.
- `addCourse()` now refreshes both `allCourses` and `recentCourses` concurrently via `Promise.all`.
- Updated `useYoutube.ts` to call `loadAllCourses()` after a YouTube course is created.

### `src/components/CourseCarousel/`

New component:

- **Viewport** (`overflow: hidden`) wraps a **track** (`display: flex; gap: 20px`) that translates horizontally via CSS `transform`.
- Prev/Next buttons with `disabled` state: prev at index 0, next when `index + visibleCount >= length`.
- `visibleCount` calculated on mount/resize from container width ÷ card width.
- Empty state renders a dashed placeholder message.
- Skeleton state renders shimmer cards during loading.

### `src/pages/dashboard/DashboardPage.tsx`

Rewritten with three sections:

1. **Stats grid** — three `grid-column` cards showing course count, video count, and average progress.
2. **Manual form** — cyan-accented vertical layout with title input + description textarea + "CREAR CURSO" button. Submits an `InsertCourse` with `type: 'manual'` to the store.
3. **CourseCarousel** — renders all courses with the reusable carousel.

### `tsconfig.app.json`

- Added `@/*` path alias (was missing from `tsconfig` but present in `vite.config.ts`), fixing pre-existing resolution errors.

## Consequences

- **No new dependencies** — carousel is vanilla CSS + Preact state.
- **Home page unaffected** — `recentCourses` and `loadRecentCourses` unchanged.
- **Dashboard loads all courses** on mount via `loadAllCourses` effect.
- **Manual courses** visible alongside YouTube courses immediately after creation (page stays on dashboard, no navigation).
- **Translucent form style** (cyan border + transparent background) differentiates from HeroSection's magenta URL input.
- **Carousel step** is recalculated on resize, gracefully degrading on narrow viewports (shows fewer cards).
