# Documentation rendering and template depth audit

Follow-up baseline: `15bbf5d`. Work remains on `feature/site-experience-pass`; no pushes, publishing, deployment, dependency additions, lockfile changes, or frozen shadcn edits. The user authorized a merge to `main` after verification.

## Completed behavior

All 100 component overview pages begin with independently lazy-loaded common variants and include a separate contextual product example. Imports arrive syntax-highlighted in the server-rendered HTML. Source disclosure requests only the current example source, already highlighted, so there is no plain-text-to-colored flash. Properties and accessibility query tabs remain linkable. The existing three-block catalogue and four-template catalogue remain intact.

- Music: nine original instrumental clips, real audio transport, seeking, volume, shuffle/repeat, queue editing, saved albums, liked songs, history, query-linked library views, and expanded mobile playback.
- Video: two original silent 24-second films with descriptive text tracks, category browsing, related titles, watchlist persistence, actual saved playback position, and error retry. Other fictional catalogue entries identify their short preview explicitly.
- Email: an integrated Mail, Calendar, and Tasks workspace with persistent app navigation, inline composition, message-to-task/event actions, and Important tasks. Reply threads, forward drafts, archive undo, event create/edit/delete with overlap validation, month/day selection, task due dates, filtering, completion, and editing. Screen switches preserve local work; content resets on reload as disclosed in the demo.
- Social: profile editing, query-linked views/threads/profiles, described original media, retained text drafts, following, saved notes, notifications filtering, and reversible hiding.

The shared template bar links directly between all four full-page applications. Native view transitions use Bedrock timing tokens and skip animation for reduced motion; browsers without the API navigate normally. Template assets load by URL and are not embedded in the JavaScript bundles. Original audio totals 2,446,069 bytes; the two films, posters, and description tracks total 866,050 bytes. Their reproducible generators and provenance are documented in the template reports.

## API and accessibility judgments

Stepper still presents progress; Stepped Form remains the separate validation/navigation coordinator. This follow-up does not change their public contracts. Native labeled range controls provide Music seeking and volume. Video reuses the public VideoPlayer and its media setup hook. Email reuses Calendar, DateInput, Progress, and existing form/dialog components; inactive screens cannot handle mail shortcuts or retain visible portaled dialogs. None of the templates currently consumes a reusable block.

Documentation keeps its hard-reload reliability boundary. The observed SvelteKit 3 development SSR restart failure matches the upstream issue linked in [the rendering report](./docs-followup.md); running the production build avoids that development interruption but is not an upstream fix. A narrowly scoped adapter bridges Superforms' removed `$app/stores` import using current `$app/state` and `toStore`. No dependency or vendor code was changed.

Frozen tinted destructive Badge and Avatar contrast exceptions, the inherited contrast findings in the initial audit, and the upstream multi-thumb Slider labeling limitation remain unresolved and explicitly documented. Passing the test suite does not imply blanket WCAG conformance. Server-backed forms examples remain source guidance for the static documentation site.

## Verification

The first integrated pass passed 163 production cases. A later 169-case sweep passed 168 and exposed an intermittent mobile Email reading-heading focus failure. The integrated Email/inline-compose pass fixed delayed CSS visibility, added a visible mobile compose entry point, and passed all ten Email flows plus ten repeated mobile focus/compose cases. Documentation rendering/navigation and cross-template navigation passed 33 cases across three fresh repetitions. The exact unit command `pnpm run test:unit -- --run` passed 346 tests across 63 files (35.48 seconds); a bounded two-worker run also passed. The final isolated unit run also passed all 346 tests in 63 files (26.50 seconds). The sticky navigation regression passed ten fresh repetitions after the border/height correction. Final production verification is recorded below. Evidence is retained in `verification/followup/` and `screenshots/depth-*`. Each worker diff was reviewed and its check, formatting, lint, and production tests independently rerun before cherry-picking. All changed Svelte files passed the Svelte MCP autofixer with zero issues or suggestions.

## Ownership

The initial worktree map remains recorded in the first expansion audit. Preserved worktrees were not removed or reset. Three existing workers handled the documentation example batches and then Music, Video, and Email in separate worktrees; a fourth worker handled Social in its own worktree. Worker commits: Music `b33eb4d`, Video `96d1a71`, Email `74afaa8`, Social `9dbb466`, integrated Email `7576872`. Integration commits retain their authorship. Shared contracts and template navigation stayed owned by the orchestrator.

## Production bundle comparison

Compared with `15bbf5d`; decimal KB of raw route-entry JavaScript, not whole-page transfer.

| Route                      |   Before |    After | After gzip |
| -------------------------- | -------: | -------: | ---------: |
| `docs/components/[slug]`   | 60.81 KB | 69.77 KB |   17.47 KB |
| `templates/music-player`   | 21.45 KB | 28.79 KB |    9.10 KB |
| `templates/video-library`  | 24.94 KB | 32.93 KB |   10.47 KB |
| `templates/email-client`   | 31.09 KB | 57.05 KB |   17.06 KB |
| `templates/social-network` | 31.49 KB | 38.95 KB |   12.04 KB |

The deduplicated root/docs/component static JavaScript closure is 555,849 bytes versus 549,732 bytes before (+6,117 bytes, about 1.1%). The original pre-expansion component entry was 44,385 bytes. The detail eager graph contains no component examples/previews, templates, Shiki, PDF runtime, or chart example. The route entry grew for the separate lazy preview map and source handling; the full static closure changed less because browser highlighting moved out of this route.

Large production chunks remain separately dynamic: Shiki Emacs Lisp (790 KB), C++ grammar (785.5 KB), Shiki WASM (622.3 KB), PDF.js (431 KB), and chart code (230.9 KB). Their presence in the output does not mean they load on documentation navigation. No chunk warning threshold was increased. The measurement JSON records route entries, static closures, gzip sizes, and the largest output chunks.

## Final isolation and merge scope

Unrelated uncommitted files appeared in the original worktree under `src/lib/bedrock/motion/{CssButton.svelte,CssPanel.svelte,css.ts,engine.ts}` and `src/routes/motion/`, followed by concurrent changes to `package.json`, `pnpm-lock.yaml`, generated component-reference metadata, `docs/bedrock/motion.md`, and `vendor/`. They were left untouched and excluded from this expansion. Final build and checks run from `/workspace/wt/bedrock-expansion-verification`, with only the reviewed expansion commits. This keeps concurrent motion work out of the production bundle measurement and main merge.

Screenshots: [inline compose desktop](./screenshots/email-integrated-compose-desktop.png), [inline compose mobile](./screenshots/email-integrated-compose-mobile.png), [integrated calendar](./screenshots/email-integrated-calendar-desktop.png), [tasks and sticky navigation](./screenshots/email-integrated-tasks-mobile.png), [music playback](./screenshots/depth-music-integrated.png), [video playback](./screenshots/depth-video-mobile-integrated.png), [social profile](./screenshots/depth-social-profile-integrated.png).

Final integration also caught a sticky-rail bottom-boundary collision: the desktop rail used the full viewport height while sitting below the header. Its height now subtracts the actual header offset. The regression checks rail position against the rendered header after scrolling settles, rather than taking a one-shot hard-coded coordinate.

## Final preview

The dedicated preview is [the template catalogue](http://100.64.0.2:4085/docs/templates), with [integrated Email](http://100.64.0.2:4085/templates/email-client). It runs the production build from the isolated verified checkout. It uses local mock data: no messages or social posts are transmitted. All four full-page templates remain available from the shared template navigation.

## Final verification result

- `pnpm check`: zero errors and warnings.
- `pnpm run test:unit -- --run`: 346 passed across 63 files (26.50 seconds).
- Production build: passed.
- Full focused production Playwright suite: **172 passed (1.5 minutes)**. Includes all 100 component pages, documentation rendering/navigation/tabs, shell, homepage, Progressive Blur, Stepped Form, all four templates, and ten Email workspace cases.
- Documentation/rendering/template-route repetitions: 33 passed across three fresh repetitions. Mobile Email focus/compose: ten passed across five repetitions each. Sticky app navigation: ten passed across ten repetitions.
- Changed-file Prettier: 260 supported files passed. ESLint: 237 supported files passed. Frozen shadcn was not reformatted; inherited global formatter failures remain outside this change.
- Every changed Svelte file passed Svelte MCP autofixer; the final sticky-rail correction also returned zero issues and suggestions.
- Final browser checks include keyboard focus, mobile/tablet/desktop layouts, light/dark themes, reduced motion, console errors, failed resources, inline compose without a dialog, and task creation with destination focus. Browser-owned tabs were closed.

No required implementation work remains in this expansion. The previously disclosed upstream framework/primitive and inherited contrast limitations remain. The verified commits are ready for the user-authorized fast-forward merge to main; no remote push is authorized or performed.
