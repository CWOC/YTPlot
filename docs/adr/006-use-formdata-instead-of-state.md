# 006 - Use FormData Instead of Local State for Form Inputs

**Date:** 2026-06-07

## Context

The `ManualCourseModal` component was tracking every keystroke via `useState` + `onInput` handlers for `title` and `description`. This caused:

- Unnecessary re-renders on each keystroke.
- Boilerplate: `value`, `onInput`, `setTitle`, `setDescription` wired through both component and hook.
- Ephemeral state that lived only until form submission.

The requirement was to reduce UI event noise and let the browser's native `FormData` API recover the values only when the user submits.

## Decision

Replace the `title`/`description` state in `useManualCourseForm` with `FormData` read inside `handleSubmit`:

- The hook no longer exposes `title`, `setTitle`, `description`, `setDescription`.
- The `ManualCourseModal` component adds `name` attributes to inputs (`name="title"`, `name="description"`), removes `value`/`onInput` bindings.
- `handleSubmit` calls `form.reset()` instead of manually clearing state.

## Alternatives Considered

1. **Keep current `useState` approach** — simpler to test but causes extra renders and more verbose wiring.
2. **Uncontrolled refs** — would still require reading refs on submit; `FormData` is more idiomatic with native forms and inherently handles reset.

## Consequences

- **Positive:** Fewer re-renders, less boilerplate, simpler hook interface.
- **Positive:** Form reset is native (`form.reset()`), no manual state clearing needed.
- **Neutral:** Tests had to be updated to simulate form input via `defaultValue` and provide a real `HTMLFormElement` as `e.currentTarget`.
- **No change** to validation, persistence, or UI behavior.
