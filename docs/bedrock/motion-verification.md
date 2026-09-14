> Historical report: the legacy engine and optional-integration architecture have
> been superseded by the CSS-first Astra migration. See [current contract](motion.md).

# Bedrock motion hardening verification

**Date:** 2026-08-30  
**Route:** `/demo/ui`  
**Status:** M1 motion foundation exit gates pass; documented projection/presence boundaries remain
intentional v1 limits.

## Automated gates

| Gate                           | Result                                           |
| ------------------------------ | ------------------------------------------------ |
| `pnpm check`                   | Pass, 0 errors and 0 warnings                    |
| Full Vitest suite              | Pass, 74 tests across 8 files                    |
| Motion browser-component suite | Pass, 29 focused lifecycle and calculation tests |
| Playwright                     | Pass, 4 tests; repeat run passed 12/12 cases     |
| Focused ESLint and Prettier    | Pass                                             |
| Production build               | Pass                                             |
| Development SSR smoke          | Pass, HTTP 200 for `/`, `/demo/ui`, and testbed  |
| `git diff --check`             | Pass                                             |

The browser-component suite covers a real layout flush, interruption and latest-target settlement,
unchanged-WAAPI preservation, paused clocks, axis-aligned and mixed-duration nested projection,
shared-id transfer in both lifecycle orderings plus unpainted/expired provenance, reduced layout and
presence motion, document and nested scrolling, same-frame scroll collisions, diagnostics, unmount
cancellation, and projection-style cleanup.

## M1.3 perceptual scene closure

The six scene-level defects reported after M1.2 separated into one engine timing bug and five
composition/primitive gaps:

- Shared attachment lookup now starts in a microtask rather than waiting a full animation frame.
  Row-mark and card-to-stage replacements therefore join the pre-paint flush instead of flashing at
  their destination and snapping backward one frame later. Nested/adjacent group isolation remains
  covered.
- Search uses a semantic continuous-width transition with a fixed content inset and delayed input
  presence. The former reciprocal transforms reached approximately `scaleX(0.149)` on the shell and
  `scaleX(6.727)` on its content; both content and shell transforms are now `none`, and the leading
  control moves 0 px.
- Pack replacement now pins outgoing layout nodes from their last committed pre-reconciliation
  offsets and excludes them from FLIP retargeting. Incoming cards wait for the 175 ms exit window,
  so unrelated identities do not fly toward ghost grid slots or fade through each other.
- Card-to-stage projects the solid background separately. Matching station code/name nodes transfer
  as opacity-1, position-only shared identities; only the stage-exclusive helper copy fades.
- The new `autoSize` attachment interpolates small persistent shells through intrinsic block-size
  changes without transforming descendants. The Wrap fixture now moves continuously between 88 px
  and 52 px and supports interruption plus reduced motion.
- Rail content keeps a 128 px inner width throughout the outer drawer transition. Its measured text
  height stayed 22.8 px while the rail contracted from 160 px toward zero, and content faded out
  before the shell became too narrow. The drawer and opacity gate now reverse on one 410 ms clock;
  the main pane follows real flex reflow without a competing FLIP attachment.
- `Swap` now uses non-reflected spring easing and a complementary opacity crossfade. The original
  simultaneous copies reached combined opacity 1.946; browser regression coverage keeps combined
  readable opacity between 0.95 and 1.05, avoiding both double-dark overlap and a blank crossover.
  Only a persistent background layer projects during width changes, so text and icons have no
  transformed or clipped ancestor.
- `Swap` also exposes a `slide-up` role for comparable single-line copy. It coordinates shorter
  opposing travel with complementary opacity, animates physical `top` rather than a compositor
  transform, and clips the persistent viewport without an empty midpoint.
- The demo's readable swap wrapper establishes `z-index: 10` above its projected background. A
  frame recording exposed that the engine's temporary projection layer had previously hidden the
  otherwise-correct content animation for the entire shell resize.
- Exclusive accordion handoff uses the same 310 ms entrance curve for both reveals. Their flow
  heights now transfer on one clock instead of shrinking and regrowing between selected items.
- Card-to-stage content is explicitly stacked above the projected surface, and the returning source
  card no longer clips its position-only identity labels.

The targeted production-browser test covers all seven high-risk scenes and passed three repeated runs. Manual
Chrome sampling found no error/warning console messages, failed requests, or responses at or above 400. Evidence recording: `/workspace/recordings/bedrock-motion-scenes-feedback-2026-08-30.mp4`,
SHA-256 `3bc60a2a15294f9271e25e1a344be36b93cdc666b3ae452fda9762ee6c2414ae`.

## M1.2 foundation closure

The final closure pass addressed the remaining platform, isolation, and setup-cost findings:

- Initial registration waits one frame so nodes inside nested groups resolve the nearest root;
  adjacent and nested same-ID groups are proven isolated.
- Guard activation now cancels effects started by the triggering flush, commits final geometry, and
  resumes animation after 120 ms of quiet in a real DEV browser test.
- Missing WAAPI clears projection state immediately. Missing observers degrades to synchronized
  static baselines, preventing later registrations from replaying never-painted geometry.
- Node SSR rendering, prerendered markup, and hydration instrumentation prove no browser-global
  access and zero initial `Element.animate()` calls.
- Actual document, outside-ancestor, and inside-group scrolling preserve or deliberately settle the
  contracted trajectory. Committed-size ResizeObserver echoes are ignored even when delivery is
  delayed 120 ms.
- `vanish` preserves content-box border geometry with `box-sizing: border-box`; RTL packing is
  covered. Unsupported fixed/sticky and interposed-scroller geometry produces a canonical warning.
- Native continuous layout transitions dominate a pending FLIP flush, so the engine does not stack
  projections on frame-driven CSS geometry.
- Ordinary fresh position jobs now use two keyframes with a cached CSS `linear(...)` spring;
  nested, size-corrected, and interrupted jobs retain sampled frames. Engine-owned completion uses
  `onfinish` rather than two Promise tasks per effect.

## Adversarial M1.1 corrections

The 2026-08-30 adversarial review identified concrete faults beyond the original happy-path audit.
This follow-up changed the engine rather than the demo timing:

- Unchanged in-flight projections now keep the same WAAPI animation and phase through document
  scroll, resize baselines, and unrelated mutations. Retargeting reads WAAPI current time rather
  than wall time.
- Nested child timelines extend through slower ancestors. An identity-local child borrows the
  ancestor clock without owning or cancelling it, including while the parent is paused.
- Internal scrolling dominates a same-frame layout mutation and settles to a fresh baseline;
  document scrolling no longer cancels unrelated motion.
- Shared geometry is published only by painted owners and resolved during flush. Never-painted
  intermediate owners cannot become provenance, and an expired newer snapshot cannot block a live
  older departure.
- The flush guard now detects sustained ordinary-frame-rate work and measured cost, clears history
  after quiet, never leaks an animated mode into recovery, and reports group context through the
  canonical diagnostics catalogue.
- Border-radius style reads are batched before the first WAAPI write. The structural scale probe
  requires real size-changing nodes and fails if reads and animation starts interleave.
- Development/test commands select distinct Vite caches and explicit `NODE_ENV` values. The
  Content-swap control retains keyboard focus with `aria-disabled` while guarding repeat activation.

## 50/100-node fixture

The table below is the original pre-adversarial measurement retained for comparison.

One discrete stress update produced the following Chromium CDP deltas. Durations are diagnostic,
not contractual budgets.

| Nodes | Box reads | Animations | Layout count | Layout time | Style recalculations | Style time |  Task time |
| ----: | --------: | ---------: | -----------: | ----------: | -------------------: | ---------: | ---------: |
|    50 |        51 |         50 |            3 |    1.214 ms |                   64 |  11.660 ms |  48.665 ms |
|   100 |       101 |        100 |            3 |    3.064 ms |                  114 |  29.569 ms | 125.345 ms |

Geometry reads are structurally linear at one group-root read plus one read per registered node.
Both fixtures reached zero active animations at rest. The 100-node case is characterization, not a
recommended group size; the initial operating ceiling remains 50.

After batching radius reads, four production runs retained 51/101 geometry reads, exactly 50/100
animations, three layouts, zero style reads after animation started, and zero radius-style reads in
the position-only fixture. A separate two-node scale probe observed at least two computed-style
reads and proved that the last read preceded the first `animate()` call.

| Nodes | Median layout time | Style recalc count | Median style time | Median task time |
| ----: | -----------------: | -----------------: | ----------------: | ---------------: |
|    50 |           1.538 ms |                 16 |         13.418 ms |        63.087 ms |
|   100 |           2.113 ms |                 16 |         23.276 ms |       118.187 ms |

These CDP task deltas remain environment-sensitive diagnostics. Batching removed the previous
per-node recalc count growth (64/114 became 16/16), but the one-time setup task at 50 nodes still
exceeds a frame and remains the highest-value performance limitation. The 50-node ceiling is an
upper operating limit, not a promise of frame-perfect input latency on every device.

The M1.2 trace attributed the old setup spike primarily to native ingestion of 52 keyframes per
node and completion Promise allocation, not measurement or Svelte. After the position fast path,
five production runs retained 51/101 total reads even with ResizeObserver delivery delayed 120 ms,
50/100 effects, and zero style reads after animation writes. Median CDP task deltas improved to
39.960 ms at 50 nodes and 50.987 ms at 100 nodes (from 63.087/118.187 ms in the prior four-run set).
Three instrumented runs observed the last WAAPI effect ready at median 17.0 ms for 50 nodes and
20.6 ms for 100 nodes after the state update. These remain diagnostics rather than universal
budgets: about 30 nodes is the normal target, 50 the tested upper boundary, and 100 characterization.

## Production-browser audit

All fourteen scenes were exercised in a production build, including rapid repeated state changes.
Console errors/warnings, page errors, DevTools issues, failed requests, and responses at or above
400 were all zero. Every scene settled with zero active animation and no residual projection,
presence, size, clipping, opacity, absolute-positioning, or z-index styles.

Key measured outcomes:

- Rapid shared-pill interruption had a 0 px discontinuity.
- Settled and rapid Shuffle-to-West-to-North replacement held outgoing cards within 0.35 px of
  their painted positions, synchronously removed prior FLIP transforms, and kept the initial exact
  sequence's replacement-slot opacity at or below 1.
- The size scene's outer and content-correction scales composed to `1.00066 × 1.00037`; its text
  stayed on one line.
- Shared card-to-stage code/name identities stayed at opacity 1 and unit scale during open and
  close; rapid reversal selected the latest card and restored focus correctly.
- Rail stow/show/stow had no late jump over 20 px.
- `Swap` copy and content ancestors remained untransformed and unclipped; only its background
  projected, and combined readable opacity remained at or below 1.
- Reduced-motion emulation produced zero animations at 20 ms for layout, reveal, appear, drawer,
  and `Swap`.
- Twenty density toggles sampled 72 frames: 16.36 ms mean, 18.30 ms p95, 22.70 ms maximum, and one
  frame over 20 ms. The before run measured 26.4 ms p95 with 18 frames over 20 ms. This is an
  indicative lab comparison, not a formal benchmark.

The adversarial M1.1 production re-audit again exercised all fourteen scenes. Outside scroll and an
unrelated mutation retained the exact WAAPI object while its phase advanced continuously from 50.05
to 100.02 to 133.36 ms. Eighteen size-correction samples composed to 0.999995–1.000014 without text
wrapping; card-to-stage composed to approximately 1.000003. Triple shared transfer used painted
source geometry, rail cleanup had a 0 px late-frame jump across 52 samples, and Content-swap focus
remained on its control at 100, 1,900, and 3,500 ms. All scenes ended at zero animations and zero
engine style residue. The console remained empty and all 90 observed requests returned 200/304.

The reduced-motion policy probe produced zero animations for layout, size, accordion, stack, rail,
and validation; changing the preference mid-flight canceled two active effects within 20 ms. The
available browser control did not natively emulate the CSS media query, so this is engine-policy
evidence rather than a fresh audit of every CSS `motion-reduce` rule.

The independent M1.2 production audit exercised all fourteen scenes under rapid interaction. Size
correction composed to 0.9999949–1.0000116 and shared card-to-stage content to
0.9999951–1.0000224; stack, rail, and Swap showed no late cleanup jump. Document scrolling plus an
unrelated mutation preserved the exact WAAPI object. Toggling the engine policy to reduced motion
canceled six active FLIP effects within 20 ms. The 50/100-node fixtures retained 51/101 rectangle
reads, zero style reads, and exclusively two-keyframe `linear(...)` effects for fresh position
motion; the sampled size path retained its 52 keyframes. A 100-node first-frame setup measured
60.8 ms in that audit, reinforcing the documented 30-node normal target and 50-node upper boundary.

## Bundle and token evidence

The production `/demo/ui` route chunk changed from 31,713 bytes raw / 10,636 bytes gzip before
hardening to 27,162 bytes raw / 8,621 bytes gzip after hardening. This route-level comparison
includes the lab and engine together; it is not an isolated library-package size claim.

After the adversarial M1.1 corrections, the same route chunk is 27,151 bytes raw / 8,609 bytes gzip.
The 11/12-byte change from the reviewed hardening build is effectively neutral; it is still a
route-level measurement rather than a standalone engine bundle claim.

M1.2 produces a 27,178-byte raw / 8,626-byte gzip route node. The 27/17-byte route-node increase is
effectively neutral, but shared-chunk extraction means this number still must not be presented as an
isolated engine-package size.

M1.3 produces a 30,386-byte raw / 9,756-byte gzip route node after adding `autoSize`, coordinated
layout/presence exits, targeted scene composition, and production regression instrumentation. The 3,208/1,130-byte route-node
increase is a route-level lab measurement, not an isolated `autoSize` package cost.

The Astryx-aligned seed files are byte-for-byte unchanged from the pre-hardening checkpoint:

- `tokens.ts`: `bbba083172e31030dea67180c48a341c316364e78d84f57aebda0b8d34aecd3e`
- `tokens.test.ts`: `ffb5c0801361c5150088eb4c68b3714530efd33334253466e114adfe132fcf35`

## Recordings

- Before: `/workspace/recordings/bedrock-motion-before-2026-08-30.mp4`, 217.27 seconds,
  SHA-256 `e9152e7215df1d87ed20ea37169577a2e546fd9cfa1f9c0e13f8ac57c53b9827`.
- After: `/workspace/recordings/bedrock-motion-after-2026-08-30.mp4`, 23.4 seconds,
  SHA-256 `02e221f3fbef17c68e081621826585ee104cdd3aefc12d4f4499f8f8b8c8d4fb`.
- Quantified after-audit data: `/workspace/recordings/bedrock-motion-after-audit.json`.

## Remaining limits

- Rotation, skew, perspective, arbitrary transformed roots, and layout descendants inside a
  `data-layout-invert` correction boundary are not projected.
- Retargeting guarantees positional continuity, not spring-velocity conservation.
- `vanish` requires a stable local containing block. Fixed/sticky exits, containing-block changes,
  and a scroll container between the node and its offset parent remain unsupported and warn.
- A deliberately extreme six-notice burst can temporarily show four in-flow/incoming and two
  outgoing absolute cards. The exits retain distinct slots and clean up correctly, but this is the
  densest remaining overlap and can take slightly over 700 ms to become idle after another dismissal.
- Repeated filter waves issued before an earlier 175 ms outro settles can briefly place two stable,
  already-exiting generations in the same grid slot. They no longer teleport or transform and new
  content remains gated, but Bedrock does not yet coalesce superseded presence generations.
- True hidden-tab lifecycle remains unverified because the shared browser forces attached pages to
  remain visible. Delayed ResizeObserver delivery is covered deterministically instead.
- Motion itself tolerates missing `matchMedia`; the full demo route does not because `svelte-sonner`
  assumes that API. That external application-level fallback is not a motion-engine guarantee.
- The 50-node upper boundary can still exceed a single frame under load. Product groups should
  target roughly 30 nodes until representative application traces justify a higher normal target.
