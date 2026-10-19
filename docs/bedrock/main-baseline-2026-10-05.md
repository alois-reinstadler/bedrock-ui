# Main baseline — 2026-10-05

## Scope

This baseline captures all current work in `/home/node/repos/bedrock-ui`, as
explicitly requested by the owner. The checkout was already on `main` at
`f4c6cc4`; no branch merge was needed. The initial inventory contained 611 tracked
changes and 714 untracked files, including component and motion expansions,
documentation, template work, media credits, verification evidence, and vendored
Astra Motion archives. Existing work was preserved.

## Component polish

- Drawer entry releases its transform for dragging; exit retains its final frame
  until unmount. Removed competing overlay animation utilities.
- Spotlight and progressive blur inherit the containing surface's corner shape.
  Blur layers inherit the relevant corner radii and stay within their edge strip.
- PDF loading uses a document skeleton until the first rendered page is ready.
  Source changes and teardown cancel owned loading/rendering work; failures expose
  an accessible error state.
- Horizontal steppers use equally sized columns with centered markers, connecting
  tracks, and wrapping labels. The examples show order progress and deployment
  activity.
- Color examples demonstrate coordinated formats, all slider channels, opacity,
  palettes, and live output. Picker controls have clearer spacing and grouping.
- Toggle examples control text formatting and an article's saved state.
- Stepped-form examples provide profile/workspace validation, review, submission,
  and reset, with unique field IDs for multiple examples on one page.
- Code-block line-number gutters follow the actual digit width.
- Outline resolves headings within its current content branch, so asynchronous
  route replacement cannot leave observers attached to the previous page. A
  regression covers overlapping heading IDs and repeated navigation.
- Regression coverage exercises drawer exit frames and dragging, slow PDF loading,
  PDF errors, mobile stepper layout, and the redesigned example workflows.

## Audit

The required local Impeccable scan ran with telemetry, update checks, and hooks
disabled. Its ten findings were reviewed against Bedrock conventions: intentional
height/width transitions and indicator geometry, a grid-background demonstration,
font choices in the video template, and two image-source false positives (sources
are assigned by an attachment or guarded conditional). No generic design rewrite
was applied to these unrelated surfaces.

Forty-two pre-existing JSON verification records were formatted to satisfy the
repository's Prettier check without changing their data. Trailing whitespace was
removed from fifteen archived logs for a clean staged diff. The aggregate test
script now forwards `--run` correctly. The Playwright test
root is restricted to `src` so the separate agentic test runner owns `tests/e2e`.
Older assertions were aligned with the existing static reduced-motion skeleton,
full-navigation documentation tabs, feedback preview heading, shader copy, and
redesigned article toggle. Semantic, rendering, history, and keyboard checks remain.

## Verification

- Frozen-lockfile installation passed using the shared pnpm store.
- `pnpm check`: zero errors and warnings.
- Repository ESLint and Prettier checks passed; subsequently added test/config
  files passed targeted lint and formatting checks.
- Server unit project: 52 files, 273 tests passed. All 78 browser unit files
  passed in independent runs (394 tests). The subsequent Outline fix passed all
  eight tests, including one new regression, for 668 passing unit tests in total.
- `pnpm motion:verify`: archive integrity, installed content, import boundaries,
  and standalone/warm bundle ceilings passed.
- `pnpm assets:verify`: passed.
- `pnpm build`: component reference generation, client/server compilation,
  prerendering, and static output passed.
- `node scripts/verify-map-lazy.mjs`: MapLibre stays deferred and its bundled
  worker is present with no unresolved upstream import.
- Manual live-browser checks covered desktop/mobile and light/dark presentation,
  color format synchronization and keyboard controls, toggle formatting,
  stepped-form validation and completion, PDF readiness, clipping, and corners.
  After restarting the dev server for the dependency install, the live color
  picker was rechecked with working input updates and no console errors.

The full production Playwright run completed all 589 cases: 580 passed. Its
nine failures identified the Outline observer leak and eight outdated
expectations (including both onboarding themes). All nine subsequently passed
against the final production build. The affected checks also cover drawer exit
and drag dismissal, PDF readiness and errors, mobile stepper layout, and Outline
scroll tracking. Drawer dragging and reduced-motion PDF loading each passed
three consecutive final runs. All 589 selected production cases therefore have
passing evidence across the full run and targeted reruns; a second full run was
not performed. The two agentic E2E workflows passed with exact assertions for
saving/removing an article and creating a workspace with the entered details.
The restarted live preview was checked again: the article toggle updates its
semantic state and visible confirmation, with no browser console errors.

## Known verification boundaries

The shared-Chrome Vitest runner still loses its browser WebSocket in combined
runs. The final combined attempt passed 482 tests without an assertion failure
before disconnecting; every browser test file passed independently. Separate
SvelteKit output (`.svelte-kit-test`) prevents tests from overwriting the live
preview's generated runtime, but did not resolve the WebSocket problem. This
baseline does not certify the one-shot shared-browser unit command as green.

The first production E2E attempt used an older preview process that cached stale
asset references after rebuilding. It was interrupted, and verification moved to
a fresh owned preview of the current build. The stale process was not modified.

The build retains adapter deprecation and large-chunk warnings. SvelteKit 3 is
outside the declared peer ranges of Astra's optional Kit integration, Runed, and
Superforms; the existing narrow compatibility adapter and tests remain in place.
Remote-media playback is excluded by the repository's normal E2E filter.
