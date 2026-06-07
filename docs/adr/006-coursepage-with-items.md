# 006 - CoursePage with Items & Individual Item Routing

**Date:** 2026-06-07

## Context

`CoursePage` at `/dashboard/course/:id` was a stub with a TODO comment. The application had no way to view course items, mark videos as completed, or navigate to individual video details. Manual courses were created with `items: []`, and YouTube-imported courses had items but no UI to display them.

## Decision

Implemented a full course consumption UI:

1. **Store (`courseStore`)** — added three actions:
   - `fetchCourseById(id)` — loads a single course from IndexedDB into `courseById`.
   - `toggleItemComplete(courseId, itemId)` — toggles `completed` on a `Video` item, recalculates `progress`, persists to IndexedDB, and refreshes course lists.
   - `clearCourseById()` — resets the currently loaded course on unmount.

2. **`CoursePage`** — renders the course header (thumbnail, title, description, progress bar) and a grid of item cards. Each card shows the video thumbnail, title, and a complete/uncomplete toggle button. Completed cards display grayscale with a green `check_circle` overlay. Empty state shows a message directing users to add YouTube content from the dashboard.

3. **`CourseItemPage`** — a new page at `/dashboard/course/:courseId/item/:itemId` showing full video details (thumbnail, title, channel, date, description) with a complete/uncomplete toggle and a back link to the parent course.

4. **Routing** — added a new wouter-preact route for individual items, listed **before** the parent course route to avoid parameter conflicts.

## Alternatives Considered

1. **Inline item toggle in store** — considered adding generic `updateCourse(id, partial)` but opted for a specific `toggleItemComplete` for type safety and simpler action.

2. **Reuse `CourseCard` for items** — `CourseCard` is designed for course-level display (source badge, progress bar, RESUME button). Video items have different UI needs (grayscale overlay, complete toggle), so a card built directly in `CoursePage` was chosen.

3. **No individual item page** — we could show everything inline; but having a dedicated route allows direct linking, bookmarking, and future expansion (e.g., video player, notes per item).

## Consequences

- **Positive:** Course content is now fully browsable and actionable.
- **Positive:** Progress tracking works end-to-end (toggle → persist → reflect).
- **Positive:** New route structure is extensible for future features (e.g., video playback).
- **Neutral:** The route `/dashboard/course/:courseId/item/:itemId` must be declared **before** `/dashboard/course/:id` in the `Switch`, otherwise `:id` would greedily match `courseId/item/:itemId`.
