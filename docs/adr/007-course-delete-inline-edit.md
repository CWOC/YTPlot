# 007 - Course Delete & Inline Editing

**Date:** 2026-06-07

## Context

Users needed two capabilities on the course detail page:

1. **Delete a course** — there was no way to remove a course from the library.
2. **Edit title and description inline** — title and description were static text; users had to recreate the course to fix typos or update metadata.

Additionally, `CoursePage` had grown inline markup for item cards that could be extracted into reusable components.

## Decision

### Store (`courseStore`)

Added two actions:

- `updateCourse(id, data)` — fetches the current course from IndexedDB, merges the partial `data` using spread (`{ ...course, ...data }`), persists via `IndexedDBService.updateCourse`, and refreshes lists. Used for title/description edits.
- `deleteCourse(id)` — calls `IndexedDBService.deleteCourse`, sets `courseById` to `null`, refreshes lists. Used by the delete button.

### `InlineEdit` component (`src/components/InlineEdit/`)

A reusable click-to-edit component:

- **Display mode:** renders the value as a span; hover shows a dashed cyan outline.
- **Edit mode:** on click switches to `<input>` or `<textarea>` (controlled via `as` prop). Auto-focuses on activation.
- **Save triggers:** Enter (`input`), Ctrl+Enter (`textarea`), or blur. Escape cancels without saving.
- Trims whitespace before saving; ignores saves if the value hasn't changed.

### `VideoItemCard` component (`src/components/VideoItemCard/`)

Extracted the item card from `CoursePage` into its own component:

- Props: `item: Video`, `onToggle: () => void`.
- Renders thumbnail, title, toggle button, and completed overlay.
- `onToggle` includes `e.preventDefault() + stopPropagation()` so the wrapping `<Link>` does not fire when toggling.

### `CoursePage` refactor

- Title and description now use `InlineEdit` instead of static `<h1>` / `<p>`.
- Added a delete button (red hover, trash icon) with `window.confirm` guard, navigates to `/dashboard` on success.
- Item grid uses `<VideoItemCard>` instead of inline markup.
- CSS cleaned up: removed styles belonging to `VideoItemCard`.

## Alternatives Considered

1. **Delete from DashboardPage instead** — more discoverable, but having delete on the course page is contextually natural and avoids accidental deletion from a list.
2. **Modal for edit instead of inline** — a modal would be disruptive; inline editing keeps context and feels faster.
3. **Single generic `updateCourse` vs specific setters** — a single partial-update action keeps the store lean and future-proof.

## Consequences

- **Positive:** Users can now fix metadata without recreating the course.
- **Positive:** Delete is safely guarded by a confirmation dialog.
- **Positive:** `InlineEdit` can be reused anywhere click-to-edit is needed.
- **Positive:** `VideoItemCard` is independently testable and reusable.
- **Neutral:** `InlineEdit` currently saves on blur; this may feel aggressive to some users but prevents accidental data loss.
