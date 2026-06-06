# ADR 003: Integration of Prettier and ESLint

## Status

Approved and implemented.

## Context

YTPlot needed consistent code formatting and linting across the entire codebase. Although both `eslint` and `prettier` were already present as `devDependencies`, several pieces were missing:

- No explicit Prettier configuration file (`.prettierrc`), so it ran with opaque defaults.
- No VSCode workspace settings to automate format-on-save and lint-on-save.
- The `@eslint/js` package (required by the flat config's `js.configs.recommended`) was not declared as a direct dependency, causing runtime resolution errors.

## Evaluated Alternatives

1. **Use a shared ESLint + Prettier config from an external package** (e.g., `@company/eslint-config`):
   - _Pros_: Centralized configuration if multiple projects existed.
   - _Cons_: Unnecessary external dependency for a single-project codebase; reduced explicitness.
   - _Decision_: Discarded.

2. **Use `eslint-plugin-prettier` to run Prettier as an ESLint rule**:
   - _Pros_: Single command for linting and formatting.
   - _Cons_: Known performance issues; duplicates work between tools; the ecosystem now recommends `eslint-config-prettier` (disable conflicting rules) instead.
   - _Decision_: Discarded.

3. **No Prettier config (leave defaults)**:
   - _Pros_: Minimal files.
   - _Cons_: Implicit behavior differs across machines; defaults (e.g., `printWidth: 80`) are too restrictive for modern TSX.
   - _Decision_: Discarded.

## Final Decision

1. **Create `.prettierrc`** with explicit values:
   - `semi: true` — standard TypeScript convention, aligns with `eslint.config.js`.
   - `singleQuote: true` — dominant JS/TS ecosystem convention.
   - `trailingComma: "all"` — cleaner diffs, Prettier default.
   - `printWidth: 100` — balance between readability and line count, used by Vite and React.
   - `tabWidth: 2`, `arrowParens: "always"` — Prettier defaults.

2. **Add `@eslint/js` as an explicit `devDependency`** so the flat config (`js.configs.recommended`) resolves reliably.

3. **Create `.vscode/extensions.json`** to recommend `dbaeumer.vscode-eslint` and `esbenp.prettier-vscode`.

4. **Create `.vscode/settings.json`** to enable `editor.formatOnSave`, default to Prettier as the formatter, and run `eslint --fix` on save.

5. **Update `.gitignore`** to track `.vscode/settings.json` alongside the already-tracked `extensions.json`.

## Consequences

- **Positive**: Every developer gets consistent formatting automatically via editor hooks. A single `pnpm format` / `pnpm lint` pass guarantees CI consistency.
- **Positive**: The `printWidth: 100` reduces unnecessary line breaks in deeply nested TSX/TypeScript.
- **Neutral**: Running `prettier --write .` reformats the entire existing codebase in one shot. This is a cosmetic-only change with no runtime impact.
- **Negative**: None identified. The `eslint-config-prettier` integration ensures ESLint and Prettier do not fight each other.
