# ADR 002: Removal of youtube-sr and Migration to Official YouTube API

## Status

Approved.

## Context

During strict TypeScript compilation analysis and unit/E2E test preparation, it was identified that the `youtube-sr` library uses native Node.js calls and modules (such as `http`, `https`, and internal APIs). Since YTPlot is a project designed to run 100% client-side without its own server, the use of this library caused CORS failures and runtime compatibility issues in the browser.

Initially, a CORS proxy scraping approach was considered to avoid requiring developer API keys. However, scraping public YouTube pages via regex is highly fragile, consumes excessive bandwidth, and does not provide a reliable or strongly typed API contract. Therefore, the decision has been updated to use the official YouTube Data API v3.

## Evaluated Alternatives

1. **Keep `youtube-sr` and inject Node.js polyfills into Vite**:
   - _Pros_: Allows maintaining the library integration.
   - _Cons_: Significantly increases client bundle size and introduces unnecessary build complexity.
   - _Decision_: Discarded.

2. **Use a Client CORS Proxy Scraper (AllOrigins/CodeTabs)**:
   - _Pros_: Free, no developer setup or API keys required.
   - _Cons_: High bandwidth usage, extremely fragile to changes in YouTube's frontend markup, lacks type safety.
   - _Decision_: Superseded in favor of the official API.

3. **Migrate to the Official YouTube Data API v3**:
   - _Pros_: High stability, clean JSON structures, strongly-typed contracts, official support.
   - _Cons_: Requires configuring an API key (`VITE_YOUTUBE_API_KEY`) in the client application.
   - _Decision_: Approved.

## Final Decision

1. Uninstall and remove the `youtube-sr` dependency from `package.json`.
2. Remove the deprecated hook `src/hooks/useYoutubeSr.ts`.
3. Clean `src/app.tsx` of any imports or invocations of this hook.
4. Implement the YouTube Data Access Layer using direct `fetch` calls to the official YouTube Data API v3.
5. Retrieve the Google API key from `import.meta.env.VITE_YOUTUBE_API_KEY`, documenting this requirement in a `.env.example` file.
6. Declare proper TypeScript interfaces for YouTube responses inside `src/types/`.

## Consequences

- **Stability**: Robust and reliable integration backed by Google's API versioning.
- **Developer Setup**: Anyone running or building the project will need to provide their own `VITE_YOUTUBE_API_KEY` in a `.env` file.
- **Type Safety**: Strictly typed contract between the YouTube API and our local services/stores.
