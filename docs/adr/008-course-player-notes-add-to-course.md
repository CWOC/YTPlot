# 008 - Course Item Player, Notes, Editable Fields & Add-to-Course

**Date:** 2026-06-07

## Context

Several gaps existed after implementing the initial `CoursePage` and `CourseItemPage`:

1. **No way to add YouTube content to an existing course** — users had to create a new course for each video/playlist.
2. **No video player** — `CourseItemPage` showed a static thumbnail; the video couldn't be watched.
3. **No per-item notes** — users had no space to write personal notes about a video.
4. **No item navigation** — users had to go back to the course page to switch between videos.
5. **Title/description on item page were static** — unlike the course page, they weren't editable.

## Decision

### `<iframe>` YouTube Player

Used a native YouTube `<iframe>` embed (`https://www.youtube.com/embed/{videoId}`) instead of a third-party library. Rationale:

- **Zero bundle impact** — no extra dependency.
- **ID already available** — `item.id` is the YouTube video ID.
- **Responsive** — a CSS `aspect-ratio: 16/9` wrapper handles all viewports.
- **Upgrade path** — switching to the YouTube IFrame API for events later requires only changing the `<iframe>` to a JS-controlled instance.

### `notes` Field on `Video` Type

Added `notes: string` to the `Video` type and all formatters (`YoutubeService`). Persisted via a new store action `updateItemNotes(courseId, itemId, notes)`.

### `addItemsToCourse` Store Action

Appends new `Video[]` to an existing course, skipping items whose `id` already exist in the course (dedup). Used by the `useAddToCourse` hook.

### `useAddToCourse(courseId)` Hook

Mirrors `useYoutube` but targets an existing course instead of creating one. Shared the same `YoutubeService` methods for extraction and formatting.

### `useCourseItemPage` Hook

Extracted all routing, store, and callback logic for `CourseItemPage`, keeping the component purely presentational. Provides `hasPrev`/`hasNext` computed booleans derived from the item's position.

### Course-Scoped YouTube Import

`CoursePage` now renders a `CourseImportInput` section (visually matching the dashboard `YoutubeUrlInput`) between the header and the items grid. It uses `useAddToCourse(courseId)` instead of the global `useYoutube`.

## Consequences

- **Positive:** Users can grow course content organically — add one video at a time or entire playlists.
- **Positive:** Each video is now watchable, editable, and annotatable without leaving the course context.
- **Positive:** Navigation between items stays within the course silo — no need to return to the course page between videos.
- **Positive:** The `notes` field on `Video` is always present (defaults to `''`) even for existing YouTube imports.
- **Neutral:** The iframe will show "Video unavailable" when offline — this is expected for an offline-first app; online features require connectivity.
