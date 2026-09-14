# Progressive Blur redesign

## API and rendering decisions

- `side: 'top' | 'right' | 'bottom' | 'left'` is the preferred physical-edge API. It takes precedence over legacy `orientation` / `edge`, which remain supported. Both old data attributes remain available.
- `size` accepts CSS lengths or non-negative numeric pixels; `strength` is a non-negative blur radius. Non-finite strength falls back to 16px.
- Five overlapping, continuously masked backdrop layers replace the previous single-layer treatment. No surface-color rectangle is painted during ordinary rendering, so nested backgrounds remain visible. Layer count is fixed regardless of size or strength.
- Decorative layers are aria-hidden and pointer transparent. In ScrollArea, every edge disappears immediately while focus is anywhere inside. This intentionally also clears outer decorations when focusing a nested scroll area. Standalone decoration also disappears immediately when any control inside its immediate positioned parent receives focus. Keep each decorative layer directly inside the surface it decorates.
- ScrollArea checks actual overflow and hidden content independently on each physical edge, including RTL horizontal scrolling. Resize and child observers are disposed on unmount.
- Reduced motion removes opacity transitions. Reduced transparency or increased contrast disables backdrop layers in favor of a surface fade; `--progressive-blur-fallback` selects a nested surface color. Forced colors removes the decoration entirely. Blur is never the only overflow cue.

## Examples

Standalone examples cover every physical edge plus high-contrast cards on a nested muted surface. ScrollArea examples cover a keyboard-operable activity list, horizontal pricing cards, a two-axis workspace, and a horizontal milestone strip nested inside vertical notes. Intrinsic content width is constrained to the scroll viewport, including mobile.

## Verification

- `pnpm check`: 0 errors, 0 warnings on final local rerun.
- `pnpm exec vitest run src/lib/bedrock/ui/progressive-blur/progressive-blur.svelte.test.ts`: 4 passed.
- `pnpm exec playwright test --config .blur-playwright.config.ts`: 4 passed against the managed development preview, covering 390px and 1280px in both themes, edge changes, focus, keyboard activation, pointer transparency, bounded layers, and forced colors. Temporary runner config removed; committed test uses the repository production runner during integration.
- Changed-file ESLint and Prettier: passed.
- Svelte MCP autofixer: all five changed Svelte files return zero issues and suggestions.
- Real shared Chrome checks: 390px and desktop, both themes, actual scrolled text/cards and two-axis high-contrast content; no visible mask bands or interior seams. Console warnings/errors and failed resource responses were empty. No horizontal document overflow at 390px.
- Screenshots: `/workspace/recordings/bedrock-blur/` (`blur-desktop-dark.png`, `blur-mobile-dark.png`, `blur-mobile-light.png`, `blur-standalone-mobile-light.png`, `blur-standalone-desktop-light.png`, `blur-standalone-mobile-dark.png`).
- Local preview: `http://127.0.0.1:4070`; user preview: `http://100.64.0.2:4070`.

Production-build integration, full-suite verification, and final bundle accounting belong to the orchestrator. No dependencies added; no frozen shadcn files edited.

## Standalone focus follow-up

A CSS immediate-parent focus-within rule now clears standalone decoration without a transition when a sibling control or its descendant receives focus. Pointer transparency is enforced in component CSS as well as its utility class. The dedicated component regression passes; the standalone Playwright regression passes against the managed preview. Shared Chrome confirmed opacity 1 before focus, 0 immediately after focus, zero-second transition, and pointer-events none, with no console warnings or errors. Screenshot: `/workspace/recordings/bedrock-blur/blur-standalone-focus.png`. The original implementation used a single backdrop layer; the redesign description above now records that accurately.
