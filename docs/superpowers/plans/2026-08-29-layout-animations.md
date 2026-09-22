# Layout motion implementation and hardening plan

> Historical implementation/design record. For current motion architecture decisions, use the
> [2026-09-22 component review](../../bedrock/motion-architecture-review.md) and
> [route evaluation](../../bedrock/motion-architecture-evaluation.md). Their CSS-first recommendations
> supersede earlier blanket primitive/FLIP rollout guidance and the View Transitions bridge choice
> for complex shared motion. Existing API behavior remains documented in the local motion contract.

> **Status:** The custom FLIP direction is accepted and the first M1 hardening pass is implemented.
> The fourteen-scene motion lab and dedicated browser fixtures now exercise the core contract, but
> the remaining production-exit gaps below are still explicit. The normative public behavior lives in
> [`docs/bedrock/motion-contract.md`](../../bedrock/motion-contract.md).

## Goal and decision

Bedrock will use a custom FLIP engine for component-level layout motion. It covers discrete
position and size changes that CSS cannot interpolate, including flex/grid packing, keyed
reorders, and a logical element that unmounts and remounts elsewhere.

The architectural split is:

- `layout()` for discrete layout jumps, packing, reorders, shared elements, and size changes.
- `reveal` for reflow-driven vertical presence, such as accordions and validation messages.
- `autoSize` for a persistent wrapping shell that must interpolate intrinsic block size without
  scaling its descendants.
- `appear` and `vanish` for insertion and removal. `vanish` leaves normal flow immediately so
  remaining `layout()` nodes can pack while the removed node fades in place.
- `drawer` for horizontal reflow-driven presence.
- `Swap` for keyed content replacement without a temporary shell sized to both the entering and
  exiting copies.

View Transitions remain a possible later route-navigation companion. They are not the Bedrock
component primitive and must not run on the same node as FLIP in the same update. Motion+ and
Framer Motion remain out of scope.

## Current implementation record

This section describes the code as it exists on 2026-08-30. It is evidence, not a claim that all
behavior is already production-ready.

### Public surface

The barrel at `src/lib/bedrock/motion/index.ts` exports:

| Export                           | Kind               | Current role                                                                |
| -------------------------------- | ------------------ | --------------------------------------------------------------------------- |
| `LayoutGroup`                    | Svelte component   | Renders a real `div`, owns one engine, and observes that root.              |
| `layout(options?)`               | attachment factory | Registers one or more elements with the nearest ancestor group.             |
| `Swap`                           | Svelte component   | Keyed label/content replacement with an out-of-flow exiting copy.           |
| `autoSize`                       | attachment factory | Real-height interpolation for a bounded persistent wrapping shell.          |
| `reveal`                         | transition         | Animates opacity and vertical box metrics so siblings follow native reflow. |
| `appear`                         | transition         | Fades/clips inserted content without scaling text or icons.                 |
| `vanish`                         | transition         | Pins removed content with physical `left`/`top`, then fades/clips it.       |
| `drawer`                         | transition         | Animates opacity, width, and horizontal padding for rails/drawers.          |
| `motionPresets`, `motionEasings` | tokens             | Shared semantic durations, curves, and spring parameters.                   |

`layout()` accepts `id`, `type: 'both' | 'position' | 'size'`, and a `transition` containing
`duration` plus spring stiffness, damping, and mass. Attachment factories are expected to have
stable identity: create them once in component script and reuse them.

### Group discovery and scheduling

`LayoutGroup` registers its rendered root in a module-level `WeakMap`. A `layout()` attachment
walks DOM ancestors to find the nearest registered root. This replaces the Svelte-context design
in the original proof-of-concept plan because attachment effects cannot establish context.

Attachment ordering is accommodated by performing the first group lookup in a microtask after the
Svelte commit, with animation-frame retries only when no group is found. If the retry window
expires, the implementation logs a warning and leaves the element unregistered.

The group observes descendant child/attribute changes with one `MutationObserver`; one
`ResizeObserver` covers the root and registered nodes. Relevant changes are coalesced into a
pre-paint `requestAnimationFrame`. Transition, resize, and capture-phase scroll events refresh the
baseline without making FLIP chase continuously changing geometry.

The scheduler degrades sustained frame-rate flush density or accumulated flush cost. It emits one
deduplicated development warning per episode, converts suppressed animation requests to baseline
synchronization, and resets history after 120 ms of quiet. Unlike the original 24-in-100-ms guard,
this policy is reachable on ordinary 60 Hz displays.

Initial node registration is deferred only to a microtask. This lets nested group roots from the
same Svelte commit bind before ancestor lookup while ensuring a newly mounted shared owner joins the
pre-paint flush instead of flashing once at its destination.

### FLIP and interruption

Boxes are stored relative to the `LayoutGroup` root. During a flush the engine:

1. Derives the current visual box from the active WAAPI clock and sampled progress, without parsing
   computed transform matrices. It captures all clocks before canceling any inherited ancestor
   effect.
2. Suspends engine projections in one write phase, then measures the root and connected nodes in one
   read phase. Unchanged, unrelated projections restore the same WAAPI objects and phase.
3. Computes the position/scale inverse, constrained by the requested layout type and corrected
   relative to an animated layout ancestor when nested.
4. Generates spring progress samples and bakes them into WAAPI transform keyframes over the token
   duration with linear playback.
5. Cancels replaced animations and starts from the last visible box, so a discrete update can
   retarget without jumping.
6. Cancels completed animations so no inline transform remains.

The spring is sampled, not a live per-frame solver. Stiffness, damping, and mass define the sampled
shape; the semantic token duration normalizes it to wall-clock playback. Retargeting preserves
visual position but does not conserve spring velocity. Unrelated baseline work preserves the
original animation and therefore its existing velocity.

Fresh, unnested position-only jobs serialize the cached samples into a CSS `linear(...)` easing and
send two transform keyframes to WAAPI. Nested, size-corrected, and interrupted jobs retain explicit
sampled keyframes. Engine-owned effects use `onfinish`; only a child borrowing an ancestor timeline
needs a shared `finished` promise.

Invalid public duration/spring values fall back to the Astryx-aligned layout preset. Exceptions and
missing WAAPI/observer APIs retain final static layout instead of wedging the group.

### Size correction

Size FLIP is implemented. When the inverse contains scale, a direct child matching
`:scope > [data-layout-invert]` receives reciprocal scale keyframes. The outer keyframes also
correct a uniform pixel border radius and set a temporary keyframed stacking order. This means
inverse scale is no longer future work. Axis-aligned nested layout nodes use affine ancestor-relative
projection; layout nodes inside a `data-layout-invert` correction boundary remain unsupported and
produce a development warning.

Nested nodes may use distinct semantic transitions. Child correction keyframes extend through the
slowest animated ancestor they depend on, and identity-local children borrow (but never cancel) the
nearest ancestor's WAAPI time source for interruption and cleanup.

### Shared layouts

Shared snapshots live inside one group. A committed node with `id` publishes its group-relative
visual box when it departs, and the latest unresolved owner may consume it during a flush for up to
480 ms. Owner/generation metadata and painted-flush provenance prevent a new target from consuming
its own geometry, an old teardown from overwriting a current hand-off, or a never-painted owner from
publishing geometry. Browser-component tests cover both attachment lifecycle orderings, a
never-painted triple handoff, and expiry precedence.

Cross-group transfer is not implemented. Simultaneously mounted duplicate ids have no defined
crossfade or ownership behavior and are not supported. The shared registry is a transient transfer
cache, not persistent application state.

### Presence and reduced motion

`reveal` deliberately animates height, paddings, margins, and border widths. This is the exception
to the transform-only FLIP rule: continuous native reflow is the desired behavior for a small
presence region, while `layout()` handles discrete jumps.

`appear`, `vanish`, `drawer`, and `Swap` are Svelte transitions; `autoSize` is a measured attachment
for persistent intrinsic-height changes. The shared SSR-safe policy resolves all presence
delays/durations, auto-sizing, and FLIP playback to immediate final state under reduced motion.

`Swap` defaults to a complementary opacity crossfade with no blank interval. Its optional
`slide-up` effect coordinates shorter opposing travel and complementary opacity for single-line
content, keeping the clipped viewport populated while animating `top`, not transforms. A resizing
control projects only its persistent background surface. Stable drawer content is composed as a fixed-width inner surface inside the clipped,
width-animating shell so text does not wrap and unwrap during the transition. The shell's opacity
gate derives from the same bidirectional progress as its width, preserving rapid reversal without
an independently restarting content timeline. Its flex sibling follows the real-width reflow
natively rather than adding discrete FLIP projection to the same axis.

`vanish` keeps physical coordinates in a stable local containing block and now emits captured
border-box dimensions with `box-sizing: border-box`. RTL, vertical writing, and unchanged
axis-aligned transformed ancestors work in that invariant. Fixed/sticky exits and an interposed
scroll container warn and remain outside v1.

### SSR, hydration, and scrolling

On the server, `layout()` and `autoSize` return before registration when `requestAnimationFrame` is
unavailable. The first client registration establishes the baseline; attachment ordering uses an
initial microtask and bounded frame retries. Node SSR rendering and production prerender/hydration
tests verify static markup and zero initial `Element.animate()` calls. Missing WAAPI and observers
degrade to synchronized static layout without retaining fictional projection geometry.

Group-relative coordinates prevent document scroll or movement of an outside ancestor from
changing a node's coordinates relative to its group. Capture-phase scroll handling refreshes the
baseline without playback while preserving unchanged in-flight WAAPI animations. An internal
scroller wins over a same-frame layout mutation and settles immediately. Browser-component tests
cover document-scroll preservation, nested-scroll retargeting, and this same-frame collision.

## Motion lab: fourteen interaction classes

Route: `/demo/ui`. The lab is an exploratory integration fixture, not product component markup.

| #   | Scene            | Behavior exercised                                                                                                        |
| --- | ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 01  | Shared pill      | One persistent node changes box and is interrupted mid-flight. Despite the historical title, it does not use a shared id. |
| 02  | Pack and shuffle | Position-only FLIP for persistent cards; committed-geometry exits and delayed fade-through entry for replacements.        |
| 03  | Unanimatable CSS | `justify-content` jumps become visual travel.                                                                             |
| 04  | Size             | Position/size FLIP plus `data-layout-invert` content counter-scale.                                                       |
| 05  | Accordion        | `reveal` drives vertical presence and native sibling reflow.                                                              |
| 06  | Stack            | `appear`/`vanish` plus packing of persistent siblings.                                                                    |
| 07  | Search morph     | Continuous width plus delayed crisp content; no reciprocal text scaling.                                                  |
| 08  | Row mark         | A remounted highlight transfers through a shared id before the first paint.                                               |
| 09  | Card to stage    | Shared surface plus always-readable position-only code/name identities; stage-exclusive copy fades separately.            |
| 10  | Density          | Grid column-count change with stable card identity.                                                                       |
| 11  | Wrap             | Chip packing plus `autoSize` interpolation of the persistent wrapping shell.                                              |
| 12  | Rail             | Bidirectional `drawer` reflow with a fixed-width surface and same-clock opacity gate.                                     |
| 13  | Content swap     | A background-only shell projection surrounds crisp, opacity-only `Swap` content without readable overlap.                 |
| 14  | Validation       | `reveal` for error/success messages and native form reflow.                                                               |

The lab currently uses raw elements and English fixture copy. After semantic foundations exist, its
controls, text, and stacks should be composed from Bedrock primitives so the route becomes a design
system integration test. Canonical component-owned strings remain English even though product UI
defaults to `de-AT`.

## Current verification evidence

- Manual Chrome review exercised every scene, rapid interruption, reduced motion, cleanup,
  console/network state, and recorded before/after evidence.
- On 2026-08-30, the full Vitest suite passes 57 tests across seven files. Seventeen
  browser-component cases cover flush, WAAPI-clock interruption, unrelated-flush preservation,
  mixed-duration nested projection, both shared-id orderings plus provenance/expiry, reduced
  motion, scrolling collisions, diagnostics, and unmount cleanup.
- The initial project-wide `pnpm check` baseline contained 100 errors across 41 files. The M0
  stabilization pass resolved the import, parser, typed-route and bindable-prop causes; `pnpm
check`, the 30-test Vitest suite and the Playwright end-to-end test now pass. The previously
  reported cached-attachment issue remains non-reproducible. Full evidence lives in the [M0
  verification baseline](../../bedrock/verification-baseline.md).
- Three Playwright scenarios pass, including the fourteen-scene integration case and deterministic
  50/100-node stress measurements. Each stress flush produces exactly N animations and N+1 geometry
  reads, then settles with no active animation residue.

## M1 hardening plan

### 1. Stabilize the baseline

- [x] Inventory every `pnpm check` failure by owning area and root cause.
- [x] Re-run the reported `/demo/ui` cached shared-attachment error; it is absent from the current
      checkpoint, so no code change is required unless it recurs.
- [x] Resolve project-wide failures until `pnpm check` exits successfully; do not hide new failures
      behind a broad exclusion.
- [x] Keep the existing motion math/token tests green.

### 2. Lock the public contract

- [x] Verify that `layout()` outside `LayoutGroup` becomes a no-op with one English development
      warning after its bounded hydration/attachment-order retry; it must not throw in production.
- [x] Keep shared ids group-scoped, give snapshots owner/generation identity, and warn on duplicate
      live owners in development.
- [x] Support axis-aligned nested projection with ancestor-relative affine correction; warn when a
      nested attachment crosses a content-correction boundary.
- [x] Keep 480 ms as the shared transfer lifetime based on mount/unmount and expiry-precedence tests. Keep
      the constant documented and tested rather than relying on timing folklore.
- [x] Confirm that sampled springs and visual-position retargeting are sufficient for v1. A live
      solver is not required unless user testing exposes the lack of velocity continuity.
- [x] Harden the preserved Astryx-aligned semantic token vocabulary needed by consumers; avoid
      arbitrary CSS-property APIs and require recorded fixture evidence before changing seed values.

### 3. Complete motion preferences and platform behavior

- [x] Make `layout`, `reveal`, `autoSize`, `appear`, `vanish`, `drawer`, and `Swap` honor reduced
      motion.
- [x] Define reduced motion as immediate final layout with no spatial interpolation or delayed
      removal; preserve semantics and focus.
- [x] Verify SSR and hydration: no server DOM access, no initial-load FLIP, and no hydration warning.
- [x] Refresh layout baselines without playback on document and nested-container scrolling.
- [x] Replace `vanish`'s physical positioning assumption or document a logical RTL-safe strategy;
      verify positioned ancestors and nested scrollers.

### 4. Establish browser coverage

- [x] Layout flush: mutate a class and observe a non-identity in-flight transform, then identity at
      rest.
- [x] Interruption: retarget mid-flight, verify no visual jump, final box, and no residual animation.
- [x] Shared transfer: cover teardown-before-mount and mount-before-teardown inside one group.
- [x] Reduced motion: verify every public primitive settles without playback.
- [x] Scroll: cover document scroll, an outside scrolling ancestor, and a scrolling container
      inside the group.
- [x] Removal/insertion: cover packing with `appear`/`vanish` and reflow with `reveal`.
- [x] Continuous layout: verify repeated CSS/style-driven targets do not accumulate FLIP springs or
      leave residue.
- [x] SSR/hydration: hydrate a group and ensure the initial geometry is only a baseline.

Do not assert exact spring pixels. Assert continuity, direction where relevant, final geometry, and
the absence of residual animations.

### 5. Set performance limits

- [x] Treat roughly 30 attached nodes as the normal target, 50 as a tested upper boundary, and 100
      as characterization.
- [x] Build a 50-node normal fixture and a 100-node stress fixture that record flush measurements,
      forced-layout cost, and dropped/throttled work.
- [ ] Define budgets against representative CI and target browsers before publishing hard
      millisecond claims.
- [x] When sustained density or measured flush cost trips the guard, issue a deduplicated English
      development warning that names the group and explains that animation was suppressed.
- [x] A throttled group must still perform a non-animated baseline sync for the latest state. It
      must not remain stale until an unrelated mutation.
- [ ] Virtualize large collections or split independent regions into groups. Do not observe the
      document root as an implicit global group.

## Production exit gate

M1 is complete only when:

- [x] `pnpm check` and current unit tests pass.
- [x] All browser cases above pass in the configured browser project without timing flakes.
- [x] The reduced-motion behavior is consistent across every public primitive.
- [x] Scroll and RTL/logical-position behavior match the motion contract.
- [x] The 50/100-node fixture has documented results and the flush guard warns and recovers.
- [x] The public barrel, semantic tokens, examples, and contract agree.
- [x] `/demo/ui` loads without console or network errors and all fourteen scenes settle without
      residual animations after interruption.

## Explicit deferrals

- Rotation/skew/perspective projection and layout descendants inside correction boundaries.
- Drag/reorder physics, SVG and canvas layout motion.
- Cross-group shared elements and simultaneous-owner crossfades.
- Route transitions and View Transitions integration.
- General-purpose animation props or a Motion+ compatibility layer.
- Product components beyond replacing the lab's raw controls after Bedrock foundations exist.
