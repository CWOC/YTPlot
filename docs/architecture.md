---
name: 'architecture'
description: Architectural blueprint for YTPlot. Defines data layers, synchronization strategies, offline persistence with IndexedDB (idb), and global state boundaries.
metadata:
  scope: ['architecture', 'data-flow']
---

# YTPlot Architecture & Data Flow

YTPlot is an offline-first web application designed to transform YouTube videos and playlists into structured, local courses. The architecture prioritizes zero-latency performance, complete offline usability, and strict separation of concerns.

## Architectural Layers Overview

The application is structured into four decoupled layers. Data flows sequentially downwards, and state updates propagate upwards via reactive hooks.

```text
+---------------------------------------------------------+
|                     Presentation Layer                  |
|                     (Vite + Preact UI)                  |
+----------------------------+----------------------------+

                             | Reads state / Dispatches
                             v
+---------------------------------------------------------+
|                     State Management                    |
|                 (Zustand Global Store)                  |
+----------------------------+----------------------------+

                             | Syncs cache / Hydrates
                             v
+---------------------------------------------------------+
|                   Data Access & Services                |
|          (idb Wrapper / Official YouTube API)           |
+----------------------------+----------------------------+

                             | Persists / Fetches
                             v
+----------------------------+----------------------------+
|                  Infrastructure & Storage               |
|               (IndexedDB / Remote YT Servers)           |
+---------------------------------------------------------+
```

## Component & Layer Responsibilities

### Presentation Layer (Preact + wouter)

- **UI Components & Pages:** Render layouts consuming local component states (Preact `Context` for simple UI toggles) or global courses data.
- **Routing (`wouter-preact`):** Lightweight client-side routing. Route changes must not drop the global state or interrupt offline access.

### State Management Layer (Zustand)

- **Single Source of Truth (Runtime):** Holds the active course, navigation history, and user preferences in memory.
- **Store Shape (`courseStore`):** `recentCourses`, `allCourses`, `courseById` (single loaded course), `isLoading`. Actions: `loadRecentCourses`, `loadAllCourses`, `fetchCourseById`, `toggleItemComplete`, `addItemsToCourse` (appends YouTube content), `updateItemNotes`, `clearCourseById`, `addCourse`, `updateCourse` (partial merge), `deleteCourse`.
- **Hydration Strategy:** On application boot, Zustand stores must query the Persistence layer (`idb`) to hydrate memory before the UI renders.
- **Optimistic Updates:** UI interactions should update the Zustand state instantly, triggering a background asynchronous sync to the local database.

### Data Access Layer (Services)

- **Database Service (`idb`):** Encapsulates all CRUD operations over IndexedDB. Direct native calls to `window.indexedDB` are strictly forbidden. Use clean async/await wrappers.
- **Network Service (Official YouTube API + Fetch):** Handles remote fetching of YouTube data via the official YouTube Data API v3 using HTTP client requests. This service is **only** reachable when an internet connection is active and requires a configured API key.

### Infrastructure & Storage Layer

- **IndexedDB:** The primary master database for storing course structures, progress tracking, and video metadata.
- **YouTube API:** Remote read-only upstream data source.

## Core Data Flows

### Course Creation Flow (Online)

1. The user inputs a YouTube Playlist URL in the UI.
2. The UI dispatches an action to the Zustand Store.
3. The Store invokes the Network Service (Official YouTube API) to fetch playlist metadata and video listings.
4. The Store normalizes the API response into a custom "Course" schema (Modules, Lessons, Progress).
5. The Store pushes the data to the Database Service (`idb`) for persistent local storage.
6. The Zustand state updates, and Preact triggers a re-render to display the new course.

### Course Consumption Flow (Offline-First)

1. The user opens a previously imported course via `/dashboard/course/:id`.
2. `CoursePage` dispatches `fetchCourseById(id)` to the Zustand store, which fetches the full course from `idb`.
3. The course header (thumbnail, title, progress bar) renders immediately.
4. The course items (`Video[]`) are displayed as a grid of cards. Each card shows:
   - Thumbnail and title of the video.
   - A toggle button to mark the item as completed or pending.
   - When completed, the card turns grayscale with a green `check_circle` overlay icon.
5. Clicking a card navigates to `/dashboard/course/:courseId/item/:itemId` (`CourseItemPage`) for a detailed view of the video.
6. `toggleItemComplete(courseId, itemId)` updates the item's `completed` status optimistically in Zustand, recalculates the course `progress` asynchronously, and persists the changes to `idb`.

### Item Completion Flow

1. The user clicks the "COMPLETADO" / "DESMARCAR" button on an item card or the item detail page.
2. The UI calls `toggleItemComplete(courseId, itemId)`.
3. The store toggles the `completed` boolean on the matching `Video` item.
4. The store recalculates `progress` = (completed items / total items) × 100.
5. The updated course object is persisted to IndexedDB via `IndexedDBService.updateCourse`.
6. The store refreshes `allCourses` and `recentCourses` lists.
7. The UI re-renders to reflect the new state.

### Add Items to Course Flow

1. From `CoursePage`, the user pastes a YouTube URL into the course-scoped import input.
2. `useAddToCourse(courseId)` hook extracts the video/playlist ID and fetches data via `YoutubeService`.
3. The response is formatted into `Video[]` via `YoutubeService.formatVideoDetails` or `formatPlaylistDetails`.
4. `addItemsToCourse(courseId, items)` is dispatched: it appends only items whose `id` is not already present in the course (dedup by video ID).
5. The updated course is persisted to IndexedDB and the store refreshes `courseById`, `allCourses`, and `recentCourses`.

### Single Item View (`CourseItemPage`)

- Video playback uses a native YouTube `<iframe>` embed (`https://www.youtube.com/embed/{videoId}`). No external player library — the video ID from the `Video` type is used directly.
- Title, description, and notes are editable via `InlineEdit`.
- Notes are persisted per-item via `updateItemNotes(courseId, itemId, notes)`.
- Navigation buttons (prev/next) appear based on the item's position in `course.items`.

## Architectural Rules for Agents

- **No API Calls in UI:** Components are prohibited from calling remote fetching services directly. All remote interactions must pass through services and stores.
- **Strict TypeScript Types:** Data schemas passed between `idb`, Zustand, and Preact must share a unified, strict contract ([/src/types/](../src/types/)). Do not use `any`.
- **Database Isolation:** Mock the Database Service cleanly in unit tests using the guidelines specified in the `vitest` and `playwright` skills.
