# Astra integration implementation record

Date: 2026-09-29. Candidate: `astra-motion-0.0.1-e07b17d773a8.tgz`.

Bedrock owns semantics, motion policy and visual presets. Astra now coordinates
AsyncButton label presence, AvatarStack membership and the project composition on
`/motion`. Ordinary feedback and measured indicators use CSS. Component imports and
native interaction semantics remain stable.

## Delivered changes

- Installed the captured sibling source as a content-addressed archive with
  recorded provenance and bundled MIT notices. The original sibling checkout was
  not modified. The previous archive and external source snapshots remain available.
- Removed the obsolete `astra-motion/css` bridge, `CssButton` and `CssPanel`, and
  migrated their examples and behavioral assertions.
- Added an engine-free `MotionProvider`, reactive OS-or-application reduction,
  portal attachments, a separate `AstraPolicy` bridge, and mechanically checked
  duration tokens with conversion to seconds at Astra boundaries.
- Added explicit completion for component-owned animation values during live
  reduction. Updating Astra's transition duration alone did not complete an
  already-running opacity animation. Native retained exits also settle through
  an ownership marker; unrelated animations are not completed indiscriminately.
- Migrated AsyncButton labels while preserving the state machine, measured shell,
  accessible status and inert outgoing visuals. AvatarStack uses position-only
  Astra layout, disambiguated existing identity keys and focus restoration for a
  retained trigger moved during membership updates.
- Replaced custom projection for Tabs, Outline, DataTable and the documentation
  sidebar indicators with measured CSS geometry and resize observation.
- Switched internal native-helper imports to their direct modules. The compatibility
  barrel's layout re-exports had retained the unused old layout engine in production
  shared chunks. The public barrel remains available; graph assertions now prevent
  migrated components and native helper fixtures from reintroducing that dependency.
- Added the expandable/reorderable project composition, native and Astra examples,
  keyboard focus return, inert retained exits and current authoring documentation.
- Qualified focused automated browser fixtures against the existing shared Chrome,
  using isolated test contexts and no browser-launch fallback.

## Bundle evidence

The locked-toolchain production fixtures use Vite 8.2.2 in both captures. Values
below are gzip bytes; shared initial and engine-warm measurements use actual
transitive chunk closures. See [fixed methodology and gates](baseline.md),
[baseline graphs](baseline-bundles.json) and [final graphs](final-bundles.json).
The [first candidate graphs](candidate-bundles.json) remain as intermediate evidence.

| Consumer                    | Before |  After | Fixed ceiling |
| --------------------------- | -----: | -----: | ------------: |
| Ordinary Button, standalone | 42,232 | 42,232 |        42,655 |
| AsyncButton, shared initial | 55,304 | 90,827 |        97,608 |
| AsyncButton, engine warm    | 35,829 | 34,267 |        41,255 |
| AvatarStack, shared initial | 43,302 | 79,658 |        85,606 |
| AvatarStack, engine warm    | 23,827 | 18,437 |        28,628 |

First engine use is measurably larger; adoption is not presented as a universal
bundle reduction. Standalone AsyncButton is 101,051 B (previously 54,144 B), and
AvatarStack is 84,666 B (previously 47,934 B). Standalone and shared closure totals
are different builds and must not be interchanged. Ordinary Button and the native
compatibility barrel contain no Astra engine modules; the latter deliberately
retains the legacy layout API. Ten graph fixtures reject React,
duplicate engines and route adapters; all 1,188 archived entries match installation.

## Verification

Verification was limited to migration milestones and focused regressions, following
the requested test scope. The entire unit/E2E repository suite was not rerun.

- Typecheck: zero errors and warnings.
- Production build: passed; existing adapter-deprecation and tooling timing/color
  notices do not represent runtime errors.
- Package/archive verification and fixed component bundle gates: passed.
- Policy/token server milestone: 21 tests passed. Updated Astra SSR: 4 tests passed.
- AsyncButton/AvatarStack browser milestone: 12 tests passed.
- Integrated Astra/policy/Outline/DataTable browser batch: 16 of 18 initially passed;
  the two live-opacity failures led to the owned-value completion fix. The targeted
  four-case policy browser rerun passed, retaining the original assertions.
- Task-owned source lint passed after documenting Playwright's required empty
  fixture dependency pattern. Formatting and Svelte autofixer checks were applied
  to authored components. Pre-existing unrelated repository formatting is untouched.

- Production E2E: all 22 selected cases pass (21 in the initial run, then the
  single affected case after its fix). These cover the sidebar, navigation/history,
  mobile layout, native activation, reversal, composition focus, live reduction
  and zero serious/critical axe violations on both motion pages in light/dark.
  The global tiny-duration fallback had overridden the sidebar's exact zero-duration
  rule. Scoped `transition: none !important` restores that contract; its original
  assertion was retained.
- Manual shared-Chrome inspection of `/motion`: 1280px desktop and 390px mobile
  snapshots/screenshots, project expansion and reordering, no horizontal overflow,
  no console warnings/errors and no failed resource responses. Resizing during exit
  then performing 20 reduced-motion toggles left zero detail nodes and zero running
  animations. Owned manual pages were closed.

Three production interaction runs per component pass the fixed gates: p95 frame
gaps were at most 16.8 ms, maximum gaps were 33.3 ms for AsyncButton and 16.8 ms
for AvatarStack, and neither produced a long task. The
[runtime comparison](runtime-comparison.md) preserves route-size results, exact
capture provenance and five manual variants per component. Its first ERP route
measurement exceeded the original mixed-toolchain comparison by 2,862 B; the
[matched control](paired-control.md) still failed by 1,880 B. Both observations
remain in the record. Direct helper imports removed 6,516 B of unnecessary
production downloads without changing component behavior or the fixed allowance.

The [final actual-browser route capture](final-route-validation.md) passes all five
original limits:

| Route             | Final JS gzip | Delta from original baseline |
| ----------------- | ------------: | ---------------------------: |
| Button docs       |     215,290 B |                     -8,242 B |
| Docs shell        |     174,697 B |                     -8,449 B |
| Motion            |     199,760 B |                    +19,122 B |
| AsyncButton docs  |     261,503 B |                    +34,626 B |
| ERP / AvatarStack |     345,906 B |                    +38,650 B |

ERP is 3,654 B below the original ceiling and 4,636 B below the matched-control
ceiling. None of the five loaded resource graphs contains the legacy layout
engine marker. The final import-only build also passed the focused composition
focus/reduction E2E and an ERP rapid-membership browser check with retained focus,
zero leftover animations and no console/network errors. The package verifier adds
an explicit graph regression guard against this accidental dependency.

Normal, OS-reduced, mobile, RTL and CSS 200% zoom checks preserve AsyncButton's
semantics/focus and AvatarStack's focused identity. Full browser zoom was not tested.
The ERP page's 446px document width on a 390px viewport and left-edge preview
clipping occur in both baseline and candidate; those existing demo limitations
remain. Other pages tested here did not show horizontal overflow.
Full logs and recovery patches live in
`/workspace/agent-jobs/bedrock-astra-migration/`.

## Deliberate remaining boundaries

The [consumer ledger](consumer-ledger.md) classifies retained `Swap`, `autoSize`,
legacy layout demos and third-party behavior, including their follow-up criteria.
This integration does not claim full custom-engine retirement, universal intrinsic
resize handling, physical-device/cross-browser qualification, live policy for text
stream pacing, or control over third-party JavaScript momentum. Raw Astra consumers
must apply the documented policy recipe, including owned paint values when needed.
Kit 3 route adapters remain outside production imports and require a separate review.

Changes remain uncommitted for review. The source snapshots preserve the original
staged and unstaged work separately; unrelated working-tree edits were not reverted.

The final managed preview is available at `http://100.64.0.2:4086/motion` (local
tools use `http://127.0.0.1:4086`). Integration-owned worktrees and the temporary
control preview are cleaned up; recovery artifacts and the final preview remain.
