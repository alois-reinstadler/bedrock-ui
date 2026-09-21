# Interaction polish defect ledger

Baseline: `2f8a4a1`, original Bedrock motion engine. Six specialists work in two
waves; integration owns shared CSS, production builds and the managed preview.
Only three specialist worktrees are active at once. Existing unrelated worktrees
are left untouched.

## Ownership and changed files

| Specialist  | Exclusive scope during its wave                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| Navigation  | `DocsSidebar.svelte`, `SiteHeader.svelte` routing, docs layout/catalogue/forms/block route, sidebar E2E |
| Presence    | AsyncButton, FieldError and their tests/fixtures; accordion endpoint tests; presence E2E                |
| Scroll      | ScrollArea and tests/fixture; progressive-blur E2E                                                      |
| Interaction | Button, ClickableCard, SelectableCard and tests/fixtures; interaction E2E                               |
| Responsive  | `SiteHeader.svelte` composition after navigation integration; Music page; responsive E2E                |
| Adversarial | Independent production E2E and review report only                                                       |
| Integration | This ledger, reviewed cherry-picks, shared preview, final suite and manual evidence                     |

Component paths are under `src/lib/bedrock/ui/`; site components under
`src/lib/site/`. Every specialist also owns its matching `polish-*.md` report.
The six reports retain their worker-stage evidence; this ledger records the
final integrated result. Public APIs, motion source and global CSS are unchanged.

## Confirmed defects

Ordered by user impact: navigation continuity, control activation/focus,
lifecycle safety, readable/reachable layout, then decorative correctness.

### Navigation loses the document and sidebar

- Impact: internal content navigation resets orientation although sidebar links
  preserve it.
- Reproduction: open `/docs/components/accordion`, retain a reference to
  `document`, then choose the **Components** breadcrumb.
- Before evidence: manual Chrome check at 1440px returned
  `window.__polishDocument === document: false` on `/docs/components`.
- Root cause: inherited and explicit `data-sveltekit-reload` boundaries.
- Owner: navigation specialist; integrated `212f706`. Removed internal reload
  boundaries, retained the search indicator, guarded outgoing block data. Scoped
  lint, integrated typecheck and production navigation regressions pass.

### Disabled link-style actions still run

- Reproduction: dispatch a click to disabled Button/IconButton with `href` and
  `onclick`; the callback runs although the href has been removed. An explicit
  tabindex can also put the disabled link back into keyboard order.
- Root cause: anchors have no native disabled behavior; facade forwarded the
  callback and allowed disabled semantics to be overridden.
- Owner: interaction specialist; three failing browser regressions reproduced.
- Integrated `1d8c62d`: cancel disabled activation and preserve disabled keyboard
  semantics while forwarding enabled native events unchanged.

### Card keyboard focus is invisible

- Reproduction: Tab to a ClickableCard or SelectableCard's stretched trigger.
  Its rectangle matches the parent; the 4px outward shadow is clipped entirely.
- Root cause: outward focus ring inside a Card with `overflow: hidden`.
- Owner: interaction specialist. Before screenshots:
  `/tmp/bedrock-polish/clickable-focus-before.png` and
  `/tmp/bedrock-polish/selectable-focus-before.png`.
- Integrated `1d8c62d`: existing ring paints inward, with an inset system-color
  outline in forced colors. No geometry or timing changes.

### Mobile Music queue close is covered by the header

- Reproduction: at 390px open **Queue** with the document at its top. After
  settlement, the close control is at y=21.59px; hit-testing its center returns
  the primary navigation instead of the button.
- Root cause: the fixed queue begins at zero inside the template's view-transition
  stacking context, below the shared sticky header.
- Owner: responsive specialist. Before screenshot:
  `/tmp/bedrock-polish/music-queue-settled-before-390.png`.
- Integrated `7d70950`: position below shared header and wait for async render
  settlement before focus. Before, focus was attempted while the close control
  remained hidden; no arbitrary delay was added.
- Production after-review rejected the first focus fix: `settled()` alone was
  insufficient. The close button's `transition-all` animated inherited visibility
  after its panel was already visible. Follow-up `679e92f` excludes visibility
  from that control's transitions, preserving color/shadow/press motion. This
  fixes the competing property owner without a timing workaround.

### Async callbacks survive route teardown

- Reproduction: start an unresolved AsyncButton action, unmount, then resolve or
  reject it. The continuation previously scheduled a new reset or called onError.
- Root cause: teardown cleared only an already-created timer.
- Owner: presence specialist; integrated `1c7b0ca`. Invalidate pending run and
  suppress callbacks after disposal. Both regressions failed before and pass now.

### Music controls overflow at tablet width

- Reproduction: Music at 768px, with classic scrollbars. Document client width
  is 753px, scroll width is 768px; volume controls end at 768px although their
  player ends at 753px.
- Root cause: player grid column minimums plus gaps/padding exceed available width.
- Owner: responsive specialist (wave two). Before screenshot:
  `/tmp/bedrock-polish/music-player-before-768-dark.png`.
- Integrated `7d70950`: flexible side tracks retain all player controls.

### Shared theme control is buried in mobile navigation

- Reproduction: at 390px the theme button lies beyond the horizontal nav clip;
  pointer hit-testing fails until navigation is scrolled sideways.
- Root cause: an always-needed utility shared the links' scrolling container.
- Integrated `7d70950`: keep the utility in a fixed-width sibling. Both themes
  have failing-before reachability regressions; all nine responsive production tests pass.

### Empty validation alerts displace content

- Reproduction: FieldError receives `[{ }, { message: '' }]`. A two-row fixture
  grew from its natural 56px to 88px despite having no message to show.
- Root cause: inherited renderer counted metadata before filtering messages.
- Owner: presence specialist; integrated `1c7b0ca`. Filter message-less entries
  before rendering. Three tests cover empty, one and multiple visible messages.
- Integration reran all 14 focused presence tests successfully. Combined runs
  emit a baseline Bits UI `derived_inert` warning. Independent review traced its
  deferred callback; reproduction and disposition are recorded below.

### Scroll decorations report the wrong hidden edge

- Reproduction: on `/docs/components/scroll-area`, change the two-axis example's
  root `dir` from `ltr` to `rtl` at `scrollLeft = 0`.
- Before evidence: manual Chrome still reports left hidden `false`, right hidden
  `true` after the computed direction becomes RTL. Screenshot:
  `/tmp/bedrock-polish/scroll-rtl-before.png`.
- Root cause: direction changes and nested content insertions were not observed.
  Fixed-size wrappers could also gain overflow without triggering resize.
- Owner: scroll specialist; integrated `102a40b`. Observe direction and nested
  structural/text changes; retain resize subscriptions for unchanged children.
- Verification: reproduced both failures before repair; integration reran all
  eight focused blur/scroll component tests successfully. Tests also cover
  nested focus and observer/listener cleanup.

## Review record

- Starting working tree clean. Reviewed the four sidebar, accordion and blur
  repair commits named in the handoff.
- Restored managed production preview `bedrock-astra-integration`: local tools
  use `http://127.0.0.1:4086`; user preview `http://100.64.0.2:4086`.
- Initial accordion page has no browser console messages. Baseline 390px Mail,
  Music and Video screenshots are stored outside source under
  `/tmp/bedrock-polish/`. Horizontal header scrollers are reachable by scrolling;
  an offscreen rectangle alone is not classified as a clipping defect.
- Manual accordion interruption: 51px natural height, close down to 10.02px,
  reverse, settle at exactly 51px for the last 18 sampled frames. Node identity
  retained. Space toggles the focused native trigger immediately.
- Existing blur midpoint inspected visually with all five filtered surfaces
  paused halfway through their transition; layer opacity 0.966, ancestor opacity
  1. Screenshot `/tmp/bedrock-polish/blur-midpoint-baseline.png` shows real filtering.
- An apparent AsyncButton startup-width rebound was a sampling-order artifact:
  an early animation-frame callback ran before the sizing callback in the same
  paint. The specialist's corrected post-callback production sampler passes.
  No motion primitive or duration was changed to address an unpainted state.

## Verification

Wave one integration: 22 focused Chromium component tests passed (14 presence,
8 scroll/blur), scoped navigation lint and typecheck passed, production build
passed. All 25 focused production E2E passed, including eight sidebar/lifecycle
tests, nine blur tests, docs shell/navigation and the real AsyncButton geometry
journey. Manual Chrome after-check: breadcrumb preserves document/sidebar;
changing direction at rest produces left hidden `true`, right hidden `false`.
After screenshot: `/tmp/bedrock-polish/scroll-rtl-after.png`. Console clean.

All six specialists finished; their diffs were reviewed before integration and
all task worktrees, including the bounded responsive follow-up, removed. Shared CSS and original motion source have no
changes. The independent adversarial tests reran successfully in integration.

First full unit attempt: 373/374 passed while build, lint and check ran in
parallel. The unchanged running-projection test at motion.svelte.test.ts:148
found no running animation after its real-time wait. A second concurrent-file
run passed that test but missed the guard test's timing-density threshold.
The isolated original motion suite passed 32/32; the full suite with
`pnpm run test:unit --run --no-file-parallelism` then passed **374/374 in 69 files**.
The flag runs test files sequentially; no assertions or durations were changed.

Full lint, typecheck (0 errors/0 warnings), build, and motion-package checks pass.
The final Music follow-up also passed scoped lint/format and worker typecheck.
Manual visual review covers docs, Mail, Music and Video at 390/768/1440 in both
themes; 24 captures and six review sheets live in `/tmp/bedrock-polish/final-*`
and `/tmp/bedrock-polish/review-*`. Cards now visibly show their inner focus ring.
Music's tablet document and client widths both measure 753px; its controls fit.
Mail compose and Video detail open/close were also exercised manually.

Final integrated production suite: **255/255 passed in 3.1 minutes**, including
all nine responsive and six interaction cases. No retry or assertion suppression
was needed. Final queue manual check at 390px confirms a visible, focused,
hit-testable close button below the header; closing returns focus to Queue.
SelectableCard focus and Space activation were also checked at 1440px in dark
mode. Manual browser console was clean; all owned Chrome pages were closed.

The managed production preview remains ready at `http://100.64.0.2:4086`.
Logs, before/after screenshots, review sheets and measurement JSON are copied to
`/workspace/recordings/bedrock-polish-20260921/evidence/`, preserving the basenames
used above. Playwright attachments and generated reference captures are archived
alongside them. Test-generated tracked screenshots/contrast JSON were restored;
this pass intentionally does not update the older reference image collection.

## Remaining baseline issue

The development-only Bits UI `derived_inert` warning has a specific reproduction:
render `accordion-motion.test.svelte` with `forceMount: true`, immediately
`await view.unmount()`, then allow 30ms for deferred work. Its `afterTick` callback
reads an already-destroyed derived ref. Source, fixture and dependency lockfile
match the pre-pass baseline. Production navigation warning capture is empty.
Dependency internals were not patched or warnings hidden; see the
[independent review](./polish-adversarial.md) for the stack and evidence. No
introduced defect remains open. Timing-sensitive original motion tests required
sequential test-file execution on this shared host, as recorded above.

## Visual theme follow-up — 2026-09-21

User feedback after the interaction pass requested a unified sidebar background,
small item gaps, a smooth join between blur and its adjoining surface, lighter
hover than active selection, and a shared CSS corner-shape theme variable.
This follow-up intentionally changes the shared theme CSS; the motion engine
and component public APIs remain unchanged.

| Symptom / reproduction                                                         | Root cause and change                                                                                                                                                                                               | Evidence                                                                                                                                                                           |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Docs sidebar looks like a separate colored panel in either theme.              | `--sidebar` had a separate lightness. It now aliases `--background`.                                                                                                                                                | Before dark: 0.205 versus body 0.145 OKLCH; after: both 0.145. Light surfaces both 1.                                                                                              |
| Neighboring sidebar targets touch.                                             | Inherited menu uses `gap-0`; Bedrock Menu supplies an overridable `gap-1`.                                                                                                                                          | Real menu gap is 4px on desktop and mobile; existing shared-indicator geometry/navigation regressions pass.                                                                        |
| Scrolled text remains visible at the hard boundary beneath the sidebar header. | Backdrop masks soften text but cannot match an opaque adjoining surface. Added an optional, continuously masked `data-blur-tint` sibling above the filters; docs sets `--progressive-blur-surface: var(--sidebar)`. | Before/after scrolled screenshots reviewed in both themes at desktop and mobile sizes. Focus immediately clears the tint along with the filters.                                   |
| Hover has the same fill as selection.                                          | Both states used sidebar-accent. Inactive hover now uses `--sidebar-hover`; active hover stays transparent over the persistent shared highlight.                                                                    | Light hover/active OKLCH lightness: 0.985/0.97; dark: 0.32/0.269. Actual pointer checks and regression tests cover both.                                                           |
| Corner curvature cannot be changed through the theme.                          | Added `--corner-shape: squircle` to shared `[data-slot]` surfaces and the `corner-theme` utility for custom surfaces. `corner-round` and `rounded-full` preserve intentional round shapes.                          | Changing the root token updates real cards/buttons; a local override affects only its subtree. Card geometry remains 406×118px. Avatar and Music play-button circles remain round. |

The theme guide documents radius versus shape, overrides and portal inheritance.
CSS `corner-shape` refines the existing `border-radius`; browsers without support
ignore it and retain rounded corners. No polyfill or dependency was added.
Research: [MDN corner-shape reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape)
and [Chrome 139 release notes](https://developer.chrome.com/blog/new-in-chrome-139).

All five modified Svelte components plus the Music exception pass Svelte
autofixer. Typecheck has 0 errors/0 warnings; scoped ESLint/Prettier, production
build and eight scroll/blur component tests pass. Four new production tests pass
in light/dark modes. Chromium versions serialize equivalent corner values as
keywords or `superellipse()`; assertions accept both equivalent serializations.
Manual mobile drawer Escape returns focus to its trigger; console is clean.
Final production browser suite: **259/259 passed in 3.1 minutes**, including
all navigation, forced-colors, blur, responsive and new theme cases. The managed
preview remains at `http://100.64.0.2:4086`. All owned Chrome pages were closed.
Evidence is archived outside source at
`/workspace/recordings/bedrock-theme-surfaces-20260921/evidence/`; before/after
screenshots use the `sidebar-*`, `hover-*`, `cards-*` and `music-*` prefixes.
Test-generated reference captures and an equivalent type-import serialization
change were archived and restored rather than committed.
