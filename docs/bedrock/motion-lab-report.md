# Bedrock UI Motion Lab report

Date: 2026-08-30  
Benchmark: `/demo/motion`

## Executive summary

Bedrock UI does not yet have one coherent motion system. It has two systems with very different maturity:

1. `src/lib/bedrock/motion` is a deliberate semantic and technical foundation. It has named roles, dedicated entry and exit curves, sampled springs, FLIP/WAAPI layout projection, current-visual-state retargeting, shared layout identity, cleanup, overload protection, SSR safety, and reduced-motion cancellation.
2. Most components in `src/lib/bedrock/ui` proxy `src/lib/shadcn/ui`, where motion is authored through Tailwind defaults and `tw-animate-css`. These components generally do not consume the Bedrock motion tokens or policy.

The custom layout engine is the strongest part of the architecture. Component timing, reduced motion, continuous movement, transform ownership, and large-surface character are the weakest parts. The recommended next step is not to add more animation. It is to connect existing components to a small CSS-facing semantic contract, define an intentional reduced mode, and remove motion from high-frequency interactions.

## What the benchmark covers

The Motion Lab is a dedicated environment rather than a gallery. Every benchmark has a decisive hard case, technical metadata, a current verdict, and global controls for time scale, motion preference, input scenario, stress level, replay, pause, and reset.

The grouped routes cover:

- foundations: durations, easing, springs, distances, transform origins, and stagger scaling;
- components: controls, simultaneous updates, anchored layers, dialogs, alert dialogs, sheets, and drawers;
- continuity: unequal tabs, directional navigation, disclosure, tall/dynamic content, 20-row expansion, sliders, resizers, drag/snap, and reordering;
- concurrency: toast packing, async controls, validation, dynamic lists, deliberate interruption, and explicit no-motion cases;
- accessibility and scale: normal/reduced comparison, continuous motion, 50 controls, 80 rows, many skeletons, rapid navigation, runtime frame-gap sampling, and external transform compatibility.

## Current architecture

### Semantic tokens

`src/lib/bedrock/motion/tokens.ts` defines:

| Role     |                          Current value |
| -------- | -------------------------------------: |
| Press    |                                 130 ms |
| State    |                                 175 ms |
| Enter    | 230 ms, cubic-bezier(0.23, 1, 0.32, 1) |
| Exit     | 175 ms, cubic-bezier(0.3, 0, 0.6, 0.6) |
| Reveal   |                                 310 ms |
| Overlay  |                                 410 ms |
| Movement |        cubic-bezier(0.77, 0, 0.175, 1) |
| Drawer   |         cubic-bezier(0.32, 0.72, 0, 1) |
| Layout   |          500 ms, spring 117 / 18.4 / 1 |
| Swap     |            400 ms, spring 183 / 23 / 1 |

This vocabulary is TypeScript-only. There are no equivalent semantic CSS custom properties available to components or consumers.

### Motion primitives

- `layout()` and `LayoutGroup` implement FLIP-style projection through WAAPI.
- `appear()` and `vanish()` coordinate presence with layout packing.
- `reveal()` animates intrinsic vertical geometry and opacity.
- `drawer()` animates real horizontal geometry with content gating.
- `autoSize()` provides interruptible intrinsic-height WAAPI animation.
- `Swap` handles keyed content replacement.
- `resolveMotionDuration()` and live media-query listeners cancel Bedrock motion for reduced motion.
- diagnostics warn about transform ownership and unsupported exit containing blocks.
- the flush guard prevents dense layout work from growing without limit.

### Component motion

Most components are thin wrappers over Shadcn/Bits UI and use a separate set of conventions:

- anchored layers: usually 100 ms fade + scale(0.95) + placement slide;
- dialogs and alert dialogs: symmetric 100 ms fade/scale for content and backdrop;
- sheet: 200 ms `ease-in-out` translation;
- drawer: Vaul-owned 500 ms transform/opacity behavior;
- accordion: 200 ms `ease-out` height keyframes;
- controls: Tailwind default transitions, frequently `transition-all`;
- spinner and skeleton: unscoped infinite utility animations;
- toast: third-party Sonner motion.

## Strengths

### Semantic intent already exists

Press, state, enter, exit, reveal, overlay, layout, and swap are separated instead of being reduced to fast/medium/slow. Dedicated entry and exit curves encode different velocity jobs.

### Layout continuity is unusually capable

The layout engine supports position, size, shared identity, nested projection correction, sampled springs, and retargeting from the currently visible box. It cancels stale playback and removes projection residue.

### Interruption is tested in the core

Existing browser tests cover rapid retargeting, paused timelines, auto-size interruption, shared handoffs, cleanup, scroll, resize, and reduced motion. This is a stronger foundation than authored CSS keyframes alone.

### Performance work is explicit

Layout reads are batched, spring samples are cached, transform playback is compositor-oriented, and the flush guard degrades dense updates instead of allowing unbounded work.

### Failure modes are documented

Transform collisions, supported scale boundaries, reflow costs, and containing-block limitations are acknowledged rather than hidden.

## Inconsistencies

### Components do not consume the semantic system

A dialog at 100 ms, a popover at 100 ms, a sheet at 200 ms, a drawer at 500 ms, and a semantic overlay token at 410 ms do not form an explainable visual-weight scale. The smallest and larger surfaces can have the same timing while adjacent implementations use unrelated curves.

### Entry and exit are frequently symmetric

Anchored layers and dialogs use the same duration and generic animation utilities in both directions. This bypasses the dedicated enter and exit meanings already present in Bedrock.

### Tabs do not preserve a visual object

The shipped line indicator is a pseudo-element on every trigger. Selection changes fade one local indicator and reveal another. The existing layout engine can move a persistent indicator between unequal widths, but Tabs does not integrate it.

### Distances and origins are not a shared contract

There are no semantic distance tokens for contextual shifts, anchored layers, medium surfaces, or full-edge travel. Transform-origin support varies by component family.

### Frequent controls claim too many properties

Eleven component files use `transition-all`, including Button, Switch, Toggle, Tabs, Progress, and Accordion triggers. This creates unintended animation and increases collision risk.

## Missing primitives and policies

1. CSS-facing semantic duration and easing custom properties.
2. Semantic distance and transform-origin tokens.
3. A reduced-motion provider/override that can preserve useful opacity and color while removing spatial motion.
4. Continuous-motion cadence and stop/substitution rules.
5. A persistent navigation indicator primitive integrated with Tabs/segmented navigation.
6. A consumer-facing transform ownership/composition contract.
7. A gesture settle/snap primitive for draggable and sortable interactions.
8. A capped or distance-aware group/stagger policy.
9. A shared component exit-timing convention.
10. An indeterminate progress primitive and static reduced alternative.
11. A generic sortable/draggable primitive and a Tree primitive.

## Performance findings

### Reflow-heavy disclosure

Accordion, `reveal()`, `drawer()`, and `autoSize()` animate height, width, padding, margin, or border. These techniques may be justified for one small disclosure, but 20 simultaneous row expansions force layout on every frame. For dense tables, instant expansion, one shared detail region, or virtualization is usually more appropriate.

### LayoutGroup scaling

LayoutGroup measures registered nodes and observes subtree changes. Its safeguards are good, but 30 nodes are the normal target, 50 the tested upper range, and 100 characterization rather than a normal budget. The performance route makes these bounds visible and includes a local rAF gap probe; CDP profiling remains the source of truth.

### Paint-heavy surfaces

Full-screen backdrop blur combined with animated opacity can be paint-heavy. `clip-path` in presence transitions also needs profiling rather than an assumption that all opacity/transform rules are free.

### Continuous work

Spinner, Skeleton, OTP caret, and Sonner loaders can continue indefinitely. There is no visibility/background-tab policy, shared cadence, or guarantee that loops stop in reduced motion.

### Persistent `will-change`

Vaul owns drawer transforms and applies persistent `will-change: transform`. It bypasses the Bedrock overload and reduced-motion policies.

## Interruptibility findings

### Strong: layout projection

Bedrock layout motion can retarget from the current visual state and cancel superseded animations. The moving indicator, toast packing, dynamic list, and sortable-list benchmarks exercise this behavior.

### Mixed: CSS transitions

CSS transitions generally retarget from the current computed value, which works for simple one-property movement. Broad `transition-all` still makes the affected property set unpredictable.

### Weak: authored keyframes and third parties

Anchored layers, dialogs, accordion, sheet, drawer, and toast implementations are authored through keyframes or third-party state machines. They do not share a current-visual-state retargeting contract. Rapid open/close/reopen must therefore be tested component by component.

### Risk: stale content after delayed group entry

Fixed stagger delays scale poorly. At 50 items with a 22 ms step, the last item starts more than one second after the first. If the parent closes mid-sequence, delayed child animations can outlive the user's intent unless the entire group timeline is cancelled.

## Accessibility findings

### Core behavior is safe but binary

Bedrock helpers resolve reduced motion to zero and cancel active motion when the preference changes. That prevents vestibular motion but does not yet define a polished alternate language.

### Components are outside the policy

Dialogs, menus, sheets, accordion, spinner, skeleton, caret, drawer, and Sonner do not consistently consume the Bedrock policy. A global user preference therefore produces an incomplete result.

### Recommended alternate mode

- remove translation, scaling, parallax, momentum, and large spatial travel;
- make snap and layout repositioning instant;
- stop looping animation and use a static status glyph or label;
- keep focus indication, color/state feedback, and live-region behavior;
- retain short opacity transitions only when they clarify a state boundary;
- do not delay content or actions;
- commit the latest state immediately when preference changes mid-animation.

## Areas where motion should be removed

The benchmark explicitly recommends no animation for:

- table-row hover;
- checkbox tick in dense or repeated selection;
- keyboard menu/command traversal;
- autocomplete results changing every keystroke;
- breadcrumb/container resizing caused by text;
- dense data-table selection;
- rapidly changing numeric values;
- bulk selection of 30–50 controls;
- most 20-row table expansion choreography;
- routine data refreshes that do not represent user-driven spatial change.

In these cases focus, color, selected state, text, and structure already communicate the change. Motion adds visual latency and noise without improving orientation.

## External animation compatibility

Transform is a single shared CSS property. Bedrock layout projection, `tw-animate-css`, Vaul, Progress, direct manipulation, and consumer animation can all claim it. Additive composition is not guaranteed.

Current safe pattern:

```svelte
<div class="consumer-motion-wrapper">
	<Button>Consumer animates the wrapper</Button>
</div>
```

Unsafe pattern:

```svelte
<Button class="consumer-transform">Competing transforms</Button>
```

The wrapper pattern should be documented until components consistently separate a motion shell from consumer-controlled content.

## Recommended next changes

### P0 — connect the two systems

1. Export the current semantic durations and curves as CSS custom properties generated from the TypeScript source of truth.
2. Replace component-local 100/200/300 ms utilities with semantic role variables, beginning with anchored layers, dialogs, sheet, accordion, Button, Switch, and Tabs.
3. Add a MotionPolicy provider with `system | normal | reduced` and a deliberate reduced substitution table.
4. Stop Spinner, Skeleton, caret, Sonner loader, and Drawer movement in reduced mode.

### P1 — remove avoidable risk

5. Replace `transition-all` with explicit property lists.
6. Integrate a persistent indicator into Tabs or publish a reusable navigation-indicator primitive.
7. Define transform ownership: outer motion shell for library/layout, inner element for consumer transforms, or vice versa.
8. Give Sheet/Drawer/Dialog visual-weight timing and entry/exit asymmetry that can be explained semantically.
9. Cap stagger total delay; disable it for large or frequently refreshed groups.

### P2 — improve direct manipulation and scale

10. Publish settle/snap/cancel semantics for gesture components while preserving 1:1 drag.
11. Define when intrinsic-size animation degrades to instant behavior, especially for tables and more than a small number of disclosures.
12. Add component-wide reduced-motion, keyboard, collision-flip, focus-return, and rapid-reversal E2E coverage.
13. Add CDP budgets for layout/style reads and long tasks, while keeping raw timing artifacts for diagnosis.

## Conclusion

Bedrock UI has the beginnings of an excellent modern motion system, particularly in layout continuity and interruption. It is not yet coherent across the library because those strengths are not connected to the components users actually render. The shortest path to excellence is consolidation and restraint: reuse the semantic foundation, formalize reduced motion and transform ownership, and deliberately make high-frequency interactions instant.
