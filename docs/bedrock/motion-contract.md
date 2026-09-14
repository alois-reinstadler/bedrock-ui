> Historical report: the legacy engine and optional-integration architecture have
> been superseded by the CSS-first Astra migration. See [current contract](motion.md).

# Bedrock motion contract

> **Maturity:** compatibility facade / stabilization candidate  
> **Scope:** public behavior expected before any hardened Bedrock component depends on motion  
> **Implementation record:** [`2026-08-29-layout-animations.md`](../superpowers/plans/2026-08-29-layout-animations.md)

## Purpose

Bedrock motion explains a state change without changing its semantics. It is progressive
enhancement: layout, DOM order, accessible names, focus order, and live-region behavior must remain
correct when animation is unsupported or reduced.

Use the smallest primitive that matches the physical change:

| Change                                                                      | Primitive                       | Why                                                                             |
| --------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------- |
| A persistent node jumps to a new position or size                           | `layout()` inside `LayoutGroup` | FLIP preserves the old visual box and animates to the new layout.               |
| A logical element unmounts and remounts elsewhere in one group              | `layout({ id })`                | A short-lived snapshot transfers geometry between DOM nodes.                    |
| Small vertical content enters/exits and siblings should follow continuously | `reveal`                        | Height and vertical metrics drive native reflow.                                |
| A persistent wrapping shell changes intrinsic height                        | `autoSize`                      | Real block-size interpolation avoids scaling or distorting descendants.         |
| An item enters or exits while persistent siblings pack                      | `appear` / `vanish`             | Presence is independent of sibling layout FLIP.                                 |
| A rail/drawer changes horizontal flow                                       | `drawer`                        | Width and horizontal padding drive native reflow.                               |
| Keyed inline content changes and its shell should resize once               | `Swap`                          | The exiting copy is removed from flow before the entering copy determines size. |

Do not use motion to repair incorrect DOM order, hide a layout shift on first render, delay critical
feedback, or make focus/selection state depend on an animation finishing.

## API contract

### `LayoutGroup`

- Renders a real grouping element and scopes measurement, observation, shared ids, and scheduling.
- Must contain every attached node in its DOM ancestor chain. It should normally be the flex/grid
  container or the nearest stable root around it.
- Groups are isolation boundaries. Shared ids, observer work, flush limits, and failure recovery do
  not cross them.
- Treat roughly 30 attached nodes as the normal smooth-motion target and 50 as a tested upper
  operating boundary. Split independent regions and virtualize large collections; 100 nodes is
  characterization only.

### `layout(options?)`

- Create the attachment once in component script; do not create a new attachment on each render.
- The same stable attachment may register multiple nodes when they share options but not a shared
  identity.
- `type: 'both'` (default) animates translation and scale.
- `type: 'position'` animates translation only and is preferred for text-heavy cards that do not
  need size interpolation.
- `type: 'size'` animates scale only and does not disguise position changes.
- `transition` selects a semantic Bedrock layout motion configuration. Consumers must not depend on
  internal keyframe sample counts.
- `id` represents one logical visual element transferring between DOM nodes. It must be unique
  among live owners in a group.

Using `layout()` outside a group is an authoring error. The contracted behavior is no animation and
one development warning after a bounded registration retry; production must remain a safe no-op.
The warning text is resolved from the canonical English internal-string catalogue.

### Shared ids

- Transfer is supported across unmount/mount ordering inside one `LayoutGroup`.
- Transfer is not supported across groups, documents, or navigations.
- The snapshot lifetime is 480 ms. Browser-component tests cover both Svelte
  teardown-before-mount and mount-before-teardown ordering.
- Snapshots carry an owner and generation. A newly mounted owner cannot consume its own target or
  let an older teardown overwrite a newer hand-off.
- Only an owner that completed a layout flush may publish geometry. Snapshot resolution happens in
  the next flush, so a mount/unmount that was never painted cannot replace painted provenance. An
  expired newer snapshot cannot prevent a still-live older owner from publishing its departure.
- Two simultaneously mounted owners with the same id are unsupported and warn in development;
  there is no implicit crossfade or ownership arbitration.
- Shared snapshots are ephemeral geometry. They must not retain application data or detached DOM
  nodes.
- Nested and adjacent groups are strict isolation boundaries. Initial attachment lookup runs in a
  microtask after the Svelte commit, so a child binds to the nearest root without painting a newly
  mounted shared owner at its destination before projection starts. Missing groups retain bounded
  animation-frame retries for diagnostics.

### Nested projection

Axis-aligned nested `layout()` nodes are supported. Each frame computes the child's world
projection relative to its nearest animated layout ancestor, so ancestor movement is not applied
twice. Translation and non-zero scale compose through multiple registered ancestors.

Nested nodes may use different durations and spring shapes. A child correction remains active for
the longest animated ancestor timeline it depends on. If a child's local correction is identity,
it owns no redundant visual effect and instead follows the nearest ancestor's WAAPI clock for
interruption and cleanup; it must not fall back to wall time while that ancestor is paused or
throttled.

The opt-in `data-layout-invert` direct child is a content-correction boundary. Do not put another
layout-attached node inside that boundary: reciprocal content correction and descendant projection
would otherwise compete, so the engine warns and leaves that composition unsupported. Rotation,
skew, perspective, and arbitrary transformed group roots are also outside the v1 projection model.

### `reveal`

`reveal` is for bounded vertical presence such as validation messages, accordion panels, and
short details. It may animate height, vertical padding, vertical margins, border widths, and
opacity. This is intentionally outside the transform-only FLIP constraint: sibling reflow is the
behavior being animated.

Do not use `reveal` for large collections, virtualized content, or continuously resizing regions.
Content must remain semantically present for the normal Svelte transition lifecycle.

### `autoSize`

`autoSize` is for a persistent, bounded shell whose intrinsic block size changes when compact
content wraps or unwraps. It animates real border-box height, keeps descendants untransformed, and
retargets from the current rendered height. This intentionally performs layout during playback;
use it for small regions, not large collections or app-shell resizing. Missing WAAPI or reduced
motion commits the intrinsic final height immediately.

### `appear` and `vanish`

`appear` fades and reveals new content with a geometry-neutral inset clip, without defining sibling
geometry or scaling its glyphs. `vanish` immediately removes the exiting node's layout slot, pins
its visual copy, disables pointer events, and fades/clips it out while persistent siblings can run
`layout()`.

For a node that also owns `layout()`, Bedrock caches the last committed local offset before keyed
reconciliation. `vanish` pins from that painted geometry rather than a new ghost slot created after
incoming keys are inserted. The group excludes the marked exit from FLIP retargeting for the outro;
if an active position projection is interrupted, its current visual offset is folded into the pin
and the old projection is cancelled synchronously before presence can paint the offset again.
Separate exit generations are not coalesced: a second keyed update inside the 175 ms exit window may
briefly leave two stationary outgoing copies in one slot. Product interactions that generate rapid
replacement waves should decide whether to preserve or explicitly supersede the earlier exit.

`vanish` requires a stable local containing block. Its physical `offsetLeft`/`offsetTop` snapshot is
intentional: RTL, vertical writing, and an unchanged axis-aligned transformed containing block are
supported because the node is pinned in the same local coordinate system. Captured border-box
dimensions are emitted with `box-sizing: border-box`, including for content-box source nodes.

Fixed/sticky exits, a scrolling ancestor strictly between the node and its offset parent, and
containing-block/transform changes during the outro are unsupported and warn in development. Put
the positioned containing block inside the scroller. Bedrock does not portal or clone the exiting
semantic node to escape these constraints.

### `Swap`

`Swap` is a presence coordinator for compact keyed content, not a general layout container. The
entering copy determines the shell's current size; the exiting copy is pinned out of flow. Its
`effect` is either `fade` (the default complementary crossfade, suitable for general compact
content) or `slide-up` (a vertical roll for single-line labels of comparable height). The slide
effect uses shorter opposing travel with complementary opacity, so the clipped viewport never has
an empty midpoint. It animates physical `top`, not transforms, so glyphs repaint sharply. When the shell changes width, project a persistent background layer or
animate real shell width; do not place readable `Swap` content under reciprocal
scale/counter-scale projection. Accessible status changes must not rely on the visual transition;
use the owning component's semantic text or live-region contract.

If the persistent background itself uses `layout()`, the readable content wrapper must establish a
higher stacking level. Projection temporarily raises the background for continuity; leaving the
content at `z-index: auto` makes a correct swap timeline disappear behind its own surface.

When an exclusive accordion changes its open item, the entering and exiting `reveal` transitions
must use the same duration and the same easing. Svelte supplies the outro's descending progress,
so reflecting its easing makes the two heights expand at once and produces a flow-height overshoot.

`drawer` animates the outer clipped shell. Text or controls that must not rewrap should live in a
fixed-width inner surface. Shell opacity is gated from the same reversible progress that drives
width, so the content cannot reappear independently while a narrow interrupted drawer settles.
Shrinking the content surface itself while it remains visible is not a supported stable-content
composition. Siblings should follow this continuous real-width reflow natively; attaching
`layout()` to that same axis would layer discrete projection over a continuously moving target.

## Runtime behavior

### Discrete changes and interruption

FLIP handles discrete changes to resting layout: DOM insertion/removal, keyed reorder, class/style
updates, flex/grid packing, and size jumps. It animates transforms through WAAPI and leaves the DOM
in its final layout throughout playback.

An in-flight discrete animation may be retargeted. The new animation starts from the last painted
visual box and finishes at the latest layout box without a visible teleport. Completion and
interruption must leave no active animation or inline transform residue.

A baseline-only refresh or unrelated mutation preserves an unchanged in-flight WAAPI animation,
including its animation object, current phase, playback state, and velocity. Only a changed target
or a related ancestor/descendant projection is rebuilt. Projection time comes from the active WAAPI
timeline; wall time is used only for the static fallback that owns no WAAPI clock.

The sampled spring does not promise velocity conservation. The v1 promise is positional
continuity, final geometry, and interruptibility.

### Continuous CSS layout

Do not use FLIP to chase a property that CSS or a Svelte transition already updates every frame.
The group follows those measurements without stacking a fresh spring. Transition lifecycle events,
registered-node resizing, and scroll events synchronize the resting baseline; projection-authored
style mutations are ignored. Continuous CSS transitions still require focused browser coverage
before this behavior is considered hardened.

If a component needs continuously interpolated reflow, it should use a bounded presence primitive
such as `reveal`, `autoSize`, `drawer`, or native CSS. A discrete `layout()` animation may explain
the final jump, but the two systems must not compete on the same property and node.

### Scrolling

- Document scroll and scrolling an ancestor outside the group must not create layout playback.
- Scrolling a container inside the group must refresh affected cached boxes without playback.
- A later mutation after scrolling must start from the geometry the user actually saw, not a stale
  pre-scroll box.
- An in-flight animation inside a scroller must remain visually continuous or settle immediately;
  it must not fling when scroll and layout updates coincide.

Group-relative measurement covers outside-root movement. Capture-phase scroll handling schedules a
non-animated baseline refresh. Document or outside-group scrolling preserves unchanged in-flight
animations. An inside-group scroller dominates a layout mutation queued for the same frame and
settles the affected geometry immediately, avoiding a projection from stale pre-scroll boxes.
Document-scroll preservation, nested-scroll retargeting, and the inside-scroll/same-frame collision
have browser-component coverage; outside-ancestor scrolling remains an M1 coverage gap.

### Reduced motion

With `prefers-reduced-motion: reduce`, every public primitive must commit the final semantic and
layout state immediately:

- no FLIP or shared-element playback;
- no scale, slide, height, width, or delayed-removal animation;
- no requirement to wait before interacting with the final state;
- focus and live-region behavior identical to the non-animated path.

The shared policy resolves FLIP, `reveal`, `autoSize`, `appear`, `vanish`, `drawer`, and therefore
`Swap` to zero-duration/no-delay behavior. A media-query change to reduced motion cancels active
FLIP and intrinsic-size playback, then synchronizes the final baseline.

### SSR and hydration

- Public motion modules must be safe to import during SSR.
- Server rendering performs no measurement, observer registration, or animation.
- The first hydrated measurement establishes a baseline; initial page load does not FLIP from a
  synthetic or zero box.
- Attachment/group ordering may use a bounded retry, but must not produce a hydration warning or
  retain callbacks after cleanup.
- Absence of WAAPI, observers, or motion preference APIs degrades to the final static layout.

Node SSR tests import the public barrel and render static motion fixtures without browser globals.
The prerender/hydration browser test records zero `Element.animate()` calls on initial load. Missing
WAAPI clears projection state immediately after committing static pixels; without
`MutationObserver`, the group degrades all animation requests to synchronized baseline updates so a
later registration cannot replay stale geometry. Missing `ResizeObserver` or `matchMedia` remains a
safe reduced-capability path.

## Visual correction and CSS ownership

The FLIP engine owns only its temporary animation effects. It must not permanently set transform,
transform origin, border radius, z-index, or `will-change`.

For a size-changing node, a direct `[data-layout-invert]` child may receive reciprocal scale
keyframes so text and icons remain visually upright. The outer node may receive keyframed uniform
pixel-radius correction and temporary stacking order. Non-uniform, percentage, or otherwise
unresolvable radii are not guaranteed to correct.

Do not apply another transform animation to a FLIP node while its layout animation is active. Do
not run View Transitions and FLIP on the same node in the same update.

## Motion tokens

The public vocabulary is semantic. Component contracts select a role; they do not invent raw
durations and curves for each instance.

| Token     | Current value/direction         | Intended use                                   |
| --------- | ------------------------------- | ---------------------------------------------- |
| `press`   | 130 ms                          | Direct press feedback.                         |
| `state`   | 175 ms                          | Hover/selected/disabled visual state.          |
| `enter`   | 230 ms, emphasized deceleration | Ordinary insertion.                            |
| `exit`    | 175 ms, accelerating exit       | Ordinary removal.                              |
| `reveal`  | 310 ms                          | Small vertical reflow presence.                |
| `overlay` | 410 ms                          | Larger overlay/stage presence.                 |
| `move`    | semantic curve                  | Non-spring positional movement where required. |
| `drawer`  | semantic curve                  | Horizontal reflow presence.                    |
| `layout`  | 500 ms; spring 117/18.4/1       | General FLIP position/size.                    |
| `swap`    | 400 ms; spring 183/23/1         | Compact keyed content replacement.             |

These are the preserved Astryx-aligned seed values already represented by `motionPresets` and
`motionEasings`, not permission to expose arbitrary numeric motion props throughout Bedrock. M1
must verify them in representative fixtures. A value changes only through a dated decision that
records the affected roles and fixture evidence, followed by matching documentation and tests.
Reduced-motion resolution is required for every role. Distances should remain contextual geometry
rather than a large public scale; if enter/exit translations are later added, define a small
semantic distance set such as `near`, `standard`, and `far` rather than pixel props.

Layout springs are duration-normalized samples, not a live physical solver: stiffness, damping,
and mass define the curve shape, while the token's `duration` defines wall-clock playback. This is
the intended Bedrock interpretation of the preserved Astryx values.

## Performance and observation contract

One group uses one subtree `MutationObserver`, one `ResizeObserver` observing the root and every
registered node, and synchronous geometry measurement during a relevant flush. A pre-paint frame
captures projection clocks, performs one projection-cancel write phase, one batched root/node/style
read phase, and one animation-start write phase. Computed radius reads must complete before the
first `animate()` call. Group boundaries remain a performance API.

Fresh, unnested position-only jobs use two transform keyframes plus a cached CSS `linear(...)`
representation of the sampled spring. Nested, size-corrected, and interrupted jobs keep the full
sampled-keyframe path. Spring samples are cached by physics values. Delayed `ResizeObserver` entries
whose border-box size matches the committed layout are ignored rather than causing a redundant full
baseline read.

Initial guidance and required safeguards:

- Target about 30 attached nodes for ordinary smooth-motion groups. Treat 50 as the tested upper
  boundary and 100 as stress characterization, not a blanket support promise.
- Coalesce relevant mutations and ignore engine-authored transform-only style mutations.
- Never install a document-wide implicit group.
- Sustained frame-rate animation flushes (including ordinary 60 Hz storms) or at least 48 ms of
  accumulated flush cost across three samples must suppress playback without losing the latest
  geometry baseline. A 120 ms quiet interval starts a fresh episode.
- When that guard activates, emit one deduplicated development warning per burst, in English, with
  enough context to find the group. Production should avoid console noise.
- Record flush count, nodes measured, layout/style/task cost, guard activations, and active animation
  residue in the fixture. Publish hard millisecond budgets only after representative CI/browser data
  exists.

The guard emits one development warning per episode, cancels effects started by the triggering
flush, and converts subsequent suppressed requests into non-animated baseline syncs rather than
silently losing the latest state. After 120 ms of quiet, animation resumes normally.

## Accessibility and localization

Motion adds no semantic nodes or accessible names. The owning component provides semantic HTML,
keyboard/focus behavior, and any live-region announcement. Visual shared elements such as a pill or
row highlight are hidden or otherwise neutral to assistive technology.

Internal motion diagnostics resolve from the canonical English catalogue in `diagnostics.ts`.
Future component-owned accessible or live-region strings must resolve from Bedrock's complete
canonical English component catalogue rather than being added to the engine. Additional locale
packs, including `de-AT`, may be added without changing component APIs.

## Acceptance checklist

The motion foundation may graduate to **Hardened Bedrock component/foundation** only when all items
are true:

- [x] `pnpm check` passes and all current motion unit tests pass.
- [x] Layout flush browser test observes playback and clean settlement.
- [x] Interruption test proves positional continuity, latest final box, and no residual animations.
- [x] Shared-id tests cover first-paint projection, both mount/unmount orderings, expiry,
      cross-group rejection, and duplicate-owner warning.
- [x] Reduced-motion tests cover `layout`, `reveal`, `autoSize`, `appear`, `vanish`, `drawer`, and
      `Swap` through the shared policy and browser behavior.
- [x] Scroll tests cover document, outside-ancestor, and inside-group scroll containers.
- [x] Insertion/removal tests cover packing presence and continuous reflow presence.
- [x] Continuous-layout tests prove the engine does not stack/chase frame-driven changes.
- [x] SSR/hydration tests prove static initial geometry and graceful platform fallback.
- [x] RTL/logical-position tests cover `vanish` or the contract explicitly narrows supported writing
      modes before use.
- [x] The 50/100-node fixture records linear geometry reads and Chromium layout/style/task metrics.
- [x] Flush-guard activation warns in development, suppresses animation safely, and synchronizes the
      latest baseline.
- [x] `/demo/ui` exercises all fourteen scenes without console/network errors or animation residue.
- [x] Public exports, preserved Astryx-aligned tokens, examples, and this contract agree.

## Deferred behavior

- Rotation/skew/perspective projection and layout nodes inside a content-correction boundary.
- Cross-group/document shared elements and simultaneous-owner crossfades.
- Route-level View Transitions.
- Drag physics, SVG/canvas projection, and general-purpose animation props.
- Motion as a prerequisite for shell, form, table, or navigation semantics.
